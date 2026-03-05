# FE-001: Fix broken pause in Terminal animation

**Type:** Bug | **Priority:** High | **Effort:** Small

## TL;DR
The Terminal page shows a "PAUSED" label on mouse hover but the animation keeps running. `isPaused` state is set but never checked by the animation loop.

## Current State
- `isPaused` is toggled on `onMouseEnter`/`onMouseLeave` (line 198-199)
- "PAUSED" label renders when `isPaused` is true (line 210)
- `runLoop` and `sleep` functions never read `isPaused` — animation continues regardless

## Expected Outcome
- Hovering over the terminal actually pauses the animation
- Or: remove the pause feature entirely if not needed

## Files
- `frontend/src/pages/Terminal.tsx` — lines 108, 112-119, 159-174, 198-199, 210

## Approach
Convert `isPaused` to a ref and check it inside the `sleep` function. When paused, `sleep` should wait until unpaused before resolving. Alternatively, use `cancelRef` pattern already in place — pause the interval and resume on mouse leave.

## Risk
Low. Isolated to Terminal page, no side effects.
