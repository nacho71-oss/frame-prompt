import { getDialect } from './dialects.js';
import { getModel, isAudioCapable, ALL_MODELS } from './models.js';

/**
 * Variable definitions — labels, types, options, and mode/section flags.
 * Used to format the system prompt context section.
 * UI rendering uses these definitions too (Session B will wire them to VariablePanel).
 *
 * Types:
 *   slider      — resolves to steps[value]
 *   pills       — single selection string
 *   multiselect — array of selected strings
 *
 * Flags:
 *   videoOnly   — only included when mode === 'video'
 *   staticOnly  — only included when mode === 'static'
 *   advanced    — lives in the Advanced accordion
 *   audioGated  — only included when selected model is audioCapable
 *   section     — 'core' | 'subject' | 'lighting' | 'atmosphere' | 'motion' | 'advanced' | 'color'
 */
export const VARIABLE_DEFS = {

  // ── CORE ────────────────────────────────────────────────────────────────

  shotFraming: {
    label: 'Shot Framing',
    type: 'slider',
    section: 'core',
    min: 0,
    max: 7,
    steps: [
      'Extreme Macro',
      'Macro',
      'Close-Up',
      'Medium Close-Up',
      'Medium',
      'Medium Wide',
      'Wide',
      'Extreme Wide',
    ],
  },

  aspectRatio: {
    label: 'Aspect Ratio',
    type: 'pills',
    section: 'core',
    options: [
      '1:1 (Square)',
      '4:5 (Portrait Social)',
      '9:16 (Vertical)',
      '1.85:1 (Academy Flat)',
      '16:9 (Standard Cinema)',
      '2.39:1 (Scope / Epic)',
      '2.76:1 (Ultra-Wide)',
      '4:3 (Classic)',
    ],
  },

  // ── SUBJECT sub-group (static only in UI; logic applies to both) ────────

  subjectOrientation: {
    label: 'Subject Orientation',
    type: 'pills',
    section: 'subject',
    staticOnly: true,
    options: [
      'Facing Camera',
      'Profile Left',
      'Profile Right',
      '3/4 Left',
      '3/4 Right',
      'Back to Camera',
    ],
  },

  subjectPosture: {
    label: 'Subject Posture',
    type: 'pills',
    section: 'subject',
    staticOnly: true,
    options: [
      'Standing',
      'Sitting',
      'Crouching',
      'Lying Down',
      'In Motion',
      'Elevated',
      'Ground Level',
    ],
  },

  // ── LIGHTING sub-group ──────────────────────────────────────────────────

  lightQuality: {
    label: 'Light Quality',
    type: 'pills',
    section: 'lighting',
    options: ['Soft', 'Soft-Directional', 'Directional', 'Hard', 'Harsh'],
  },

  lightDirection: {
    label: 'Light Direction',
    type: 'pills',
    section: 'lighting',
    // Note: options marked with [side] accept an optional L/R qualifier
    // stored separately in lightDirectionSide.
    options: [
      'Front',
      '45° Front-Side',   // uses lightDirectionSide
      'Side',             // uses lightDirectionSide
      '45° Back-Side',    // uses lightDirectionSide
      'Back',
      'Overhead',
      'Under',
      'Motivated (from scene)',
    ],
    sideQualifierOptions: ['45° Front-Side', 'Side', '45° Back-Side'],
  },

  lightingSetup: {
    label: 'Lighting Setup',
    type: 'pills',
    section: 'lighting',
    options: [
      'Natural Available',
      'Rembrandt',
      'Split',
      'Loop',
      'Butterfly',
      'Broad',
      'Short',
      'Rim Only',
      'Silhouette',
      'Chiaroscuro',
    ],
  },

  lightSourceColor: {
    label: 'Light Source Color',
    type: 'pills',
    section: 'lighting',
    // Kelvin gradient bar rendered in UI below these pills (Session B)
    options: [
      'Candlelight (1800K)',
      'Tungsten (2700K)',
      'Warm Daylight (4000K)',
      'Neutral Daylight (5600K)',
      'Overcast (6500K)',
      'Shade / Blue Sky (8000K+)',
      'Mixed Sources',
    ],
  },

  // ── ATMOSPHERE sub-group ────────────────────────────────────────────────

  atmosphericDensity: {
    label: 'Atmospheric Density',
    type: 'pills',
    section: 'atmosphere',
    options: [
      'Crystal Clear',
      'Light Haze',
      'Atmospheric Mist',
      'Heavy Fog',
      'Volumetric / God Rays',
      'Smoke / Dust',
      'Rain',
      'Heat Shimmer',
    ],
  },

  // ── CORE REMAINDER ──────────────────────────────────────────────────────

  lensCharacter: {
    label: 'Lens Character',
    type: 'multiselect',
    section: 'core',
    options: [
      'Modern Clean',
      'Vintage',
      'Anamorphic',
      'Swirly Bokeh',
      'Heavy Bokeh',
      'Tilt-Shift',
    ],
  },

  colorGrade: {
    label: 'Color Grade Feel',
    type: 'multiselect',
    section: 'core',
    options: [
      'Neutral',
      'Warm',
      'Cool',
      'High Contrast',
      'Bleach Bypass',
      'Faded',
      'Teal & Orange',
      'Silver Halide',
      'Kodachrome',
      'Desaturated',
      'Day-for-Night',
    ],
  },

  cameraAngle: {
    label: 'Camera Angle',
    type: 'pills',
    section: 'core',
    options: [
      'Low to Ground',
      'Low',
      'Eye Level',
      'Slight High',
      'High',
      'Overhead',
      'Bird\'s Eye',
      'POV',
      'Dutch Angle',
    ],
  },

  emotionalRegister: {
    label: 'Emotional Register',
    type: 'pills',
    section: 'core',
    options: [
      'Tense',
      'Melancholic',
      'Intimate',
      'Epic',
      'Playful',
      'Serene',
      'Unsettling',
      'Romantic',
      'Documentary / Observational',
    ],
  },

  // ── VIDEO MOTION (video only) ────────────────────────────────────────────

  cameraMovement: {
    label: 'Camera Movement',
    type: 'pills',
    section: 'motion',
    videoOnly: true,
    options: [
      'Static',
      'Breathing',
      'Slow Dolly In',
      'Dolly Out',
      'Pull Back Reveal',
      'Lateral Track',
      'Arc',
      'Orbit',
      'Crane Up',
      'Crane Down',
      'Handheld',
      'Whip Pan',
      'Rack Focus',
      'Unmotivated Drift',
    ],
  },

  operatorWeight: {
    label: 'Operator Weight',
    type: 'pills',
    section: 'motion',
    videoOnly: true,
    options: ['Locked Off', 'Stabilized', 'Shoulder', 'Heavy Handheld'],
  },

  playbackFeel: {
    label: 'Playback Feel',
    type: 'pills',
    section: 'motion',
    videoOnly: true,
    // Renamed from motionSpeed. Describes perceived temporal speed of the clip.
    options: [
      'Fast / Urgent (Undercranked)',
      'Normal',
      'Slightly Slow',
      'Slow Motion',
    ],
  },

  slowMotionFPS: {
    label: 'Slow Motion FPS',
    type: 'pills',
    section: 'motion',
    videoOnly: true,
    // Two tiers: Cinematic (trained values) and High-Speed (aesthetic interpretation)
    // Claude handles high-speed values as extreme time-stretch aesthetic, not literal fps
    options: [
      // Cinematic tier
      '24fps (Standard)',
      '48fps (HFR)',
      '60fps (Sports)',
      '120fps (Strong Slow-Mo)',
      '240fps (Extreme Slow-Mo)',
      // High-speed tier — aesthetic interpretation
      '500fps (Ultra Freeze)',
      '1000fps (Impact Freeze)',
      '5000fps (Near-Frozen Time)',
      '10000fps (Time Suspended)',
    ],
    cinematicTier: ['24fps (Standard)', '48fps (HFR)', '60fps (Sports)', '120fps (Strong Slow-Mo)', '240fps (Extreme Slow-Mo)'],
  },

  motionBlurVideo: {
    label: 'Motion Blur',
    type: 'slider',
    section: 'motion',
    videoOnly: true,
    min: 0,
    max: 4,
    steps: [
      'None (Frozen / Staccato)',
      'Crisp (90° — sharp, Saving Private Ryan)',
      'Natural (180° — standard cinema)',
      'Dreamy (270° — soft, painterly)',
      'Extreme Smear (360°+ — ghosting)',
    ],
  },

  lensBreathing: {
    label: 'Lens Breathing',
    type: 'pills',
    section: 'motion',
    videoOnly: true,
    // Breathing = slight focal length shift during focus pulls; only visible in motion
    options: ['None', 'Subtle', 'Pronounced'],
  },

  subjectBehavior: {
    label: 'Subject Behavior',
    type: 'multiselect',
    section: 'motion',
    videoOnly: true,
    options: [
      'Idle / Still',
      'Subtle Movement',
      'Walking',
      'Running',
      'Gesture-Based',
      'Emotional Reaction',
      'Interacting with Object',
      'Environmental Response',
      'Multiple Subjects',
      'Crowd',
    ],
  },

  secondaryMotion: {
    label: 'Secondary Motion',
    type: 'multiselect',
    section: 'motion',
    videoOnly: true,
    options: [
      'None',
      'Hair / Fabric',
      'Smoke / Steam',
      'Water',
      'Foliage',
      'Dust / Particles',
      'All Environmental',
    ],
  },

  audioDirection: {
    label: 'Audio Direction',
    type: 'pills',
    section: 'motion',
    videoOnly: true,
    audioGated: true, // hidden when selected model is not audioCapable
    options: [
      'Ambient Only',
      'Silence',
      'Dialogue / Voice',
      'Diegetic Sound',
      'Music-Driven',
      'Sound Design Emphasis',
    ],
  },

  // ── ADVANCED ────────────────────────────────────────────────────────────

  focalLength: {
    label: 'Focal Length Feel',
    type: 'slider',
    section: 'advanced',
    min: 0,
    max: 7,
    steps: [
      '8mm (Extreme Distortion)',
      '24mm (Environmental Wide)',
      '35mm (Natural Human POV)',
      '50mm (Neutral / Natural)',
      '85mm (Portrait Compression)',
      '135mm (Telephoto Flatness)',
      '200mm (Strong Compression)',
      '400mm+ (Extreme Isolation)',
    ],
  },

  apertureFeel: {
    label: 'Aperture Feel',
    type: 'pills',
    section: 'advanced',
    options: [
      'Razor Thin',
      'Shallow',
      'Moderate',
      'Deep',
      'Everything in Focus',
    ],
  },

  sensorStock: {
    label: 'Sensor / Film Stock',
    type: 'pills',
    section: 'advanced',
    options: [
      'Digital Clean',
      'Digital Cinematic',
      '16mm',
      'Super 16',
      '35mm',
      '70mm',
      'IMAX',
      'Kodak Vision3',
      'Kodak Portra 400',
      'Fuji Eterna',
      'Ektachrome',
      'ARRI Alexa',
      'RED Dragon',
      'Lomography',
    ],
  },

  compositionalIntent: {
    label: 'Compositional Intent',
    type: 'multiselect',
    section: 'advanced',
    // Renamed from framingStyle. Focuses on the compositional principle chosen.
    options: [
      'Rule of Thirds',
      'Centered / Symmetric',
      'Dutch Symmetry',
      'Negative Space Heavy',
      'Foreground Frame',
      'Leading Lines',
      'Layered Depth',
      'Tight / Compressed',
      'Open / Breathable',
    ],
  },

  lensQualities: {
    label: 'Lens Qualities',
    type: 'multiselect',
    section: 'advanced',
    // Breathing removed (moved to video motion). Halation + Edge Softness added.
    options: [
      'Flare Prone',
      'Low Contrast',
      'Chromatic Aberration',
      'Vignette',
      'Halation',
      'Edge Softness',
    ],
  },

  timeOfDay: {
    label: 'Time of Day',
    type: 'pills',
    section: 'advanced',
    // Golden Hour and Magic Hour were duplicates — differentiated.
    // Interior Artificial removed (location qualifier, not time).
    options: [
      'Sunrise',
      'Golden Hour',
      'Magic Hour',
      'Midday',
      'Overcast Day',
      'Blue Hour',
      'Dusk',
      'Night',
      'Indoor Artificial',
    ],
  },

  shadowQuality: {
    label: 'Shadow Quality',
    type: 'pills',
    section: 'advanced',
    options: [
      'No Visible Shadows',
      'Soft Gradients',
      'Defined Shadows',
      'Hard-Edged Shadows',
      'Deep Black Shadows',
      'Crushed Blacks',
    ],
  },

  grainTexture: {
    label: 'Grain & Texture',
    type: 'pills',
    section: 'advanced',
    options: [
      'None',
      'Fine Digital Noise',
      'Light Film Grain',
      'Visible Grain',
      'Heavy Grain',
      'Extreme / Degraded',
    ],
  },

  depthLayers: {
    label: 'Depth Layers',
    type: 'pills',
    section: 'advanced',
    options: [
      'Flat (No Layers)',
      'Shallow Depth',
      'Foreground Element',
      'Mid / Back Separation',
      'Deep Layers',
      'Parallax / Rack Focus',
    ],
  },

  practicalLights: {
    label: 'Practical Lights',
    type: 'multiselect',
    section: 'advanced',
    options: [
      'Candle / Fire',
      'Neon Sign',
      'TV / Screen Glow',
      'Window Light',
      'Streetlight',
      'Flashlight',
      'Practical Lamp',
      'Phone / Device',
      'Headlights',
    ],
  },

  motionBlurStatic: {
    label: 'Motion Blur (Implied)',
    type: 'slider',
    section: 'advanced',
    staticOnly: true,
    // In static mode, motion blur = implied motion / long exposure feel
    min: 0,
    max: 4,
    steps: [
      'None (Everything Sharp)',
      'Slight Implied Motion',
      'Moderate Motion Blur',
      'Strong Long-Exposure Feel',
      'Extreme Smear / Trail',
    ],
  },

  // ── COLOR PALETTE (own section) ─────────────────────────────────────────
  // colorPalette is an object: { primary: '#hex', active: ['#hex', ...] }
  // Handled separately in buildColorPaletteContext() below.

};

// ── Core variables eligible for Claude fill when fillGaps is on ──────────
export const CORE_VAR_KEYS = [
  'shotFraming',
  'lightQuality',
  'lightDirection',
  'lensCharacter',
  'colorGrade',
  'cameraAngle',
  'emotionalRegister',
];

// ── FPS values that are in the high-speed tier (aesthetic, not literal) ──
const HIGH_SPEED_FPS = [
  '500fps (Ultra Freeze)',
  '1000fps (Impact Freeze)',
  '5000fps (Near-Frozen Time)',
  '10000fps (Time Suspended)',
];

// ── Light direction values that accept an L/R side qualifier ──────────────
const SIDE_QUALIFIER_OPTIONS = ['45° Front-Side', 'Side', '45° Back-Side'];

/**
 * Format a single variable value for inclusion in the prompt context.
 */
function formatVarValue(key, value, def) {
  if (value === null || value === undefined) return null;

  if (def.type === 'slider') {
    return def.steps[value] ?? null;
  }
  if (def.type === 'multiselect') {
    return Array.isArray(value) && value.length > 0 ? value.join(', ') : null;
  }
  return value ?? null;
}

/**
 * Builds the formatted light direction string, incorporating L/R qualifier.
 */
function formatLightDirection(lightDirection, lightDirectionSide) {
  if (!lightDirection) return null;
  const needsSide = SIDE_QUALIFIER_OPTIONS.includes(lightDirection);
  if (needsSide && lightDirectionSide) {
    const sideLabel = lightDirectionSide === 'L' ? 'Left' : 'Right';
    return `${lightDirection} (${sideLabel})`;
  }
  return lightDirection;
}

/**
 * Builds color palette context string for Claude.
 * Handles hex → descriptive translation for non-hex-capable models,
 * and raw hex for Flux.2 Pro which explicitly supports HEX color specification.
 */
function buildColorPaletteContext(colorPalette, dialectKey) {
  if (!colorPalette) return null;

  const { primary, active } = colorPalette;
  const allColors = [primary, ...(active || [])].filter(Boolean);
  if (allColors.length === 0) return null;

  // Flux.2 Pro supports raw HEX color specification natively
  const supportsHex = dialectKey === 'flux2_pro';

  if (supportsHex) {
    return `Color Palette (HEX — specify directly in prompt): ${allColors.join(', ')}`;
  }

  // For all other models: pass hex values and instruct Claude to translate
  // to precise descriptive color language in the generated prompt
  return `Color Palette (translate to precise descriptive color language in the prompt): ${allColors.join(', ')}`;
}

/**
 * Builds the FPS instruction, distinguishing cinematic vs high-speed tier.
 */
function formatSlowMotionFPS(value) {
  if (!value) return null;
  if (HIGH_SPEED_FPS.includes(value)) {
    return `${value} — [HIGH-SPEED AESTHETIC: describe as extreme time-stretch, near-frozen motion, ultra-slow physics — do not reference literal fps value in the prompt]`;
  }
  return value;
}

/**
 * Builds motion blur instruction with mode-aware language.
 * Static = implied motion / long exposure aesthetic.
 * Video = shutter angle / per-frame blur.
 */
function formatMotionBlur(value, def, mode) {
  if (value === null || value === undefined) return null;
  const stepLabel = def.steps[value];
  if (!stepLabel) return null;

  if (mode === 'static') {
    return `Motion Blur (implied / long exposure): ${stepLabel}`;
  }
  return `Motion Blur (shutter angle / per-frame): ${stepLabel}`;
}

/**
 * Builds the variable context section of the system prompt.
 */
function buildVariableContext(variables, mode, fillGaps, dialectKey) {
  const lines = [];

  for (const key of Object.keys(VARIABLE_DEFS)) {
    const def = VARIABLE_DEFS[key];

    // Mode gating
    if (def.videoOnly && mode !== 'video') continue;
    if (def.staticOnly && mode !== 'static') continue;

    // Audio gating — handled separately at call site via audioCapable check
    // audioGated variables are skipped here; they're injected in buildAudioContext
    if (def.audioGated) continue;

    // lightDirectionSide is handled inline with lightDirection — skip standalone
    if (key === 'lightDirectionSide') continue;

    // Motion blur handled specially for mode-awareness
    if (key === 'motionBlurVideo' || key === 'motionBlurStatic') {
      const blurValue = mode === 'video' ? variables.motionBlurVideo : variables.motionBlurStatic;
      if (blurValue !== null && blurValue !== undefined) {
        const formatted = formatMotionBlur(blurValue, def, mode);
        if (formatted) lines.push(`  ${formatted}`);
      } else if (fillGaps && CORE_VAR_KEYS.includes(key)) {
        lines.push(`  ${def.label}: [NOT SET — infer from base description]`);
      }
      continue;
    }

    // Light direction with side qualifier
    if (key === 'lightDirection') {
      const formatted = formatLightDirection(variables.lightDirection, variables.lightDirectionSide);
      if (formatted) {
        lines.push(`  Light Direction: ${formatted}`);
      } else if (fillGaps && CORE_VAR_KEYS.includes(key)) {
        lines.push(`  Light Direction: [NOT SET — infer a cinematographically coherent light direction from the scene]`);
      }
      continue;
    }

    // Slow motion FPS — special formatting for high-speed tier
    if (key === 'slowMotionFPS') {
      const val = variables[key];
      if (val !== null && val !== undefined) {
        const formatted = formatSlowMotionFPS(val);
        if (formatted) lines.push(`  Slow Motion FPS: ${formatted}`);
      }
      continue;
    }

    // Standard variable handling
    const rawValue = variables[key];
    const isSet = rawValue !== null && rawValue !== undefined;

    if (!isSet) {
      if (fillGaps && CORE_VAR_KEYS.includes(key)) {
        lines.push(`  ${def.label}: [NOT SET — infer a cinematographically coherent choice from the base description and other variables]`);
      }
      continue;
    }

    const formatted = formatVarValue(key, rawValue, def);
    if (formatted) {
      lines.push(`  ${def.label}: ${formatted}`);
    }
  }

  // Color palette — injected last in variable context
  const colorContext = buildColorPaletteContext(variables.colorPalette, dialectKey);
  if (colorContext) {
    lines.push(`  ${colorContext}`);
  }

  return lines.length > 0
    ? lines.join('\n')
    : '  (no variables set — interpret freely from the base description)';
}

/**
 * Builds audio direction context when model is audio-capable.
 */
function buildAudioContext(variables, mode) {
  if (mode !== 'video') return null;
  const audioDir = variables.audioDirection;
  if (!audioDir) return null;
  return `AUDIO DIRECTION: ${audioDir}`;
}

/**
 * Formats @elements for inclusion in the system prompt.
 */
function buildElementsContext(elements, baseDescription) {
  if (!elements || elements.length === 0) return null;

  const activeElements = elements.filter((el) => el.active !== false);
  if (activeElements.length === 0) return null;

  const alwaysInclude = [];
  const onlyWhenCalled = [];

  for (const el of activeElements) {
    const isCalled = baseDescription.includes(el.handle);
    if (el.alwaysInclude || isCalled) {
      alwaysInclude.push(el);
    } else {
      onlyWhenCalled.push(el);
    }
  }

  const lines = [];

  if (alwaysInclude.length > 0) {
    lines.push('ELEMENTS TO INCORPORATE (always include or explicitly called in description):');
    for (const el of alwaysInclude) {
      const verbatim = el.magnific ? ` [OUTPUT HANDLE VERBATIM AS: ${el.handle}]` : '';
      const desc = el.description ? ` — ${el.description}` : '';
      lines.push(`  ${el.handle} [${el.category}]${desc}${verbatim}`);
    }
  }

  if (onlyWhenCalled.length > 0) {
    lines.push('ELEMENTS DEFINED (do NOT incorporate unless called in description):');
    for (const el of onlyWhenCalled) {
      const desc = el.description ? ` — ${el.description}` : '';
      lines.push(`  ${el.handle} [${el.category}]${desc}`);
    }
  }

  return lines.join('\n');
}

/**
 * Main export: builds the complete system prompt string for Claude.
 */
export function buildSystemPrompt({
  modelId,
  mode,
  variables,
  fillGaps,
  elements,
  baseDescription,
  userNotes,
}) {
  const model = modelId ? getModel(modelId) : null;
  const dialectKey = model
    ? (getModel(modelId)?.dialectKey ?? 'master')
    : 'master';

  const dialect = getDialect(dialectKey);
  const blocks = dialect.blockStructure?.[mode] ?? dialect.blockStructure?.static ?? ['SUBJECT & SCENE', 'CINEMATOGRAPHY', 'MOOD & GRADE'];
  const isApproximate = model ? (getModel(modelId)?.approximate ?? false) : false;
  const modelIsAudioCapable = modelId ? isAudioCapable(modelId) : false;

  const varContext = buildVariableContext(variables, mode, fillGaps, dialectKey);
  const audioContext = modelIsAudioCapable ? buildAudioContext(variables, mode) : null;
  const elementsContext = buildElementsContext(elements, baseDescription);

  const approximateNote = isApproximate
    ? `\nNOTE: This model's prompt dialect is based on general best practices (limited official documentation available). Apply the master dialect structure with the specified model's known characteristics.\n`
    : '';

  const userNotesSection = userNotes?.trim()
    ? `\nUSER NOTES FOR THIS MODEL:\n${userNotes.trim()}\n`
    : '';

  // Audio section — only shown when model is audio-capable
  const audioSection = modelIsAudioCapable
    ? `\n─── AUDIO (model generates native audio) ───────────────────────────────────\n\n${audioContext ?? 'AUDIO DIRECTION: not set — generate contextually appropriate ambient audio for the scene'}\n`
    : '';

  const systemPrompt = `${dialect.systemPromptCore}
${approximateNote}
─── GENERATION CONTEXT ─────────────────────────────────────────────────────

MODE: ${mode.toUpperCase()}
${modelId ? `MODEL: ${modelId}` : 'MODEL: None selected (master dialect)'}

OUTPUT BLOCKS TO GENERATE:
${blocks.map((b, i) => `  ${i + 1}. ${b}`).join('\n')}

Format each block as:
[BLOCK NAME]
[content — 1–4 sentences depending on dialect rules above]

After all blocks, output exactly:
SUMMARY: [≤20 words — ${dialect.summaryInstruction}]

─── CINEMATIC VARIABLES ────────────────────────────────────────────────────

${fillGaps
  ? 'FILL MODE: Core variables marked [NOT SET] should be inferred from the base description and scene context. Make cinematographically coherent choices — do not default to safe/generic.'
  : 'OMIT MODE: Only incorporate variables explicitly listed below — do not invent values for unset variables.'
}

${varContext}
${audioSection}
─── @ELEMENTS ──────────────────────────────────────────────────────────────

${elementsContext ?? '(no @elements defined)'}

─── USER NOTES ─────────────────────────────────────────────────────────────
${userNotesSection || '(none)'}

─── CRITICAL OUTPUT RULES ──────────────────────────────────────────────────

1. Output ONLY the formatted prompt blocks + SUMMARY line. Nothing else.
2. No preamble, no explanation, no "Here is your prompt:", no markdown.
3. Block labels must match exactly: ${blocks.map(b => `[${b}]`).join(', ')}, then SUMMARY:
4. Do not invent cinematic variables not listed above (unless fill mode is active for core vars).
5. @elements with [OUTPUT HANDLE VERBATIM] must appear exactly as written (e.g. @handle).
6. The tone is professional cinematographer — technically precise, physically grounded, never generic.
7. Color palette hex values: translate to precise descriptive color language unless model is Flux.2 Pro (which accepts raw HEX).
8. High-speed FPS values (500fps+): describe as extreme time-stretch aesthetic — do not reference literal fps numbers in the output prompt.
9. Aspect ratio: incorporate naturally into the prompt's spatial and compositional language, not as a technical tag.
10. Emotional Register: this is a tonal instruction — let it inflect the entire prompt's language and atmosphere, not just one block.
`;

  return systemPrompt;
}
