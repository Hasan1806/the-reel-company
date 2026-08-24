import { NextResponse } from "next/server";

// Helper to sanitize inputs
function sanitize(text: string): string {
  return typeof text === "string" ? text.replace(/[<>]/g, "").trim() : "";
}

const GOOGLE_FORM_ACTION_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfo7zUw86_yoFHA0d8AVUtbGjDfD3yyUq76fz9M0RC1uSyqJQ/formResponse";

const CONTENT_SOLUTION_MAP: Record<string, string> = {
  "In-House Team": "In House Team",
  "Freelancers & Agencies": "Freelancer/Agencies",
  "Platforms & Apps": "Platform and Apps",
  "All of Them": "All of them",
  "In House Team": "In House Team",
  "Freelancer/Agencies": "Freelancer/Agencies",
  "Platform and Apps": "Platform and Apps",
  "All of them": "All of them",
};

const MONTHLY_REQUIREMENT_MAP: Record<string, string> = {
  "0 - 10": "1-20",
  "11 - 30": "20-50",
  "31 - 100": "50-100",
  "100+": "100+",
  "1 to 20": "1-20",
  "20 to 50": "20-50",
  "50 to 100": "50-100",
  "100 to 200": "100+",
  "200 +": "100+",
  "1-20": "1-20",
  "20-50": "20-50",
  "50-100": "50-100",
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
      fullName = "",
      name = "",
      phoneNumber = "",
      phone = "",
      contactNumber = "",
      email = "",
      brandName = "",
      companyName = "",
      company = "",
      role = "",
      designation = "",
      websiteOrSocial = "",
      contentSolution = "",
      monthlyRequirement = "",
      videoCount = "",
      estimatedMOQ = "",
      honeypot = "",
      source = "Website Discovery Call Modal",
    } = body;

    // Honeypot bot protection
    if (honeypot) {
      return NextResponse.json({ success: true, message: "Request received" });
    }

    const cleanFullName = sanitize(fullName || name);
    const cleanPhone = sanitize(phoneNumber || phone || contactNumber);
    const cleanEmail = sanitize(email);
    const cleanBrand = sanitize(brandName || companyName || company);
    const cleanRole = sanitize(role || designation);
    const cleanWeb = sanitize(websiteOrSocial);
    const rawContentSolution = sanitize(contentSolution || "In-House Team");
    const rawRequirement = sanitize(monthlyRequirement || videoCount || estimatedMOQ || "11 - 30");

    const googleSolutionValue =
      CONTENT_SOLUTION_MAP[rawContentSolution] || "In House Team";
    const googleRequirementValue =
      MONTHLY_REQUIREMENT_MAP[rawRequirement] || "20-50";

    const timestamp = new Date().toISOString();

    const leadData = {
      fullName: cleanFullName,
      phoneNumber: cleanPhone,
      email: cleanEmail,
      brandName: cleanBrand,
      role: cleanRole,
      websiteOrSocial: cleanWeb,
      contentSolution: rawContentSolution,
      monthlyRequirement: rawRequirement,
      source,
      timestamp,
    };

    console.log("[DISCOVERY CALL LEAD RECEIVED]:", JSON.stringify(leadData, null, 2));

    // 1. Forward to Google Forms server-side
    try {
      const googleFormData = new URLSearchParams();
      googleFormData.append("entry.1936983498", cleanFullName);
      googleFormData.append("entry.203780078", cleanPhone);
      googleFormData.append("entry.979876141", cleanEmail);
      googleFormData.append("entry.897870888", cleanBrand);
      googleFormData.append("entry.1100839857", cleanRole);
      googleFormData.append("entry.793890874", cleanWeb);
      googleFormData.append("entry.982760340", googleSolutionValue);
      googleFormData.append("entry.1194319614", googleRequirementValue);

      fetch(GOOGLE_FORM_ACTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: googleFormData.toString(),
      }).catch((err) => console.log("Google Form server submit error:", err));
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
          fullName: cleanFullName,
          name: cleanFullName,
          phoneNumber: cleanPhone,
          phone: cleanPhone,
          contactNumber: cleanPhone,
          email: cleanEmail,
          brandName: cleanBrand,
          companyName: cleanBrand,
          role: cleanRole,
          designation: cleanRole,
          websiteOrSocial: cleanWeb,
          contentSolution: rawContentSolution,
          monthlyRequirement: rawRequirement,
          videoCount: rawRequirement,
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
