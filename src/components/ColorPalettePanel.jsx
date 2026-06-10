import { useState, useEffect, useRef } from 'react';
import { getColorSuggestions, isValidHex } from '../lib/colorTheory.js';

const THEORY_GROUPS = [
  { key: 'complementary',      label: 'Comp' },
  { key: 'triadic',            label: 'Triadic' },
  { key: 'splitComplementary', label: 'Split' },
  { key: 'analogous',          label: 'Analog' },
  { key: 'monochromatic',      label: 'Mono' },
];

export default function ColorPalettePanel({ colorPalette, onChange }) {
  const primary = colorPalette?.primary ?? null;
  const active  = colorPalette?.active  ?? [];

  const pickerRef = useRef(null);

  // Local hex input state — tracks in-progress typing without committing invalid values
  const [localHex, setLocalHex] = useState(primary ?? '');
  const [hexFocused, setHexFocused] = useState(false);

  useEffect(() => {
    if (!hexFocused) setLocalHex(primary ?? '');
  }, [primary, hexFocused]);

  const suggestions = primary && isValidHex(primary) ? getColorSuggestions(primary) : {};

  function handlePickerChange(e) {
    const hex = e.target.value;
    onChange('colorPalette', { primary: hex, active: [] });
  }

  function handleHexChange(e) {
    const raw = e.target.value;
    setLocalHex(raw);
    const normalized = raw.startsWith('#') ? raw : `#${raw}`;
    if (isValidHex(normalized)) {
      onChange('colorPalette', { primary: normalized, active: [] });
    }
  }

  function handleHexBlur() {
    setHexFocused(false);
    if (!isValidHex(localHex.startsWith('#') ? localHex : `#${localHex}`)) {
      setLocalHex(primary ?? '');
    }
  }

  function toggleSuggestion(hex) {
    if (!primary) return;
    const next = active.includes(hex) ? active.filter((c) => c !== hex) : [...active, hex];
    onChange('colorPalette', { primary, active: next });
  }

  function removeActive(hex) {
    onChange('colorPalette', { primary, active: active.filter((c) => c !== hex) });
  }

  function clearPalette() {
    onChange('colorPalette', null);
  }

  return (
    <div className="color-palette-section">
      <div className="section-label">Color Palette</div>

      {/* Primary picker row */}
      <div className="cp-primary-row">
        <div className="cp-swatch-wrap">
          <button
            className={`cp-swatch-btn${primary ? '' : ' cp-swatch-empty'}`}
            style={primary ? { background: primary } : {}}
            onClick={() => pickerRef.current?.click()}
            title={primary ? 'Change color' : 'Pick primary color'}
          >
            {!primary && <span className="cp-swatch-plus">+</span>}
          </button>
          <input
            ref={pickerRef}
            type="color"
            className="cp-color-input-hidden"
            value={primary ?? '#c8b87a'}
            onChange={handlePickerChange}
          />
        </div>

        <input
          type="text"
          className={`cp-hex-input${!primary ? ' cp-hex-empty' : ''}`}
          value={localHex}
          placeholder="#rrggbb"
          maxLength={7}
          onChange={handleHexChange}
          onFocus={() => setHexFocused(true)}
          onBlur={handleHexBlur}
          spellCheck={false}
        />

        {primary && (
          <button className="var-reset" onClick={clearPalette} title="Clear palette">×</button>
        )}
      </div>

      {/* Theory suggestions */}
      {primary && (
        <div className="cp-suggestions">
          {THEORY_GROUPS.map(({ key, label }) => {
            const colors = suggestions[key] ?? [];
            if (!colors.length) return null;
            return (
              <div key={key} className="cp-theory-row">
                <span className="cp-theory-label">{label}</span>
                <div className="cp-swatch-row">
                  {colors.map((hex) => (
                    <button
                      key={hex}
                      className={`cp-swatch-sm${active.includes(hex) ? ' active' : ''}`}
                      style={{ background: hex }}
                      onClick={() => toggleSuggestion(hex)}
                      title={hex}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Active palette chips */}
      {primary && (
        <div className="cp-active-row">
          {/* Primary — always present, not individually removable */}
          <div className="cp-chip cp-chip-primary" title={primary}>
            <span className="cp-chip-dot" style={{ background: primary }} />
            <span className="cp-chip-hex">{primary}</span>
          </div>

          {active.map((hex) => (
            <div key={hex} className="cp-chip" title={hex}>
              <span className="cp-chip-dot" style={{ background: hex }} />
              <span className="cp-chip-hex">{hex}</span>
              <button className="var-reset" onClick={() => removeActive(hex)} title="Remove">×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
