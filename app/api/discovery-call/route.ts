import { NextResponse } from "next/server";

// Helper to sanitize inputs
function sanitize(text: string): string {
  return typeof text === "string" ? text.replace(/[<>]/g, "").trim() : "";
}

const GOOGLE_FORM_ACTION_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfo7zUw86_yoFHA0d8AVUtbGjDfD3yyUq76fz9M0RC1uSyqJQ/formResponse";

const VIDEO_COUNT_MAP: Record<string, string> = {
  "1 to 20": "1-20",
  "20 to 50": "20-50",
  "50 to 100": "50-100",
  "100 to 200": "100-200",
  "200 +": "200+",
  "1-20": "1-20",
  "20-50": "20-50",
  "50-100": "50-100",
  "100-200": "100-200",
  "200+": "200+",
};

export async function POST(request: Request) {
  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const {
      name = "",
      fullName = "",
      phone = "",
      contactNumber = "",
      email = "",
      companyName = "",
      company = "",
      designation = "",
      videoCount = "",
      estimatedMOQ = "",
      honeypot = "",
      source = "Book a Call Modal",
    } = body;

    // Honeypot check for bots
    if (honeypot) {
      return NextResponse.json({ success: true, message: "Request received" });
    }

    const cleanName = sanitize(name || fullName);
    const cleanPhone = sanitize(phone || contactNumber);
    const cleanEmail = sanitize(email);
    const cleanCompany = sanitize(companyName || company);
    const cleanDesignation = sanitize(designation);
    const rawVideoCount = sanitize(videoCount || estimatedMOQ || "1 to 20");
    const googleVideoValue = VIDEO_COUNT_MAP[rawVideoCount] || "1-20";

    const timestamp = new Date().toISOString();

    const leadData = {
      name: cleanName,
      phone: cleanPhone,
      email: cleanEmail,
      companyName: cleanCompany,
      designation: cleanDesignation,
      videoCount: rawVideoCount,
      source,
      timestamp,
    };

    console.log("[BOOK A CALL LEAD RECEIVED]:", JSON.stringify(leadData, null, 2));

    // 1. Forward directly to Google Form server-side (non-blocking for instant speed)
    try {
      const googleFormData = new URLSearchParams();
      googleFormData.append("entry.1936983498", cleanName);
      googleFormData.append("entry.203780078", cleanPhone);
      googleFormData.append("entry.979876141", cleanEmail);
      googleFormData.append("entry.897870888", cleanCompany);
      googleFormData.append("entry.1100839857", cleanDesignation);
      googleFormData.append("entry.1194319614", googleVideoValue);

      fetch(GOOGLE_FORM_ACTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: googleFormData.toString(),
      }).catch((err) => console.log("Google Form server submit:", err));
    } catch (gErr) {
      console.warn("Google Form forwarding error:", gErr);
    }

    // 2. Also forward to Google Sheet Webhook if configured
    const SHEET_WEBHOOK_URL =
      "https://script.google.com/macros/s/AKfycbyBGm2YZIYt5m41QYT2dx9bkvfI9iXwgs4WZshHwXwklo6rLI4ET8SIN2VoatZV7jpm/exec";
    const googleSheetUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL || SHEET_WEBHOOK_URL;
    const googleSheetSecret =
      process.env.GOOGLE_SHEET_SECRET ||
      "AKfycbyBGm2YZIYt5m41QYT2dx9bkvfI9iXwgs4WZshHwXwklo6rLI4ET8SIN2VoatZV7jpm";

    if (googleSheetUrl) {
      try {
        const payload = {
          secret: googleSheetSecret,
          name: cleanName,
          fullName: cleanName,
          phone: cleanPhone,
          contactNumber: cleanPhone,
          email: cleanEmail,
          companyName: cleanCompany,
          company: cleanCompany,
          designation: cleanDesignation,
          videoCount: rawVideoCount,
          estimatedMoq: rawVideoCount,
          estimatedMOQ: rawVideoCount,
          source,
          timestamp,
        };

        fetch(googleSheetUrl, {
          method: "POST",
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify(payload),
        }).catch(() => {});
      } catch (sheetErr) {
        console.warn("Sheet Webhook forwarding error:", sheetErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Discovery call booked successfully",
      leadId: `lead_${Date.now()}`,
    });
  } catch (error) {
    console.error("Error processing discovery call request:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
