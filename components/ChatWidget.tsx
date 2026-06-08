"use client";
import { useState, useEffect, useRef } from "react";
import { getNextStep, scoreLead, LeadData, ChatStep } from "@/lib/chatFlow";

interface Message {
  role: "bot" | "user";
  text: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState<ChatStep>("greeting");
  const [leadData, setLeadData] = useState<LeadData>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const { botMessage, step: next } = getNextStep("greeting", "", {});
      setMessages([{ role: "bot", text: botMessage }]);
      setStep(next);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || loading || submitted) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    const {
      step: nextStep,
      botMessage,
      field,
    } = getNextStep(step, userMsg, leadData);
    const newData = field ? { ...leadData, [field]: userMsg } : leadData;

    setLeadData(newData);
    setStep(nextStep);

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "bot", text: botMessage }]);
      setLoading(false);
    }, 600);

    if (nextStep === "done") {
      setSubmitted(true);
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newData,
          email: field === "email" ? userMsg : newData.email,
          score: scoreLead({
            ...newData,
            email: field === "email" ? userMsg : newData.email,
          }),
          full_transcript: [
            ...messages,
            { role: "user", text: userMsg },
            { role: "bot", text: botMessage },
          ],
        }),
      });
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-200 font-medium"
      >
        Bize Ulaşın
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div
          className="fixed bottom-20 right-6 w-80 bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-100"
          style={{ height: "460px" }}
        >
          {/* Header */}
          <div className="bg-indigo-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <div>
              <p className="font-semibold text-sm">NextReach Asistanı</p>
              <p className="text-indigo-200 text-xs">
                Genellikle hemen yanıt verir
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-indigo-200 hover:text-white text-lg"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-sm"
                      : "bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-2 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100 text-gray-400 text-sm">
                  ···
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          {!submitted && (
            <div className="p-3 border-t border-gray-100 bg-white rounded-b-2xl flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Mesajınızı yazın..."
                className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-indigo-400"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-4 py-2 text-sm disabled:opacity-50 transition"
              >
                Gönder
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
