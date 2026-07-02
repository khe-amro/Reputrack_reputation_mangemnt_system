<div align="center">

# 🌟 RepuTrack

### A Modern Review & Reputation Management Web Application

[![Status](https://img.shields.io/badge/Status-🚧%20In%20Development-orange?style=for-the-badge)](#)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript)](#)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=for-the-badge&logo=vite)](#)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.x-06B6D4?style=for-the-badge&logo=tailwindcss)](#)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?style=for-the-badge&logo=supabase)](#)
[![License](https://img.shields.io/badge/License-Custom%20MIT-green?style=for-the-badge)](#)

> **🚧 Note: This project is still actively under development. Features, databases, and UI components are continuously being refined.**

</div>

---

## 📌 What Is This Project?

**RepuTrack** is a state-of-the-art review and reputation management platform designed to connect local businesses with their customers through verified, transparent feedback. It provides a comprehensive ecosystem where customers can find trusted services, write authentic reviews, and local businesses can track, manage, and showcase their public reputation.

---

## 🚨 Problem It Solves

Trust online is hard to verify. RepuTrack solves key industry problems:

- **Unverified Feedback & Fake Reviews:** RepuTrack uses verified review mechanics to ensure reviews come from authentic interactions.
- **Scattered Customer Feedback:** Instead of tracking reviews across multiple disconnected directories, businesses can manage reviews in a single dashboard.
- **Low Engagement & Visibility:** Businesses lack simple ways to showcase positive reviews and engage with dissatisfied customers in real time.
- **Local SEO & Reputation Challenges:** Makes it easier for top-rated, hard-working local businesses to gain the local search ranking they deserve.

---

## ✨ Features

### 🖥️ Customer Portal
- **Browse & Search Directory:** Find local businesses by category, location, and overall rating.
- **Write Reviews:** Express feedback with an interactive star rating component and text-based details.
- **My Reviews Dashboard:** Track and view all previously written reviews in a single workspace.

### 💼 Business Dashboard
- **Real-Time Analytics:** Access critical insights like overall rating, review count, and monthly feedback trends.
- **Reviews Manager:** View and respond directly to customer reviews.
- **Reputation Marketing:** Tools to request and showcase reviews on external websites.

### 🔑 Authentication & Authorization
- **Role-Based Access Control:** Distinct workflows for **Customers**, **Business Owners**, and **Administrators**.
- **Secure Authentication:** Integrated with Supabase Auth for safe registration, login, and sessions.

### 👑 Admin Console
- **System Metrics & Monitoring:** High-level dashboard containing statistics on users, registered businesses, and platform engagement.
- **Moderation Tools:** Manage business listings and review submissions.

---

## 📸 Project Previews & Diagrams

### 🖥️ Website Interface
![RepuTrack Homepage](screenshot/homepage.png)


---

## 🔧 Techniques & Stack Used

### Frontend & UI
- **React 18.3 (TypeScript 5.8):** Component-driven interface and strict type safety.
- **Vite 7.x:** Rapid local development build tooling.
- **Tailwind CSS + shadcn/ui:** Modern styling, custom color palettes, and accessible component building blocks.
- **Recharts:** Interactive administrative and business charts.
- **React Router Dom v6:** Client-side routing and layout hierarchies.
- **React Hook Form + Zod:** Form validation and robust schema verification.

### Backend & Infrastructure
- **Supabase:** Managed cloud database, authentication layer, and real-time data sync.
- **TanStack Query (React Query v5):** Smart server-side state synchronization, query caching, and optimistic UI mutations.

---

## 🚀 Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/khe-amro/repuTrack.git
   cd repuTrack
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root of the project with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the local development server:
   ```bash
   npm run dev
   ```

---

## 📄 License

This project is licensed under a custom MIT-style license. See [LICENSE.md](./LICENSE.md) for details.
