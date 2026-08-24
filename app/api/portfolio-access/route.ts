import { NextResponse } from "next/server";

function sanitize(text: string): string {
  return typeof text === "string" ? text.replace(/[<>]/g, "").trim() : "";
}

const PORTFOLIO_GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSch9tLR2yl2BGu3-EiXK_p7UQLbCA5NSANVpnYen0pOs7Zj4w/formResponse";

const PORTFOLIO_REDIRECT_URL =
  "https://www.playbook.com/s/creator-navigator/ugc-content-portfolio";

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
      source = "View Full Portfolio CTA",
    } = body;

    const cleanName = sanitize(name || fullName);
    const cleanPhone = sanitize(phone || contactNumber);
    const cleanEmail = sanitize(email);

    const timestamp = new Date().toISOString();

    const leadData = {
      name: cleanName,
      fullName: cleanName,
      phone: cleanPhone,
      contactNumber: cleanPhone,
      email: cleanEmail,
      source,
      timestamp,
    };

    console.log("[PORTFOLIO ACCESS LEAD RECEIVED]:", JSON.stringify(leadData, null, 2));

    // 1. Forward directly to Google Form for Portfolio asynchronously
    const googleFormData = new URLSearchParams();
    googleFormData.append("entry.41647073", cleanName);
    googleFormData.append("entry.1646448611", cleanPhone);
    googleFormData.append("entry.1726298412", cleanEmail);

    fetch(PORTFOLIO_GOOGLE_FORM_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: googleFormData.toString(),
      signal: AbortSignal.timeout(5000),
    }).catch((err) => console.log("Portfolio Google Form submit note:", err?.message || err));

    // 2. Forward to the Google Sheets Webhook if configured
    const SHEET_WEBHOOK_URL =
      process.env.GOOGLE_SHEET_WEBHOOK_URL ||
      "https://script.google.com/macros/s/AKfycbyBGm2YZIYt5m41QYT2dx9bkvfI9iXwgs4WZshHwXwklo6rLI4ET8SIN2VoatZV7jpm/exec";
    const googleSheetSecret =
      process.env.GOOGLE_SHEET_SECRET ||
      "AKfycbyBGm2YZIYt5m41QYT2dx9bkvfI9iXwgs4WZshHwXwklo6rLI4ET8SIN2VoatZV7jpm";

    if (SHEET_WEBHOOK_URL) {
      const payload = {
        secret: googleSheetSecret,
        name: cleanName,
        fullName: cleanName,
        phone: cleanPhone,
        contactNumber: cleanPhone,
        email: cleanEmail,
        source,
        timestamp,
      };

      fetch(SHEET_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(5000),
      }).catch(() => {});
    }

    return NextResponse.json({
      success: true,
      message: "Lead recorded successfully",
      redirectUrl: PORTFOLIO_REDIRECT_URL,
    });
  } catch (error) {
    console.error("Error processing portfolio access lead:", error);
    return NextResponse.json(
      {
        success: true,
        redirectUrl: PORTFOLIO_REDIRECT_URL,
      },
      { status: 200 }
    );
  }
}
