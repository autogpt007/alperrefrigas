# Move WhatsApp Button to Bottom-Left with Brand Icon

## Goal
Relocate the active floating WhatsApp button to the bottom-left of the viewport and replace its generic chat icon with the recognizable WhatsApp brand icon so users immediately identify it as WhatsApp.

## Current State
- `src/components/ui/ChatToggle.tsx` is the live WhatsApp button rendered in `App.tsx`.
- It is currently fixed at `bottom-24 right-6` and uses a generic `MessageCircle` icon.
- `src/components/ui/WhatsAppButton.tsx` exists with the correct WhatsApp SVG icon but is not mounted.
- `src/components/ui/TawkToChat.tsx` injects CSS that positions the Tawk.to bubble on the bottom-left to avoid overlapping the WhatsApp button (which was on the right).

## Changes

### 1. Brand Icon
- In `src/components/ui/ChatToggle.tsx`, replace the `MessageCircle` icon with the official WhatsApp SVG icon taken from `WhatsAppButton.tsx`.
- Keep the existing green color palette (`bg-green-500 hover:bg-green-600 text-white`).

### 2. Reposition to Bottom-Left
- Change the container class from `fixed bottom-24 right-6 z-50` to `fixed bottom-24 left-6 z-50`.

### 3. Avoid Overlap with Tawk.to
- Update the injected positioning stylesheet in `src/components/ui/TawkToChat.tsx` so the Tawk.to bubble and the WhatsApp button can coexist on the left side without covering each other.
- Stack Tawk.to at the bottom-left and place WhatsApp above it with sufficient vertical clearance, or offset them horizontally on mobile.

### 4. Cleanup
- Either remove the unused `src/components/ui/WhatsAppButton.tsx` or keep it as a thin re-export of `ChatToggle` to avoid duplicate/confusing code. Decision: remove the unused file to prevent drift.

### 5. Verification
- Run a Playwright check on the home page to confirm:
  - The WhatsApp button renders at the bottom-left.
  - It displays the WhatsApp brand icon (speech-bubble phone SVG).
  - It does not overlap the Tawk.to bubble.
  - No console errors related to the button or Tawk.to positioning.

## Files to Modify
- `src/components/ui/ChatToggle.tsx`
- `src/components/ui/TawkToChat.tsx`
- `src/components/ui/WhatsAppButton.tsx` (delete)
