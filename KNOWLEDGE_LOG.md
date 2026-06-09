# FRAME — Prompting Knowledge Log

Tracks all dialect and variable system updates to Frame.
Each entry documents what changed, why, and the source.
Review and approve changes in chat before they are committed here.

---

## 2026-06-08 — Session A Baseline

**Type:** Initial baseline entry. No prior log existed.

### State at baseline

All dialects reviewed against official documentation and current practitioner research.
The following findings were incorporated into dialects.js in this session:

---

**MASTER dialect**
- Added explicit instruction that light direction is the highest-signal lighting variable
- Added instruction that Emotional Register inflects the entire prompt's tone, not just mood block

---

**NANO BANANA 2**
- Added explicit light direction instruction: direction + quality + motivated source in TECHNICAL SETUP
- Added shadow quality as a meaningful variable for this model
- Added atmospheric density note (physical description beats mood adjectives)

---

**NANO BANANA PRO**
- Strengthened lighting direction instruction with named setup + direction syntax example
- Added atmospheric density note (fog, haze, volumetric elements render accurately when described physically)
- Added shadow quality instruction

---

**FLUX.2 MAX**
- Strengthened lighting direction instruction: direction + quality + temperature + motivation
- Added explicit note that named lighting setups (Rembrandt, split, butterfly) are deeply trained
- Added atmospheric density guidance (physical description)
- Added shadow quality as high-signal variable note

---

**FLUX.2 PRO**
- Added explicit HEX color palette injection instruction (raw hex values used verbatim)
- Strengthened lighting direction with named setup support
- Added atmospheric density and shadow quality guidance

---

**FLUX.2 FLEX**
- Added light direction instruction (concise version matching Flex's tighter density)

---

**GPT IMAGE 2**
- Strengthened lighting guidance: "light logic" framing — direction + reason + behavior
- Added shadow quality as logical scene condition
- Added atmospheric density as physical scene condition

---

**SEEDREAM 4.5**
- Strengthened light direction instruction: "most impactful lighting variable — state it concisely"
- Added named setup note (Rembrandt, split, butterfly translate accurately)
- Added atmospheric density guidance (simple and direct)
- Added shadow quality guidance (one precise phrase)

---

**SEEDREAM 5 LITE**
- Added light direction instruction (simple and direct per Lite's concise style)
- Added named setup note

---

**SEEDANCE 2.0**
- Added knowledge update note (2026-06-08)
- Elevated light direction as "highest-signal variable" — full directionality required
- Added secondary motion as physical behavior instruction (fabric, smoke, water — physics not appearance)
- Added shadow quality instruction

---

**KLING 3.0**
- Added knowledge update note (2026-06-08)
- Confirmed physics-language guidance for fabric/fluid (prevents floating/sliding artifacts)
- Added secondary motion as physics instruction
- Added lighting direction instruction (complex setups now supported in 2.6+)

---

**KLING 2.X**
- Added light direction instruction
- Added secondary motion as physics instruction

---

**VEO 3.1**
- Added knowledge update note (2026-06-08)
- Audio now accepts musical genre and emotional tone references — updated audio instruction
- Added depth cue guidance (shallow DOF, foreground parallax, atmospheric haze improve output)
- Placed lighting direction in SHOT & SUBJECT block (first = most weight rule)

---

**RUNWAY GEN 4**
- Strengthened lighting instruction: light behavior as it affects the scene, with direction and shadow sweep
- Added atmospheric density guidance (physical description grounds physics simulation)

---

### New variables added to VARIABLE_DEFS (buildSystemPrompt.js)

All new variables from the full restructure plan are now defined and wired:

**Core:** aspectRatio, subjectOrientation (static), subjectPosture (static), lightDirection (+side qualifier), lightingSetup, lightSourceColor (renamed from colorTemperature), atmosphericDensity, emotionalRegister. lensCharacter and colorGrade converted to multiselect. cameraAngle expanded (+Dutch Angle, +Bird's Eye). lensCharacter expanded (+Tilt-Shift).

**Video Motion:** cameraMovement (expanded options), playbackFeel (renamed from motionSpeed), slowMotionFPS (two tiers: cinematic + high-speed aesthetic), motionBlurVideo (slider), lensBreathing (moved from lensQualities), subjectBehavior (multiselect), secondaryMotion (multiselect), audioDirection (model-gated).

**Advanced:** compositionalIntent (renamed from framingStyle, multiselect, expanded options), lensQualities (Breathing removed, Halation + Edge Softness added), timeOfDay (Golden Hour / Magic Hour differentiated, Interior Artificial removed), shadowQuality (new), grainTexture (new), depthLayers (new), practicalLights (new multiselect), motionBlurStatic (new slider, static only), focalLength (semantic labels added).

**Color Palette:** colorPalette object ({ primary, active }) with hex-to-descriptive translation logic for all models except Flux.2 Pro (raw hex).

---

### Sources used for this session's research

- artlist.io/blog/ai-lighting-prompts (Artlist, March 2026)
- blog.designhero.tv/ai-art-direction-prompts-flux-midjourney (Designhero.tv, February 2026)
- sider.ai/blog/best-prompt-techniques-for-veo-3_1 (Sider.ai field guide, October 2025)
- veed.io/learn/kling-ai-prompting-guide (Veed.io, March 2026)
- medium.com — "AI Video Prompts: Complete List" (May 2026)
- magichour.ai/blog/cinematic-ai-video-prompt-cookbook (April 2026)
- imagine.art/blogs/ai-film-prompts-guide (May 2026)
- garageproductions.in/directing-ai-like-a-dp (March 2026)
- Official model docs: BFL Flux.2, ByteDance Seedream, Google Veo, Runway Gen 4, Kuaishou Kling

---

## Next update due: 2026-06-15

Review models: all featured models.
Check: Kling 3.0 motion control specifics, Veo 3.1 audio improvements, Seedance 2.0 multi-shot updates, Flux.2 Kontext/reference system changes.
