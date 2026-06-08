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
          phone: field === "phone" ? userMsg : newData.phone,
          score: scoreLead({
            ...newData,
            email: field === "email" ? userMsg : newData.email,
            phone: field === "phone" ? userMsg : newData.phone,
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
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xl transition-all duration-200 rounded-2xl px-14 py-6 font-bold text-2xl hover:scale-105 animate-pulse hover:animate-none tracking-wide"
      >
        Bize Ulaşın
      </button>

      {isOpen && (
        <div
          className="fixed bottom-32 right-6 w-[480px] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-100"
          style={{ height: "600px" }}
        >
          <div className="bg-indigo-600 text-white p-5 rounded-t-2xl flex justify-between items-center">
            <div>
              <p className="font-semibold text-lg">NextReach Asistanı</p>
              <p className="text-indigo-200 text-sm mt-0.5">
                Genellikle hemen yanıt verir
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-indigo-200 hover:text-white text-2xl"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-base leading-relaxed ${
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
                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100 text-gray-400 text-base">
                  ···
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {!submitted && (
            <div className="p-4 border-t border-gray-100 bg-white rounded-b-2xl flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Mesajınızı yazın..."
                className="flex-1 border border-gray-200 rounded-full px-5 py-3 text-base focus:outline-none focus:border-indigo-400"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 py-3 text-base font-medium disabled:opacity-50 transition"
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
