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

## 2026-06-10 — Session C Pre-Build Update

**Type:** Scheduled knowledge update (early — performed before Session C implementation).

### Research scope

All featured models reviewed. No new flagship models launched after 2026-06-08.
LTX-2.3 (Lightricks, March 2026) and HappyHorse-1.0 (Alibaba, limited China beta) noted for future consideration.

---

### Dialect changes applied

**Seedream 5 Lite**
- Confirmed reasoning + live web search architecture (distinct from 4.5's fidelity-first approach)
- Added intent-driven prompting guidance: context-rich prompts ("Create a mood board for a neo-noir thriller") outperform keyword stacking for this model
- Updated dialect comment to reflect confirmed architecture

---

**Veo 3.1**
- Updated knowledge comment with official audio labeling syntax
- Added official timestamp multi-shot syntax `[00:00-00:02]` as documented in Google's official prompting guide
- Added specific audio cue syntax to dialect rules: quoted dialogue with character attribution, `SFX:` prefix, `Ambient noise:` prefix, score via `SFX:` prefix
- Audio cues confirmed to go AFTER visual description in prompt body
- Removed reference to "Clip 1 / Clip 2" format; replaced with official timestamp format

---

**Seedance 2.0**
- Updated knowledge comment: `@Image1/@Video1/@Audio1` reference tagging syntax confirmed (up to 9 images + 3 videos + 3 audio files)
- Added reference tagging rule to dialect: tags can be used inline in prompt body
- "Lens switch" multi-shot keyword retained and confirmed accurate

---

**Kling 3.0**
- Updated knowledge comment: 5-part prompt formula confirmed; multi-shot "Shot 1: / Cut to:" syntax confirmed
- Added Motion Control variant clarification: prompt describes TARGET scene, not the motion; motion is inferred from reference video
- Updated rule 5 with explicit 5-part formula
- Updated rule 7: "First shot:" → "Shot 1:" for consistency with official syntax
- Added rule 8: Motion Control variant behavior

---

**GPT Image 2**
- Added rule 9: "Video-ready frame" pattern — motion cues for stills intended for image-to-video conversion (dust, fabric, rain, hair mid-motion; reserve compositional space for movement)

---

**Flux.2 Pro**
- Added rule 9: Kontext editing syntax — explicit keep/change framing: "Keep [X] exactly as shown. Change only [Y]."

---

### New models noted (not yet added)

| Model | Status | Notes |
|---|---|---|
| LTX-2.3 (Lightricks) | GA, Apache 2.0 | 20s clips, 4K + native stereo audio. Review for Session D. |
| HappyHorse-1.0 (Alibaba) | China limited beta | Top benchmarks, not available for Western integration yet. |

---

### Sources used

- cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-veo-3-1 (official Google guide)
- cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-nano-banana (official)
- bfl.ai/models/flux-2 (BFL official)
- bfl.ai/models/flux-kontext (BFL official)
- seed.bytedance.com/en/blog/official-launch-of-seedance-2-0 (official ByteDance)
- zencreator.pro/ai-university/guides/seedance-2-ai-video-generator-guide
- blog.fal.ai/kling-3-0-prompting-guide (Kling 3.0 official via fal.ai)
- openai.com/index/introducing-chatgpt-images-2-0 (OpenAI official)
- pixverse.ai/en/blog/gpt-image-2-review-and-prompt-guide
- help.runwayml.com/hc/en-us/articles/40042718905875 (Runway official Gen-4 references)

---

## Next update due: 2026-06-17

Review: LTX-2.3 availability for Western users, HappyHorse-1.0 API access, any Kling 3.0 or Veo 3.1 updates.
