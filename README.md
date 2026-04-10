<div align="center">

![ResumeAI Banner](public/metadata/banner.png)

# ◈ ResumeAI: The Pro SaaS Builder

**An Advanced AI-Powered Resume Builder built with Next.js 14, Groq AI (LLaMA 3.3), and Supabase.**

[Live Demo](https://ai-resume-builder-amaan-alys-projects.vercel.app) • [View Features](#-key-features) • [Tech Stack](#-tech-stack)

</div>

---

## 🚀 Key Features

- **✨ AI-Driven Generation:** Automatically generate professional summaries, work experience bullet points, and skills using **LLaMA 3.3 Pro** (via Groq API).
- **📊 ATS Scoring Engine:** Real-time analysis of your resume against market standards with actionable tips to beat the Applicant Tracking Systems.
- **☁️ Cloud Sync & Persistence:** Secure user authentication and real-time auto-save using **Supabase**. Your resumes are always safe and accessible.
- **🎨 Premium Themes & Fonts:** 10+ professional templates (Modern Sidebar, Luxury Serif, Tech Mono, etc.) and high-end Google Fonts (Montserrat, Poppins, Playfair Display).
- **🌐 AI Quick Tools:** Bilingual support with AI-powered translation (English to Hinglish/Hindi) and custom section generators.
- **📸 Dynamic Photo Styling:** Custom shapes (Circle, Rounded, Square), border controls, and grayscale effects for a professional headshot.
- **📄 Instant PDF Export:** High-quality PDF generation with localized printing support.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), React, Vanilla CSS |
| **Backend/AI** | Groq API (LLaMA-3.3-70B-Versatile) |
| **Database/Auth** | Supabase (PostgreSQL + Auth) |
| **Infrastructure** | Vercel |
| **Design** | Flexbox, CSS Grid, Responsive Layouts |

---

## 📸 Mockups

> [!NOTE]
> Check out the **Design** tab in the app to switch between 10+ unique themes including our new **★ Modern Sidebar** and **★ Luxury Serif** editions.

---

## ⚙️ Development Setup

1. **Clone the repo:**
   ```bash
   git clone https://github.com/AmaanAly/ai-resume-builder.git
   cd ai-resume-builder
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file with the following:
   ```env
   GROQ_API_KEY=your_key
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  Developed with ❤️ by <strong>Amaan</strong>
</div>
