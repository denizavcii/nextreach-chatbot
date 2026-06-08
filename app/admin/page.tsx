"use client";
import { useEffect, useState } from "react";

interface Message {
  role: "bot" | "user";
  text: string;
}

interface Lead {
  id: string;
  created_at: string;
  name: string;
  company: string;
  sector: string;
  email: string;
  phone: string;
  pain_point: string;
  score: number;
  is_duplicate: boolean;
  is_read: boolean;
  full_transcript: Message[];
}

export default function AdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Lead | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    const res = await fetch("/api/leads");
    const data = await res.json();
    setLeads(data);
    setLoading(false);
  }

  async function markAsRead(lead: Lead) {
    if (lead.is_read) return;
    await fetch("/api/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: lead.id, is_read: true }),
    });
    setLeads((prev) =>
      prev.map((l) => (l.id === lead.id ? { ...l, is_read: true } : l)),
    );
  }

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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gelen Talepler</h1>
            <p className="text-gray-500 mt-1">
              Chatbot üzerinden gelen iletişim talepleri
            </p>
          </div>
          <button
            onClick={fetchLeads}
            className="text-sm text-indigo-600 hover:text-indigo-800 border border-indigo-200 px-4 py-2 rounded-lg transition"
          >
            Yenile
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
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
            <p className="text-sm text-gray-500">Okunmadı</p>
            <p className="text-2xl font-bold text-indigo-600 mt-1">
              {leads.filter((l) => !l.is_read).length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-sm text-gray-500">Daha Önce Ulaşmış</p>
            <p className="text-2xl font-bold text-orange-500 mt-1">
              {leads.filter((l) => l.is_duplicate).length}
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
                    Sektör
                  </th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">
                    Sorun
                  </th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">
                    İletişim
                  </th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">
                    Skor
                  </th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">
                    Tarih
                  </th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">
                    Konuşma
                  </th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className={`border-b border-gray-50 hover:bg-gray-50 transition ${!lead.is_read ? "bg-indigo-50/30" : ""}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {!lead.is_read && (
                          <span className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0"></span>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">
                            {lead.name || "—"}
                          </p>
                          <p className="text-gray-400 text-xs mt-0.5">
                            {lead.company || "—"}
                          </p>
                        </div>
                      </div>
                      {lead.is_duplicate && (
                        <span className="text-xs text-orange-500 font-medium">
                          ⚠ Daha önce ulaşmış
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {lead.sector || "—"}
                    </td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs">
                      <p className="truncate">{lead.pain_point || "—"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600 text-xs">
                        {lead.email || "—"}
                      </p>
                      <p className="text-gray-400 text-xs mt-0.5">
                        {lead.phone || "—"}
                      </p>
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
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setSelected(lead);
                          markAsRead(lead);
                        }}
                        className="text-indigo-600 hover:text-indigo-800 text-xs font-medium"
                      >
                        Görüntüle →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-900">
                  {selected.name} — {selected.company}
                </p>
                <p className="text-sm text-gray-400 mt-0.5">
                  {selected.sector}
                </p>
                <p className="text-sm text-gray-400">
                  {selected.email} {selected.phone && `· ${selected.phone}`}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {selected.full_transcript &&
              selected.full_transcript.length > 0 ? (
                selected.full_transcript.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-2xl text-sm ${
                        msg.role === "user"
                          ? "bg-indigo-600 text-white rounded-br-sm"
                          : "bg-gray-100 text-gray-800 rounded-bl-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 text-sm">
                  Konuşma geçmişi yok.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
