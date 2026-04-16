<script setup>
import { computed, ref } from 'vue'

import { sampleEntries } from '../data/sampleEntries'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['mounted'])

const pastedJson = ref(JSON.stringify(sampleEntries, null, 2))
const parseError = ref('')
const successMessage = ref('')
const isReadingFile = ref(false)

const exampleJson = JSON.stringify(sampleEntries, null, 2)

const isBusy = computed(() => props.loading || isReadingFile.value)

const validatePayload = (payload) => {
  if (!Array.isArray(payload)) {
    throw new Error('JSON must be an array of entries.')
  }
  payload.forEach((entry, index) => {
    if (typeof entry !== 'object' || entry === null) {
      throw new Error(`Entry #${index + 1} is not an object.`)
    }
    if (typeof entry.title !== 'string' || !entry.title.trim()) {
      throw new Error(`Entry #${index + 1} is missing a title.`)
    }
    if (typeof entry.content !== 'string' || !entry.content.trim()) {
      console.log("MISSING CONTENT", entry.title)
      throw new Error(`Entry #${index + 1} is missing content.`)
    }
    if (typeof entry.time !== 'string' || !entry.time.trim()) {
      throw new Error(`Entry #${index + 1} is missing a time value.`)
    }
  })
  return payload
}

const mountPayload = (payload) => {
  emit('mounted', payload)
  parseError.value = ''
  successMessage.value = 'JSON mounted successfully. You can now browse the archive.'
}

const handleFileChange = (event) => {
  const file = event.target.files?.[0]
  if (!file || isBusy.value) {
    return
  }
  isReadingFile.value = true
  parseError.value = ''
  successMessage.value = ''

  const reader = new FileReader()
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result ?? '[]')
      const payload = validatePayload(parsed)
      pastedJson.value = JSON.stringify(payload, null, 2)
      mountPayload(payload)
    } catch (err) {
      parseError.value = err instanceof Error ? err.message : 'Unable to parse the selected file.'
    } finally {
      isReadingFile.value = false
    }
  }
  reader.onerror = () => {
    parseError.value = 'Unable to read the selected file.'
    isReadingFile.value = false
  }
  reader.readAsText(file)
}

const handleMountClick = () => {
  if (isBusy.value) {
    return
  }
  parseError.value = ''
  successMessage.value = ''
  if (!pastedJson.value.trim()) {
    parseError.value = 'Paste JSON or select a file first.'
    return
  }
  try {
    const payload = validatePayload(JSON.parse(pastedJson.value))
    mountPayload(payload)
  } catch (err) {
    parseError.value = err instanceof Error ? err.message : 'Unable to parse the provided JSON.'
  }
}

const handleUseExample = () => {
  pastedJson.value = exampleJson
  parseError.value = ''
  successMessage.value = ''
}
</script>

<template>
  <section class="mount-panel" aria-live="polite">
    <header class="mount-panel__header">
      <p class="eyebrow">Bring your memories</p>
    </header>

    <div class="mount-panel__grid">
      <div class="mount-panel__card">
        <p class="mount-panel__card-title">Upload JSON</p>
        <label class="file-upload" :class="{ 'file-upload--disabled': isBusy }">
          <input
            type="file"
            accept="application/json,.json"
            @change="handleFileChange"
            :disabled="isBusy"
          />
          <span>Choose file</span>
        </label>

        <div class="divider">
          <span>or</span>
        </div>

        <textarea
          v-model="pastedJson"
          class="json-input"
          rows="10"
          placeholder="Paste your JSON array here..."
          :disabled="isBusy"
        ></textarea>

        <div class="mount-panel__actions">
          <button type="button" class="secondary" @click="handleUseExample" :disabled="isBusy">
            Load example JSON
          </button>
          <button type="button" class="primary" @click="handleMountClick" :disabled="isBusy">
            Mount JSON
          </button>
        </div>

        <p v-if="parseError" class="state state--error">{{ parseError }}</p>
        <p v-else-if="successMessage" class="state state--success">{{ successMessage }}</p>
        <p v-else-if="props.error" class="state state--error">{{ props.error }}</p>
      </div>

      <div class="mount-panel__card">
        <p class="mount-panel__card-title">Example structure</p>
        <p class="mount-panel__hint">
          Each entry should include <code>title</code>, <code>content</code>, <code>time</code>, and
          optional <code>tags</code>.
        </p>
        <pre class="example-json"><code>{{ exampleJson }}</code></pre>
      </div>
    </div>
  </section>
</template>

<style scoped>
.mount-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: clamp(1.5rem, 1.2rem + 1.8vw, 2.5rem);
  border-radius: 4px;
  border: 1px solid var(--border);
  background: #FFFFFF;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.mount-panel__header {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.mount-panel__header h2 {
  font-size: clamp(1.45rem, 1.2rem + 1vw, 1.9rem);
  font-weight: 600;
  margin: 0;
  font-family: 'Newsreader', serif;
  color: var(--text);
}

.mount-panel__header p {
  margin: 0;
  color: var(--text-soft);
}

.mount-panel__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
}

.mount-panel__card {
  border-radius: 4px;
  border: 1px solid var(--border);
  background: #FDFAF5;
  padding: clamp(1rem, 0.9rem + 1vw, 1.75rem);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.mount-panel__card-title {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0;
  font-family: 'Newsreader', serif;
  color: var(--text);
}

.file-upload {
  position: relative;
  overflow: hidden;
  width: fit-content;
  border-radius: 4px;
  border: 1px dashed var(--border-strong);
  background: transparent;
  cursor: pointer;
  transition: border-color 160ms ease, background 160ms ease;
}

.file-upload:hover {
  border-color: var(--accent);
  background: var(--accent-soft);
}

.file-upload input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.file-upload span {
  display: inline-block;
  padding: 0.5rem 1.25rem;
  font-size: 0.85rem;
  color: var(--text-soft);
}

.file-upload--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.divider {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-muted);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-family: 'DM Sans', sans-serif;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border);
}

.json-input {
  width: 100%;
  border-radius: 4px;
  border: 1px solid var(--border);
  background: #FFFFFF;
  color: var(--text);
  padding: 0.85rem 1rem;
  font-family: 'JetBrains Mono', 'SFMono-Regular', Consolas, Menlo, monospace;
  font-size: 0.82rem;
  resize: vertical;
  transition: border-color 160ms ease;
}

.json-input::placeholder {
  color: var(--text-muted);
}

.json-input:focus-visible {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-soft);
}

.json-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.mount-panel__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.mount-panel__actions button {
  border-radius: 4px;
  padding: 0.55rem 1.4rem;
  font-size: 0.82rem;
  letter-spacing: 0.04em;
  cursor: pointer;
  border: 1px solid transparent;
  transition: background 160ms ease, border-color 160ms ease;
  font-family: 'DM Sans', sans-serif;
}

.mount-panel__actions button.primary {
  background: var(--accent);
  color: #FFFFFF;
  border-color: var(--accent);
}

.mount-panel__actions button.primary:hover,
.mount-panel__actions button.primary:focus-visible {
  background: #A8521F;
  border-color: #A8521F;
  outline: none;
}

.mount-panel__actions button.secondary {
  background: transparent;
  border-color: var(--border);
  color: var(--text-soft);
}

.mount-panel__actions button.secondary:hover,
.mount-panel__actions button.secondary:focus-visible {
  background: #F0EBE5;
  border-color: var(--border-strong);
  color: var(--text);
  outline: none;
}

.mount-panel__actions button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.mount-panel__hint {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-soft);
  line-height: 1.55;
}

.mount-panel__hint code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  background: var(--accent-soft);
  color: var(--accent);
  padding: 0.1rem 0.35rem;
  border-radius: 3px;
}

.example-json {
  max-height: 300px;
  overflow: auto;
  border-radius: 4px;
  border: 1px solid var(--border);
  background: #FFFFFF;
  padding: 1rem;
  font-size: 0.78rem;
  font-family: 'JetBrains Mono', 'SFMono-Regular', Consolas, Menlo, monospace;
  line-height: 1.6;
}

.state {
  margin: 0;
  font-size: 0.85rem;
  font-family: 'DM Sans', sans-serif;
}

.state--error {
  color: var(--accent);
}

.state--success {
  color: #2D6A4F;
}

@media (max-width: 640px) {
  .example-json {
    max-height: 220px;
  }
}
</style>
