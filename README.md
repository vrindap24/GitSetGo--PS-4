# 🍽️ Reflo
### AI-Powered Restaurant Review Management Ecosystem

<p align="center">
  <strong>Turn customer feedback into actionable restaurant intelligence.</strong>
</p>

<p align="center">
  Reflo uses AI to analyze customer reviews, detect operational risks,
  and provide actionable insights across multiple restaurant branches.
</p>

---

## 🚀 Overview

**Reflo** is a comprehensive, enterprise-ready platform designed to transform
how restaurants manage customer feedback and engagement.

By leveraging **Google Gemini AI**, Reflo automatically analyzes customer
reviews, identifies operational risks in real time, and provides actionable
insights through a seamless multi-platform experience.

The ecosystem connects:

**Customers → Feedback → AI Analysis → Risk Detection → Management Insights**

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🤖 **AI Review Analysis** | Automatically analyzes customer reviews using Google Gemini |
| 😊 **Sentiment Analysis** | Identifies positive, neutral, and negative customer sentiment |
| 🚨 **Risk Detection** | Detects high-risk or low-rated reviews requiring attention |
| ⚡ **Automated Escalation** | Creates escalation tasks for critical feedback |
| 📊 **Branch Analytics** | Compare performance across multiple restaurant branches |
| 👥 **Staff Performance** | Track staff-related metrics and operational performance |
| 📱 **Customer PWA** | Mobile-first experience for customers to browse menus and submit reviews |
| 🌐 **Centralized Dashboard** | Gives restaurant owners and managers a unified view of operations |
| 🔄 **Real-Time Insights** | Converts incoming feedback into actionable operational intelligence |

---

# 🚀 The Ecosystem

Reflo is composed of four primary components, each designed for a
specific stakeholder in the restaurant ecosystem.

---

## 🧠 Backend Service

The **Brain of Reflo**.

A high-performance API built with **FastAPI** that orchestrates AI analysis,
data persistence, review processing, and analytics.

### Key capabilities

- 🤖 **AI Analysis Pipeline**
  - Processes reviews using **Google Gemini 2.0 Flash**
  - Performs sentiment analysis
  - Categorizes operational risks
  - Generates performance scores

- 🚨 **Automated Escalation**
  - Detects high-risk or low-rated reviews
  - Triggers alerts
  - Creates escalation tasks

- 🔥 **Data Persistence**
  - Uses **Firebase Firestore**
  - Provides scalable data storage

- 📊 **Comprehensive Analytics**
  - Branch-level performance metrics
  - Staff performance insights
  - Review analytics

---

## 📊 HQ Dashboard

A powerful management console designed for **restaurant owners,
regional managers, and decision-makers**.

### Key capabilities

- 📈 **Executive Overview**
  - Visualizes performance metrics across branches
  - Uses **Recharts** for data visualization

- 🏢 **Branch Management**
  - Inspect individual restaurant locations
  - View branch-level metrics
  - Monitor escalation statuses

- 👥 **Staff Insights**
  - Analyze staff-related performance metrics
  - Identify operational trends

- 🎨 **Modern Interface**
  - Built with **React**
  - Powered by **Vite**
  - Styled with **Tailwind CSS**
  - Responsive and component-driven UI

---

## 📱 Customer PWA

A mobile-first, installable **Progressive Web App** that connects
customers directly with the restaurant feedback ecosystem.

### Key capabilities

- 🍽️ **Dynamic Menu**
  - Browse restaurant menus
  - View item-specific details

- 💬 **Seamless Feedback**
  - Submit customer reviews
  - Optimized for mobile devices

- ⚡ **Modern State Management**
  - Powered by **Zustand**

- 🎨 **Native-Like Experience**
  - Built with **Material UI (MUI)**

---

## 🌐 Landing Page

The public-facing marketing experience for Reflo.

### Highlights

- ✨ High-impact visual design
- 🎬 Smooth animations powered by **Framer Motion**
- 📱 Responsive layouts
- 🎯 Clear presentation of the Reflo value proposition

---

# 🛠️ Tech Stack

### Frontend

![React](https://img.shields.io/badge/React-2026-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-2026-purple?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-2026-06B6D4?logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-2026-blue?logo=typescript)

### Backend

![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-API-009688?logo=fastapi)

### AI & Data

![Google Gemini](https://img.shields.io/badge/Google-Gemini_AI-4285F4)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?logo=firebase)

### Other Technologies

- Recharts
- Zustand
- Material UI
- Framer Motion
- Progressive Web App architecture

---

# 🏗️ Architecture

Reflo follows a modern, decoupled architecture:

```mermaid
graph TD
    subgraph "Customer Layer"
        PWA[Customer PWA]
        LP[Landing Page]
    end

    subgraph "Management Layer"
        HQ[HQ Dashboard]
    end

    subgraph "Core Service Layer"
        API[FastAPI Backend]
    end

    subgraph "External Services"
        Firebase[(Firebase Firestore)]
        Gemini[[Google Gemini AI]]
    end

    PWA -->|Submit Review| API
    HQ -->|Fetch Analytics| API
    API -->|Store/Retrieve| Firebase
    API -->|Analyze Sentiment| Gemini
