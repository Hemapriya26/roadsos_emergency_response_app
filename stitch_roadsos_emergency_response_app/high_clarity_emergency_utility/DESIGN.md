---
name: High-Clarity Emergency Utility
colors:
  surface: '#fbf9f9'
  surface-dim: '#dbdad9'
  surface-bright: '#fbf9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#efeded'
  surface-container-high: '#e9e8e7'
  surface-container-highest: '#e3e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#5b403d'
  inverse-surface: '#303031'
  inverse-on-surface: '#f2f0f0'
  outline: '#8f6f6c'
  outline-variant: '#e4beba'
  surface-tint: '#ba1a20'
  primary: '#af101a'
  on-primary: '#ffffff'
  primary-container: '#d32f2f'
  on-primary-container: '#fff2f0'
  inverse-primary: '#ffb3ac'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e5e2e1'
  on-secondary-container: '#656464'
  tertiary: '#565858'
  on-tertiary: '#ffffff'
  tertiary-container: '#6e7070'
  on-tertiary-container: '#f4f4f4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad6'
  primary-fixed-dim: '#ffb3ac'
  on-primary-fixed: '#410003'
  on-primary-fixed-variant: '#930010'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474646'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#fbf9f9'
  on-background: '#1b1c1c'
  surface-variant: '#e3e2e2'
typography:
  headline-xl:
    fontFamily: Public Sans
    fontSize: 34px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Public Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Public Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
  body-lg:
    fontFamily: Public Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-xl:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 18px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  baseline: 8px
  margin-mobile: 20px
  gutter: 16px
  touch-target-min: 48px
  safe-bottom-zone: 80px
---

## Brand & Style
The design system is centered on the concept of **"Calm in Chaos."** It serves a high-stakes, high-stress environment where every millisecond and every pixel must contribute to user certainty. The style is a fusion of **Modern Minimalism** and **Institutional Utility**, prioritizing immediate legibility and one-handed ergonomic efficiency. 

The visual language is intentionally restrained to reduce cognitive load. It avoids unnecessary decorative elements, utilizing generous whitespace and a rigid grid to guide the user's eye toward critical actions. The emotional response should be one of absolute reliability, professionalism, and rapid assistance.

## Colors
The palette is built for high-contrast accessibility. 
- **Primary (Emergency Red):** Reserved strictly for critical SOS triggers, alerts, and life-safety information. 
- **Secondary (Onyx Black):** Used for primary text and structural elements to provide a grounded, authoritative feel.
- **Surface & Accents:** Light Gray (#F5F5F5) and White provide the "stress-free" canvas, ensuring the red elements pop immediately.

Use semantic color application: Red for danger/action, Green for "help arrived/safe," and Amber for "en route/caution."

## Typography
This design system utilizes **Public Sans** for its institutional clarity and neutral, trustworthy tone. 
- **Headlines:** Use heavy weights (700) to anchor the page. In emergency states, headlines should be concise—no more than 3 words.
- **Body:** Standardized at 16px-18px to ensure readability for users who may be in motion or in low-light conditions.
- **Labels:** Use uppercase for high-level categories and navigation to distinguish them clearly from descriptive body text.

## Layout & Spacing
The layout follows a **Fluid Mobile-First Grid** optimized for one-handed operation. 
- **The Thumb Zone:** Critical interactive elements (SOS Button, Contact Support) must be placed in the bottom 40% of the screen.
- **Vertical Rhythm:** A strict 8px spacing system ensures consistent grouping of related information.
- **Safe Areas:** Generous 20px side margins prevent interaction errors near the bezel edges. 
- **Bottom Sheet Pattern:** Use expandable bottom sheets for secondary information (e.g., vehicle details, mechanic bios) to keep the primary map or status view visible.

## Elevation & Depth
Depth is used to denote interactable surfaces versus background information.
- **Surface Level (0dp):** The Light Gray background (#F5F5F5).
- **Interactive Cards (1dp):** White cards with a subtle 1px border (#E0E0E0) and a soft ambient shadow (Y: 4, Blur: 12, Opacity: 0.05).
- **Floating Actions (2dp):** The SOS button and primary triggers use a more pronounced shadow (Y: 8, Blur: 24, Opacity: 0.15) to appear "pressable" and physically above the map or content layer.
- **Glassmorphism:** Use only for top-level navigation bars to maintain context of the map behind them, with a 20px backdrop blur.

## Shapes
The shape language is **Softly Functional**. 
- **Cards:** Use a 16px (1rem) corner radius to evoke a modern, approachable feel that softens the "emergency" nature of the app.
- **Buttons:** Main action buttons use a 12px radius, while the SOS button is a perfect circle to stand out as a unique object.
- **Inputs:** Use 8px rounding to maintain a professional, structured appearance.

## Components
- **The SOS Trigger:** A large, circular red button (min 80px). It features a "Hold to Confirm" mechanic and a subtle pulsing outer ring animation (3-tier opacity ripples) to indicate active transmission.
- **Status Chips:** Small, pill-shaped indicators for "Arriving in 5m" or "GPS Active." High contrast (Dark Blue text on Light Gray background).
- **Interactive Cards:** Container for roadside provider info. Must include a clear, 48px touch-target phone icon in the primary red or secondary blue.
- **Input Fields:** Large, 56px height fields with bold labels and high-contrast focus states. Avoid floating labels; use persistent top-aligned labels for clarity under stress.
- **Progress Stepper:** A simplified horizontal line at the top of the screen to show the 3-step lifecycle: *Request > Dispatch > Arrival.*