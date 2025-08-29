
"use client";
import React, { useState } from "react";

interface Mentor {
  full_name: string;
  gender: string;
  short_code: string;
  phone_number: string;
  course: string;
  year: string;
  mentorship_type: string;
  max_students: number;
  current_students: number;
  timestamp?: string;
}

interface Mentee {
  full_name: string;
  email: string;
  a_levels: string;
  interested_subjects: string[];
  gender: string;
  phone_number: string;
  why_interested: string;
  areas_of_advice: string;
  is_year13: string;
}

interface Pairing {
  mentor: Mentor;
  mentees: Mentee[];
}

interface UnpairedMentor {
  mentor: Mentor;
}

interface UnpairedMentee {
  mentee: Mentee;
}

interface PairingResponse {
  pairings?: Pairing[];
  unpaired_mentors?: UnpairedMentor[];
  unpaired_mentees?: UnpairedMentee[];
}
const PairingSection: React.FC = () => {
  const [pairings, setPairings] = useState<Pairing[]>([]);
  const [unpairedMentors, setUnpairedMentors] = useState<UnpairedMentor[]>([]);
  const [unpairedMentees, setUnpairedMentees] = useState<UnpairedMentee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pairings' | 'mentors' | 'mentees'>('pairings');

  const handleRunPairing = async () => {
    setLoading(true);
    setError(null);
    try {
  const hostUrl = process.env.NEXT_PUBLIC_HOST_URL || "http://localhost:8000";
      const res = await fetch(`${hostUrl}/pair`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({})
      });
      if (!res.ok) throw new Error("Failed to fetch pairings");
  const data: PairingResponse = await res.json();
  setPairings(data.pairings || []);
  setUnpairedMentors(data.unpaired_mentors || []);
  setUnpairedMentees(data.unpaired_mentees || []);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center">
      <button
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mb-4 w-full"
        onClick={handleRunPairing}
        disabled={loading}
      >
        {loading ? "Running..." : "Run Pairing Algorithm"}
      </button>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      <div className="flex gap-2 mb-4 w-full justify-center">
        <button
          className={`px-4 py-2 rounded-t-lg font-semibold transition-colors ${activeTab === 'pairings' ? 'bg-blue-700 text-white' : 'bg-gray-700 text-blue-300 hover:bg-blue-800'}`}
          onClick={() => setActiveTab('pairings')}
        >
          Mentor-Mentee Pairings
        </button>
        <button
          className={`px-4 py-2 rounded-t-lg font-semibold transition-colors ${activeTab === 'mentors' ? 'bg-yellow-600 text-white' : 'bg-gray-700 text-yellow-300 hover:bg-yellow-700'}`}
          onClick={() => setActiveTab('mentors')}
        >
          Unpaired Mentors
        </button>
        <button
          className={`px-4 py-2 rounded-t-lg font-semibold transition-colors ${activeTab === 'mentees' ? 'bg-pink-600 text-white' : 'bg-gray-700 text-pink-300 hover:bg-pink-700'}`}
          onClick={() => setActiveTab('mentees')}
        >
          Unpaired Mentees
        </button>
      </div>
      <div className="w-full">
        {activeTab === 'pairings' && (
          pairings.length === 0 && !loading ? (
            <div className="text-gray-500">No pairings yet.</div>
          ) : (
            <ul className="space-y-4">
              {pairings.map((pairing: Pairing, i: number) => (
                <li key={i} className="bg-gray-700 rounded p-4 w-full">
                  <div className="font-bold text-blue-300 text-lg mb-2">Mentor: {pairing.mentor.full_name}</div>
                  <div className="ml-4">
                    <div className="text-gray-300 text-sm mb-1"><span className="font-semibold">Course:</span> {pairing.mentor.course}</div>
                    <div className="text-gray-300 text-sm mb-1"><span className="font-semibold">Year:</span> {pairing.mentor.year}</div>
                    <div className="text-gray-300 text-sm mb-1"><span className="font-semibold">Mentorship Type:</span> {pairing.mentor.mentorship_type}</div>
                    <div className="text-gray-400 text-xs mb-2"><span className="font-semibold">Phone:</span> {pairing.mentor.phone_number}</div>
                  </div>
                  <div className="font-semibold text-green-300 mt-2 mb-1">Mentees:</div>

                    {pairing.mentees.map((mentee: Mentee, j: number) => (
                      <li key={j} className="bg-gray-800 rounded p-3 mb-2 w-full">
                        <div className="font-bold text-gray-100">{mentee.full_name}</div>
                        <div className="ml-4">
                          <div className="text-gray-300 text-xs mb-1"><span className="font-semibold">Email:</span> {mentee.email}</div>
                          <div className="text-gray-300 text-xs mb-1"><span className="font-semibold">A-levels:</span> {mentee.a_levels}</div>
                          <div className="text-gray-300 text-xs mb-1"><span className="font-semibold">Subjects:</span> {mentee.interested_subjects.join(", ")}</div>
                          <div className="text-gray-300 text-xs mb-1"><span className="font-semibold">Phone:</span> {mentee.phone_number}</div>
                          <div className="text-gray-300 text-xs mb-1"><span className="font-semibold">Advice:</span> {mentee.areas_of_advice}</div>
                        </div>
                      </li>
                    ))}

                </li>
              ))}
            </ul>
          )
        )}
        {activeTab === 'mentors' && (
          unpairedMentors.length === 0 ? (
            <div className="text-gray-500">No unpaired mentors.</div>
          ) : (
            <ul className="space-y-2">
              {unpairedMentors.map((um, i) => (
                <li key={i} className="bg-gray-700 rounded p-4 w-full">
                  <div className="font-bold text-yellow-200 text-lg mb-2">{um.mentor.full_name}</div>
                  <div className="ml-4">
                    <div className="text-gray-300 text-sm mb-1"><span className="font-semibold">Course:</span> {um.mentor.course}</div>
                    <div className="text-gray-300 text-sm mb-1"><span className="font-semibold">Year:</span> {um.mentor.year}</div>
                    <div className="text-gray-300 text-sm mb-1"><span className="font-semibold">Mentorship Type:</span> {um.mentor.mentorship_type}</div>
                    <div className="text-gray-400 text-xs mb-2"><span className="font-semibold">Phone:</span> {um.mentor.phone_number}</div>
                  </div>
                </li>
              ))}
            </ul>
          )
        )}
        {activeTab === 'mentees' && (
          unpairedMentees.length === 0 ? (
            <div className="text-gray-500">No unpaired mentees.</div>
          ) : (
            <ul className="space-y-2">
              {unpairedMentees.map((um, i) => (
                <li key={i} className="bg-gray-700 rounded p-4 w-full">
                  <div className="font-bold text-pink-200 text-lg mb-2">{um.mentee.full_name}</div>
                  <div className="ml-4">
                    <div className="text-gray-300 text-sm mb-1"><span className="font-semibold">A-levels:</span> {um.mentee.a_levels}</div>
                    <div className="text-gray-300 text-sm mb-1"><span className="font-semibold">Email:</span> {um.mentee.email}</div>
                    <div className="text-gray-300 text-sm mb-1"><span className="font-semibold">Phone:</span> {um.mentee.phone_number}</div>
                    <div className="text-gray-300 text-sm mb-1"><span className="font-semibold">Subjects:</span> {um.mentee.interested_subjects.join(", ")}</div>
                    <div className="text-gray-300 text-sm mb-1"><span className="font-semibold">Advice:</span> {um.mentee.areas_of_advice}</div>
                  </div>
                </li>
              ))}
            </ul>
          )
        )}
      </div>
    </div>
  );
};

export default PairingSection;
