export type ChatStep =
  | "greeting"
  | "ask_name"
  | "ask_company"
  | "ask_sector"
  | "ask_pain"
  | "ask_team_size"
  | "ask_urgency"
  | "ask_email"
  | "ask_phone"
  | "done";

export interface LeadData {
  name?: string;
  company?: string;
  sector?: string;
  pain_point?: string;
  team_size?: string;
  urgency?: string;
  email?: string;
  phone?: string;
}

export function getNextStep(
  current: ChatStep,
  input: string,
  data: LeadData,
): { step: ChatStep; botMessage: string; field?: keyof LeadData } {
  switch (current) {
    case "greeting":
      return {
        step: "ask_name",
        botMessage:
          "Merhaba! Ben NextReach asistanı. Size nasıl yardımcı olabileceğimi anlamak için birkaç soru sormak istiyorum. Önce adınızı öğrenebilir miyim?",
      };

    case "ask_name":
      if (
        !input.trim() ||
        input.trim().length < 2 ||
        !/[a-zA-ZğüşıöçĞÜŞİÖÇ]/.test(input)
      ) {
        return {
          step: "ask_name",
          botMessage: "Lütfen geçerli bir isim girin.",
        };
      }
      return {
        step: "ask_company",
        field: "name",
        botMessage: `Merhaba ${input}! Hangi şirket için bize ulaşıyorsunuz?`,
      };

    case "ask_company":
      if (!input.trim() || input.trim().length < 2) {
        return {
          step: "ask_company",
          botMessage: "Şirket adınızı paylaşabilir misiniz?",
        };
      }
      return {
        step: "ask_sector",
        field: "company",
        botMessage: `Teşekkürler! Hangi sektörde faaliyet gösteriyorsunuz? (Örn: e-ticaret, tekstil, gıda, elektronik)`,
      };

    case "ask_sector":
      if (!input.trim() || input.trim().length < 2) {
        return {
          step: "ask_sector",
          botMessage: "Sektörünüzü paylaşabilir misiniz?",
        };
      }
      return {
        step: "ask_pain",
        field: "sector",
        botMessage: `Anladım. Hangi konuda destek arıyorsunuz? (Örn: sipariş takibi, müşteri analizi, raporlama)`,
      };

    case "ask_pain":
      if (!input.trim() || input.trim().length < 5) {
        return { step: "ask_pain", botMessage: "Biraz daha açıklar mısınız?" };
      }
      return {
        step: "ask_team_size",
        field: "pain_point",
        botMessage: "Anladım. Ekibiniz kaç kişiden oluşuyor?",
      };

    case "ask_team_size":
      if (!input.trim()) {
        return {
          step: "ask_team_size",
          botMessage: "Ekip büyüklüğünüzü paylaşabilir misiniz?",
        };
      }
      return {
        step: "ask_urgency",
        field: "team_size",
        botMessage:
          "Ne zaman bir çözüme ihtiyacınız var? (Hemen / 1-3 ay içinde / Sadece araştırıyorum)",
      };

    case "ask_urgency":
      if (!input.trim()) {
        return {
          step: "ask_urgency",
          botMessage: "Ne zaman bir çözüme ihtiyacınız var?",
        };
      }
      return {
        step: "ask_email",
        field: "urgency",
        botMessage: "E-posta adresinizi alabilir miyim?",
      };

    case "ask_email": {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!input.trim() || !emailRegex.test(input.trim())) {
        return {
          step: "ask_email",
          botMessage:
            "Geçerli bir e-posta adresi girebilir misiniz? (örn: isim@sirket.com)",
        };
      }
      return {
        step: "ask_phone",
        field: "email",
        botMessage:
          'Telefon numaranızı da paylaşmak ister misiniz? (İstemiyorsanız "hayır" yazabilirsiniz)',
      };
    }

    case "ask_phone": {
      const skip = input.trim().toLowerCase();
      if (skip === "hayır" || skip === "hayir" || skip === "no") {
        return {
          step: "done",
          botMessage: `Talebinizi aldık, teşekkürler! Satış ekibimiz en kısa sürede ${data.email} adresine dönüş yapacak.`,
        };
      }
      const phoneRegex = /^[0-9\s\+\-\(\)]{7,15}$/;
      if (!phoneRegex.test(input.trim())) {
        return {
          step: "ask_phone",
          botMessage:
            "Geçerli bir telefon numarası girer misiniz? (örn: 0532 123 45 67)",
        };
      }
      return {
        step: "done",
        field: "phone",
        botMessage: `Harika! Talebinizi aldık. Satış ekibimiz en kısa sürede ${data.email} adresine veya telefonunuza dönüş yapacak.`,
      };
    }

    default:
      return { step: "done", botMessage: "Talebiniz alındı, teşekkürler!" };
  }
}

export function scoreLead(data: LeadData): number {
  let score = 0;
  if (data.email && data.phone) score += 4;
  else if (data.email) score += 2;
  else if (data.phone) score += 2;
  if (data.urgency) {
    const u = data.urgency.toLowerCase();
    if (u.includes("hemen")) score += 3;
    else if (u.includes("1") || u.includes("3")) score += 1;
  }
  if (data.team_size) {
    const n = parseInt(data.team_size);
    if (n >= 50) score += 2;
    else if (n >= 10) score += 1;
  }
  if (data.pain_point && data.pain_point.length > 20) score += 1;
  return Math.min(score, 10);
}
