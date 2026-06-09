import { useState, useRef, useEffect } from 'react';
import { VARIABLE_DEFS, CORE_VAR_KEYS } from '../lib/buildSystemPrompt.js';
import { isAudioCapable } from '../lib/models.js';

const KELVIN_POSITIONS = {
  'Candlelight (1800K)':       0.00,
  'Tungsten (2700K)':          0.15,
  'Warm Daylight (4000K)':     0.32,
  'Neutral Daylight (5600K)':  0.52,
  'Overcast (6500K)':          0.68,
  'Shade / Blue Sky (8000K+)': 0.85,
  'Mixed Sources':             null,
};

function KelvinBar({ selectedValue, onSelect }) {
  const position = selectedValue ? KELVIN_POSITIONS[selectedValue] : null;
  const clickableOptions = Object.entries(KELVIN_POSITIONS).filter(([, pos]) => pos !== null);

  function handleClick(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickPct = (e.clientX - rect.left) / rect.width;
    let nearest = null;
    let nearestDist = Infinity;
    for (const [label, pos] of clickableOptions) {
      const dist = Math.abs(pos - clickPct);
      if (dist < nearestDist) { nearestDist = dist; nearest = label; }
    }
    if (nearest) onSelect(nearest);
  }

  return (
    <div className="kelvin-bar-wrap">
      <div className="kelvin-bar kelvin-bar-interactive" onClick={handleClick} title="Click to select light source color" />
      {position !== null && position !== undefined && (
        <div className="kelvin-marker" style={{ left: `${position * 100}%` }} />
      )}
      <div className="kelvin-labels">
        <span>1800K</span>
        <span>5600K</span>
        <span>10000K</span>
      </div>
    </div>
  );
}

function SliderVar({ varKey, def, value, onChange }) {
  const isUnset = value === null || value === undefined;
  const displayIndex = isUnset ? Math.floor((def.steps.length - 1) / 2) : value;
  const pct = (displayIndex / (def.steps.length - 1)) * 100;
  const displayValue = isUnset ? null : def.steps[value];

  return (
    <div className="var-row">
      <div className="var-label">
        <span className="var-name">{def.label}</span>
        <div className="var-label-right">
          <span className={`var-value${isUnset ? ' unset' : ''}`}>{displayValue ?? '—'}</span>
          {!isUnset && <button className="var-reset" onClick={() => onChange(varKey, null)} title="Clear">×</button>}
        </div>
      </div>
      <div className="slider-wrap">
        {!isUnset && <div className="slider-track-fill" style={{ width: `calc(${pct}% - ${pct * 0.12}px)` }} />}
        <input
          type="range"
          className={`slider${isUnset ? ' slider-unset' : ''}`}
          min={def.min}
          max={def.max}
          value={displayIndex}
          onChange={(e) => onChange(varKey, Number(e.target.value))}
          onMouseDown={() => { if (isUnset) onChange(varKey, Math.floor((def.steps.length - 1) / 2)); }}
          onTouchStart={() => { if (isUnset) onChange(varKey, Math.floor((def.steps.length - 1) / 2)); }}
        />
        <div className="slider-endpoints">
          <span className="slider-endpoint">{def.steps[0]}</span>
          <span className="slider-endpoint">{def.steps[def.steps.length - 1]}</span>
        </div>
      </div>
    </div>
  );
}

function PillVar({ varKey, def, value, onChange }) {
  return (
    <div className="var-row">
      <div className="var-label">
        <span className="var-name">{def.label}</span>
        <div className="var-label-right">
          <span className={`var-value${!value ? ' unset' : ''}`}>{value ?? '—'}</span>
          {value && <button className="var-reset" onClick={() => onChange(varKey, null)} title="Clear">×</button>}
        </div>
      </div>
      <div className="pill-group">
        {def.options.map((opt) => (
          <button key={opt} className={`pill${value === opt ? ' selected' : ''}`} onClick={() => onChange(varKey, value === opt ? null : opt)}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

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
            {value ? (needsSide && side ? `${value} (${side === 'L' ? 'Left' : 'Right'})` : value) : '—'}
          </span>
          {value && (
            <button className="var-reset" onClick={() => { onChange('lightDirection', null); onChange('lightDirectionSide', null); }} title="Clear">×</button>
          )}
        </div>
      </div>
      <div className="pill-group">
        {def.options.map((opt) => (
          <button key={opt} className={`pill${value === opt ? ' selected' : ''}`}
            onClick={() => {
              if (value === opt) { onChange('lightDirection', null); onChange('lightDirectionSide', null); }
              else { onChange('lightDirection', opt); onChange('lightDirectionSide', null); }
            }}>
            {opt}
          </button>
        ))}
      </div>
      {needsSide && (
        <div className="lr-qualifier">
          <span className="lr-label">Side:</span>
          <button className={`pill pill-sm${side === 'L' ? ' selected' : ''}`} onClick={() => onChange('lightDirectionSide', side === 'L' ? null : 'L')}>Left</button>
          <button className={`pill pill-sm${side === 'R' ? ' selected' : ''}`} onClick={() => onChange('lightDirectionSide', side === 'R' ? null : 'R')}>Right</button>
        </div>
      )}
    </div>
  );
}

function LightSourceColorVar({ variables, onChange }) {
  const def = VARIABLE_DEFS.lightSourceColor;
  const value = variables.lightSourceColor;

  return (
    <div className="var-row">
      <div className="var-label">
        <span className="var-name">{def.label}</span>
        <div className="var-label-right">
          <span className={`var-value${!value ? ' unset' : ''}`}>{value ?? '—'}</span>
          {value && <button className="var-reset" onClick={() => onChange('lightSourceColor', null)} title="Clear">×</button>}
        </div>
      </div>
      <div className="pill-group">
        {def.options.map((opt) => (
          <button key={opt} className={`pill${value === opt ? ' selected' : ''}`} onClick={() => onChange('lightSourceColor', value === opt ? null : opt)}>
            {opt}
          </button>
        ))}
      </div>
      <KelvinBar selectedValue={value} onSelect={(v) => onChange('lightSourceColor', v === value ? null : v)} />
    </div>
  );
}

function MultiSelectVar({ varKey, def, value, onChange }) {
  const selected = value ?? [];
  const toggle = (opt) => {
    const next = selected.includes(opt) ? selected.filter((v) => v !== opt) : [...selected, opt];
    onChange(varKey, next.length > 0 ? next : null);
  };

  return (
    <div className="var-row">
      <div className="var-label">
        <span className="var-name">{def.label}</span>
        <div className="var-label-right">
          <span className={`var-value${selected.length === 0 ? ' unset' : ''}`}>{selected.length > 0 ? selected.join(', ') : '—'}</span>
          {selected.length > 0 && <button className="var-reset" onClick={() => onChange(varKey, null)} title="Clear">×</button>}
        </div>
      </div>
      <div className="pill-group">
        {def.options.map((opt) => (
          <button key={opt} className={`pill${selected.includes(opt) ? ' selected' : ''}`} onClick={() => toggle(opt)}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function VarControl({ varKey, def, value, onChange }) {
  if (def.type === 'slider') return <SliderVar varKey={varKey} def={def} value={value} onChange={onChange} />;
  if (def.type === 'multiselect') return <MultiSelectVar varKey={varKey} def={def} value={value} onChange={onChange} />;
  return <PillVar varKey={varKey} def={def} value={value} onChange={onChange} />;
}

function SubGroupHeader({ label }) {
  return <div className="subgroup-header">{label}</div>;
}

function Accordion({ label, children }) {
  const [open, setOpen] = useState(false);
  const bodyRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (bodyRef.current) setHeight(open ? bodyRef.current.scrollHeight : 0);
  }, [open, children]);

  return (
    <div className="accordion">
      <button className="accordion-trigger" onClick={() => setOpen((o) => !o)}>
        <span>{label}</span>
        <span className={`accordion-arrow${open ? ' open' : ''}`}>↓</span>
      </button>
      <div className="accordion-body" style={{ height: `${height}px`, overflow: 'hidden', transition: 'height 350ms ease' }}>
        <div ref={bodyRef}>{children}</div>
      </div>
    </div>
  );
}

export default function VariablePanel({ mode, variables, onChange, baseDescription, onBaseDescChange, modelId }) {
  const audioCapable = isAudioCapable(modelId);

  const coreMainVars = Object.entries(VARIABLE_DEFS).filter(([, def]) =>
    def.section === 'core' && !def.videoOnly && !def.audioGated
  );

  const subjectVars = Object.entries(VARIABLE_DEFS).filter(([, def]) =>
    def.section === 'subject'
  );

  const atmosphereVars = Object.entries(VARIABLE_DEFS).filter(([, def]) =>
    def.section === 'atmosphere'
  );

  const motionVars = Object.entries(VARIABLE_DEFS).filter(([key, def]) =>
    def.section === 'motion' && def.videoOnly && !def.audioGated && key !== 'motionBlurVideo'
  );

  const advancedVars = Object.entries(VARIABLE_DEFS).filter(([key, def]) => {
    if (def.section !== 'advanced') return false;
    if (key === 'motionBlurStatic') return mode === 'static';
    if (key === 'motionBlurVideo') return false;
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
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-primary)' }}>{setVarCount} set</span>
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

        {/* ── CORE ─────────────────────────────────────────── */}
        <div className="section">
          <div className="section-label">Core</div>

          {coreMainVars
            .filter(([key]) => key === 'shotFraming' || key === 'aspectRatio')
            .map(([key, def]) => (
              <VarControl key={key} varKey={key} def={def} value={variables[key] ?? null} onChange={onChange} />
            ))
          }

          {mode === 'static' && (
            <div className="subgroup">
              <SubGroupHeader label="Subject" />
              {subjectVars.map(([key, def]) => (
                <VarControl key={key} varKey={key} def={def} value={variables[key] ?? null} onChange={onChange} />
              ))}
            </div>
          )}

          <div className="subgroup">
            <SubGroupHeader label="Lighting" />
            <VarControl varKey="lightQuality" def={VARIABLE_DEFS.lightQuality} value={variables.lightQuality ?? null} onChange={onChange} />
            <LightDirectionVar variables={variables} onChange={onChange} />
            <VarControl varKey="lightingSetup" def={VARIABLE_DEFS.lightingSetup} value={variables.lightingSetup ?? null} onChange={onChange} />
            <LightSourceColorVar variables={variables} onChange={onChange} />
          </div>

          <div className="subgroup">
            <SubGroupHeader label="Atmosphere" />
            {atmosphereVars.map(([key, def]) => (
              <VarControl key={key} varKey={key} def={def} value={variables[key] ?? null} onChange={onChange} />
            ))}
          </div>

          {coreMainVars
            .filter(([key]) => !['shotFraming', 'aspectRatio'].includes(key))
            .map(([key, def]) => (
              <VarControl key={key} varKey={key} def={def} value={variables[key] ?? null} onChange={onChange} />
            ))
          }
        </div>

        {/* ── MOTION (video only) ───────────────────────────── */}
        {mode === 'video' && (
          <div className="section">
            <div className="section-label">Motion</div>

            {motionVars.map(([key, def]) => (
              <VarControl key={key} varKey={key} def={def} value={variables[key] ?? null} onChange={onChange} />
            ))}

            <VarControl varKey="motionBlurVideo" def={VARIABLE_DEFS.motionBlurVideo} value={variables.motionBlurVideo ?? null} onChange={onChange} />

            {audioCapable && (
              <VarControl varKey="audioDirection" def={VARIABLE_DEFS.audioDirection} value={variables.audioDirection ?? null} onChange={onChange} />
            )}
          </div>
        )}

        {/* ── ADVANCED ─────────────────────────────────────── */}
        <Accordion label="Advanced">
          <div className="section" style={{ borderBottom: 'none' }}>
            {advancedVars.map(([key, def]) => (
              <VarControl key={key} varKey={key} def={def} value={variables[key] ?? null} onChange={onChange} />
            ))}
          </div>
        </Accordion>

      </div>
    </div>
  );
}
