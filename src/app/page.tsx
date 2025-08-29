
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
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl justify-center">
        <div className="flex-1 min-w-[350px] md:min-w-[400px] lg:min-w-[500px]">
          <PairingSection />
        </div>
        <div className="flex-1 min-w-[350px] md:min-w-[400px] lg:min-w-[500px]">
          <EmailSection emails={emails} onGenerateEmails={handleGenerateEmails} />
        </div>
        <div className="flex-1 min-w-[350px] md:min-w-[400px] lg:min-w-[500px]">
          <SendSection sendResult={sendResult} onSendEmails={handleSendEmails} />
        </div>
      </div>
    </div>
  );
}
