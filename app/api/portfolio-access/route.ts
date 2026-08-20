import { NextResponse } from "next/server";

function sanitize(text: string): string {
  return text.replace(/[<>]/g, "").trim();
}

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
      phone = "",
      email = "",
      source = "View Full Portfolio CTA",
    } = body;

    const cleanName = sanitize(name);
    const cleanPhone = sanitize(phone);
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

    // Forward to the main form database / Google Sheets Webhook
    const SHEET_WEBHOOK_URL =
      process.env.GOOGLE_SHEET_WEBHOOK_URL ||
      "https://script.google.com/macros/s/AKfycbyBGm2YZIYt5m41QYT2dx9bkvfI9iXwgs4WZshHwXwklo6rLI4ET8SIN2VoatZV7jpm/exec";
    const googleSheetSecret =
      process.env.GOOGLE_SHEET_SECRET ||
      "AKfycbyBGm2YZIYt5m41QYT2dx9bkvfI9iXwgs4WZshHwXwklo6rLI4ET8SIN2VoatZV7jpm";

    if (SHEET_WEBHOOK_URL) {
      try {
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

        await fetch(SHEET_WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify(payload),
          redirect: "follow",
          cache: "no-store",
        });
      } catch (webhookErr) {
        console.error("Failed to forward lead to Google Sheet webhook:", webhookErr);
      }
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
