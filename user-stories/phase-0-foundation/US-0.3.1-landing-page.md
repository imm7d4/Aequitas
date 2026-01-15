# US-0.3.1 - Landing Page

**Epic:** Foundation & User Experience  
**Phase:** Phase 0 - Foundation  
**Status:** Completed  
**Priority:** High  
**Estimated Effort:** 3-4 days

---

## User Story

**As a** prospective user visiting Aequitas for the first time  
**I want to** see an engaging, informative landing page that explains what Aequitas offers  
**So that** I can understand the platform's value proposition and decide whether to sign up

---

## Problem Statement

Currently, the default route (`/`) redirects unauthenticated users directly to the login page. This provides no context about what Aequitas is, its features, or why someone should create an account. New visitors have no opportunity to learn about the platform before committing to registration.

**The Goal:** Create a stunning, modern landing page that:
- Captures attention with premium design and smooth animations
- Clearly communicates Aequitas' value proposition
- Showcases key features and benefits
- Provides social proof and trust signals
- Guides users toward registration with clear CTAs

---

## Acceptance Criteria

### Core Functionality
- [ ] Landing page is accessible at root route (`/`) for unauthenticated users
- [ ] Authenticated users are redirected to `/dashboard` when visiting `/`
- [ ] "Get Started" / "Sign Up" CTAs navigate to `/register`
- [ ] "Login" CTA navigates to `/login`
- [ ] Page is fully responsive (mobile, tablet, desktop)
- [ ] All sections load smoothly without layout shifts

### Content Sections (Minimum)
- [ ] **Hero Section**: Compelling headline, subheadline, primary CTA, hero image/animation
- [ ] **Features Section**: Showcase 4-6 key platform features with icons and descriptions
- [ ] **How It Works**: 3-4 step process showing user journey
- [ ] **Why Aequitas**: Unique value propositions (transparency, speed, fairness)
- [ ] **Trust Signals**: Security features, compliance mentions, statistics
- [ ] **Final CTA**: Strong call-to-action to sign up
- [ ] **Footer**: Links to login, privacy policy placeholder, copyright

### Design & Animation Requirements
- [ ] **Modern Aesthetics**: Premium design with vibrant gradients, glassmorphism, or modern UI patterns
- [ ] **Scroll Animations**: Elements fade in, slide in, or scale as user scrolls
- [ ] **Parallax Effects**: Background elements move at different speeds for depth
- [ ] **Hover Effects**: Interactive elements respond to hover with smooth transitions
- [ ] **Micro-animations**: Subtle animations on icons, buttons, and cards
- [ ] **Smooth Scrolling**: Anchor links scroll smoothly to sections
- [ ] **Loading Animation**: Elegant page load transition
- [ ] **Typography**: Modern, readable fonts (e.g., Inter, Outfit, Poppins)
- [ ] **Color Palette**: Consistent with brand, using vibrant/professional colors
- [ ] **Dark Mode Ready**: Design works in both light and dark themes (if applicable)

### Performance
- [ ] Page loads in < 2 seconds on 3G connection
- [ ] Animations are GPU-accelerated (use `transform` and `opacity`)
- [ ] Images are optimized (WebP format, lazy loading)
- [ ] No cumulative layout shift (CLS < 0.1)
- [ ] Lighthouse score > 90 for Performance and Accessibility

---

## Technical Requirements

### Frontend

#### New Components
1. **`LandingPage.tsx`** (Container - max 200 lines)
   - Main landing page component
   - Orchestrates all sections
   - Handles scroll animations initialization

2. **`HeroSection.tsx`** (Component - max 150 lines)
   - Eye-catching headline with gradient text
   - Official tagline: "Fair & Deterministic Trading Infrastructure"
   - Animated subheadline
   - Primary and secondary CTAs
   - Generated hero illustration (trading-themed)
   - Floating elements with parallax

3. **`FeaturesSection.tsx`** (Component - max 150 lines)
   - Grid of feature cards (4-6 features)
   - Icons with animations
   - Stagger animation on scroll
   - Features to highlight:
     - Real-time market data
     - Advanced order types (Stop Loss, Trailing Stop)
     - Interactive charts
     - Portfolio management
     - Instant execution
     - Transparent fees

4. **`HowItWorksSection.tsx`** (Component - max 150 lines)
   - Step-by-step process (3-4 steps)
   - Numbered steps with connecting lines
   - Animated progression
   - Steps: Sign Up → Fund Account → Start Trading → Track Portfolio

5. **`WhyAequitasSection.tsx`** (Component - max 150 lines)
   - Unique value propositions
   - Statistics/metrics (if available)
   - Trust badges
   - Key differentiators:
     - Fairness & Transparency
     - Lightning-fast execution
     - Professional-grade tools
     - Zero hidden fees

6. **`CTASection.tsx`** (Component - max 100 lines)
   - Final call-to-action
   - Compelling copy
   - Prominent sign-up button
   - Background gradient or pattern

7. **`LandingFooter.tsx`** (Component - max 100 lines)
   - Links to login
   - Social media placeholders
   - Copyright notice
   - Privacy/Terms placeholders

#### Hooks
8. **`useScrollAnimation.ts`** (Hook - max 150 lines)
   - Intersection Observer for scroll-triggered animations
   - Handles fade-in, slide-in, scale animations
   - Configurable thresholds and delays

9. **`useParallax.ts`** (Hook - max 100 lines)
   - Parallax scrolling effect
   - Calculates transform based on scroll position
   - Performance-optimized with requestAnimationFrame

#### Utilities
10. **`animations.ts`** (Utility - max 100 lines)
    - Reusable animation variants for Framer Motion (if used)
    - Or CSS animation classes
    - Stagger configurations

#### Styling
11. **`LandingPage.module.css`** or styled components
    - Modern CSS with gradients
    - Glassmorphism effects
    - Responsive grid layouts
    - Animation keyframes
    - Hover effects

### Backend

**No backend changes required** - This is a purely frontend feature.

### Routing Updates

**File:** `frontend/src/app/router.tsx`

**Changes:**
```typescript
// Update root route logic
<Route 
  path="/" 
  element={
    <PublicRoute>
      <LandingPage />
    </PublicRoute>
  } 
/>

// PublicRoute component redirects to /dashboard if authenticated
```

**New Component:** `PublicRoute.tsx`
- Checks authentication status
- If authenticated, redirects to `/dashboard`
- If not authenticated, renders children (LandingPage)

---

## Design Requirements

### Visual Style
- **Theme**: Modern, professional, trustworthy
- **Color Scheme**: 
  - Primary: Vibrant blue/teal gradient (#0066FF → #00D4FF)
  - Accent: Green for positive actions (#00C853)
  - Background: Dark navy or clean white with subtle patterns
  - Text: High contrast for readability
- **Typography**:
  - Headings: Bold, large (48-72px for hero)
  - Body: 16-18px, readable line height (1.6-1.8)
  - Font: Modern sans-serif (Inter, Outfit, Poppins)

### Animation Specifications

#### Hero Section
- **Headline**: Fade in + slide up (0.6s ease-out)
- **Subheadline**: Fade in + slide up (0.8s ease-out, 0.2s delay)
- **CTAs**: Fade in + scale (1s ease-out, 0.4s delay)
- **Hero Image**: Fade in + gentle float animation (continuous)
- **Background**: Gradient animation or particle effect

#### Features Section
- **Cards**: Stagger fade-in + slide-up (each card 0.1s delay)
- **Icons**: Scale on hover (1.1x, 0.3s ease)
- **Cards**: Lift on hover (translateY -8px, box-shadow increase)

#### How It Works
- **Steps**: Reveal on scroll with connecting line animation
- **Numbers**: Pulse animation when visible
- **Icons**: Rotate or bounce on scroll into view

#### Why Aequitas
- **Stats**: Count-up animation from 0 to actual value
- **Badges**: Fade in with rotation
- **Background**: Parallax movement

#### CTA Section
- **Button**: Pulse animation (subtle, continuous)
- **Background**: Gradient shift animation

### Scroll Behavior
- **Intersection Observer**: Trigger animations at 20% visibility
- **Smooth Scroll**: CSS `scroll-behavior: smooth` for anchor links
- **Parallax**: Background elements move at 0.5x scroll speed

### Responsive Breakpoints
- **Mobile**: < 768px (single column, simplified animations)
- **Tablet**: 768px - 1024px (2-column grid)
- **Desktop**: > 1024px (full layout, all effects)

---

## Content Specifications

### Hero Section
**Headline:** "Trade Smarter, Not Harder"  
**Tagline:** "Fair & Deterministic Trading Infrastructure"  
**Subheadline:** "Experience the future of retail stock trading with Aequitas. Real-time data, advanced tools, zero hidden fees."  
**Primary CTA:** "Get Started Free"  
**Secondary CTA:** "Learn More" (scroll to features)

### Features (6 Key Features)
1. **⚡ Lightning-Fast Execution**
   - Market orders execute instantly. Limit orders matched in real-time.

2. **📊 Professional-Grade Charts**
   - Interactive candlestick charts with multiple timeframes and live price overlays.

3. **🎯 Advanced Order Types**
   - Stop Loss, Stop Limit, Trailing Stop - manage risk like a pro.

4. **💼 Smart Portfolio Management**
   - Track holdings, realized/unrealized P&L, and performance in real-time.

5. **🔒 Bank-Grade Security**
   - JWT authentication, encrypted data, and complete audit trails.

6. **💰 Transparent Pricing**
   - Capped commissions (0.03% or ₹20, whichever is lower). No surprises.

### How It Works (4 Steps)
1. **Create Your Account** - Sign up in 60 seconds with just email and password.
2. **Fund Your Account** - Add funds to your trading account (INR).
3. **Start Trading** - Place orders with our intuitive trade panel.
4. **Track & Grow** - Monitor your portfolio and watch your wealth grow.

### Why Aequitas (3 Pillars)
1. **Fairness First**
   - "Aequitas" means fairness. We believe in transparent execution and honest pricing.

2. **Built for Speed**
   - Sub-200ms API latency. Real-time market data. No lag, no missed opportunities.

3. **Professional Tools**
   - Access the same advanced order types and analytics used by professional traders.

### Trust Signals
- "🔐 Bank-grade encryption"
- "✅ ACID-compliant transactions"
- "📈 Real-time market data"
- "🛡️ Complete audit trails"

### Final CTA
**Headline:** "Ready to Start Trading?"  
**Subheadline:** "Join Aequitas today and experience fair, fast, and transparent stock trading."  
**CTA Button:** "Create Free Account"

---

## Dependencies

### User Stories
- ✅ US-0.1.1: User Registration (users can sign up from landing page)
- ✅ US-0.1.3: Authentication (redirect logic for authenticated users)

### External Dependencies
- **Animation Library**: Framer Motion (confirmed)
- **Icons**: Material UI Icons (already in use)
- **Fonts**: Google Fonts (Inter recommended)

### Assets Needed
- **Hero illustration**: Custom trading-themed illustration (to be generated)
- **Feature icons**: Material UI Icons
- **Background patterns/gradients**: CSS gradients

---

## Implementation Notes

### Technical Considerations

1. **Animation Performance**
   - Use `transform` and `opacity` for animations (GPU-accelerated)
   - Avoid animating `width`, `height`, `top`, `left` (causes reflow)
   - Use `will-change` sparingly and only during animation
   - Debounce scroll listeners

2. **Code Organization**
   - Follow feature-first architecture
   - Place in `frontend/src/features/landing/`
   - Components should be < 150 lines each
   - Extract reusable animations to utilities

3. **Accessibility**
   - All animations respect `prefers-reduced-motion`
   - Proper heading hierarchy (h1 → h2 → h3)
   - Sufficient color contrast (WCAG AA)
   - Keyboard navigation for all CTAs
   - Alt text for all images

4. **SEO Considerations**
   - Semantic HTML5 elements
   - Meta tags for title and description
   - Open Graph tags for social sharing
   - Structured data (JSON-LD) for organization

5. **State Management**
   - No complex state needed
   - Use local state for animation triggers
   - Check auth state from existing auth store

### Edge Cases

1. **Slow Connections**
   - Show skeleton loaders for images
   - Progressive enhancement (content first, animations second)
   - Lazy load below-the-fold content

2. **Reduced Motion**
   - Detect `prefers-reduced-motion: reduce`
   - Disable or simplify animations
   - Ensure content is still accessible

3. **Small Screens**
   - Simplify animations on mobile
   - Stack sections vertically
   - Larger touch targets (min 44px)

4. **Browser Compatibility**
   - Test on Chrome, Firefox, Safari, Edge
   - Provide fallbacks for older browsers
   - Use autoprefixer for CSS

### Performance Optimizations

1. **Image Optimization**
   - Use WebP format with JPEG fallback
   - Implement lazy loading (`loading="lazy"`)
   - Responsive images with `srcset`

2. **Code Splitting**
   - Lazy load LandingPage component
   - Split animation library if large

3. **CSS Optimization**
   - Use CSS containment (`contain: layout style paint`)
   - Minimize CSS bundle size
   - Critical CSS inline for above-the-fold

4. **JavaScript Optimization**
   - Debounce scroll handlers (16ms for 60fps)
   - Use passive event listeners
   - RequestAnimationFrame for scroll animations

---

## Testing Requirements

### Unit Tests
- [ ] `LandingPage.tsx` renders all sections
- [ ] `PublicRoute.tsx` redirects authenticated users
- [ ] `useScrollAnimation` hook triggers at correct thresholds
- [ ] All CTAs have correct navigation links

### Integration Tests
- [ ] Unauthenticated user sees landing page at `/`
- [ ] Authenticated user redirected to `/dashboard` from `/`
- [ ] "Get Started" button navigates to `/register`
- [ ] "Login" link navigates to `/login`
- [ ] Scroll animations trigger correctly

### Visual Regression Tests
- [ ] Landing page matches design mockups
- [ ] Responsive layouts at all breakpoints
- [ ] Animations play smoothly (no jank)
- [ ] Dark mode (if applicable) renders correctly

### Performance Tests
- [ ] Lighthouse Performance score > 90
- [ ] Lighthouse Accessibility score > 95
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Total Blocking Time < 300ms

### Accessibility Tests
- [ ] Keyboard navigation works for all interactive elements
- [ ] Screen reader announces sections correctly
- [ ] Color contrast meets WCAG AA standards
- [ ] Focus indicators are visible
- [ ] `prefers-reduced-motion` is respected

### Browser Compatibility Tests
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## Design Inspiration & References

### Animation Patterns
- **Scroll-triggered animations**: Fade in, slide up, scale
- **Parallax**: Background moves slower than foreground
- **Stagger**: Sequential animation of multiple elements
- **Hover effects**: Lift, glow, scale
- **Continuous animations**: Gentle float, gradient shift

### Modern Design Trends
- **Glassmorphism**: Frosted glass effect with blur
- **Neumorphism**: Soft shadows for depth (use sparingly)
- **Gradients**: Vibrant, multi-color gradients
- **Dark mode**: Deep backgrounds with vibrant accents
- **Micro-interactions**: Button ripples, icon bounces

### Example Layouts
- Hero: Full-screen with centered content
- Features: 3-column grid on desktop, 1-column on mobile
- How It Works: Horizontal timeline or vertical steps
- CTA: Full-width with gradient background

---

## Audit Trail

| Date | Author | Change |
|------|--------|--------|
| 2026-01-11 | AI Assistant | Initial creation of user story |

---

## Notes for Implementation

### Recommended Tech Stack
- **Animation**: Framer Motion (best React integration)
- **Icons**: Material UI Icons (already in project)
- **Fonts**: Google Fonts - Inter or Outfit
- **Images**: Generate hero illustration with generate_image tool

### Implementation Phases

**Phase 1: Structure (Day 1)**
- Create component structure
- Build basic layout without animations
- Implement routing logic
- Add content

**Phase 2: Styling (Day 2)**
- Apply modern design
- Implement responsive layouts
- Add gradients and visual effects
- Optimize typography

**Phase 3: Animations (Day 3)**
- Integrate Framer Motion
- Implement scroll animations
- Add hover effects
- Create parallax effects

**Phase 4: Polish & Optimization (Day 4)**
- Performance optimization
- Accessibility improvements
- Browser testing
- Final refinements

### Success Criteria
✅ Landing page looks premium and modern  
✅ Animations are smooth and purposeful  
✅ Page loads fast (< 2s)  
✅ Converts visitors to sign-ups  
✅ Works flawlessly on all devices  
✅ Accessible to all users
