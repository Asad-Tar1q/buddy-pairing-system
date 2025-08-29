
'use client'


import React, { useState } from "react";
import PairingSection from "./PairingSection";
import EmailSection from "./EmailSection";
import SendSection from "./SendSection";


export default function Home() {
  const [pairings, setPairings] = useState<string[]>([]);
  const [emails, setEmails] = useState<string[]>([]);
  const [sendResult, setSendResult] = useState<string>("");
  // Always use dark mode

  // Real handler for sending emails
  const handleSendEmails = async () => {
    setSendResult("Sending emails...");
    try {
      const hostUrl = process.env.NEXT_PUBLIC_HOST_URL || "http://localhost:8000";
      const res = await fetch(`${hostUrl}/send-emails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({})
      });
      if (!res.ok) throw new Error("Failed to send emails");
      const data = await res.json();
      setSendResult(data.message || "No message returned.");
    } catch (err: any) {
      setSendResult(err.message || "Unknown error");
    }
  };

  return (
    <div className="dark min-h-screen flex flex-col items-center justify-center bg-gray-900 p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-100">Pairing System Dashboard</h1>
      <div className="w-full max-w-6xl">
        <div className="bg-gray-800 rounded-lg shadow p-8 flex flex-col items-center w-full">
          <div className="w-full mb-8">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">Step 1: Run Pairing Algorithm</h2>
            <PairingSection />
          </div>
          <div className="w-full mb-8">
            <h2 className="text-2xl font-bold text-green-400 mb-4">Step 2: Generate Email Templates</h2>
            <EmailSection />
          </div>
          <div className="w-full">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">Step 3: Send Emails</h2>
            <SendSection sendResult={sendResult} onSendEmails={handleSendEmails} />
          </div>
        </div>
      </div>
    </div>
  );
}
