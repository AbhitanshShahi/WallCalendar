📅 WallCalendar - Frontend Engineering Challenge
An interactive, premium React/Next.js calendar component that bridges the gap between a traditional physical wall calendar and a high-performance digital productivity tool.

🔗 Submission Links
Live Demo: [Insert Vercel/Netlify Link Here]

Video Walkthrough: [Insert YouTube/Loom Link Here]

Source Code: https://github.com/AbhitanshShahi/WallCalendar

✨ Features
1. Physical Wall Calendar Aesthetic
Inspired by the tactile nature of paper planners, the UI features a prominent Hero Image that updates per month. I utilized a Serif-heavy typography and a soft stone/terracotta color palette to emulate a high-end editorial feel.

2. Intelligent Range Selector
Users can select a start and end date with a single-click flow.

Seamless UI: The selection uses a "pill" highlight that connects dates across weeks without gaps.

Logic: Implemented timestamp-based comparisons to ensure precise range detection and automatic "swap" logic if the end date is clicked before the start date.

3. Integrated Multi-Tier Notes
The sidebar acts as a context-aware scratchpad:

Monthly Notes: Default view for general memos.

Daily Notes: Deep-dive into specific dates.

Range Notes: Unique persistence for selected date ranges.

Persistence: All data is persisted locally via localStorage.

4. Creative Liberties (The "Extra Mile")
3D Page Flip Animation: Leveraging Framer Motion's 3D transforms (rotateX) and originY manipulation to simulate a physical calendar page flipping.

Indian Holiday Integration: A localized holiday engine specifically for the Indian calendar (Diwali, Republic Day, etc.) with custom UI markers and tooltips.

Performance Optimization: Extensive use of useMemo and useCallback to ensure the 42-cell grid doesn't re-render while typing in the notes section.

🛠 Tech Stack & Choices
Framework: Next.js 14 (App Router)

Styling: Tailwind CSS (for rapid, responsive utility-first styling).

Animations: Framer Motion (chosen for its robust AnimatePresence and layout transition capabilities).

Icons: Lucide React (clean, consistent stroke weights).

State Management: React Hooks (useState, useMemo, useEffect). I opted against Redux/Zustand to keep the bundle size small for a single-component challenge, proving that complex state can be handled efficiently with native hooks.

🚀 Getting Started
Follow these steps to run the project locally:

Clone the repository:

Bash
git clone https://github.com/AbhitanshShahi/WallCalendar.git
cd WallCalendar
Install dependencies:

Bash
npm install
# or
bun install
Run the development server:

Bash
npm run dev
# or
bun dev
Open the app:
Navigate to http://localhost:3000.

🧠 Engineering Decisions
The "42-Cell" Grid
I implemented a consistent 6-row (42-cell) grid. While some months only need 5 rows, using a fixed size prevents "layout jumping" when navigating between months, providing a much smoother user experience.

Responsive Architecture
Instead of a simple "hide/show" mobile menu, I restructured the grid system. On mobile, the Sidebar and Calendar maintain a 1:1 vertical stack, ensuring that the touch targets for the date buttons remain large enough for thumbs (Fitts's Law).

Persistence Layer
I created a separate lib/storage.ts utility to abstract localStorage calls. This ensures the main component remains "lean" and handles only UI logic, following the Separation of Concerns principle.

👨‍💻 Author
Abhitansh Shahi
Second Year CSE Student, KIIT Bhubaneswar
