import { useState } from 'react';
import { getModel } from '../lib/models.js';

export default function OutputPanel({
  prompt,
  summary,
  loading,
  error,
  onGenerate,
  onRegenerate,
  fillGaps,
  setFillGaps,
  modelId,
  baseDescription,
}) {
  const [copied, setCopied] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const canGenerate = baseDescription.trim().length > 0;
  const currentModel = modelId ? getModel(modelId) : null;

  async function handleCopy() {
    if (!prompt) return;
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  async function handleCopySummary() {
    if (!summary) return;
    await navigator.clipboard.writeText(summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 1800);
  }

  return (
    <div className="panel output-panel">
      {/* Summary bar */}
      <div className={`output-summary${!summary ? ' empty' : ''}`}>
        {summary ? (
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
            <span>{summary}</span>
            <button
              className="btn-icon"
              onClick={handleCopySummary}
              style={{ flexShrink: 0, marginTop: -1 }}
              title="Copy summary"
            >
              {copiedSummary ? '✓' : '⎘'}
            </button>
          </div>
        ) : (
          <span>Summary will appear here after generation</span>
        )}
      </div>

      {/* Prompt output area */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
        {loading ? (
          <div className="loading-indicator">
            <div className="loading-dots">
              <div className="loading-dot" />
              <div className="loading-dot" />
              <div className="loading-dot" />
            </div>
            <span>Generating{currentModel ? ` for ${currentModel.label}` : ''}…</span>
          </div>
        ) : error ? (
          <div className="error-msg">{error}</div>
        ) : (
          <textarea
            className="output-textarea"
            readOnly
            value={prompt}
            placeholder={
              canGenerate
                ? 'Hit Generate to build your cinematic prompt.'
                : 'Write a base description in the Variables panel to get started.'
            }
          />
        )}
      </div>

      {/* Actions bar */}
      <div className="output-actions">
        <div className="output-actions-left">
          <label className="output-fill-toggle" title="Let Claude fill in core cinematic variables even if you haven't set them">
            <div
              className={`toggle-switch${fillGaps ? ' on' : ''}`}
              onClick={() => setFillGaps((v) => !v)}
            />
            <span className="toggle-label">Fill gaps</span>
          </label>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          {prompt && (
            <>
              <button
                className="btn btn-secondary btn-sm"
                onClick={handleCopy}
                disabled={!prompt}
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={onRegenerate}
                disabled={loading || !canGenerate}
              >
                ↻ Regen
              </button>
            </>
          )}
          <button
            className="btn btn-primary btn-sm"
            onClick={onGenerate}
            disabled={loading || !canGenerate}
          >
            {loading ? '…' : prompt ? 'Generate' : 'Generate'}
          </button>
        </div>
      </div>
    </div>
  );
}
