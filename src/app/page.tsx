
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

  // Dummy handlers for demonstration
  const handleRunPairing = () => {
    setPairings(["Mentor A - Mentee 1", "Mentor B - Mentee 2"]);
  };
  const handleGenerateEmails = () => {
    setEmails([
      "Email to Mentor A: ...",
      "Email to Mentor B: ...",
      "Email to Mentee 1: ...",
      "Email to Mentee 2: ...",
    ]);
  };
  const handleSendEmails = () => {
    setSendResult("Emails sent successfully!");
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
