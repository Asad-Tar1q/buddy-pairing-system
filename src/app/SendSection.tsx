import React from "react";

interface SendProps {
  sendResult: string;
  onSendEmails: () => void;
}

const SendSection: React.FC<SendProps> = ({ sendResult, onSendEmails }) => (
  <div className="flex-1 bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center">
    <button
      className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 mb-4 w-full"
      onClick={onSendEmails}
    >
      Send Emails
    </button>
    <h2 className="text-lg font-semibold mb-2 text-gray-100">Send Result</h2>
    <div className="w-full min-h-[32px] text-gray-200">
      {sendResult || <span className="text-gray-500">No emails sent yet.</span>}
    </div>
  </div>
);

export default SendSection;
