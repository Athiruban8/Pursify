import { seedTransactions } from "@/actions/seed";
import { sendEmail } from "@/actions/send-email";
import EmailTemplate from "@/emails/template";

export async function GET() {
  const result = await seedTransactions();
  return Response.json(result);
}

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    const emailResult = await sendEmail({
      to: email,
      subject: "Test Email from Pursify",
      react: EmailTemplate({
        userName: "Test User",
        type: "monthly-report",
        data: {
          stats: {
            totalIncome: 5000,
            totalExpenses: 3000,
            byCategory: { Food: 500, Transport: 300 },
          },
          month: "December",
          insights: [
            "This is a test email to verify email functionality.",
            "Your email system is working correctly.",
            "You can now receive notifications from Pursify.",
          ],
        },
      }),
    });

    return Response.json(emailResult);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
