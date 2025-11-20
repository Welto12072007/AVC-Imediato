# Planning Guide

A professional healthcare landing page showcasing two TCC (final course projects) mobile applications focused on emergency health response and stroke awareness, with secure user authentication to access detailed project information.

**Experience Qualities**: 
1. **Professional** - Medical-grade credibility through clean design, clear typography, and authoritative presentation that instills trust
2. **Accessible** - Intuitive navigation and clear information hierarchy ensuring anyone can quickly understand the projects' value and purpose
3. **Engaging** - Smooth animations and visual storytelling that guide users through the healthcare solutions without overwhelming them

**Complexity Level**: Light Application (multiple features with basic state)
  - Includes user authentication, protected routes, multiple content sections, and persistent user sessions, but maintains focused functionality around project presentation

## Essential Features

### User Authentication System
- **Functionality**: Secure registration and login with password hashing, session management, and protected content access
- **Purpose**: Gate access to detailed project information and download links, creating a qualified audience
- **Trigger**: User clicks "Acessar Projetos" CTA or attempts to access protected content
- **Progression**: Landing view → Click access button → Auth modal opens → User enters credentials (login/register toggle) → Validation → Session created → Protected content unlocked
- **Success criteria**: Users can register with email/username/password, login with stored credentials, session persists across page refreshes, logout clears session

### Project Showcase Cards
- **Functionality**: Detailed presentation cards for AVC Alerta and Socorro Imediato with descriptions, features, QR code placeholders, and download buttons
- **Purpose**: Communicate project value, features, and provide clear download pathways for the mobile applications
- **Trigger**: User authenticates and scrolls to projects section
- **Progression**: Authentication → Projects section visible → Scroll/navigate to cards → Read information → View QR code placeholder → Click download button
- **Success criteria**: Each project displays complete information, visual hierarchy guides reading flow, download buttons are prominent and accessible

### Smooth Navigation System
- **Functionality**: Fixed navigation bar with smooth scroll to sections, active section highlighting, and mobile-responsive menu
- **Purpose**: Enable quick access to any section of the page while maintaining context of current location
- **Trigger**: User clicks navigation link or scrolls page
- **Progression**: User action → Smooth animated scroll to target section → URL updates (optional) → Active nav item highlights
- **Success criteria**: All sections accessible within 2 clicks, smooth scroll animations complete in <500ms, mobile menu functions properly

### Hero Section with CTA
- **Functionality**: Compelling introduction with headline, description, and primary call-to-action button for authentication
- **Purpose**: Immediately communicate the page's value proposition and guide users toward authentication
- **Trigger**: Page load
- **Progression**: Page loads → Hero content animates in → User reads content → Clicks CTA → Auth flow begins
- **Success criteria**: Hero captures attention in first 3 seconds, CTA is immediately visible, message is clear and compelling

## Edge Case Handling
- **Authentication Errors**: Toast notifications for invalid credentials, duplicate registrations, or connection issues with clear recovery instructions
- **Empty States**: First-time users see welcoming onboarding message before authentication, authenticated users without saved preferences see defaults
- **Network Issues**: Graceful handling of KV storage failures with retry mechanisms and user feedback
- **Session Expiry**: Automatic logout after extended inactivity (optional) with prompt to re-authenticate
- **Mobile Navigation**: Hamburger menu with overlay for small screens, touch-friendly tap targets
- **Form Validation**: Real-time validation feedback for email format, password strength, required fields

## Design Direction
The design should evoke trust, professionalism, and medical credibility while remaining approachable and modern. It should feel like a clinical environment—clean, organized, and precise—but with warmth conveyed through soft animations and thoughtful color choices. A minimal interface serves the content best, allowing the project information to be the hero without competing visual noise.

## Color Selection
**Triadic** (medical blue, health green, clean white) - Using a healthcare-focused palette that balances clinical professionalism with approachability and vitality.

- **Primary Color**: Medical Blue `oklch(0.55 0.15 240)` - Communicates trust, stability, and medical authority; used for primary CTAs and headers
- **Secondary Colors**: 
  - Health Green `oklch(0.60 0.12 150)` - Represents healing, growth, and vitality; used for success states and secondary elements
  - Clean White `oklch(0.98 0 0)` - Provides breathing room and clinical cleanliness; primary background color
- **Accent Color**: Vibrant Teal `oklch(0.65 0.14 195)` - Attention-grabbing for important CTAs and interactive elements
- **Foreground/Background Pairings**:
  - Background (Clean White #FAFAFA): Dark Blue text (#1A2B3C) - Ratio 12.1:1 ✓
  - Card (Soft Blue-Gray #F4F7FA): Dark text (#1A2B3C) - Ratio 11.8:1 ✓
  - Primary (Medical Blue #3B6EBF): White text (#FFFFFF) - Ratio 5.2:1 ✓
  - Secondary (Health Green #4CAF7D): White text (#FFFFFF) - Ratio 4.8:1 ✓
  - Accent (Vibrant Teal #42B8D4): Dark Blue text (#1A2B3C) - Ratio 6.1:1 ✓
  - Muted (Light Gray #E8ECF0): Medium Gray text (#5A6C7D) - Ratio 4.7:1 ✓

## Font Selection
Typography should convey medical professionalism and modern digital polish, prioritizing exceptional readability for health-related content while maintaining visual interest in headings.

**Primary Font**: Inter (sans-serif) - Clean, highly legible, and professional for body text and UI elements
**Accent Font**: Plus Jakarta Sans (sans-serif) - Geometric and modern for headings, providing visual contrast

- **Typographic Hierarchy**:
  - H1 (Hero Title): Plus Jakarta Sans Bold/48px/tight letter spacing/-0.02em
  - H2 (Section Titles): Plus Jakarta Sans SemiBold/36px/normal/0em
  - H3 (Card Titles): Plus Jakarta Sans SemiBold/24px/normal/0em  
  - Body (Descriptions): Inter Regular/16px/relaxed/1.6 line height
  - Small (Meta Info): Inter Medium/14px/normal/1.5 line height
  - Button Text: Inter SemiBold/16px/wide/0.02em uppercase

## Animations
Animations should feel medical-grade precise—smooth, purposeful, and never frivolous. Think of the confident motion of medical equipment or the gentle pulse of a heart monitor. Subtle and professional with moments of delight in micro-interactions.

- **Purposeful Meaning**: Gentle fade-ins and slide-ups for content sections suggest careful revelation of important information, while pulse effects on CTAs create urgency without anxiety
- **Hierarchy of Movement**: Hero section animates first to establish focus, followed by cascading card animations, with interactive elements responding to hover with subtle scale and color transitions

## Component Selection
- **Components**: 
  - Dialog (authentication modal with smooth overlay)
  - Card (project showcase with hover effects)
  - Button (primary CTAs with loading states)
  - Input (form fields with validation states)
  - Label (form field labels)
  - Separator (section dividers)
  - ScrollArea (smooth scrolling sections)
  - Avatar (user profile icon after login)
  - Badge (project status indicators)
  - Sonner (toast notifications for auth feedback)
  
- **Customizations**: 
  - Custom hero gradient background with medical imagery
  - Animated QR code placeholder with dashed border
  - Project cards with glassmorphism effect on hover
  - Floating navigation bar with backdrop blur
  - Custom loading spinner with medical cross icon
  
- **States**: 
  - Buttons: Default (subtle shadow), Hover (lift with deeper shadow + color shift), Active (pressed inset), Disabled (opacity 50% + no interaction), Loading (spinner + disabled)
  - Inputs: Default (light border), Focus (accent border + glow ring), Error (red border + shake animation), Success (green border + checkmark), Filled (maintained focus styling)
  
- **Icon Selection**: 
  - Heart (health/medical theme)
  - FirstAid (emergency response)
  - User (authentication/profile)
  - LockKey (security/login)
  - Download (APK downloads)
  - QrCode (placeholder indicator)
  - SignIn/SignOut (auth actions)
  - CheckCircle (success states)
  - Warning (error states)
  
- **Spacing**: 
  - Section padding: py-20 px-6 (desktop), py-12 px-4 (mobile)
  - Card padding: p-8 (desktop), p-6 (mobile)
  - Element gaps: gap-8 (major), gap-4 (related items), gap-2 (tight groups)
  - Container max-width: 1200px centered
  
- **Mobile**: 
  - Hero: Stack vertically, reduce title to 32px, full-width CTA
  - Navigation: Hamburger menu with slide-in drawer, full-screen overlay
  - Project Cards: Single column stack, maintain padding proportions
  - Forms: Full-width inputs, larger touch targets (min 44px)
  - Spacing: Reduce section padding by 40%, maintain relative gaps
