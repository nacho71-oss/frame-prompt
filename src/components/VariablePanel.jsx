import { useState, useRef, useEffect } from 'react';
import { VARIABLE_DEFS, CORE_VAR_KEYS } from '../lib/buildSystemPrompt.js';
import { isAudioCapable } from '../lib/models.js';

// ── Kelvin gradient bar data ───────────────────────────────
// Maps each Light Source Color pill to a Kelvin position (0–1) on the gradient
const KELVIN_POSITIONS = {
  'Candlelight (1800K)':      0.00,
  'Tungsten (2700K)':         0.15,
  'Warm Daylight (4000K)':    0.32,
  'Neutral Daylight (5600K)': 0.52,
  'Overcast (6500K)':         0.68,
  'Shade / Blue Sky (8000K+)':0.85,
  'Mixed Sources':            null, // no position marker
};

/**
 * Kelvin gradient bar — interactive. Clicking snaps to the nearest pill value.
 * Also shows position marker for currently selected value.
 */
function KelvinBar({ selectedValue, onSelect }) {
  const position = selectedValue ? KELVIN_POSITIONS[selectedValue] : null;

  const clickableOptions = Object.entries(KELVIN_POSITIONS).filter(
    ([, pos]) => pos !== null
  );

  function handleClick(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickPct = (e.clientX - rect.left) / rect.width;
    let nearest = null;
    let nearestDist = Infinity;
    for (const [label, pos] of clickableOptions) {
      const dist = Math.abs(pos - clickPct);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = label;
      }
    }
    if (nearest) onSelect(nearest);
  }

  return (
    <div className="kelvin-bar-wrap">
      <div
        className="kelvin-bar kelvin-bar-interactive"
        onClick={handleClick}
        title="Click to select light source color"
      />
      {position !== null && position !== undefined && (
        <div
          className="kelvin-marker"
          style={{ left: `${position * 100}%` }}
        />
      )}
      <div className="kelvin-labels">
        <span>1800K</span>
        <span>5600K</span>
        <span>10000K</span>
      </div>
    </div>
  );
}

/**
 * Slider with null-state support.
 * When value is null: thumb is hollow/grey, positioned at center.
 * First interaction activates it.
 */
function SliderVar({ varKey, def, value, onChange }) {
  const isUnset = value === null || value === undefined;
  const displayIndex = isUnset ? Math.floor((def.steps.length - 1) / 2) : value;
  const pct = (displayIndex / (def.steps.length - 1)) * 100;
  const displayValue = isUnset ? null : def.steps[value];

  function handleChange(e) {
    onChange(varKey, Number(e.target.value));
  }

  function handleMouseDown() {
    if (isUnset) {
      onChange(varKey, Math.floor((def.steps.length - 1) / 2));
    }
  }

  return (
    <div className="var-row">
      <div className="var-label">
        <span className="var-name">{def.label}</span>
        <div className="var-label-right">
          <span className={`var-value${isUnset ? ' unset' : ''}`}>
            {displayValue ?? '—'}
          </span>
          {!isUnset && (
            <button
              className="var-reset"
              onClick={() => onChange(varKey, null)}
              title="Clear"
            >×</button>
          )}
        </div>
      </div>
      <div className="slider-wrap">
        {!isUnset && (
          <div
            className="slider-track-fill"
            style={{ width: `calc(${pct}% - ${pct * 0.12}px)` }}
          />
        )}
        <input
          type="range"
          className={`slider${isUnset ? ' slider-unset' : ''}`}
          min={def.min}
          max={def.max}
          value={displayIndex}
          onChange={handleChange}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
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
 * Pill selector — single select with reset.
 */
function PillVar({ varKey, def, value, onChange }) {
  return (
    <div className="var-row">
      <div className="var-label">
        <span className="var-name">{def.label}</span>
        <div className="var-label-right">
          <span className={`var-value${!value ? ' unset' : ''}`}>
            {value ?? '—'}
          </span>
          {value && (
            <button
              className="var-reset"
              onClick={() => onChange(varKey, null)}
              title="Clear"
            >×</button>
          )}
        </div>
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
 * Light Direction pill selector with conditional L/R qualifier.
 * When a side-qualifier option is selected, shows an inline L/R toggle.
 */
function LightDirectionVar({ variables, onChange }) {
  const def = VARIABLE_DEFS.lightDirection;
  const value = variables.lightDirection;
  const side = variables.lightDirectionSide;
  const needsSide = def.sideQualifierOptions?.includes(value);

  return (
    <div className="var-row">
      <div className="var-label">
        <span className="var-name">{def.label}</span>
        <div className="var-label-right">
          <span className={`var-value${!value ? ' unset' : ''}`}>
            {value
              ? needsSide && side
                ? `${value} (${side === 'L' ? 'Left' : 'Right'})`
                : value
              : '—'}
          </span>
          {value && (
            <button
              className="var-reset"
              onClick={() => { onChange('lightDirection', null); onChange('lightDirectionSide', null); }}
              title="Clear"
            >×</button>
          )}
        </div>
      </div>
      <div className="pill-group">
        {def.options.map((opt) => (
          <button
            key={opt}
            className={`pill${value === opt ? ' selected' : ''}`}
            onClick={() => {
              if (value === opt) {
                onChange('lightDirection', null);
                onChange('lightDirectionSide', null);
              } else {
                onChange('lightDirection', opt);
                onChange('lightDirectionSide', null);
              }
            }}
          >
            {opt}
          </button>
        ))}
      </div>
      {needsSide && (
        <div className="lr-qualifier">
          <span className="lr-label">Side:</span>
          <button
            className={`pill pill-sm${side === 'L' ? ' selected' : ''}`}
            onClick={() => onChange('lightDirectionSide', side === 'L' ? null : 'L')}
          >Left</button>
          <button
            className={`pill pill-sm${side === 'R' ? ' selected' : ''}`}
            onClick={() => onChange('lightDirectionSide', side === 'R' ? null : 'R')}
          >Right</button>
        </div>
      )}
    </div>
  );
}

/**
 * Light Source Color pill selector with Kelvin gradient bar below.
 */
function LightSourceColorVar({ variables, onChange }) {
  const def = VARIABLE_DEFS.lightSourceColor;
  const value = variables.lightSourceColor;

  return (
    <div className="var-row">
      <div className="var-label">
        <span className="var-name">{def.label}</span>
        <div className="var-label-right">
          <span className={`var-value${!value ? ' unset' : ''}`}>
            {value ?? '—'}
          </span>
          {value && (
            <button
              className="var-reset"
              onClick={() => onChange('lightSourceColor', null)}
              title="Clear"
            >×</button>
          )}
        </div>
      </div>
      <div className="pill-group">
        {def.options.map((opt) => (
          <button
            key={opt}
            className={`pill${value === opt ? ' selected' : ''}`}
            onClick={() => onChange('lightSourceColor', value === opt ? null : opt)}
          >
            {opt}
          </button>
        ))}
      </div>
      <KelvinBar selectedValue={value} onSelect={(v) => onChange('lightSourceColor', v === value ? null : v)} />
    </div>
  );
}

/**
 * Multiselect pill group with reset.
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
        <div className="var-label-right">
          <span className={`var-value${selected.length === 0 ? ' unset' : ''}`}>
            {selected.length > 0 ? selected.join(', ') : '—'}
          </span>
          {selected.length > 0 && (
            <button
              className="var-reset"
              onClick={() => onChange(varKey, null)}
              title="Clear"
            >×</button>
          )}
        </div>
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
 * Special cases (lightDirection, lightSourceColor) are handled in sub-groups directly.
 */
function VarControl({ varKey, def, value, onChange }) {
  if (def.type === 'slider') return <SliderVar varKey={varKey} def={def} value={value} onChange={onChange} />;
  if (def.type === 'multiselect') return <MultiSelectVar varKey={varKey} def={def} value={value} onChange={onChange} />;
  return <PillVar varKey={varKey} def={def} value={value} onChange={onChange} />;
}

/**
 * Sub-group header — lighter visual treatment than section headers.
 */
function SubGroupHeader({ label }) {
  return <div className="subgroup-header">{label}</div>;
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
 */
export default function VariablePanel({ mode, variables, onChange, baseDescription, onBaseDescChange, modelId }) {
  const audioCapable = isAudioCapable(modelId);

  // ── Variable filtering by section ─────────────────────────
  // Core section — non-subject, non-lighting, non-atmosphere, non-advanced, non-video
  const coreMainVars = Object.entries(VARIABLE_DEFS).filter(([, def]) =>
    !def.advanced &&
    !def.videoOnly &&
    !def.audioGated &&
    !['subject', 'lighting', 'atmosphere'].includes(def.section) &&
    def.section === 'core'
  );

  // Subject sub-group (static only)
  const subjectVars = Object.entries(VARIABLE_DEFS).filter(([, def]) =>
    def.section === 'subject'
  );

  // Lighting sub-group (lightDirection and lightSourceColor handled specially)
  const lightingVars = Object.entries(VARIABLE_DEFS).filter(([key, def]) =>
    def.section === 'lighting' &&
    key !== 'lightDirection' &&
    key !== 'lightSourceColor'
  );

  // Atmosphere sub-group
  const atmosphereVars = Object.entries(VARIABLE_DEFS).filter(([, def]) =>
    def.section === 'atmosphere'
  );

  // Video motion vars (excluding audioDirection which is gated separately)
  const motionVars = Object.entries(VARIABLE_DEFS).filter(([key, def]) =>
    def.videoOnly && !def.audioGated
  );

  // Advanced vars — split static/video blur for correct placement
  const advancedVars = Object.entries(VARIABLE_DEFS).filter(([key, def]) => {
    if (def.section !== 'advanced') return false;
    if (key === 'motionBlurStatic') return mode === 'static';
    if (key === 'motionBlurVideo') return false; // lives in motion section
    return true;
  });

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

        {/* ── CORE Section ─────────────────────────────────── */}
        <div className="section">
          <div className="section-label">Core</div>

          {/* Shot Framing + Aspect Ratio — top of core, no sub-group */}
          {coreMainVars
            .filter(([key]) => key === 'shotFraming' || key === 'aspectRatio')
            .map(([key, def]) => (
              <VarControl
                key={key}
                varKey={key}
                def={def}
                value={variables[key] ?? null}
                onChange={onChange}
              />
            ))
          }

          {/* SUBJECT sub-group — static only */}
          {mode === 'static' && (
            <div className="subgroup">
              <SubGroupHeader label="Subject" />
              {subjectVars.map(([key, def]) => (
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

          {/* LIGHTING sub-group */}
          <div className="subgroup">
            <SubGroupHeader label="Lighting" />
            {/* Light Quality — standard pill */}
            <VarControl
              varKey="lightQuality"
              def={VARIABLE_DEFS.lightQuality}
              value={variables.lightQuality ?? null}
              onChange={onChange}
            />
            {/* Light Direction — special component with L/R qualifier */}
            <LightDirectionVar variables={variables} onChange={onChange} />
            {/* Lighting Setup — standard pill */}
            <VarControl
              varKey="lightingSetup"
              def={VARIABLE_DEFS.lightingSetup}
              value={variables.lightingSetup ?? null}
              onChange={onChange}
            />
            {/* Light Source Color — special component with Kelvin bar */}
            <LightSourceColorVar variables={variables} onChange={onChange} />
          </div>

          {/* ATMOSPHERE sub-group */}
          <div className="subgroup">
            <SubGroupHeader label="Atmosphere" />
            {atmosphereVars.map(([key, def]) => (
              <VarControl
                key={key}
                varKey={key}
                def={def}
                value={variables[key] ?? null}
                onChange={onChange}
              />
            ))}
          </div>

          {/* Core remainder — Lens Character, Color Grade, Camera Angle, Emotional Register */}
          {coreMainVars
            .filter(([key]) => !['shotFraming', 'aspectRatio'].includes(key))
            .map(([key, def]) => (
              <VarControl
                key={key}
                varKey={key}
                def={def}
                value={variables[key] ?? null}
                onChange={onChange}
              />
            ))
          }
        </div>

        {/* ── MOTION Section (video only) ───────────────────── */}
        {mode === 'video' && (
          <div className="section">
            <div className="section-label">Motion</div>

            {motionVars.map(([key, def]) => (
              <VarControl
                key={key}
                varKey={key}
                def={def}
                value={variables[key] ?? null}
                onChange={onChange}
              />
            ))}

            {/* Motion Blur slider — video placement */}
            <VarControl
              varKey="motionBlurVideo"
              def={VARIABLE_DEFS.motionBlurVideo}
              value={variables.motionBlurVideo ?? null}
              onChange={onChange}
            />

            {/* Audio Direction — only when model is audio-capable */}
            {audioCapable && (
              <VarControl
                varKey="audioDirection"
                def={VARIABLE_DEFS.audioDirection}
                value={variables.audioDirection ?? null}
                onChange={onChange}
              />
            )}
          </div>
        )}

        {/* ── ADVANCED Accordion ───────────────────────────── */}
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
