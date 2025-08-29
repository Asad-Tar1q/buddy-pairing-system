import React from "react";

interface EmailProps {
  emails: string[];
  onGenerateEmails: () => void;
}

const EmailSection: React.FC<EmailProps> = ({ emails, onGenerateEmails }) => (
  <div className="flex-1 bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center">
    <button
      className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 mb-4 w-full"
      onClick={onGenerateEmails}
    >
      Generate Email Templates
    </button>
    <h2 className="text-lg font-semibold mb-2 text-gray-100">Emails</h2>
    <ul className="w-full list-disc pl-5">
      {emails.length === 0 ? (
        <li className="text-gray-500">No emails generated yet.</li>
      ) : (
        emails.map((e, i) => <li key={i} className="text-gray-200">{e}</li>)
      )}
    </ul>
  </div>
);

export default EmailSection;
