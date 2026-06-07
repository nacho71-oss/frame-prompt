/**
 * Builds the user message sent to Claude.
 * The system prompt handles dialect + variable context.
 * This message is the creative input — base description is passed here directly.
 *
 * @param {object} params
 * @param {string} params.baseDescription — the user's raw creative description
 * @param {string} params.mode           — 'static' | 'video'
 * @param {string|null} params.modelId   — selected model id or null
 * @param {string} params.modelLabel     — display name of selected model
 */
export function buildUserMessage({ baseDescription, mode, modelId, modelLabel }) {
  const modeNote = mode === 'video' ? 'video generation' : 'image generation';
  const modelNote = modelLabel ? `for ${modelLabel}` : '(master dialect, no model specified)';

  return `Generate a cinematic AI prompt ${modelNote}.

BASE DESCRIPTION:
${baseDescription.trim()}

Generate the prompt now. Output only the formatted blocks and SUMMARY line — nothing else.`;
}
