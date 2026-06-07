import { useState } from 'react';

const CATEGORIES = ['character', 'style', 'object', 'location'];

const DEFAULT_ELEMENT = {
  handle: '',
  category: 'character',
  description: '',
  alwaysInclude: false,
  magnific: false,
  active: true,
};

function ElementItem({ el, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ ...el });

  function toggleFlag(flag) {
    const updated = { ...el, [flag]: !el[flag] };
    onUpdate(updated);
  }

  function saveEdit() {
    if (!draft.handle.trim()) return;
    onUpdate({ ...draft });
    setEditing(false);
  }

  function cancelEdit() {
    setDraft({ ...el });
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="element-item" style={{ background: 'var(--bg-elevated)' }}>
        <div className="form-row">
          <input
            className="input handle"
            value={draft.handle}
            onChange={(e) => {
              let v = e.target.value;
              if (!v.startsWith('@')) v = '@' + v.replace('@', '');
              setDraft((d) => ({ ...d, handle: v }));
            }}
            placeholder="@handle"
          />
          <select
            className="select"
            value={draft.category}
            onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <textarea
          className="input textarea"
          value={draft.description}
          onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
          placeholder="Optional description for Claude..."
          rows={2}
        />
        <div className="element-actions">
          <button className="btn btn-primary btn-sm" onClick={saveEdit}>Save</button>
          <button className="btn btn-secondary btn-sm" onClick={cancelEdit}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`element-item${!el.active ? ' inactive' : ''}`}>
      <div className="element-meta" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span className="element-handle">{el.handle}</span>
          <span className="element-category">{el.category}</span>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
          <button className="btn-icon" onClick={() => setEditing(true)} title="Edit">
            ✎
          </button>
          <button
            className="btn-icon danger"
            onClick={() => onDelete(el.id)}
            title="Delete"
          >
            ✕
          </button>
        </div>
      </div>

      {el.description && (
        <div className="element-desc" title={el.description}>
          {el.description}
        </div>
      )}

      <div className="element-flags">
        <button
          className={`element-flag${el.active ? ' on' : ''}`}
          onClick={() => toggleFlag('active')}
          title={el.active ? 'Active — click to deactivate' : 'Inactive — click to activate'}
        >
          {el.active ? 'active' : 'inactive'}
        </button>
        <button
          className={`element-flag${el.alwaysInclude ? ' on' : ''}`}
          onClick={() => toggleFlag('alwaysInclude')}
          title="Always include this element regardless of whether @handle appears in description"
        >
          always include
        </button>
        <button
          className={`element-flag${el.magnific ? ' on' : ''}`}
          onClick={() => toggleFlag('magnific')}
          title="Output handle verbatim in prompt (e.g. for Magnific @handle references)"
        >
          verbatim
        </button>
      </div>
    </div>
  );
}

function AddElementForm({ onAdd }) {
  const [form, setForm] = useState({ ...DEFAULT_ELEMENT });
  const [open, setOpen] = useState(false);

  function handleAdd() {
    if (!form.handle.trim() || form.handle === '@') return;
    const handle = form.handle.startsWith('@') ? form.handle : '@' + form.handle;
    onAdd({
      ...form,
      handle,
      id: Date.now().toString(),
    });
    setForm({ ...DEFAULT_ELEMENT });
    setOpen(false);
  }

  if (!open) {
    return (
      <div style={{ padding: 'var(--space-3) var(--space-4)', borderTop: '1px solid var(--border-subtle)' }}>
        <button
          className="btn btn-secondary btn-sm w-full"
          style={{ width: '100%' }}
          onClick={() => setOpen(true)}
        >
          + Add Element
        </button>
      </div>
    );
  }

  return (
    <div className="add-element-form">
      <div className="section-label">New Element</div>
      <div className="form-row">
        <input
          className="input handle"
          value={form.handle}
          onChange={(e) => {
            let v = e.target.value;
            if (!v.startsWith('@')) v = '@' + v.replace('@', '');
            setForm((f) => ({ ...f, handle: v }));
          }}
          placeholder="@handle"
          autoFocus
        />
        <select
          className="select"
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <textarea
        className="input textarea"
        value={form.description}
        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        placeholder="Optional description for Claude (e.g. 'mid-30s detective, grey coat, weathered face')..."
        rows={2}
      />
      <div className="element-flags" style={{ marginTop: 0 }}>
        <button
          className={`element-flag${form.alwaysInclude ? ' on' : ''}`}
          onClick={() => setForm((f) => ({ ...f, alwaysInclude: !f.alwaysInclude }))}
        >
          always include
        </button>
        <button
          className={`element-flag${form.magnific ? ' on' : ''}`}
          onClick={() => setForm((f) => ({ ...f, magnific: !f.magnific }))}
        >
          verbatim
        </button>
      </div>
      <div className="element-actions">
        <button className="btn btn-primary btn-sm" onClick={handleAdd}>
          Add
        </button>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => { setForm({ ...DEFAULT_ELEMENT }); setOpen(false); }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function ElementsPanel({ elements, setElements }) {
  function handleAdd(el) {
    setElements((prev) => [...prev, el]);
  }

  function handleUpdate(updated) {
    setElements((prev) => prev.map((el) => el.id === updated.id ? updated : el));
  }

  function handleDelete(id) {
    setElements((prev) => prev.filter((el) => el.id !== id));
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">Elements</span>
        {elements.length > 0 && (
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
            {elements.filter((e) => e.active !== false).length} active
          </span>
        )}
      </div>

      <div className="panel-body">
        {elements.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-glyph">@</div>
            <div className="empty-state-title">No elements</div>
            <div className="empty-state-body">
              Add @handles for characters, styles, objects, and locations that Claude can reference.
            </div>
          </div>
        ) : (
          <div className="elements-list">
            {elements.map((el) => (
              <ElementItem
                key={el.id}
                el={el}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <AddElementForm onAdd={handleAdd} />
    </div>
  );
}
