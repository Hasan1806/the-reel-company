import { NextResponse } from "next/server";

const ESTIMATED_MOQ_OPTIONS = [
  "1–5 videos",
  "6–10 videos",
  "11–25 videos",
  "26–50 videos",
  "51–100 videos",
  "100+ videos",
  "Not sure yet",
];

// Helper to sanitize inputs
function sanitize(text: string): string {
  return text.replace(/[<>]/g, "").trim();
}

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
      companyName = "",
      designation = "",
      email = "",
      contactNumber = "",
      estimatedMOQ = "",
      honeypot = "",
      source = "Book a Discovery Call CTA",
    } = body;

    // Honeypot check
    if (honeypot) {
      // Quietly reject spam bots
      return NextResponse.json({ success: true, message: "Request received" });
    }

    // Field validations
    const errors: Record<string, string> = {};

    const cleanFullName = sanitize(fullName);
    if (cleanFullName.length < 2) {
      errors.fullName = "Full name must be at least 2 characters.";
    }

    const cleanCompanyName = sanitize(companyName);
    if (cleanCompanyName.length < 2) {
      errors.companyName = "Company name must be at least 2 characters.";
    }

    const cleanDesignation = sanitize(designation);
    if (cleanDesignation.length < 2) {
      errors.designation = "Designation / Job Title must be at least 2 characters.";
    }

    const cleanEmail = sanitize(email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      errors.email = "Please enter a valid work email address.";
    }

    const cleanContact = sanitize(contactNumber);
    const phoneDigits = cleanContact.replace(/\D/g, "");
    if (!cleanContact || phoneDigits.length < 7 || phoneDigits.length > 15) {
      errors.contactNumber = "Please enter a valid contact number (7–15 digits).";
    }

    const cleanMOQ = sanitize(estimatedMOQ);
    if (!cleanMOQ || !ESTIMATED_MOQ_OPTIONS.includes(cleanMOQ)) {
      errors.estimatedMOQ = "Please select an estimated requirement.";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    const timestamp = new Date().toISOString();

    const leadData = {
      fullName: cleanFullName,
      companyName: cleanCompanyName,
      designation: cleanDesignation,
      email: cleanEmail,
      contactNumber: cleanContact,
      estimatedMOQ: cleanMOQ,
      source,
      timestamp,
    };

    // Log the lead server-side
    console.log("[DISCOVERY CALL LEAD RECEIVED]:", JSON.stringify(leadData, null, 2));

    // Google Sheet Webhook Integration
    const SHEET_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbyBGm2YZIYt5m41QYT2dx9bkvfI9iXwgs4WZshHwXwklo6rLI4ET8SIN2VoatZV7jpm/exec";
    const googleSheetUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL || SHEET_WEBHOOK_URL;
    const googleSheetSecret = process.env.GOOGLE_SHEET_SECRET || "AKfycbyBGm2YZIYt5m41QYT2dx9bkvfI9iXwgs4WZshHwXwklo6rLI4ET8SIN2VoatZV7jpm";

    if (googleSheetUrl) {
      try {
        const payload = {
          secret: googleSheetSecret,
          fullName: cleanFullName,
          name: cleanFullName,
          companyName: cleanCompanyName,
          company: cleanCompanyName,
          designation: cleanDesignation,
          email: cleanEmail,
          contactNumber: cleanContact,
          phone: cleanContact,
          estimatedMoq: cleanMOQ,
          estimatedMOQ: cleanMOQ,
          message: `Company: ${cleanCompanyName} | Designation: ${cleanDesignation} | MOQ: ${cleanMOQ}`,
          source,
          timestamp,
        };

        // Send payload to Google Sheet Webhook
        const sheetResponse = await fetch(googleSheetUrl, {
          method: "POST",
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify(payload),
          redirect: "follow",
          cache: "no-store",
        });

        if (!sheetResponse.ok) {
          console.error(`Google Sheet webhook returned status ${sheetResponse.status}`);
          throw new Error(`Google Sheet returned status ${sheetResponse.status}`);
        }

        const resText = await sheetResponse.text();
        console.log("[GOOGLE SHEET RESPONSE]:", resText);
      } catch (webhookErr) {
        console.error("Failed to forward lead to Google Sheet webhook:", webhookErr);
        return NextResponse.json(
          { success: false, message: "Failed to log entry into Google Sheet. Please check webhook deployment." },
          { status: 502 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Form submitted successfully",
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
