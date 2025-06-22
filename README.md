# Pursify – an AI-Powered Personal Finance Platform

Pursify is a full-stack AI-powered finance platform built with Next.js, React.js, Tailwind CSS, Supabase, Prisma, and Google’s Gemini Flash 1.5. It enables users to manage their expenses and income seamlessly, offering intelligent features such as automatic receipt scanning, recurring transactions, real-time alerts, and visual financial insights.

---

## Features

- **Expense and Income Tracking**  
  Add and manage individual transactions with category selection, notes, and timestamps.

- **Recurring Transactions**  
  Option to mark transactions as recurring (e.g., monthly rent, salary, subscriptions).

- **AI Receipt Scanner (Gemini Flash 1.5)**  
  Upload receipts to automatically extract and fill transaction details using Gemini Flash 1.5.

- **Budget Monitoring and Alerts**  
  Uses Inngest to trigger Resend email alerts when the user's monthly budget nears exhaustion.

- **Spending Insights**  
  Monthly spending summaries and AI-generated insights to help users understand their financial behavior.

- **Data Visualization**  
  Interactive graphs and charts to visualize spending patterns, income sources, and budget status.

- **Authentication and Security**
  - User sign-in and session management handled by Clerk.
  - ArcJet used to enhance API and platform-level security.

---

## Tech Stack

- **Frontend**: Next.js, React.js, JavaScript, Tailwind CSS, Shadcn UI
- **Backend**: Supabase (PostgreSQL), Prisma ORM
- **AI Integration**: Gemini Flash 1.5 for receipt parsing and insights generation.
- **Task Scheduling and Emails**: Inngest for event handling, Resend for transactional emails
- **Authentication**: Clerk
- **Security**: ArcJet

---

## Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/pursify.git
   cd pursify
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create a .env.local file and add the following environment variables:**

   ```bash
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
   CLERK_SECRET_KEY=
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=sign-up
   DATABASE_URL=
   DIRECT_URL=
   ARCJET_KEY=
   RESEND_API_KEY=
   GEMINI_API_KEY=
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

## Demo

View the demo at - https://pursify.vercel.app/
