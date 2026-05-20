# Project Instructions

## Project Overview
- Next.js app (v16) with React 19, Three.js, GSAP, Framer Motion, and Sass
- Dev server: `npm run dev` (runs on localhost:3000 with Turbopack)
- Build: `npm run build`

## Design Rules
- **Monochrome only**: The entire website uses a strictly monochrome palette (black, white, shades of grey). Never introduce any color (no blues, reds, greens, ambers, etc.). All accents, glows, borders, and highlights must be white at varying opacities.

## Testing Fixes with Playwright MCP

When the user asks to fix something (UI bug, layout issue, visual glitch, broken interaction, etc.), always verify the fix using the playwright-mcp tools **before** considering the fix complete. Follow these steps:

### 1. Make the Fix
- Read and understand the relevant code before making changes.
- Apply the fix.

### 2. Ensure Dev Server is Running
- Check if the dev server is already running on `localhost:3000` by navigating to the page using playwright-mcp.
- If not running, start it with `npm run dev` in the background and wait for it to be ready.

### 3. Test with Playwright MCP
- Use `mcp__playwright__browser_navigate` to open the relevant page (e.g., `http://localhost:3000`).
- Use `mcp__playwright__browser_snapshot` to capture an accessibility snapshot of the page and verify the page loaded correctly.
- Use `mcp__playwright__browser_screenshot` to take a screenshot and visually verify the fix.
- If the fix involves a specific section, use `mcp__playwright__browser_click` or `mcp__playwright__browser_scroll` to navigate to that section first, then screenshot.
- If the fix involves interactions (hover, click, scroll, animation triggers), simulate those interactions using the appropriate playwright-mcp tools (`browser_click`, `browser_hover`, `browser_type`, etc.) and screenshot the result.

### 4. Verify and Report
- Examine the screenshot(s) to confirm the fix works as expected.
- If the fix doesn't look right, iterate — adjust the code and re-test.
- Only report the fix as complete after visual confirmation via playwright-mcp.

### Common Playwright MCP Tools Reference
| Tool | Purpose |
|------|---------|
| `mcp__playwright__browser_navigate` | Navigate to a URL |
| `mcp__playwright__browser_screenshot` | Take a screenshot of the current page |
| `mcp__playwright__browser_snapshot` | Get accessibility tree snapshot |
| `mcp__playwright__browser_click` | Click an element (use accessibility snapshot refs) |
| `mcp__playwright__browser_hover` | Hover over an element |
| `mcp__playwright__browser_scroll` | Scroll the page (up/down) |
| `mcp__playwright__browser_type` | Type text into an input field |
| `mcp__playwright__browser_resize` | Resize the browser viewport (useful for responsive testing) |
