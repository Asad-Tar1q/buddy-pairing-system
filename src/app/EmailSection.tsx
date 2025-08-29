
"use client";
import React, { useState } from "react";


interface MentorInfo {
  full_name: string;
  short_code: string;
  email: string;
}

interface MenteeInfo {
  full_name: string;
  email: string;
}

interface EmailEntry {
  mentor: MentorInfo;
  mentee: MenteeInfo;
  content: string;
}

interface EmailData {
  emails: EmailEntry[];
}

const EmailSection: React.FC = () => {
  const [emails, setEmails] = useState<EmailEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'shared'>('shared');

  const handleGenerateEmails = async () => {
    setLoading(true);
    setError(null);
    try {
      const hostUrl = process.env.NEXT_PUBLIC_HOST_URL || "http://localhost:8000";
      const res = await fetch(`${hostUrl}/generate-emails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({})
      });
      if (!res.ok) throw new Error("Failed to fetch emails");
      const data: EmailData = await res.json();
  setEmails(data.emails || []);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Group emails by mentor
  const groupedEmails: { [mentorKey: string]: { mentor: MentorInfo; emails: EmailEntry[] } } = {};
  emails.forEach((email) => {
    const key = email.mentor.email || email.mentor.short_code;
    if (!groupedEmails[key]) {
      groupedEmails[key] = { mentor: email.mentor, emails: [] };
    }
    groupedEmails[key].emails.push(email);
  });

  return (
    <div className="flex-1 bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center">
      <button
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 mb-4 w-full"
        onClick={handleGenerateEmails}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Email Templates"}
      </button>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      <div className="flex gap-2 mb-4 w-full justify-center">
        <button
          className={`px-4 py-2 rounded-t-lg font-semibold transition-colors ${activeTab === 'shared' ? 'bg-green-700 text-white' : 'bg-gray-700 text-green-300 hover:bg-green-800'}`}
          onClick={() => setActiveTab('shared')}
        >
          Shared Emails
        </button>
      </div>
      <div className="w-full">
        {activeTab === 'shared' && (
          emails.length === 0 && !loading ? (
            <div className="text-gray-500">No emails generated yet.</div>
          ) : (
            <ul className="space-y-8">
              {Object.values(groupedEmails).map((group, i) => (
                <li key={i} className="bg-gray-700 rounded p-4 w-full">
                  <div className="font-bold text-green-200 text-lg mb-2">Mentor: {group.mentor.full_name}</div>
                  <div className="text-gray-300 text-xs mb-2"><span className="font-semibold">Mentor Email:</span> {group.mentor.email}</div>
                  <ul className="space-y-4 ml-4">
                    {group.emails.map((email, j) => (
                      <li key={j} className="bg-gray-800 rounded p-3 w-full">
                        <div className="font-bold text-gray-100">To: {email.mentee.full_name}</div>
                        <div className="text-gray-300 text-xs mb-1"><span className="font-semibold">Mentee Email:</span> {email.mentee.email}</div>
                        <div className="text-gray-300 text-sm mb-1 mt-2">
                          {email.content.slice(0, 200)}{email.content.length > 200 ? "..." : ""}
                        </div>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )
        )}
      </div>
    </div>
  );
};

export default EmailSection;
