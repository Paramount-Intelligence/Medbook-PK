# 🏥 MedBook PK — Next.js

Pakistan's AI-powered doctor appointment booking platform, rebuilt in **Next.js 14 + TypeScript + Tailwind CSS**.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + CSS Variables |
| AI Chatbot | Groq API — Llama 3.3 70B (streaming) |
| Automation | n8n webhooks |
| Storage | Google Sheets (via n8n) |
| Email | Gmail (via n8n) |
| Voice | Web Speech API |

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.local.example .env.local
```
Edit `.env.local`:
```env
NEXT_PUBLIC_GROQ_API_KEY=your_groq_key_here
```
Get a **free** Groq key at [console.groq.com](https://console.groq.com) → API Keys → Create.

### 3. Run development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
src/
├── app/
│   ├── globals.css          # All custom CSS (hospital cards, modal, chatbot, forms)
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Main page — wires everything together
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx       # Sticky top navbar
│   │   ├── Hero.tsx         # Hero section with search
│   │   ├── HowItWorks.tsx   # 3-step explainer section
│   │   └── Footer.tsx       # Footer with hospital list + emergency info
│   │
│   ├── doctors/
│   │   ├── HospitalGrid.tsx # 6-hospital grid with skeleton loading
│   │   ├── HospitalCard.tsx # Individual hospital card
│   │   └── DoctorsList.tsx  # Paginated doctor list with search + specialty filter
│   │
│   ├── booking/
│   │   ├── BookingModal.tsx  # Full modal with tab navigation
│   │   ├── BookingForm.tsx   # Patient details + slot selection + n8n submit
│   │   ├── RescheduleForm.tsx# Reschedule request form
│   │   └── SuccessScreen.tsx # Booking confirmed + reschedule success screens
│   │
│   └── chatbot/
│       └── Chatbot.tsx      # Zara AI — full chatbot with voice, streaming, doctor cards
│
├── hooks/
│   ├── useHospitals.ts      # Loads AKUH JSON + assembles hospital data
│   └── useBookingModal.ts   # Modal open/close/tab state + ProfileID doctor matching
│
├── lib/
│   ├── config.ts            # All config: webhooks, hospitals, static doctors
│   ├── validator.ts         # Form validation, payload builder, phone normalizer
│   ├── api.ts               # n8n API calls with retry + timeout
│   └── smap.ts              # 61-specialty keyword engine (English + Urdu + Roman Urdu)
│
└── types/
    └── index.ts             # TypeScript interfaces: Doctor, Hospital, BookingFormData, etc.

public/
└── agha_khan_doctors.json   # 437 real AKUH doctors (scraped)
```

---

## Features

### 🤖 AI Chatbot (Zara)
- **Groq API** — Llama 3.3 70B, real-time streaming responses
- **61 specialties** — full SMAP keyword engine, English + Urdu + Roman Urdu
- **Multi-turn memory** — remembers last 10 conversation turns
- **Affirmative fallback** — "yes" / "haan" / "ji" reuses previous specialty context
- **Voice input** — Web Speech API with mic button (Chrome/Edge/Safari)
- **Doctor cards** — embedded `[[DOCTORS:id1,id2,...]]` renders clickable cards
- **Direct booking** — `[[BOOK:id]]` opens booking modal with doctor pre-selected
- **Emergency detection** — chest+arm pain → "Call 1122 immediately"

### 🏥 Hospital Booking
- 437 real AKUH doctors loaded from JSON
- Paginated, searchable, filterable doctor list
- Pakistani phone validation (`03xx-xxxxxxx`)
- Appointment date picker (today → +90 days)
- Time slot selection
- Visit type: In-Person, Video, Follow-up, Emergency

### ⚡ n8n Automation
- Booking → Google Sheets append + Gmail confirmation
- Reschedule → Updates col L status to `rescheduled`
- Full retry logic (2 retries, 10s timeout)

---

## n8n Setup

1. Import `n8n_booking_workflow.json` from the original MedBook PK project
2. Activate the workflow
3. Copy the **Production webhook URL** to `src/lib/config.ts` → `N8N_BOOKING_WEBHOOK`

---

## Deployment (Vercel)

```bash
npm run build
# Then deploy to Vercel — set NEXT_PUBLIC_GROQ_API_KEY in Vercel Environment Variables
```

Or:
```bash
npx vercel --prod
```

---

## Key Differences from Vanilla HTML Version

| Feature | HTML Version | Next.js Version |
|---|---|---|
| Type safety | ❌ None | ✅ Full TypeScript |
| State management | Global JS vars | React hooks |
| Component reuse | Copy-paste HTML | Proper components |
| Routing | Single page | App Router ready for multi-page |
| API keys | Exposed in config.js | `.env.local` (secure) |
| Build optimization | None | Next.js automatic |
| SEO | Basic | Metadata API |
| Deployment | Static host | Vercel / any Node host |

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_GROQ_API_KEY` | ✅ Yes | Groq API key for AI chatbot |

The n8n webhook URLs are hardcoded in `src/lib/config.ts` — update them directly or add as env vars.

---

## Credits

- **437 AKUH doctors** — scraped from Aga Khan University Hospital website
- **AI** — Groq (free tier: 14,400 req/day, 30 req/min)
- **Automation** — n8n (self-hosted or n8n cloud)
- **Icons** — emoji + inline SVG
