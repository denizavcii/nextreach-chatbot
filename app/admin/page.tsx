"use client";
import { useEffect, useState } from "react";

interface Lead {
  id: string;
  created_at: string;
  name: string;
  company: string;
  email: string;
  pain_point: string;
  score: number;
}

export default function AdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leads")
      .then((r) => r.json())
      .then((data) => {
        setLeads(data);
        setLoading(false);
      });
  }, []);

  function scoreColor(score: number) {
    if (score >= 7) return "bg-green-100 text-green-800";
    if (score >= 4) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-600";
  }

  function scoreLabel(score: number) {
    if (score >= 7) return "Sıcak";
    if (score >= 4) return "Orta";
    return "Soğuk";
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Gelen Talepler</h1>
          <p className="text-gray-500 mt-1">
            Chatbot üzerinden gelen iletişim talepleri
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-sm text-gray-500">Toplam Talep</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {leads.length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-sm text-gray-500">Sıcak Lead</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {leads.filter((l) => l.score >= 7).length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-sm text-gray-500">Orta Lead</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">
              {leads.filter((l) => l.score >= 4 && l.score < 7).length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Yükleniyor...</div>
          ) : leads.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              Henüz talep yok.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">
                    Kişi
                  </th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">
                    Sorun
                  </th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">
                    E-posta
                  </th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">
                    Skor
                  </th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">
                    Tarih
                  </th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, i) => (
                  <tr
                    key={lead.id}
                    className={`border-b border-gray-50 hover:bg-gray-50 transition ${i % 2 === 0 ? "" : "bg-gray-50/50"}`}
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">
                        {lead.name || "—"}
                      </p>
                      <p className="text-gray-400 text-xs mt-0.5">
                        {lead.company || "—"}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs">
                      <p className="truncate">{lead.pain_point || "—"}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {lead.email || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${scoreColor(lead.score)}`}
                      >
                        {scoreLabel(lead.score)} ({lead.score}/10)
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs">
                      {new Date(lead.created_at).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
