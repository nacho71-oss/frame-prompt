/**
 * Builds the user message sent to Claude.
 * The system prompt handles dialect + variable context.
 * This message is the creative input — base description + mode context.
 *
 * @param {object} params
 * @param {string} params.baseDescription — the user's raw creative description
 * @param {string} params.mode           — 'static' | 'video'
 * @param {string|null} params.modelId   — selected model id or null
 * @param {string} params.modelLabel     — display name of selected model
 */
export function buildUserMessage({ baseDescription, mode, modelId, modelLabel }) {
  const modeLabel = mode === 'video' ? 'AI VIDEO generation' : 'AI IMAGE (static) generation';
  const modelNote = modelLabel ? `for ${modelLabel}` : '(master dialect — no specific model selected)';

  // Mode-specific reminder reinforces to Claude which prompt language register to use.
  // Video prompts need motion, timing, and temporal language.
  // Static prompts need spatial, compositional, and photographic language.
  const modeReminder = mode === 'video'
    ? 'This is a VIDEO prompt — include motion behavior, temporal pacing, and camera movement language appropriate to the dialect.'
    : 'This is a STATIC IMAGE prompt — focus on spatial composition, photographic precision, and frame-level detail. No motion language unless describing implied motion.';

  return `Generate a cinematic ${modeLabel} prompt ${modelNote}.

${modeReminder}

BASE DESCRIPTION:
${baseDescription.trim()}

Generate the prompt now. Output only the formatted blocks and SUMMARY line — nothing else.`;
}
