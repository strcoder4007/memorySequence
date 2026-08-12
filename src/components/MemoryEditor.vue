<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  jsonResult: {
    type: String,
    default: '',
  },
  embedded: {
    type: Boolean,
    default: false,
  },
  mode: {
    type: String,
    default: 'create',
  },
  seed: {
    type: String,
    default: '',
  },
  initialDraft: {
    type: Object,
    default: () => ({ title: '', tags: [], content: '' }),
  },
})

const emit = defineEmits(['cancel', 'submit'])

const title = ref('')
const tagInput = ref('')
const tags = ref([])
const content = ref('')
const localError = ref('')
const copyStatus = ref('')

const trimmedTagInput = computed(() => tagInput.value.trim())
const editorHeadline = computed(() => (props.mode === 'edit' ? 'Edit Memory' : 'Compose New Memory'))
const submitLabel = computed(() => (props.mode === 'edit' ? 'Update JSON' : 'Get JSON'))
const outputTitle = computed(() => (props.mode === 'edit' ? 'Updated JSON' : 'Generated JSON'))
const outputHint = computed(() =>
  props.mode === 'edit'
    ? 'This memory has been updated in your mounted archive. Copy the JSON if you need a backup.'
    : 'This entry is already saved to your mounted archive. Copy the JSON if you need a backup.',
)

const canSubmit = computed(() => title.value.trim().length > 0 && content.value.trim().length > 0)

watch([title, content, tags, () => props.jsonResult], () => {
  localError.value = ''
  copyStatus.value = ''
})

const applyDraft = (draft) => {
  title.value = draft?.title ?? ''
  tags.value = Array.isArray(draft?.tags) ? [...draft.tags] : []
  content.value = draft?.content ?? ''
  tagInput.value = ''
  localError.value = ''
  copyStatus.value = ''
}

watch(
  () => props.seed,
  () => {
    applyDraft(props.initialDraft)
  },
  { immediate: true },
)

const addTag = () => {
  const next = trimmedTagInput.value.replace(/,$/, '')
  if (!next) {
    tagInput.value = ''
    return
  }
  const normalized = next.replace(/\s+/g, ' ').trim()
  const exists = tags.value.some((tag) => tag.toLowerCase() === normalized.toLowerCase())
  if (!exists) {
    tags.value = [...tags.value, normalized]
  }
  tagInput.value = ''
}

const removeTag = (target) => {
  tags.value = tags.value.filter((tag) => tag !== target)
}

const handleTagKey = (event) => {
  if (event.key === 'Enter' || event.key === ',') {
    event.preventDefault()
    addTag()
  } else if (event.key === 'Backspace' && !trimmedTagInput.value && tags.value.length) {
    removeTag(tags.value[tags.value.length - 1])
  }
}

const resetForm = () => {
  applyDraft({ title: '', tags: [], content: '' })
}

const handleCancel = () => {
  resetForm()
  emit('cancel')
}

const handleSubmit = () => {
  const nextTitle = title.value.trim()
  const nextContent = content.value.trim()
  if (!nextTitle || !nextContent) {
    localError.value = 'Title and content are required.'
    return
  }
  const payload = {
    title: nextTitle,
    tags: tags.value,
    content: nextContent,
  }
  emit('submit', payload)
}

const copyJson = async () => {
  if (!props.jsonResult) {
    return
  }
  try {
    await navigator.clipboard.writeText(props.jsonResult)
    copyStatus.value = 'Copied!'
  } catch (err) {
    copyStatus.value = 'Copy failed. Press Cmd/Ctrl+C.'
  }
  setTimeout(() => {
    copyStatus.value = ''
  }, 2000)
}
</script>

<template>
  <section :class="props.embedded ? 'editor-embedded' : 'panel editor-panel'">
    <form class="editor__form" @submit.prevent="handleSubmit">
      <label class="field">
        <span class="field__label">Title</span>
        <input
          type="text"
          v-model="title"
          placeholder="Give your memory a headline"
          required
        />
      </label>

      <div class="field">
        <span class="field__label">Tags</span>
        <div class="tag-input">
          <input
            type="text"
            v-model="tagInput"
            placeholder="Add a tag and press Enter"
            @keydown="handleTagKey"
          />
          <button
            type="button"
            class="tag-input__cta"
            @click="addTag"
            :disabled="!trimmedTagInput"
          >
            Add
          </button>
        </div>
        <div v-if="tags.length" class="tag-collection">
          <span v-for="tag in tags" :key="tag" class="tag-pill">
            {{ tag }}
            <button
              type="button"
              class="tag-pill__remove"
              :aria-label="`Remove tag ${tag}`"
              @click="removeTag(tag)"
            >
              ×
            </button>
          </span>
        </div>
      </div>

      <label class="field">
        <span class="field__label">Content</span>
        <textarea
          v-model="content"
          rows="16"
          placeholder="Capture the details of this memory..."
          required
        ></textarea>
      </label>

      <p v-if="localError" class="editor__error">{{ localError }}</p>

      <div class="editor__actions">
        <button type="button" class="editor__secondary" @click="handleCancel">
          Discard
        </button>
        <button type="submit" class="editor__submit" :disabled="!canSubmit">
          {{ submitLabel }}
        </button>
      </div>
    </form>

    <div v-if="jsonResult" class="editor__output">
      <div class="editor__output-header">
        <p class="editor__output-title">{{ outputTitle }}</p>
        <button type="button" class="editor__copy" @click="copyJson">
          Copy JSON
        </button>
      </div>
      <pre class="editor__json"><code>{{ jsonResult }}</code></pre>
      <p v-if="copyStatus" class="editor__copy-status">{{ copyStatus }}</p>
      <p class="editor__hint">
        {{ outputHint }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.editor-embedded {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: transparent;
  border: 0;
  border-radius: 0;
  padding: 0;
  min-height: auto;
  position: relative;
  overflow: visible;
}

.panel.editor-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 2px;
  padding: clamp(1.35rem, 1.2rem + 1vw, 2rem);
  min-height: min(640px, 72vh);
  position: relative;
  overflow: hidden;
}

.editor__form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  position: relative;
  z-index: 1;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field__label {
  font-size: 0.68rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
  font-weight: 500;
  font-family: var(--font-ui);
}

.field input,
.field textarea {
  width: 100%;
  border-radius: 8px;
  border: 1px solid var(--border-strong);
  background: var(--surface-raised);
  color: var(--text);
  font-size: 0.95rem;
  padding: 0.8rem 1rem;
  outline: none;
  transition: border-color 150ms ease;
  font-family: var(--font-ui);
}

.field input::placeholder,
.field textarea::placeholder {
  color: var(--text-muted);
}

.field input:focus-visible,
.field textarea:focus-visible {
  border-color: var(--accent);
}

.field textarea {
  resize: vertical;
  min-height: 220px;
  line-height: 1.7;
}

.tag-input {
  display: flex;
  gap: 0.65rem;
  align-items: center;
  flex-wrap: wrap;
}

.tag-input input {
  flex: 1 1 200px;
  min-width: 0;
}

.tag-input__cta {
  border-radius: 8px;
  padding: 0.5rem 1rem;
  border: 1px solid var(--accent);
  background: var(--accent);
  color: var(--accent-text);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 150ms ease, border-color 150ms ease, color 150ms ease;
  font-family: var(--font-ui);
}

.tag-input__cta:hover,
.tag-input__cta:focus-visible {
  background: transparent;
  color: var(--accent);
  outline: none;
}

.tag-input__cta:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.tag-collection {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  background: var(--accent-dim);
  color: var(--accent);
  font-size: 0.72rem;
  letter-spacing: 0.04em;
  border: 1px solid var(--accent);
}

.tag-pill__remove {
  background: transparent;
  border: 0;
  color: var(--accent);
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  padding: 0;
  transition: opacity 160ms ease;
}

.tag-pill__remove:hover,
.tag-pill__remove:focus-visible {
  opacity: 0.6;
  outline: none;
}

.editor__error {
  margin: 0;
  padding: 0.75rem 1rem;
  border-radius: 2px;
  border: 1px solid rgba(255, 77, 77, 0.3);
  background: var(--error-dim);
  color: var(--error);
  font-size: 0.85rem;
}

.editor__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.editor__secondary,
.editor__submit {
  border-radius: 8px;
  padding: 0.55rem 1.4rem;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 150ms ease, border-color 150ms ease, color 150ms ease;
  font-family: var(--font-ui);
}

.editor__secondary {
  border: 1px solid var(--border-strong);
  background: transparent;
  color: var(--text-soft);
}

.editor__secondary:hover,
.editor__secondary:focus-visible {
  background: var(--surface-raised);
  border-color: var(--text-soft);
  color: var(--text);
  outline: none;
}

.editor__submit {
  border: 1px solid var(--accent);
  background: var(--accent);
  color: var(--accent-text);
  font-weight: 600;
}

.editor__submit:hover,
.editor__submit:focus-visible {
  background: transparent;
  color: var(--accent);
  outline: none;
}

.editor__submit:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.editor__output {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding: 1rem;
  border-radius: 2px;
  border: 1px solid var(--border);
  background: var(--surface-raised);
}

.editor__output-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.editor__output-title {
  margin: 0;
  font-size: 0.68rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
  font-family: var(--font-ui);
}

.editor__copy {
  border-radius: 8px;
  padding: 0.4rem 1rem;
  border: 1px solid var(--accent);
  background: var(--accent);
  color: var(--accent-text);
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 150ms ease, border-color 150ms ease, color 150ms ease;
  font-family: var(--font-ui);
}

.editor__copy:hover,
.editor__copy:focus-visible {
  background: transparent;
  color: var(--accent);
  outline: none;
}

.editor__json {
  margin: 0;
  padding: 1rem;
  border-radius: 2px;
  background: var(--surface);
  border: 1px solid var(--border-strong);
  color: var(--text);
  font-family: var(--font-ui);
  font-size: 0.82rem;
  line-height: 1.6;
  overflow: auto;
  max-height: 320px;
  white-space: pre;
}

.editor__copy-status {
  margin: 0;
  font-size: 0.75rem;
  color: var(--accent);
}

.editor__hint {
  margin: 0;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.editor__hint code {
  font-family: var(--font-ui);
  color: var(--accent);
}

@media (max-width: 960px) {
  .panel.editor-panel {
    padding: 1.25rem;
    border-radius: 2px;
    min-height: auto;
  }

  .field textarea {
    min-height: 180px;
  }
}
</style>
