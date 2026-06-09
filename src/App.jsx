import { useState, useEffect, useCallback } from 'react';
import './App.css';

import Header from './components/Header.jsx';
import VariablePanel from './components/VariablePanel.jsx';
import ElementsPanel from './components/ElementsPanel.jsx';
import OutputPanel from './components/OutputPanel.jsx';

import { buildSystemPrompt } from './lib/buildSystemPrompt.js';
import { buildUserMessage } from './lib/buildUserMessage.js';
import { getModel } from './lib/models.js';

// ── Default variable state (all null = unset) ──────────────
// v2: expanded with all new variables from the full restructure.
// localStorage key bumped to frame_session_v2 — old sessions won't partially break.
const DEFAULT_VARIABLES = {
  // ── CORE ────────────────────────────────────────────────
  shotFraming: null,
  aspectRatio: null,

  // SUBJECT sub-group (static only in UI — both modes in logic)
  subjectOrientation: null,
  subjectPosture: null,

  // LIGHTING sub-group
  lightQuality: null,
  lightDirection: null,
  lightDirectionSide: null,   // 'L' | 'R' | null — qualifier for directional options
  lightingSetup: null,
  lightSourceColor: null,     // renamed from colorTemperature

  // ATMOSPHERE sub-group
  atmosphericDensity: null,

  // Core remainder
  lensCharacter: null,        // multi-select → array or null
  colorGrade: null,           // multi-select → array or null
  cameraAngle: null,
  emotionalRegister: null,

  // ── VIDEO MOTION (video only) ────────────────────────────
  cameraMovement: null,
  operatorWeight: null,
  playbackFeel: null,         // renamed from motionSpeed
  slowMotionFPS: null,
  motionBlurVideo: null,      // slider 0–4, video mode placement
  lensBreathing: null,        // moved from lensQualities, video only
  subjectBehavior: null,      // multi-select → array or null
  secondaryMotion: null,      // multi-select → array or null
  audioDirection: null,       // model-gated: only for audioCapable models

  // ── ADVANCED ────────────────────────────────────────────
  focalLength: null,
  apertureFeel: null,
  sensorStock: null,
  compositionalIntent: null,  // renamed from framingStyle, multi-select
  lensQualities: null,        // multi-select, Breathing removed
  timeOfDay: null,
  shadowQuality: null,
  grainTexture: null,
  depthLayers: null,
  practicalLights: null,      // multi-select → array or null
  motionBlurStatic: null,     // slider 0–4, static mode placement

  // ── COLOR PALETTE (own section) ─────────────────────────
  // Stored as { primary: '#hex', active: ['#hex', '#hex', ...] } or null
  colorPalette: null,
};

// ── localStorage helpers ───────────────────────────────────
// v2: bumped key so old v1 sessions don't partially hydrate new state shape
const LS_KEY = 'frame_session_v2';

function loadSession() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveSession(state) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {
    // storage full or private mode — silently fail
  }
}

export default function App() {
  // ── State ──────────────────────────────────────────────────
  const [mode, setMode] = useState('static');
  const [modelId, setModelId] = useState(null);
  const [variables, setVariables] = useState({ ...DEFAULT_VARIABLES });
  const [baseDescription, setBaseDescription] = useState('');
  const [elements, setElements] = useState([]);
  const [fillGaps, setFillGaps] = useState(false);

  const [prompt, setPrompt] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ── Load session on mount ──────────────────────────────────
  useEffect(() => {
    const session = loadSession();
    if (!session) return;
    if (session.mode) setMode(session.mode);
    if (session.modelId !== undefined) setModelId(session.modelId);
    if (session.variables) setVariables({ ...DEFAULT_VARIABLES, ...session.variables });
    if (session.baseDescription) setBaseDescription(session.baseDescription);
    if (session.elements) setElements(session.elements);
    if (session.fillGaps !== undefined) setFillGaps(session.fillGaps);
    if (session.prompt) setPrompt(session.prompt);
    if (session.summary) setSummary(session.summary);
  }, []);

  // ── Persist session on state change ───────────────────────
  useEffect(() => {
    saveSession({ mode, modelId, variables, baseDescription, elements, fillGaps, prompt, summary });
  }, [mode, modelId, variables, baseDescription, elements, fillGaps, prompt, summary]);

  // ── Variable change handler ────────────────────────────────
  const handleVarChange = useCallback((key, value) => {
    setVariables((prev) => ({ ...prev, [key]: value }));
  }, []);

  // ── Mode switch: clear video-only variables when switching to static ──
  const handleModeChange = useCallback((newMode) => {
    setMode(newMode);
    if (newMode === 'static') {
      setVariables((prev) => ({
        ...prev,
        cameraMovement: null,
        operatorWeight: null,
        playbackFeel: null,
        slowMotionFPS: null,
        motionBlurVideo: null,
        lensBreathing: null,
        subjectBehavior: null,
        secondaryMotion: null,
        audioDirection: null,
      }));
    }
  }, []);

  // ── Generate prompt ────────────────────────────────────────
  async function generate() {
    if (!baseDescription.trim()) return;
    setLoading(true);
    setError(null);

    const model = modelId ? getModel(modelId) : null;

    try {
      const systemPrompt = buildSystemPrompt({
        modelId,
        mode,
        variables,
        fillGaps,
        elements,
        baseDescription,
        userNotes: model?.notes ?? '',
      });

      const userMessage = buildUserMessage({
        baseDescription,
        mode,
        modelId,
        modelLabel: model?.label ?? null,
      });

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemPrompt, userMessage }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }

      setPrompt(data.prompt ?? '');
      setSummary(data.summary ?? '');
    } catch (err) {
      setError(err.message ?? 'Generation failed. Check console for details.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <Header
        mode={mode}
        setMode={handleModeChange}
        modelId={modelId}
        setModelId={setModelId}
      />

      <main className="main">
        {/* Left: Elements sidebar */}
        <ElementsPanel
          elements={elements}
          setElements={setElements}
        />

        {/* Center: Variable panel */}
        <VariablePanel
          mode={mode}
          variables={variables}
          onChange={handleVarChange}
          baseDescription={baseDescription}
          onBaseDescChange={setBaseDescription}
          modelId={modelId}
        />

        {/* Right: Output panel */}
        <OutputPanel
          prompt={prompt}
          summary={summary}
          loading={loading}
          error={error}
          onGenerate={generate}
          onRegenerate={generate}
          fillGaps={fillGaps}
          setFillGaps={setFillGaps}
          modelId={modelId}
          baseDescription={baseDescription}
        />
      </main>
    </div>
  );
}
