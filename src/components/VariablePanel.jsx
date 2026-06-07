import { useState, useRef, useEffect } from 'react';
import { VARIABLE_DEFS, CORE_VAR_KEYS } from '../lib/buildSystemPrompt.js';

/**
 * Slider control with fill track and endpoint labels.
 */
function SliderVar({ varKey, def, value, onChange }) {
  const pct = value === null ? 0 : (value / (def.steps.length - 1)) * 100;
  const displayValue = value !== null ? def.steps[value] : null;

  return (
    <div className="var-row">
      <div className="var-label">
        <span className="var-name">{def.label}</span>
        <span className={`var-value${value === null ? ' unset' : ''}`}>
          {displayValue ?? '—'}
        </span>
      </div>
      <div className="slider-wrap">
        <div
          className="slider-track-fill"
          style={{ width: `calc(${pct}% - ${pct * 0.12}px)` }}
        />
        <input
          type="range"
          className="slider"
          min={def.min}
          max={def.max}
          value={value ?? 0}
          onChange={(e) => onChange(varKey, Number(e.target.value))}
          onMouseDown={() => { if (value === null) onChange(varKey, 0); }}
        />
        <div className="slider-endpoints">
          <span className="slider-endpoint">{def.steps[0]}</span>
          <span className="slider-endpoint">{def.steps[def.steps.length - 1]}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Pill selector — single select.
 */
function PillVar({ varKey, def, value, onChange }) {
  return (
    <div className="var-row">
      <div className="var-label">
        <span className="var-name">{def.label}</span>
        <span className={`var-value${!value ? ' unset' : ''}`}>
          {value ?? '—'}
        </span>
      </div>
      <div className="pill-group">
        {def.options.map((opt) => (
          <button
            key={opt}
            className={`pill${value === opt ? ' selected' : ''}`}
            onClick={() => onChange(varKey, value === opt ? null : opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Multiselect pill group.
 */
function MultiSelectVar({ varKey, def, value, onChange }) {
  const selected = value ?? [];
  const toggle = (opt) => {
    const next = selected.includes(opt)
      ? selected.filter((v) => v !== opt)
      : [...selected, opt];
    onChange(varKey, next.length > 0 ? next : null);
  };

  return (
    <div className="var-row">
      <div className="var-label">
        <span className="var-name">{def.label}</span>
        <span className={`var-value${selected.length === 0 ? ' unset' : ''}`}>
          {selected.length > 0 ? selected.join(', ') : '—'}
        </span>
      </div>
      <div className="pill-group">
        {def.options.map((opt) => (
          <button
            key={opt}
            className={`pill${selected.includes(opt) ? ' selected' : ''}`}
            onClick={() => toggle(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Render a single variable based on its type.
 */
function VarControl({ varKey, def, value, onChange }) {
  if (def.type === 'slider') return <SliderVar varKey={varKey} def={def} value={value} onChange={onChange} />;
  if (def.type === 'multiselect') return <MultiSelectVar varKey={varKey} def={def} value={value} onChange={onChange} />;
  return <PillVar varKey={varKey} def={def} value={value} onChange={onChange} />;
}

/**
 * Collapsible accordion for advanced variables.
 */
function Accordion({ label, children }) {
  const [open, setOpen] = useState(false);
  const bodyRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (bodyRef.current) {
      setHeight(open ? bodyRef.current.scrollHeight : 0);
    }
  }, [open, children]);

  return (
    <div className="accordion">
      <button className="accordion-trigger" onClick={() => setOpen((o) => !o)}>
        <span>{label}</span>
        <span className={`accordion-arrow${open ? ' open' : ''}`}>↓</span>
      </button>
      <div
        className="accordion-body"
        style={{ height: `${height}px`, overflow: 'hidden', transition: 'height 350ms ease' }}
      >
        <div ref={bodyRef}>
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Main VariablePanel component.
 * Shows core vars always, video vars when mode=video, advanced in accordion.
 */
export default function VariablePanel({ mode, variables, onChange, baseDescription, onBaseDescChange }) {
  const coreVars = Object.entries(VARIABLE_DEFS).filter(
    ([, def]) => !def.advanced && !def.videoOnly
  );
  const videoVars = Object.entries(VARIABLE_DEFS).filter(
    ([, def]) => def.videoOnly
  );
  const advancedVars = Object.entries(VARIABLE_DEFS).filter(
    ([, def]) => def.advanced
  );

  const setVarCount = Object.values(variables).filter(
    (v) => v !== null && v !== undefined && !(Array.isArray(v) && v.length === 0)
  ).length;

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">Variables</span>
        {setVarCount > 0 && (
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-primary)' }}>
            {setVarCount} set
          </span>
        )}
      </div>

      <div className="panel-body">
        {/* Base Description */}
        <div className="base-desc-section">
          <div className="section-label">Base Description</div>
          <textarea
            className="base-desc-textarea"
            placeholder="Describe the shot, scene, or subject. Use @handle to invoke elements."
            value={baseDescription}
            onChange={(e) => onBaseDescChange(e.target.value)}
            rows={4}
          />
        </div>

        {/* Core Variables */}
        <div className="section">
          <div className="section-label">Core</div>
          {coreVars.map(([key, def]) => (
            <VarControl
              key={key}
              varKey={key}
              def={def}
              value={variables[key] ?? null}
              onChange={onChange}
            />
          ))}
        </div>

        {/* Video-only Variables */}
        {mode === 'video' && (
          <div className="section">
            <div className="section-label">Motion</div>
            {videoVars.map(([key, def]) => (
              <VarControl
                key={key}
                varKey={key}
                def={def}
                value={variables[key] ?? null}
                onChange={onChange}
              />
            ))}
          </div>
        )}

        {/* Advanced Variables */}
        <Accordion label="Advanced">
          <div className="section" style={{ borderBottom: 'none' }}>
            {advancedVars.map(([key, def]) => (
              <VarControl
                key={key}
                varKey={key}
                def={def}
                value={variables[key] ?? null}
                onChange={onChange}
              />
            ))}
          </div>
        </Accordion>
      </div>
    </div>
  );
}
