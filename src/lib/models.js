/**
 * FRAME — Model Registry
 * ─────────────────────────────────────────────────────────────
 * Add / remove / update models here. No other file needs to change.
 *
 * Fields:
 *   id           — unique key, used in state + localStorage
 *   label        — display name shown in UI
 *   group        — 'static' | 'video'
 *   platform     — the platform/company (for grouping in selector)
 *   dialectKey   — maps to a profile in dialects.js (use 'master' for fallback)
 *   approximate  — true = show ⚠ badge, dialect is best-guess not well-documented
 *   audioCapable — true = model generates native audio; enables Audio Direction variable
 *   staticOnly   — true = only show in static mode selector
 *   videoOnly    — true = only show in video mode selector
 *   notes        — default user notes string (persisted per-user in localStorage)
 *
 * DOCUMENTATION SOURCES USED TO BUILD DIALECTS:
 *   Nano Banana 2   — cloud.google.com/blog prompting guide + Magnific blog
 *   Nano Banana Pro — blog.google/products/gemini/prompting-tips + dev.to/googleai guide
 *   Flux.2 Max      — docs.bfl.ml/guides/prompting_guide_flux2 (official BFL guide)
 *   Flux.2 Pro      — same as Max (same family, official BFL docs)
 *   Flux.2 Flex     — same family, approximated from Pro/Max baseline
 *   GPT Image 2     — OpenAI published prompting guide + community testing
 *   Seedream 4.5    — docs.byteplus.com/en/docs/ModelArk/1829186 (official ByteDance guide)
 *   Seedream 5 Lite — official guide + evolink.ai/blog/seedream-prompt-guide (2026)
 *   Seedance 2.0    — morphic.com/resources/how-to/seedance-2-guide + thesiliconreview comparison
 *   Kling 3.0       — atlabs.ai/blog/kling-3-0-prompting-guide + klingaio.com/blogs/kling-3-prompt-guide
 *   Kling variants  — same sources, version-specific notes approximated from changelogs
 *   Veo 3.1         — veed.io/learn/veo-3-1-prompts + ltx.io/blog/veo-prompt-guide
 *   Runway Gen 4    — help.runwayml.com Gen-4 prompting guide (official)
 *   Grok video      — minimal public documentation; APPROXIMATE, uses master dialect
 */

export const STATIC_MODELS = [
  {
    id: 'nano_banana_2',
    label: 'Google Nano Banana 2',
    group: 'static',
    platform: 'Google',
    dialectKey: 'nano_banana_2',
    approximate: false,
    audioCapable: false,
    staticOnly: true,
    videoOnly: false,
    notes: '',
  },
  {
    id: 'nano_banana_pro',
    label: 'Google Nano Banana Pro',
    group: 'static',
    platform: 'Google',
    dialectKey: 'nano_banana_pro',
    approximate: false,
    audioCapable: false,
    staticOnly: true,
    videoOnly: false,
    notes: '',
  },
  {
    id: 'flux2_max',
    label: 'Flux.2 Max',
    group: 'static',
    platform: 'Black Forest Labs',
    dialectKey: 'flux2_max',
    approximate: false,
    audioCapable: false,
    staticOnly: true,
    videoOnly: false,
    notes: '',
  },
  {
    id: 'flux2_pro',
    label: 'Flux.2 Pro',
    group: 'static',
    platform: 'Black Forest Labs',
    dialectKey: 'flux2_pro',
    approximate: false,
    audioCapable: false,
    staticOnly: true,
    videoOnly: false,
    notes: '',
  },
  {
    id: 'flux2_flex',
    label: 'Flux.2 Flex',
    group: 'static',
    platform: 'Black Forest Labs',
    dialectKey: 'flux2_flex',
    approximate: true,
    audioCapable: false,
    staticOnly: true,
    videoOnly: false,
    notes: '',
  },
  {
    id: 'gpt_image_2',
    label: 'GPT Image 2',
    group: 'static',
    platform: 'OpenAI',
    dialectKey: 'gpt_image_2',
    approximate: false,
    audioCapable: false,
    staticOnly: true,
    videoOnly: false,
    notes: '',
  },
  {
    id: 'seedream_5_lite',
    label: 'Seedream 5 Lite',
    group: 'static',
    platform: 'ByteDance',
    dialectKey: 'seedream_5_lite',
    approximate: true,
    audioCapable: false,
    staticOnly: true,
    videoOnly: false,
    notes: '',
  },
  {
    id: 'seedream_45',
    label: 'Seedream 4.5',
    group: 'static',
    platform: 'ByteDance',
    dialectKey: 'seedream_45',
    approximate: false,
    audioCapable: false,
    staticOnly: true,
    videoOnly: false,
    notes: '',
  },
];

export const VIDEO_MODELS = [
  {
    id: 'seedance_2_fast',
    label: 'Seedance 2.0 Fast',
    group: 'video',
    platform: 'ByteDance',
    dialectKey: 'seedance_2',
    approximate: false,
    audioCapable: true,
    staticOnly: false,
    videoOnly: true,
    notes: 'Fast variant — shorter clip budget, same prompt structure as Seedance 2.0.',
  },
  {
    id: 'seedance_2',
    label: 'Seedance 2.0',
    group: 'video',
    platform: 'ByteDance',
    dialectKey: 'seedance_2',
    approximate: false,
    audioCapable: true,
    staticOnly: false,
    videoOnly: true,
    notes: '',
  },
  {
    id: 'kling_3',
    label: 'Kling 3.0',
    group: 'video',
    platform: 'Kuaishou',
    dialectKey: 'kling_3',
    approximate: false,
    audioCapable: false,
    staticOnly: false,
    videoOnly: true,
    notes: '',
  },
  {
    id: 'kling_3_omni',
    label: 'Kling 3.0 Omni',
    group: 'video',
    platform: 'Kuaishou',
    dialectKey: 'kling_3',
    approximate: false,
    audioCapable: true,
    staticOnly: false,
    videoOnly: true,
    notes: 'Omni variant — supports audio/dialogue generation alongside video.',
  },
  {
    id: 'kling_3_motion',
    label: 'Kling 3.0 Motion Control',
    group: 'video',
    platform: 'Kuaishou',
    dialectKey: 'kling_3',
    approximate: false,
    audioCapable: false,
    staticOnly: false,
    videoOnly: true,
    notes: 'Motion Control variant — emphasize precise camera trajectory language.',
  },
  {
    id: 'kling_26',
    label: 'Kling 2.6',
    group: 'video',
    platform: 'Kuaishou',
    dialectKey: 'kling_2x',
    approximate: false,
    audioCapable: false,
    staticOnly: false,
    videoOnly: true,
    notes: '',
  },
  {
    id: 'kling_25',
    label: 'Kling 2.5',
    group: 'video',
    platform: 'Kuaishou',
    dialectKey: 'kling_2x',
    approximate: false,
    audioCapable: false,
    staticOnly: false,
    videoOnly: true,
    notes: '',
  },
  {
    id: 'grok_video',
    label: 'Grok',
    group: 'video',
    platform: 'xAI',
    dialectKey: 'master',
    approximate: true,
    audioCapable: false,
    staticOnly: false,
    videoOnly: true,
    notes: 'Limited public prompting documentation. Dialect uses master structure.',
  },
  {
    id: 'veo_31_fast',
    label: 'Google Veo 3.1 Fast',
    group: 'video',
    platform: 'Google',
    dialectKey: 'veo_31',
    approximate: false,
    audioCapable: true,
    staticOnly: false,
    videoOnly: true,
    notes: 'Fast variant — keep prompts tighter, prioritize motion clarity.',
  },
  {
    id: 'veo_31_lite',
    label: 'Google Veo 3.1 Lite',
    group: 'video',
    platform: 'Google',
    dialectKey: 'veo_31',
    approximate: false,
    audioCapable: true,
    staticOnly: false,
    videoOnly: true,
    notes: 'Lite variant — simplified generation; avoid overly complex camera instructions.',
  },
  {
    id: 'veo_31',
    label: 'Google Veo 3.1',
    group: 'video',
    platform: 'Google',
    dialectKey: 'veo_31',
    approximate: false,
    audioCapable: true,
    staticOnly: false,
    videoOnly: true,
    notes: '',
  },
  {
    id: 'runway_gen4',
    label: 'Runway Gen 4',
    group: 'video',
    platform: 'Runway',
    dialectKey: 'runway_gen4',
    approximate: false,
    audioCapable: false,
    staticOnly: false,
    videoOnly: true,
    notes: '',
  },
];

/** Combined list for lookups */
export const ALL_MODELS = [...STATIC_MODELS, ...VIDEO_MODELS];

/** Get a model object by id */
export const getModel = (id) => ALL_MODELS.find((m) => m.id === id) ?? null;

/** Check if currently selected model supports audio generation */
export const isAudioCapable = (id) => getModel(id)?.audioCapable ?? false;
