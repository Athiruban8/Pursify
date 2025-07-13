"use server";

import { Resend } from "resend";

export async function sendEmail({ to, subject, react }) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    return { success: false, error: "RESEND_API_KEY is not configured" };
  }

  const resend = new Resend(apiKey);

  try {
    console.log(`Attempting to send email to: ${to}`);

    const { data, error } = await resend.emails.send({
      from: "Pursify <onboarding@resend.dev>",
      to: [to],
      subject,
      react,
    });

    if (error) {
      console.error(`Failed to send email to ${to}:`, error);
      return { success: false, error: error.message };
    }

    console.log(`Email sent successfully to ${to}:`, data);
    return { success: true, data };
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    console.error("Error details:", {
      message: error.message,
      status: error.status,
      code: error.code,
    });
    return { success: false, error: error.message };
  }
}
