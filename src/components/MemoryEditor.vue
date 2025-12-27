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
  box-shadow: none;
  min-height: auto;
  position: relative;
  overflow: visible;
}

.panel.editor-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background:
    linear-gradient(155deg, rgba(16, 22, 33, 0.92), rgba(6, 8, 13, 0.75)),
    radial-gradient(120% 140% at 10% -20%, rgba(255, 138, 61, 0.12), transparent 65%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 1.5rem;
  padding: clamp(1.35rem, 1.2rem + 1vw, 2rem);
  box-shadow: 0 24px 50px rgba(5, 7, 11, 0.55);
  min-height: min(640px, 72vh);
  position: relative;
  overflow: hidden;
}

.panel.editor-panel::after {
  content: '';
  position: absolute;
  top: -40%;
  right: -35%;
  bottom: -40%;
  left: -35%;
  background: radial-gradient(circle at top, rgba(255, 138, 61, 0.18), transparent 70%);
  pointer-events: none;
}

.editor__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
}

.editor__cancel {
  border: 1px solid rgba(255, 138, 61, 0.45);
  background: transparent;
  border-radius: 999px;
  padding: 0.45rem 1.1rem;
  color: var(--text);
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
}

.editor__cancel:hover,
.editor__cancel:focus-visible {
  background: rgba(255, 138, 61, 0.22);
  border-color: rgba(255, 138, 61, 0.75);
  box-shadow: 0 10px 24px rgba(255, 120, 66, 0.18);
  outline: none;
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
  gap: 0.65rem;
}

.field__label {
  font-size: 0.78rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(255, 213, 182, 0.82);
  font-weight: 600;
}

.field input,
.field textarea {
  width: 100%;
  border-radius: 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(6, 8, 13, 0.78);
  color: var(--text);
  font-size: 0.95rem;
  padding: 0.85rem 1rem;
  outline: none;
  transition: border-color 160ms ease, box-shadow 160ms ease, background 160ms ease;
}

.field input:focus-visible,
.field textarea:focus-visible {
  border-color: rgba(255, 138, 61, 0.7);
  box-shadow: 0 12px 28px rgba(255, 120, 66, 0.22);
  background: rgba(6, 8, 13, 0.92);
}

.field textarea {
  resize: vertical;
  min-height: 220px;
  line-height: 1.6;
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
  border-radius: 0.8rem;
  padding: 0.55rem 1.1rem;
  border: 1px solid rgba(255, 138, 61, 0.55);
  background: rgba(255, 138, 61, 0.18);
  color: var(--text);
  font-size: 0.78rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
}

.tag-input__cta:hover,
.tag-input__cta:focus-visible {
  background: rgba(255, 138, 61, 0.28);
  border-color: rgba(255, 138, 61, 0.8);
  box-shadow: 0 12px 24px rgba(255, 120, 66, 0.2);
  outline: none;
}

.tag-input__cta:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  background: rgba(255, 138, 61, 0.1);
  border-color: rgba(255, 138, 61, 0.35);
  box-shadow: none;
}

.tag-collection {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.tag-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.35rem 0.8rem;
  border-radius: 999px;
  background: rgba(255, 138, 61, 0.18);
  color: #ffd9bd;
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.tag-pill__remove {
  background: transparent;
  border: 0;
  color: rgba(255, 213, 182, 0.8);
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  padding: 0;
  transition: color 160ms ease;
}

.tag-pill__remove:hover,
.tag-pill__remove:focus-visible {
  color: var(--text);
  outline: none;
}

.editor__error {
  margin: 0;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 90, 77, 0.45);
  background: rgba(255, 90, 77, 0.18);
  color: #ffb4b4;
  font-size: 0.85rem;
}

.editor__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.85rem;
  flex-wrap: wrap;
}

.editor__secondary,
.editor__submit {
  border-radius: 999px;
  padding: 0.6rem 1.45rem;
  font-size: 0.82rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 160ms ease, border-color 160ms ease, box-shadow 160ms ease, opacity 160ms ease;
}

.editor__secondary {
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: transparent;
  color: var(--text);
}

.editor__secondary:hover,
.editor__secondary:focus-visible {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.22);
  box-shadow: 0 10px 24px rgba(6, 8, 13, 0.45);
  outline: none;
}

.editor__submit {
  border: 1px solid rgba(255, 138, 61, 0.65);
  background: linear-gradient(135deg, rgba(255, 138, 61, 0.9), rgba(255, 111, 61, 0.7));
  color: #130a07;
  font-weight: 700;
  box-shadow: 0 16px 32px rgba(255, 120, 66, 0.28);
}

.editor__submit:hover,
.editor__submit:focus-visible {
  border-color: rgba(255, 138, 61, 0.9);
  box-shadow: 0 18px 36px rgba(255, 120, 66, 0.35);
  outline: none;
}

.editor__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

.editor__output {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding: 1rem;
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(6, 8, 13, 0.78);
  box-shadow: inset 0 0 0 1px rgba(255, 138, 61, 0.08);
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
  font-size: 0.8rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(255, 213, 182, 0.85);
}

.editor__copy {
  border-radius: 0.75rem;
  padding: 0.45rem 1.05rem;
  border: 1px solid rgba(255, 138, 61, 0.55);
  background: rgba(255, 138, 61, 0.18);
  color: var(--text);
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
}

.editor__copy:hover,
.editor__copy:focus-visible {
  background: rgba(255, 138, 61, 0.3);
  border-color: rgba(255, 138, 61, 0.85);
  box-shadow: 0 12px 26px rgba(255, 120, 66, 0.25);
  outline: none;
}

.editor__json {
  margin: 0;
  padding: 1rem;
  border-radius: 0.9rem;
  background: rgba(5, 7, 12, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #f8f6f3;
  font-family: 'Space Grotesk', 'Inter', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.83rem;
  line-height: 1.6;
  overflow: auto;
  max-height: 320px;
  white-space: pre;
}

.editor__copy-status {
  margin: 0;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  color: rgba(255, 213, 182, 0.8);
  text-transform: uppercase;
}

.editor__hint {
  margin: 0;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.editor__hint code {
  font-family: inherit;
  color: rgba(255, 213, 182, 0.9);
}

@media (max-width: 960px) {
  .panel.editor-panel {
    padding: 1.25rem;
    border-radius: 1.25rem;
    min-height: auto;
  }

  .field textarea {
    min-height: 180px;
  }
}
</style>
