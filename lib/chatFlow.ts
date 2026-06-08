export type ChatStep =
  | "greeting"
  | "ask_name"
  | "ask_company"
  | "ask_pain"
  | "ask_email"
  | "done";

export interface LeadData {
  name?: string;
  company?: string;
  pain_point?: string;
  email?: string;
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
      if (!input.trim()) {
        return {
          step: "ask_name",
          botMessage: "Adınızı öğrenebilir miyim?",
        };
      }
      return {
        step: "ask_company",
        field: "name",
        botMessage: `Merhaba ${input}! Hangi şirket için bize ulaşıyorsunuz?`,
      };

    case "ask_company":
      if (!input.trim()) {
        return {
          step: "ask_company",
          botMessage: "Şirket adınızı paylaşabilir misiniz?",
        };
      }
      return {
        step: "ask_pain",
        field: "company",
        botMessage: `Teşekkürler! ${input} olarak hangi konuda destek arıyorsunuz? (Örn: sipariş takibi, müşteri analizi, raporlama)`,
      };

    case "ask_pain":
      if (!input.trim()) {
        return {
          step: "ask_pain",
          botMessage: "Hangi konuda destek arıyorsunuz?",
        };
      }
      return {
        step: "ask_email",
        field: "pain_point",
        botMessage:
          "Anladım, size en kısa sürede dönebilmemiz için e-posta adresinizi alabilir miyim?",
      };

    case "ask_email":
      if (!input.trim() || !input.includes("@")) {
        return {
          step: "ask_email",
          botMessage: "Geçerli bir e-posta adresi girebilir misiniz?",
        };
      }
      return {
        step: "done",
        field: "email",
        botMessage: `Teşekkürler! Talebinizi aldık. Satış ekibimiz en kısa sürede ${input} adresine dönüş yapacak.`,
      };

    default:
      return {
        step: "done",
        botMessage: "Talebiniz alındı, teşekkürler!",
      };
  }
}

export function scoreLead(data: LeadData): number {
  let score = 0;
  if (data.email) score += 4;
  if (data.company) score += 2;
  if (data.pain_point && data.pain_point.length > 20) score += 3;
  if (data.name) score += 1;
  return Math.min(score, 10);
}
