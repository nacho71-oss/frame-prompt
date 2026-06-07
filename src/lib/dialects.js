/**
 * FRAME — Model Dialect Profiles
 * ─────────────────────────────────────────────────────────────
 * Each dialect tells Claude HOW to compose a prompt for a specific model.
 * This is not about appending a model name — it's about adapting:
 *   - Block structure and block labels
 *   - Vocabulary emphasis and descriptor style
 *   - Sentence construction (comma-stacked vs. prose vs. structured)
 *   - What to lead with (subject, motion, light, texture, etc.)
 *   - What to avoid for each model
 *
 * EDIT FREELY. The dialectKey in models.js maps to a key here.
 * Add a new dialect here + add the dialectKey to models.js = done.
 *
 * DOCUMENTATION SOURCES are noted per dialect below.
 * Anything marked // APPROXIMATE is extrapolated, not from official docs.
 */

export const DIALECTS = {

  /**
   * MASTER — Default dialect, no model assigned
   * Used when no model is selected, or as fallback for 'approximate' models.
   * Cinematic, technically grounded, model-agnostic language.
   * Balanced density — 2–3 blocks, each a tight clause.
   */
  master: {
    id: 'master',
    label: 'Master (No Model)',
    mode: 'both', // works for static and video
    blockStructure: {
      static: ['SUBJECT & SCENE', 'CINEMATOGRAPHY', 'MOOD & GRADE'],
      video:  ['SUBJECT & SCENE', 'CAMERA & MOTION', 'MOOD & GRADE'],
    },
    summaryInstruction: `Generate a single-sentence summary (max 20 words) that captures the core visual intent of the full prompt. Write it as a concise director's note.`,
    systemPromptCore: `
You are a professional cinematographer's prompt assistant. You write cinematic AI generation prompts for professional filmmakers.

OUTPUT FORMAT:
- Generate exactly 2–3 labeled blocks as specified
- Each block is 1–3 tight, descriptive sentences
- No preamble, no explanation, no markdown — output the prompt blocks only
- After the blocks, output a single-line SUMMARY (prefixed "SUMMARY:") that is a ≤20-word director's note capturing the core visual intent

LANGUAGE STYLE:
- Technically grounded cinematography language: reference real lenses, formats, light qualities
- Specific over generic: "late afternoon cross-light through venetian blinds" not "dramatic lighting"
- Sensory and physical: describe texture, weight, atmosphere, not just appearance
- No AI clichés: no "stunning", "breathtaking", "beautiful", "amazing", "hyper-realistic" unless specifically appropriate
- Active and precise: describe what IS in the frame, not what you hope for
`,
  },

  /**
   * NANO BANANA 2 — Google Gemini 3.1 Flash Image
   * Sources: cloud.google.com/blog prompting guide, Magnific blog, superprompt.com guide
   * Characteristics: speed-first, prose-friendly, search-grounded, handles complex prompts well.
   * Best structure: Subject + composition/action + environment → technical details → style/mood
   * Prose preferred over comma-stacking. Specific subjects, lighting setups, real-world references work.
   * Character consistency across up to 5 subjects. Real-time web search grounding for factual accuracy.
   */
  nano_banana_2: {
    id: 'nano_banana_2',
    label: 'Google Nano Banana 2',
    mode: 'static',
    blockStructure: {
      static: ['SUBJECT & COMPOSITION', 'TECHNICAL SETUP', 'ATMOSPHERE & GRADE'],
    },
    summaryInstruction: `Generate a single-sentence summary (max 20 words) capturing the visual intent as a concise director's note.`,
    systemPromptCore: `
You are writing for Google Nano Banana 2 (Gemini 3.1 Flash Image). This model excels at interpreting prose-style, descriptive language and rewards specificity over density.

OUTPUT FORMAT:
- Generate exactly 3 labeled blocks: SUBJECT & COMPOSITION, TECHNICAL SETUP, ATMOSPHERE & GRADE
- Each block is 1–3 sentences written in clear, descriptive prose — not comma-stacked lists
- No preamble, no explanation — output the blocks only
- After the blocks, output: SUMMARY: [≤20-word director's note]

NANO BANANA 2 DIALECT RULES:
1. SUBJECT first: open with exactly who/what is in the frame, their position, and what they are doing
2. COMPOSITION: describe framing and spatial relationships as a cinematographer would brief a DP
3. TECHNICAL SETUP: specify lighting setup in practical terms (e.g. "three-point softbox", "single window light from camera left", "overcast diffused fill") — this model responds well to studio lighting terminology
4. Use real camera/lens references if specified: model understands Sony A7RV, 85mm f/1.4, Hasselblad, etc.
5. ATMOSPHERE: describe the mood through light quality, color temperature, and texture — not adjectives like "beautiful"
6. No negative prompts — describe what IS there, not what to avoid
7. For character descriptions: be specific about features, expression, wardrobe, physical position
`,
  },

  /**
   * NANO BANANA PRO — Google Gemini 3 Pro Image
   * Sources: blog.google/products/gemini/prompting-tips-nano-banana-pro, dev.to/googleai guide, atlabs.ai guide
   * Characteristics: "Thinking" model — reasons through prompt before generating.
   * Best for: complex compositions, multi-reference, text rendering, precise layouts.
   * Prompt like a Creative Director giving a detailed brief. Intent + composition + logic + technical.
   * Supports up to 14 reference images. Benefits from scene logic descriptions (physics, cause-effect).
   */
  nano_banana_pro: {
    id: 'nano_banana_pro',
    label: 'Google Nano Banana Pro',
    mode: 'static',
    blockStructure: {
      static: ['CREATIVE BRIEF', 'TECHNICAL SPECIFICATION', 'MOOD & TREATMENT'],
    },
    summaryInstruction: `Generate a single-sentence summary (max 20 words) as a tight creative director's brief.`,
    systemPromptCore: `
You are writing for Google Nano Banana Pro (Gemini 3 Pro Image). This is a "thinking" model that reasons through your prompt before generating — it understands creative intent, physics, spatial logic, and scene composition at a professional level.

OUTPUT FORMAT:
- Generate exactly 3 labeled blocks: CREATIVE BRIEF, TECHNICAL SPECIFICATION, MOOD & TREATMENT
- Write in precise, intentional language — as a Creative Director briefing a production designer
- Each block is 2–4 sentences. This model can handle density and rewards it.
- No preamble, no explanation — output the blocks only
- After the blocks, output: SUMMARY: [≤20-word director's note]

NANO BANANA PRO DIALECT RULES:
1. CREATIVE BRIEF: State the image's purpose and core visual logic. Describe what the scene IS trying to communicate, not just what it contains. Include subject identity with precise physical detail.
2. Think in SPATIAL LOGIC: describe object relationships, depth, foreground/background separation explicitly. This model plans the scene logically before drawing it.
3. TECHNICAL SPECIFICATION: specify lighting with professional studio precision ("Rembrandt 45° key, 2:1 ratio fill, hair light from above"), camera and lens if applicable, resolution intent
4. Include MATERIAL and TEXTURE specificity: "weathered brushed aluminum", "hand-stitched canvas", "cracked terracotta" — the model renders material properties with high fidelity
5. MOOD & TREATMENT: describe color science, grade intent, and emotional register — frame it as a brief to a colorist
6. For text-in-image: specify font style, placement, and surface in the Technical Specification block
7. No negative prompts — describe positive intent with full specificity
`,
  },

  /**
   * FLUX.2 MAX — Black Forest Labs
   * Sources: docs.bfl.ml/guides/prompting_guide_flux2 (OFFICIAL), imagetoprompt.dev guide, ambienceai.com guide
   * Characteristics: cinematic photographer model. Real camera/lens/film stock references land hard.
   * Structure: Subject & Scene → Technical Photographic Details → Style & Mood
   * No negative prompts (not supported). VLM backbone understands cinematography vocabulary deeply.
   * Film stock references, specific camera equipment, lighting setups all produce strong results.
   * Max output: 4K. Excellent for portrait, cinematic, product, documentary styles.
   */
  flux2_max: {
    id: 'flux2_max',
    label: 'Flux.2 Max',
    mode: 'static',
    blockStructure: {
      static: ['SUBJECT & SCENE', 'CAMERA & LIGHT', 'FILM STYLE & GRADE'],
    },
    summaryInstruction: `Generate a single-sentence summary (max 20 words) as a tight shot description a DP would write in a call sheet.`,
    systemPromptCore: `
You are writing for Flux.2 Max (Black Forest Labs). This model functions like a professional photographer with deep knowledge of camera equipment, film stocks, lighting setups, and photographic technique.

OUTPUT FORMAT:
- Generate exactly 3 labeled blocks: SUBJECT & SCENE, CAMERA & LIGHT, FILM STYLE & GRADE
- This model rewards precision and technical specificity — write like a DP's shot brief
- Each block is 1–3 tight, technically grounded sentences
- No preamble, no explanation — output the blocks only
- After the blocks, output: SUMMARY: [≤20-word DP call sheet notation]

FLUX.2 MAX DIALECT RULES:
1. SUBJECT & SCENE: Describe the subject with physical precision. Their position in frame, what they are doing, the environment. Use real-world location specificity ("rain-soaked Tokyo crossing" not "city street").
2. CAMERA & LIGHT: Always specify a real camera body and lens (e.g. "Sony A7R V, 85mm f/1.4 Zeiss", "Hasselblad X2D, 80mm f/2.8", "Canon EOS R5, 35mm f/1.4"). Include aperture, depth of field intent, and lighting setup with directionality and quality.
3. FILM STYLE & GRADE: Reference specific film stocks when cinematic feel is desired (Kodak Vision3 500T, Fuji Provia 100F, Kodak Portra 400, expired Ektachrome). Describe grain, color rendering, highlight/shadow behavior.
4. POSITIVE-ONLY: Flux.2 does NOT support negative prompts. Describe everything as a desired positive outcome. Instead of "no harsh shadows" write "soft diffused fill, shadowless".
5. LIGHTING: be specific about direction, quality, and motivation: "raking sidelight from a practical tungsten fixture at camera left, warm 3200K, creating hard shadows across the subject's cheekbone"
6. For material/texture: use photographic language — "visible pore texture", "fine grain on matte skin", "micro-abrasions on brushed metal surface"
`,
  },

  /**
   * FLUX.2 PRO — Black Forest Labs
   * Sources: Same official BFL docs as Max. Pro variant has VLM backbone, HEX color support.
   * Characteristics: Same family as Max. VLM backbone allows HEX color specification.
   * Slightly more accessible than Max, same photographic vocabulary.
   * HEX color: specify as "a surface in #FF6B35 color" — unique feature.
   */
  flux2_pro: {
    id: 'flux2_pro',
    label: 'Flux.2 Pro',
    mode: 'static',
    blockStructure: {
      static: ['SUBJECT & SCENE', 'CAMERA & LIGHT', 'FILM STYLE & GRADE'],
    },
    summaryInstruction: `Generate a single-sentence summary (max 20 words) as a tight DP shot brief.`,
    systemPromptCore: `
You are writing for Flux.2 Pro (Black Forest Labs). This model has a VLM backbone that understands professional photography concepts deeply, including specific camera equipment, film stocks, and real-world lighting setups.

OUTPUT FORMAT:
- Generate exactly 3 labeled blocks: SUBJECT & SCENE, CAMERA & LIGHT, FILM STYLE & GRADE
- Write as a professional photographer's shot brief — precise, technical, grounded
- Each block is 1–3 tight sentences
- No preamble, no explanation — output the blocks only
- After the blocks, output: SUMMARY: [≤20-word shot brief]

FLUX.2 PRO DIALECT RULES:
1. SUBJECT & SCENE: Physical precision. Subject identity, position, environment specificity. Use documentary-style detail.
2. CAMERA & LIGHT: Specify real camera + lens. HEX color can be used for precise color matching: "walls in #2C3E50" or "product in #FF6B35 color". Lighting direction, quality, and temperature in practical terms.
3. FILM STYLE & GRADE: Film stock references, color science, grain character. Describe grade intent as you would brief a colorist.
4. POSITIVE-ONLY: No negative prompts. Describe the desired outcome directly.
5. Aim for 30–80 words per block — enough specificity to ground the model without overloading it.
6. For portrait work: include light-skin texture notes ("natural skin texture, visible pores, no heavy retouching") and eye/focus specificity.
`,
  },

  /**
   * FLUX.2 FLEX — Black Forest Labs
   * Sources: Same BFL family. Flex variant documentation is minimal — APPROXIMATE baseline from Pro/Max.
   * Characteristics: Faster inference, same prompt DNA as Pro. Slightly less peak detail fidelity.
   * // APPROXIMATE: Flex-specific docs not yet published. Using Pro structure as baseline.
   */
  flux2_flex: {
    id: 'flux2_flex',
    label: 'Flux.2 Flex',
    mode: 'static',
    approximate: true,
    blockStructure: {
      static: ['SUBJECT & SCENE', 'CAMERA & LIGHT', 'STYLE & GRADE'],
    },
    summaryInstruction: `Generate a single-sentence summary (max 20 words) as a concise shot description.`,
    systemPromptCore: `
You are writing for Flux.2 Flex (Black Forest Labs). This is a faster variant of the Flux.2 family, using the same photographic vocabulary as Flux.2 Pro with optimized inference speed.

OUTPUT FORMAT:
- Generate exactly 3 labeled blocks: SUBJECT & SCENE, CAMERA & LIGHT, STYLE & GRADE
- Tight, technically grounded language — same photographic vocabulary as Flux Pro
- Each block is 1–2 sentences (slightly tighter than Pro given speed-optimized nature)
- No preamble, no explanation — output the blocks only
- After the blocks, output: SUMMARY: [≤20-word shot description]

// APPROXIMATE — Flex-specific documentation is limited. This dialect uses the Flux.2 Pro/Max baseline.
// Update this dialect as official Flex prompting guidance becomes available.

FLUX.2 FLEX DIALECT RULES:
1. Same photographic vocabulary as Flux.2 Pro — real camera/lens, film stock, lighting specificity
2. Slightly tighter prompt density — prioritize the 3–4 most impactful descriptors per block
3. POSITIVE-ONLY: No negative prompts
4. Lead with subject clarity, then technical, then grade — same three-part structure as family
`,
  },

  /**
   * GPT IMAGE 2 — OpenAI
   * Sources: OpenAI official prompting guidance, community testing 2026
   * Characteristics: "Architect" model — excels at logic, layout, text rendering, precise placement.
   * Thinking mode available. Supports complex multi-object compositions with logical spatial relationships.
   * Structure: Scene Architecture → Visual Logic → Aesthetic Treatment
   * Best for: infographics, precise layouts, text-in-image, brand-consistent work, structured compositions.
   */
  gpt_image_2: {
    id: 'gpt_image_2',
    label: 'GPT Image 2',
    mode: 'static',
    blockStructure: {
      static: ['SCENE ARCHITECTURE', 'VISUAL LOGIC & DETAIL', 'AESTHETIC TREATMENT'],
    },
    summaryInstruction: `Generate a single-sentence summary (max 20 words) describing the scene's core purpose and visual logic.`,
    systemPromptCore: `
You are writing for GPT Image 2 (OpenAI). This model reasons about spatial logic, object placement, and compositional intent before generating — it functions more like an architect than a photographer.

OUTPUT FORMAT:
- Generate exactly 3 labeled blocks: SCENE ARCHITECTURE, VISUAL LOGIC & DETAIL, AESTHETIC TREATMENT
- Write with precision about placement, proportion, and spatial relationships
- Each block is 2–3 sentences, using clear declarative language
- No preamble, no explanation — output the blocks only
- After the blocks, output: SUMMARY: [≤20-word description of scene purpose and visual logic]

GPT IMAGE 2 DIALECT RULES:
1. SCENE ARCHITECTURE: Describe the scene's structural composition first — what exists in the frame, where it is positioned, what the spatial relationships are. Use directional and proportional language: "centered in the lower third", "occupying the left half of the frame", "background elements recede to a single vanishing point".
2. VISUAL LOGIC: Describe the logical and physical relationships between elements. This model understands cause-and-effect and scene logic. Include material properties, surface descriptions, and object identity with specificity.
3. For text-in-image: specify font style, exact text content, surface type, and placement. GPT Image 2 has near-perfect text rendering when given explicit instruction.
4. AESTHETIC TREATMENT: Lighting, color palette, overall visual register. Frame this as the scene's intended emotional and aesthetic function.
5. Use precise, unambiguous language for spatial placement — this model places objects exactly where instructed when language is clear.
6. Multi-object scenes: describe each element's position relative to others, not just in absolute terms.
`,
  },

  /**
   * SEEDREAM 4.5 — ByteDance
   * Sources: docs.byteplus.com/en/docs/ModelArk/1829186 (OFFICIAL ByteDance prompting guide)
   * Characteristics: Strong natural language understanding. Concise + precise beats ornate + complex.
   * Excellent text rendering in both English and Chinese.
   * 4.5 adds stronger editing capabilities. Subject + action + environment + aesthetic (style/color/light).
   * Clear and direct > repeatedly stacking ornate vocabulary. Images are no longer washed out vs 3.0.
   */
  seedream_45: {
    id: 'seedream_45',
    label: 'Seedream 4.5',
    mode: 'static',
    blockStructure: {
      static: ['SCENE & SUBJECT', 'AESTHETIC DIRECTION', 'LIGHT & ATMOSPHERE'],
    },
    summaryInstruction: `Generate a single-sentence summary (max 20 words) describing the visual scene with precise, direct language.`,
    systemPromptCore: `
You are writing for Seedream 4.5 (ByteDance). This model has strong prompt comprehension and rewards concise, precise language over elaborate descriptor stacking.

OUTPUT FORMAT:
- Generate exactly 3 labeled blocks: SCENE & SUBJECT, AESTHETIC DIRECTION, LIGHT & ATMOSPHERE
- Write in clear, direct natural language — NOT comma-stacked lists of adjectives
- Each block is 1–3 sentences. Precision over density.
- No preamble, no explanation — output the blocks only
- After the blocks, output: SUMMARY: [≤20-word direct scene description]

SEEDREAM 4.5 DIALECT RULES:
1. CONCISE AND PRECISE: Seedream 4.5 understands prompts with less description than older models. Do not over-stack ornate vocabulary — "a woman in a red dress in rain" is more effective than "stunning beautiful elegant mysterious woman draped in flowing crimson scarlet red dress".
2. SCENE & SUBJECT: Natural language scene description. Subject + what they are doing + their environment. Like explaining a photograph to someone who hasn't seen it.
3. AESTHETIC DIRECTION: Style type (documentary photography, editorial fashion, cinematic still, product advertising, etc.) followed by color direction. Use the image usage/type format from official guide: "Type: [category]. Style: [description]. Color: [palette]."
4. LIGHT & ATMOSPHERE: Describe light source, direction, and quality in practical terms. Also include temporal context (time of day, interior/exterior) as this shapes the model's lighting choices significantly.
5. For text in image: place text content in quotation marks and specify placement and surface.
6. AVOID: repeating adjectives, stacking synonyms, vague quality markers like "ultra-realistic" or "best quality".
`,
  },

  /**
   * SEEDREAM 5 LITE — ByteDance
   * Sources: evolink.ai/blog/seedream-prompt-guide (2026 guide), extrapolated from 4.5 official docs
   * // APPROXIMATE: 5 Lite specific docs not yet fully available. Strong baseline from 4.5 family.
   * Characteristics: Updated 4.5 family with improved reference handling (up to 14 refs).
   * Same prompting philosophy: concise and direct. Lite = faster inference.
   */
  seedream_5_lite: {
    id: 'seedream_5_lite',
    label: 'Seedream 5 Lite',
    mode: 'static',
    approximate: true,
    blockStructure: {
      static: ['SCENE & SUBJECT', 'AESTHETIC DIRECTION', 'LIGHT & ATMOSPHERE'],
    },
    summaryInstruction: `Generate a single-sentence summary (max 20 words) as a direct scene description.`,
    systemPromptCore: `
You are writing for Seedream 5 Lite (ByteDance). This model continues the Seedream family's emphasis on clear, precise natural language over elaborate descriptor stacking.

OUTPUT FORMAT:
- Generate exactly 3 labeled blocks: SCENE & SUBJECT, AESTHETIC DIRECTION, LIGHT & ATMOSPHERE
- Clear, direct prose — not adjective lists
- Each block is 1–3 sentences
- No preamble, no explanation — output the blocks only
- After the blocks, output: SUMMARY: [≤20-word direct scene description]

// APPROXIMATE — Seedream 5 Lite official docs not yet fully published.
// This dialect uses the Seedream 4.5 baseline from official ByteDance documentation.
// Update as 5.x-specific guidance becomes available.

SEEDREAM 5 LITE DIALECT RULES:
1. Same concise-and-precise philosophy as 4.5 — clarity over stacking
2. Lite variant: slightly tighter prompt density recommended for optimal inference
3. Supports up to 14 reference images for consistency — note in prompt if referencing specific elements
4. Use image usage/type framing: "Type: [category]. Style: [description]."
5. AVOID: ornate vocabulary stacking, vague quality markers, repeat adjectives
`,
  },

  /**
   * SEEDANCE 2.0 — ByteDance video model
   * Sources: morphic.com/resources/how-to/seedance-2-guide, thesiliconreview.com comparison,
   *          multic.com/guides/seedance-2-vs-kling comparison
   * Characteristics: Director-level control. Multimodal inputs. Multi-shot native.
   * Explicit lighting, shadow, and camera behavior language. Reference-based creation.
   * Best for: narrative sequences, dialogue scenes, complex multi-shot.
   * Structure: Scene Setup → Camera & Motion → Audio & Temporal
   */
  seedance_2: {
    id: 'seedance_2',
    label: 'Seedance 2.0',
    mode: 'video',
    blockStructure: {
      video: ['SCENE & CHARACTER', 'CAMERA & MOTION LANGUAGE', 'TEMPORAL & AUDIO'],
    },
    summaryInstruction: `Generate a single-sentence summary (max 20 words) as a director's shot description including camera behavior and scene intent.`,
    systemPromptCore: `
You are writing for Seedance 2.0 (ByteDance). This is a director-level video generation model with multimodal input support and native multi-shot capability.

OUTPUT FORMAT:
- Generate exactly 3 labeled blocks: SCENE & CHARACTER, CAMERA & MOTION LANGUAGE, TEMPORAL & AUDIO
- Write as a film director describing a shot to a DP and 1st AC
- Each block is 2–4 sentences with explicit technical specificity
- No preamble, no explanation — output the blocks only
- After the blocks, output: SUMMARY: [≤20-word director's shot description]

SEEDANCE 2.0 DIALECT RULES:
1. SCENE & CHARACTER: Establish the location, lighting conditions, and character(s) with physical precision. Include explicit lighting direction, shadow quality, and environmental atmosphere. Seedance responds strongly to lighting language: "hard motivated key from practical neon sign at camera right, deep cyan cast, heavy shadows pooling left".
2. CAMERA & MOTION: Be explicit about camera behavior using director/DP terminology. Include: movement type, speed, axis, focal length behavior. Seedance supports complex multi-shot sequences — specify shot transitions if multi-shot.
3. TEMPORAL: Describe the scene's duration intent, pacing, and any audio/dialogue elements. For Seedance 2.0, audio is generated alongside video — specify ambient sound, music tone, or dialogue if desired.
4. REFERENCE-AWARE: If @elements are defined, the model integrates referenced visual elements (character, style, location) from prior descriptions — reinforce key identity details in the scene description.
5. Use cinema language: "motivated light source", "practicals", "rack focus from foreground to subject", "handheld follow through doorway".
`,
  },

  /**
   * KLING 3.0 — Kuaishou
   * Sources: atlabs.ai/blog/kling-3-0-prompting-guide (tested guide), klingaio.com/blogs/kling-3-prompt-guide,
   *          magichour.ai/blog/kling-30-reference-guide, vicsee.com/blog/kling-3-prompts
   * Characteristics: 5-part structure works best: Scene → Characters → Action → Camera → Audio/Style
   * Physics-first language. Explicit cinematography terms. Frame-level control.
   * Multi-shot sequences up to 6 angles. Native audio and dialogue. First/last frame control.
   * Best for: realistic motion, human action, photorealistic footage, FPV drone, sports.
   */
  kling_3: {
    id: 'kling_3',
    label: 'Kling 3.0',
    mode: 'video',
    blockStructure: {
      video: ['SCENE & CHARACTER', 'MOTION & PHYSICS', 'CAMERA & AUDIO'],
    },
    summaryInstruction: `Generate a single-sentence summary (max 20 words) in the format: [Camera movement] + [subject action] + [setting] + [visual style].`,
    systemPromptCore: `
You are writing for Kling 3.0 (Kuaishou). This model excels at realistic motion, natural human action, and photorealistic footage. It responds to physics-based language and explicit cinematography terminology.

OUTPUT FORMAT:
- Generate exactly 3 labeled blocks: SCENE & CHARACTER, MOTION & PHYSICS, CAMERA & AUDIO
- Write like a film director describing expected physical behavior to a stunt coordinator and DP
- Each block is 2–4 sentences
- No preamble, no explanation — output the blocks only
- After the blocks, output: SUMMARY: [≤20-word prompt in format: camera movement + subject action + setting + visual style]

KLING 3.0 DIALECT RULES:
1. SCENE first: ground the model in a clear environment before introducing characters or motion. Include specific location atmosphere.
2. CHARACTER: Anchor character identity early with consistent physical descriptors. For character consistency across shots, repeat identical descriptive attributes.
3. MOTION & PHYSICS: This is where Kling excels — describe motion in physical terms, not just visual terms. Instead of "she walks elegantly" write "heel-first stride, weight transferring through ball of foot, slight forward lean, 4–5 feet per second pace". Physics language prevents floating/sliding artifacts.
4. CAMERA: Use precise cinematography terminology. Kling 3.0 understands and correctly executes: "slow dolly push on 50mm", "FPV drone rolling 360 degrees", "whip pan right to reveal", "crash push to extreme close-up". Specify camera movement FIRST in this block.
5. AUDIO: Kling 3.0 generates native audio. For dialogue: use quoted speech with character descriptors. For ambient: describe sound environment. Keep dialogue to 1–2 short sentences.
6. MULTI-SHOT: For sequences, describe each shot transition explicitly: "First shot: [description]. Cut to: [description]."
7. Film reference: "Shot on 35mm film, shallow depth of field, realistic cinematic movement" — this triggers trained cinematic behavior.
`,
  },

  /**
   * KLING 2.6 / 2.5 — Kuaishou older variants
   * Sources: Same Kling documentation, variant-specific behavior from changelog/community testing
   * Characteristics: Same core approach as 3.0 but without multi-shot, less audio capability.
   * Solid for single-shot realistic clips. Character consistency is strong.
   * // APPROXIMATE for 2.5/2.6-specific nuances; core structure from official Kling docs.
   */
  kling_2x: {
    id: 'kling_2x',
    label: 'Kling 2.x',
    mode: 'video',
    blockStructure: {
      video: ['SCENE & CHARACTER', 'MOTION & PHYSICS', 'CAMERA & STYLE'],
    },
    summaryInstruction: `Generate a single-sentence summary (max 20 words): camera movement + subject action + setting + visual style.`,
    systemPromptCore: `
You are writing for Kling 2.x (Kuaishou — covers 2.5 and 2.6). Same core approach as Kling 3.0 with slightly less complex multi-shot and audio capability.

OUTPUT FORMAT:
- Generate exactly 3 labeled blocks: SCENE & CHARACTER, MOTION & PHYSICS, CAMERA & STYLE
- Physics-first motion language, explicit cinematography terminology
- Each block is 2–3 sentences
- No preamble, no explanation — output the blocks only
- After the blocks, output: SUMMARY: [≤20-word camera + action + setting + style description]

KLING 2.X DIALECT RULES:
1. Same physics-first motion language as Kling 3.0 — describe motion as physical behavior, not appearance
2. SCENE: ground in environment first, then character, then action
3. CAMERA: explicit cinematography terms — dolly, push, pull, pan, FPV. Specify focal length and movement speed.
4. No multi-shot sequences (save that for 3.0) — single, well-defined shot
5. Character consistency: repeat identical physical descriptors, reuse same reference language throughout
6. Film reference works: "35mm film look, shallow depth of field" triggers trained aesthetic behavior
`,
  },

  /**
   * VEO 3.1 — Google
   * Sources: veed.io/learn/veo-3-1-prompts (tested guide), ltx.io/blog/veo-prompt-guide,
   *          invideo.io/blog/google-veo-prompt-guide, imagine.art/blogs/veo-3-1-prompt-guide
   * Characteristics: Interprets professional film terminology exceptionally well.
   * 5-element formula: Shot Composition + Subject + Action + Setting + Aesthetics/Mood
   * Structure-literal: what you mention first gets most attention.
   * Native audio generation — always include audio direction.
   * Max ~175 words optimal; longer prompts cause conflicting instructions.
   * Generates up to 2-minute clips (3.1 max).
   */
  veo_31: {
    id: 'veo_31',
    label: 'Google Veo 3.1',
    mode: 'video',
    blockStructure: {
      video: ['SHOT & SUBJECT', 'ACTION & ENVIRONMENT', 'AESTHETICS & AUDIO'],
    },
    summaryInstruction: `Generate a single-sentence summary (max 20 words) using Veo's 5-element format: shot type + subject + action + setting + aesthetic.`,
    systemPromptCore: `
You are writing for Google Veo 3.1. This model interprets professional cinematography language with exceptional accuracy and treats prompt structure literally — what comes first in the prompt receives the most rendering attention.

OUTPUT FORMAT:
- Generate exactly 3 labeled blocks: SHOT & SUBJECT, ACTION & ENVIRONMENT, AESTHETICS & AUDIO
- Total prompt word count should be 100–175 words maximum. Exceeding this causes conflicting instructions.
- Each block is 1–3 focused sentences
- No preamble, no explanation — output the blocks only
- After the blocks, output: SUMMARY: [≤20-word: shot type + subject + action + setting + aesthetic]

VEO 3.1 DIALECT RULES:
1. SHOT FIRST: Always open the SHOT & SUBJECT block with the shot type and camera position (e.g. "Low angle tracking shot", "Overhead crane move", "Dutch angle close-up"). Veo 3.1 interprets what comes first most strongly — camera position anchors the entire generation.
2. SUBJECT: Describe the subject immediately after shot type — who/what, physical presence, position in frame.
3. ACTION: Describe movement and action with physical specificity. Include scene motion (environmental elements moving) alongside subject motion.
4. ENVIRONMENT: Setting, time of day, atmosphere — ground the model in a real physical space.
5. AESTHETICS: Film stock, color grade, visual style using professional terminology. Veo understands Dutch angle, rack focus, dolly zoom, etc. with high accuracy.
6. AUDIO (always include): Veo 3.1 generates synchronized audio. Keep dialogue to one natural breath — about 8–10 seconds. Specify: ambient sound, dialogue tone, or score direction. "No background music" is a valid instruction if desired.
7. KEEP IT TIGHT: Do not mix multiple camera movements in one prompt. One movement per generation. Abstract descriptions confuse the model — be concrete.
`,
  },

  /**
   * RUNWAY GEN 4 — Runway
   * Sources: help.runwayml.com/hc/en-us/articles/39789879462419-Gen-4-Video-Prompting-Guide (OFFICIAL)
   *          veo3gen.app/blog/runway-gen4-prompting-rules (analysis of official guide)
   * Characteristics: Motion-first approach. Three motion layers: subject / camera / scene.
   * Use reference image as art direction; prompt as shot direction.
   * Iterate one change at a time. Refer to subjects as "the subject" not proper names.
   * Excellent physics and realistic weight/momentum. Strong for product, portrait, and commercial.
   */
  runway_gen4: {
    id: 'runway_gen4',
    label: 'Runway Gen 4',
    mode: 'video',
    blockStructure: {
      video: ['SUBJECT MOTION', 'CAMERA MOTION', 'SCENE MOTION & ATMOSPHERE'],
    },
    summaryInstruction: `Generate a single-sentence summary (max 20 words) describing the three motion layers: what moves, how camera moves, what else moves in the scene.`,
    systemPromptCore: `
You are writing for Runway Gen 4. This model is optimized for motion-first generation with exceptional physics and realistic weight/momentum. The official Runway prompting philosophy: use a reference image for art direction, and use the text prompt exclusively for motion description.

OUTPUT FORMAT:
- Generate exactly 3 labeled blocks: SUBJECT MOTION, CAMERA MOTION, SCENE MOTION & ATMOSPHERE
- Each block describes a distinct motion layer — think of them as three separate "motion channels"
- Each block is 1–3 sentences, specific and concrete
- No preamble, no explanation — output the blocks only
- After the blocks, output: SUMMARY: [≤20-word description of the three motion layers]

RUNWAY GEN 4 DIALECT RULES:
1. THREE MOTION LAYERS: The fundamental structure. Always describe (a) subject motion, (b) camera motion, (c) scene/environment motion separately. This is the core Runway Gen 4 approach per official documentation.
2. SUBJECT: Refer to subjects as "the subject" rather than by name or overly specific identity — this reduces generation conflicts. Describe what the subject DOES, not what they look like (the reference image handles looks).
3. SUBJECT MOTION: Describe physical behavior with forces and momentum: "The subject's shoulders drop forward as weight shifts, arm extending in a deliberate overhead reach, movement smooth and controlled." Think forces acting on objects.
4. CAMERA MOTION: One camera movement per generation. Be precise: "Slow dolly push from waist-height, closing distance at approximately 1 foot per second." Never combine two camera movements.
5. SCENE MOTION: Environmental elements that move — wind-affected fabric, reflections on wet pavement, steam rising from a grate, background crowd movement at low energy.
6. ATMOSPHERE: End with brief atmospheric context — light quality, time of day, visual mood. This grounds the physics simulation.
7. AVOID: Describing subject appearance (use reference image instead), multiple camera movements, abstract metaphors, overly long prompts.
`,
  },

};

/** Convenience: get a dialect by key, falling back to master */
export const getDialect = (key) => DIALECTS[key] ?? DIALECTS.master;
