4. Start the development server:

```bash
   npm run dev
```

5. Open http://localhost:3000 in your browser.

---

## Tech Stack & Reasoning

**Next.js + Tailwind CSS**  
Next.js App Router allowed me to manage both frontend and API routes in a single project. Tailwind enabled fast, responsive UI development without writing custom CSS.

**Supabase**  
Quick setup, generous free tier, and a simple JavaScript client. Database, API, and storage all in one platform — ideal for a time-constrained project.

**Rule-based chatbot (no AI API)**  
I chose a rule-based state machine over an AI API integration. Within a 6-hour limit, reliability and debuggability matter more than conversational flexibility. An AI integration would have introduced additional complexity around error handling and unpredictable responses. I noted this as a future improvement.

---

## Ambiguous PRD Decisions

**What does the chatbot ask, and in what order?**  
I designed a 4-step flow: name → company → problem → email. Email is collected last intentionally — users are more willing to share contact details after they've had a chance to explain their needs.

**Tone and personality?**  
Warm and concise. The bot greets users by name, keeps sentences short, and never feels like a form. Professional but not corporate.

**Good lead vs. bad lead?**  
I implemented an automatic scoring system (1–10):

- Email provided: +4 points
- Company name provided: +2 points
- Detailed problem description (20+ chars): +3 points
- Name provided: +1 point

Score 7+: Hot (green), 4–6: Warm (yellow), 0–3: Cold (gray)

**Admin view design?**  
Summary cards at the top (total, hot, warm leads) and a sortable table below. The sales team can open it once a day and immediately see who reached out, why, and how urgent it is.

**Spam and bad-faith usage?**  
Email validation is required before submission. A minimum of 4 conversation steps must be completed before a lead is saved. Empty responses prompt the bot to repeat the question.

**What if a visitor doesn't want to answer?**  
The bot repeats the question once. Fields other than email can be skipped — the system still saves the lead with whatever data was collected.

---

## What I Couldn't Finish in 6 Hours

- Email notifications when a new lead arrives
- Search and filter on the admin panel
- Full conversation transcript view in admin
- Claude API integration for more natural conversation flow
- Rate limiting for spam protection

---

## AI Assistance

I used Claude (Anthropic) as a coding assistant during development. All code was reviewed, understood, and adapted by me. I can explain any part of the codebase.

---

## Time Spent

~3 hours
