import { STATIC_MODELS, VIDEO_MODELS, getModel } from '../lib/models.js';

export default function Header({ mode, setMode, modelId, setModelId }) {
  const models = mode === 'static' ? STATIC_MODELS : VIDEO_MODELS;
  const currentModel = modelId ? getModel(modelId) : null;
  const showApproxBadge = currentModel?.approximate;

  // When mode changes, reset model if it doesn't belong to the new mode
  function handleModeChange(newMode) {
    setMode(newMode);
    if (modelId) {
      const model = getModel(modelId);
      if (model && model.group !== newMode) {
        setModelId(null);
      }
    }
  }

  return (
    <header className="header">
      <div className="header-left">
        <div className="header-logo">
          fr<span>a</span>me
        </div>
        <div className="header-divider" />
        <div className="mode-toggle">
          <button
            className={`mode-toggle-btn${mode === 'static' ? ' active' : ''}`}
            onClick={() => handleModeChange('static')}
          >
            Static
          </button>
          <button
            className={`mode-toggle-btn${mode === 'video' ? ' active' : ''}`}
            onClick={() => handleModeChange('video')}
          >
            Video
          </button>
        </div>
      </div>

      <div className="header-center" />

      <div className="header-right">
        {showApproxBadge && (
          <div
            className="model-approx-badge"
            data-tooltip="Dialect based on general best practices — limited official docs"
          >
            ⚠ master dialect
          </div>
        )}

        <div className="model-selector-wrap">
          <select
            className="model-selector"
            value={modelId ?? ''}
            onChange={(e) => setModelId(e.target.value || null)}
          >
            <option value="">No model (master)</option>
            <optgroup label={mode === 'static' ? 'Static Models' : 'Video Models'}>
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>
    </header>
  );
}
