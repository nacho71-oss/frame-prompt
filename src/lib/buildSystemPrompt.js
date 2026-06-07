import { getDialect } from './dialects.js';
import { getModel, ALL_MODELS } from './models.js';

/**
 * Variable definitions — labels and option sets for each cinematic variable.
 * Used to render UI AND to format the system prompt context section.
 */
export const VARIABLE_DEFS = {
  // ── CORE (always visible) ─────────────────────────────────
  shotFraming: {
    label: 'Shot Framing',
    type: 'slider',
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
  lightQuality: {
    label: 'Light Quality',
    type: 'pills',
    options: ['Soft', 'Soft-Directional', 'Directional', 'Hard', 'Harsh'],
  },
  lensCharacter: {
    label: 'Lens Character',
    type: 'pills',
    options: ['Modern Clean', 'Vintage', 'Anamorphic', 'Swirly Bokeh', 'Heavy Bokeh'],
  },
  colorGrade: {
    label: 'Color Grade Feel',
    type: 'pills',
    options: ['Neutral', 'Warm', 'Cool', 'High Contrast', 'Bleach Bypass', 'Faded', 'Neon'],
  },
  cameraAngle: {
    label: 'Camera Angle',
    type: 'pills',
    options: [
      'Low to Ground',
      'Low',
      'Eye Level',
      'Slight High',
      'High',
      'Overhead',
      'POV',
    ],
  },

  // ── VIDEO ONLY (always visible when mode=video) ───────────
  cameraMovement: {
    label: 'Camera Movement',
    type: 'pills',
    videoOnly: true,
    options: [
      'Static',
      'Subtle Breathing',
      'Slow Push',
      'Pull',
      'Lateral Track',
      'Handheld',
      'Whip',
    ],
  },
  operatorWeight: {
    label: 'Operator Weight',
    type: 'pills',
    videoOnly: true,
    options: ['Locked Off', 'Stabilized', 'Shoulder', 'Heavy Handheld'],
  },
  motionSpeed: {
    label: 'Motion Speed',
    type: 'pills',
    videoOnly: true,
    options: ['Undercranked', 'Normal', 'Slightly Overcranked', 'Overcranked'],
  },

  // ── ADVANCED (accordion, collapsed by default) ────────────
  focalLength: {
    label: 'Focal Length Feel',
    type: 'slider',
    advanced: true,
    min: 0,
    max: 8,
    steps: [
      '8mm — extreme fisheye',
      '14mm — ultra wide',
      '24mm — wide environmental',
      '35mm — natural wide',
      '50mm — natural',
      '85mm — portrait compression',
      '135mm — telephoto flatness',
      '200mm — strong compression',
      '400mm+ — extreme compression',
    ],
  },
  apertureFeel: {
    label: 'Aperture Feel',
    type: 'pills',
    advanced: true,
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
    advanced: true,
    options: [
      'Digital Clean',
      'Digital Cinematic',
      '16mm',
      'Super 16',
      '35mm',
      '70mm',
      'IMAX',
    ],
  },
  colorTemperature: {
    label: 'Color Temperature',
    type: 'pills',
    advanced: true,
    options: [
      'Tungsten',
      'Warm',
      'Neutral Daylight',
      'Cool',
      'Blue Hour',
      'Mixed',
    ],
  },
  framingStyle: {
    label: 'Framing Style',
    type: 'pills',
    advanced: true,
    options: [
      'Rule of Thirds',
      'Centered Symmetric',
      'Minimalist',
      'Chaotic',
      'Negative Space',
    ],
  },
  lensQualities: {
    label: 'Lens Qualities',
    type: 'multiselect',
    advanced: true,
    options: [
      'Flare Prone',
      'Low Contrast',
      'Chromatic Aberration',
      'Vignette',
      'Breathing',
    ],
  },
  timeOfDay: {
    label: 'Time of Day',
    type: 'pills',
    advanced: true,
    options: [
      'Golden Hour',
      'Magic Hour',
      'Midday',
      'Overcast',
      'Blue Hour',
      'Night',
      'Interior Artificial',
    ],
  },
};

/**
 * Core variables (always eligible for Claude-fill when toggle is on)
 */
export const CORE_VAR_KEYS = [
  'shotFraming',
  'lightQuality',
  'lensCharacter',
  'colorGrade',
  'cameraAngle',
];

/**
 * Format a variable value for inclusion in the prompt context.
 * Slider variables resolve their step label. Multi-select joins with commas.
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
 * Builds the section of the system prompt that describes the cinematic variables.
 * If fillGaps=true, Claude is told to fill core vars even if unset.
 * If fillGaps=false, only explicitly set variables are included.
 */
function buildVariableContext(variables, mode, fillGaps) {
  const lines = [];

  const allKeys = Object.keys(VARIABLE_DEFS);

  for (const key of allKeys) {
    const def = VARIABLE_DEFS[key];
    if (def.videoOnly && mode !== 'video') continue;

    const rawValue = variables[key];
    const isSet = rawValue !== null && rawValue !== undefined;

    if (!isSet) {
      if (fillGaps && CORE_VAR_KEYS.includes(key)) {
        lines.push(`  ${def.label}: [NOT SET — infer a cinematographically coherent choice from the base description and other variables]`);
      }
      // if not fillGaps and not set, skip entirely
      continue;
    }

    const formatted = formatVarValue(key, rawValue, def);
    if (formatted) {
      lines.push(`  ${def.label}: ${formatted}`);
    }
  }

  return lines.length > 0 ? lines.join('\n') : '  (no variables set — interpret freely from the base description)';
}

/**
 * Formats @elements for inclusion in the system prompt.
 * Handles: always-include, only-when-called, magnific-verbatim, active/inactive.
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
 *
 * @param {object} params
 * @param {string} params.modelId       — selected model id (or null for master)
 * @param {string} params.mode          — 'static' | 'video'
 * @param {object} params.variables     — cinematic variable state from UI
 * @param {boolean} params.fillGaps     — whether to fill unset core vars
 * @param {Array}  params.elements      — @elements array
 * @param {string} params.baseDescription — user's base description text
 * @param {string} [params.userNotes]   — per-model notes from user
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
  const model = modelId ? { id: modelId } : null;
  const dialectKey = model
    ? (getModel(modelId)?.dialectKey ?? 'master')
    : 'master';

  const dialect = getDialect(dialectKey);
  const blocks = dialect.blockStructure?.[mode] ?? dialect.blockStructure?.static ?? ['SUBJECT & SCENE', 'CINEMATOGRAPHY', 'MOOD & GRADE'];
  const isApproximate = model ? (getModel(modelId)?.approximate ?? false) : false;

  const varContext = buildVariableContext(variables, mode, fillGaps);
  const elementsContext = buildElementsContext(elements, baseDescription);

  const approximateNote = isApproximate
    ? `\nNOTE: This model's prompt dialect is based on general best practices (limited official documentation available). Apply the master dialect structure with the specified model's known characteristics.\n`
    : '';

  const userNotesSection = userNotes?.trim()
    ? `\nUSER NOTES FOR THIS MODEL:\n${userNotes.trim()}\n`
    : '';

  const systemPrompt = `${dialect.systemPromptCore}
${approximateNote}
─── GENERATION CONTEXT ─────────────────────────────────────────

MODE: ${mode.toUpperCase()}
${modelId ? `MODEL: ${modelId}` : 'MODEL: None selected (master dialect)'}

OUTPUT BLOCKS TO GENERATE:
${blocks.map((b, i) => `  ${i + 1}. ${b}`).join('\n')}

Format each block as:
[BLOCK NAME]
[content — 1–4 sentences depending on dialect rules above]

After all blocks, output exactly:
SUMMARY: [≤20 words — ${dialect.summaryInstruction}]

─── CINEMATIC VARIABLES ────────────────────────────────────────

${fillGaps
  ? 'FILL MODE: Core variables marked [NOT SET] should be inferred from the base description.'
  : 'OMIT MODE: Only incorporate variables explicitly listed below — do not invent values for unset variables.'
}

${varContext}

─── @ELEMENTS ──────────────────────────────────────────────────

${elementsContext ?? '(no @elements defined)'}

─── USER NOTES ─────────────────────────────────────────────────
${userNotesSection || '(none)'}

─── CRITICAL OUTPUT RULES ──────────────────────────────────────

1. Output ONLY the formatted prompt blocks + SUMMARY line. Nothing else.
2. No preamble, no explanation, no "Here is your prompt:", no markdown.
3. Block labels must match exactly: ${blocks.map(b => `[${b}]`).join(', ')}, then SUMMARY:
4. Do not invent cinematic variables not listed above (unless fill mode is active for core vars).
5. @elements with [OUTPUT HANDLE VERBATIM] must appear exactly as written (e.g. @handle) in the generated prompt.
6. The tone is professional cinematographer — technically precise, physically grounded, never generic.
`;

  return systemPrompt;
}
