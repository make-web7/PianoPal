# Piano Practice Tracker - Design Guidelines

## Design Approach: Design System (Material Design 3)

**Rationale:** This is a utility-focused productivity tool requiring data visualization, form inputs, and specialized music tools. Material Design 3's emphasis on adaptive layouts, clear information hierarchy, and robust component patterns makes it ideal for this data-dense application.

**Key Principles:**
- Clarity over decoration: Information accessibility is paramount
- Consistent interaction patterns for daily use
- Purposeful use of space for dashboard and statistics
- Music-specific affordances (metronome, recorder) integrated seamlessly

## Typography System

**Font Family:** Inter (Google Fonts) for UI, JetBrains Mono for time/numerical displays

**Hierarchy:**
- Page Titles: 2xl (24px), semibold
- Section Headers: xl (20px), semibold  
- Card Titles: lg (18px), medium
- Body Text: base (16px), regular
- Metadata/Labels: sm (14px), medium
- Timer/Stats Display: 3xl-5xl (30-48px), bold, tabular-nums

## Layout System

**Spacing Units:** Tailwind 2, 4, 6, 8, 12, 16 units consistently throughout

**Container Structure:**
- Dashboard grid: 12-column system
- Main content: max-w-7xl mx-auto px-4 md:px-6
- Cards: p-6 with gap-6 between elements
- Sidebar navigation: 280px fixed width on desktop, drawer on mobile

## Core Layout Structure

**Dashboard View (Default Landing):**
- Left sidebar: Navigation + quick stats widget
- Main area: 3-column responsive grid (lg:grid-cols-3 md:grid-cols-2 grid-cols-1)
  - Today's Practice card (large, spans 2 columns on desktop)
  - Quick Actions card (start session, access metronome)
  - Weekly Stats graph card
  - Recent Sessions list
  - Monthly Progress calendar heatmap
  - Recording Library card

**Session Tracking Page:**
- Prominent timer display at top (centered, large typography)
- Note-taking textarea below timer (full-width)
- Control buttons (Start/Pause/Stop/Save) in fixed bottom bar
- Session metadata: date, duration, tempo (if metronome used)

**Statistics Dashboard:**
- Top row: 4 stat cards (total hours, sessions this week, average duration, current streak)
- Chart area: line graph showing practice time over selected period
- Calendar heatmap showing daily practice patterns (GitHub contribution style)
- Sessions table with sorting/filtering capabilities

**Metronome Tool:**
- Centered, minimal interface
- Large BPM display with increment/decrement buttons
- Visual beat indicator (pulsing circle)
- Time signature selector (4/4, 3/4, 6/8 common options)
- Accent pattern toggles
- Start/Stop button prominent

**Recording Studio:**
- Waveform visualization during recording/playback
- Record/Stop/Pause controls
- Playback timeline with scrubbing capability
- Recording list with date, duration, notes preview
- Download/Delete actions per recording

## Component Library

**Navigation:**
- Fixed left sidebar on desktop with icon + label navigation items
- Mobile: Bottom tab bar with 4 primary actions (Dashboard, Practice, Stats, Tools)
- Active state: filled background, primary color accent

**Cards:**
- Elevated surface (shadow-md)
- Rounded corners (rounded-xl)
- Padding: p-6
- Header with title + optional action button
- Dividers for content sections (border-b)

**Buttons:**
- Primary: Solid fill, prominent for main actions (Start Practice, Save Session)
- Secondary: Outlined for alternative actions
- Icon buttons: Ghost style for utility actions
- Sizes: Large (h-12) for primary CTAs, Medium (h-10) for standard, Small (h-8) for compact areas

**Form Inputs:**
- Floating labels on focus
- Border on all sides (not just bottom)
- Error states with red accent and helper text
- Textarea for notes: min-h-32, auto-expand

**Data Visualization:**
- Bar/Line charts: Clean axes, grid lines, tooltips on hover
- Calendar heatmap: 7-row grid, intensity scale from light to saturated
- Progress rings: Circular progress for goals/streaks

**Metronome Components:**
- BPM stepper: Large touch targets, ±1 and ±10 increment buttons
- Beat indicator: 120px circle, pulsing animation on beat
- Visual feedback: Scale transform on beat (scale-110 momentarily)

**Audio Recording:**
- Waveform: Canvas-based visualization, real-time during recording
- Timeline scrubber: Range input styled as progress bar
- Recording list items: Compact cards with play/pause, timestamp, duration

## Theme Customization System

**Preset Themes:** 5 curated options
- Classic Piano (black/white/gray scale)
- Warm Wood (browns, amber accents)
- Modern Minimalist (neutrals with blue accent)
- Vibrant Energy (bold primary colors)
- Dark Mode (true dark with subtle accents)

**Customizable Elements:**
- Primary accent color
- Background surface color
- Sidebar/navigation color
- Light/Dark mode toggle independent of theme

**Theme Switcher Interface:**
- Accessible from settings icon in sidebar
- Grid of theme preview cards
- Real-time preview on selection
- Save preference to localStorage

## Responsive Breakpoints

- Mobile: < 768px (single column, bottom nav)
- Tablet: 768px - 1024px (2-column grid, sidebar drawer)
- Desktop: > 1024px (3-column grid, fixed sidebar)

## Interactions & Animations

**Minimal, Purposeful Animation:**
- Metronome beat pulse: transform scale, 100ms duration
- Card hover: subtle lift (shadow increase)
- Button press: scale-95 active state
- Page transitions: fade, 200ms
- Recording waveform: real-time animation during capture
- NO decorative scroll animations or parallax

## Accessibility

- Keyboard navigation for all interactive elements
- Focus indicators: 2px ring, primary color
- ARIA labels for icon-only buttons
- High contrast mode support
- Timer/metronome visual indicators paired with audio for hearing impaired users

## Images

**No hero image required** - this is a utility application prioritizing functionality. Use icons and illustrations sparingly:
- Empty states: Simple illustrations for "No sessions yet"
- Onboarding: Optional minimal illustrations for feature highlights
- Focus on data visualization over decorative imagery