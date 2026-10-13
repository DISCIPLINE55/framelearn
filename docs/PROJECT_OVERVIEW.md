# Project Overview — FrameLearn

## 1. Project Identification
- **Project Title**: FrameLearn: A Web-Based Photography Portfolio, Client Service and Learning Platform
- **Project Type**: Final-Year BSc Information Technology Education Capstone Project
- **Lead Developer & System Architect**: Ismail Ibrahim Mensah
- **Documentation & QA Lead**: Arafat Nabuku Jansu
- **UI/UX & Brand Identity Lead**: Janet Antwi
- **Target User Personas**:
  1. **Independent Professional Photographer**: Needs a high-impact branded digital home to showcase photographic work, organize client inquiries, and share educational materials.
  2. **Photography Clients**: Need an effortless way to browse portfolio categories, inquire about session bookings, and access secure photo proofing galleries.
  3. **Aspiring Learners / Students**: Seek structured photography guides, tips, and workshop learning resources.

---

## 2. Core Problem Statement & Motivation
Independent creative professionals frequently struggle with fragmented tooling: using third-party social media for exposure, disparate email chains for scheduling, separate cloud drives for proofing, and scattered channels for educational workshops. FrameLearn unifies these workflows under a single cohesive, high-performance web platform built on modern software engineering standards.

---

## 3. Product Scope Boundaries

### In Scope for Full Application (Phased Delivery):
- **Branded Photography Showcase**: High-resolution gallery presentation with category filtering and accessible lightbox previews.
- **Client Session Scheduling**: Inquiries, package listings, and structured booking workflows.
- **Private Proofing Galleries**: Protected image review for clients with favoriting and selection.
- **Learning & Educational Hub**: Step-by-step photography guides, tutorials, and workshop resources.
- **Photographer Management Dashboard**: Single point of administration for appointments, galleries, and content.

### Current Implementation Boundary:
- **Completed**: Milestone 001 — Frontend Foundation, strict design system tokens, 14 UI primitives, accessible responsive shell, and CI pipeline.
- **Active Feature**: Reusable Notification Standard, Central Documentation Hub, and Interactive Portfolio with category filtering and accessible lightbox viewer.
- **Explicitly Deferred (Future Milestones)**:
  - Database-backed user authentication (Milestone 002).
  - Client booking persistence and scheduling tables (Milestone 004).
  - Private client proofing galleries with passcodes (Milestone 005).
  - Course enrollment and LMS tracking (Milestone 006).
  - Payment gateway processing (Milestone 007+).

---

## 4. Brand & Aesthetics Policy
- **Primary Navy (`#10212B`)**: Dominant contrast, structural framing, high-contrast headings and buttons.
- **Sage Green (`#8FA464`)**: Subtle brand accent, secondary buttons, active selection states, focus highlights.
- **Light Cream (`#EFFBDD`)**: Warm, non-glare background surfaces, breathable containers.
- **No Native Browser Popups**: Zero usage of `alert()`, `confirm()`, or `prompt()`. All notifications are branded, accessible, and honest.
