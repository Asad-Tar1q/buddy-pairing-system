# Buddy Pairing System (based off the mentor/mentee pairing system)

This project is a mentor-mentee pairing and email automation system with a React/Next.js frontend and a FastAPI backend.

## Backend (FastAPI)

### Setup
1. Install Python 3.10+.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Place your `mentors.xlsx` and `mentees.xlsx` files in the project root.

### Run the Backend
1. Start the FastAPI server:
   ```bash
   uvicorn api:app --reload
   ```
2. The API will be available at `http://localhost:8000`.

## Frontend (Next.js)

### Setup
1. Install Node.js (v18+ recommended).
2. Install dependencies:
   ```bash
   npm install
   ```

### Run the Frontend
1. Start the Next.js development server:
   ```bash
   npm run dev
   ```
2. The app will be available at `http://localhost:3000`.

## Usage
1. Step 1: Run the pairing algorithm from the dashboard.
2. Step 2: Generate email templates.
3. Step 3: Send emails (requires Outlook on Windows).

## Important Generated Files

- **pairings_export.xlsx**: This Excel file is automatically created after running the pairing algorithm (Step 1). It contains:
  - `Pairings` sheet: All mentor-mentee pairs, including matched subjects and contact details.
  - `Unpaired_Mentors` sheet: Mentors who were not matched to any mentee.
  - `Unpaired_Mentees` sheet: Mentees who were not matched to any mentor.
  - You can manually review or update pairings here before generating emails.

- **emails/** directory: This folder is created after generating email templates (Step 2). It contains:
  - One subfolder per mentor, named after the mentor's full name.
  - Each mentor folder contains:
    - `mentor_details.json`: Mentor's details.
    - `mentees_details/`: A folder with one JSON file per mentee, containing their details.
    - One `.txt` file per mentor-mentee pair, containing the email template for that mentee.
  - You can review or edit email templates here before sending.

## Notes
- Ensure your Excel files have the correct columns as expected by the backend.
- Email sending uses Outlook via `pywin32` and only works on Windows.
- API endpoints:
  - `/pair` (POST): Runs the pairing algorithm.
  - `/generate-emails` (POST): Generates email templates.
  - `/send-emails` (POST): Sends emails via Outlook.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
