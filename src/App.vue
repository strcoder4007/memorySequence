<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import DOMPurify from 'dompurify'

import MemoryDetail from './components/MemoryDetail.vue'
import MemoryEditor from './components/MemoryEditor.vue'
import MemoryList from './components/MemoryList.vue'
import AnalyticsBar from './components/AnalyticsBar.vue'
import JsonMountPanel from './components/JsonMountPanel.vue'
import AppModal from './components/AppModal.vue'
import logomark from './assets/img/logo.png'

const STORAGE_KEY = 'memory-sequence:data'

const entries = ref([])
const sourceEntries = ref([])
const hasMountedSource = ref(false)
const loading = ref(false)
const error = ref('')
const selectedId = ref('')
const activeMonthKey = ref('')
const searchQuery = ref('')
const isCreating = ref(false)
const generatedJson = ref('')
const previousSelectedId = ref('')
const showArchiveJson = ref(false)
const archiveCopyStatus = ref('')
const editingEntry = ref(null)
const editorSeed = ref('')

const latestEntry = computed(() => (entries.value.length ? entries.value[0] : null))

const isSearching = computed(() => searchQuery.value.trim().length > 0)
const isFiltered = computed(() => Boolean(activeMonthKey.value) || isSearching.value)
const isEditing = computed(() => Boolean(editingEntry.value))
const isEditorOpen = computed(() => isCreating.value || isEditing.value)
const archiveJson = computed(() => JSON.stringify(sourceEntries.value ?? [], null, 2))

const filteredEntries = computed(() => {
  let list = [...entries.value]

  if (activeMonthKey.value) {
    const [year, month] = activeMonthKey.value.split('-').map((value) => Number(value))
    list = list.filter((entry) => {
      if (!(entry.date instanceof Date) || Number.isNaN(entry.date.getTime())) {
        return false
      }
      return entry.date.getFullYear() === year && entry.date.getMonth() === month
    })
  }

  const query = searchQuery.value.trim().toLowerCase()
  if (query) {
    list = list.filter((entry) => {
      const haystacks = [
        entry.title ?? '',
        entry.snippet ?? '',
        entry.plainText ?? '',
        ...(entry.tags ?? []),
      ]
      return haystacks.some((value) => String(value ?? '').toLowerCase().includes(query))
    })
  }

  return list
})

const activeEntry = computed(() => {
  if (!hasMountedSource.value) {
    return null
  }
  if (filteredEntries.value.length) {
    return (
      filteredEntries.value.find((item) => item.id === selectedId.value) ?? filteredEntries.value[0]
    )
  }
  if (!selectedId.value) {
    return null
  }
  return entries.value.find((item) => item.id === selectedId.value) ?? latestEntry.value ?? null
})

const monthlyAnalytics = computed(() => {
  if (!entries.value.length) {
    return []
  }

  const datedEntries = entries.value.filter(
    (entry) => entry.date instanceof Date && !Number.isNaN(entry.date.getTime()),
  )

  if (!datedEntries.length) {
    return []
  }

  const buckets = new Map()
  datedEntries.forEach((entry) => {
    const year = entry.date.getFullYear()
    const month = entry.date.getMonth()
    const key = `${year}-${month}`
    const chars = entry.plainText?.length ?? 0
    const current = buckets.get(key) ?? { chars: 0, count: 0 }
    buckets.set(key, {
      chars: current.chars + chars,
      count: current.count + 1,
    })
  })

  const monthTimestamps = datedEntries.map((entry) =>
    new Date(entry.date.getFullYear(), entry.date.getMonth(), 1).getTime(),
  )
  const startDate = new Date(Math.min(...monthTimestamps))
  const endDate = new Date(Math.max(...monthTimestamps))
  startDate.setHours(0, 0, 0, 0)
  endDate.setHours(0, 0, 0, 0)

  const results = []
  const cursor = new Date(startDate)
  while (cursor.getTime() <= endDate.getTime()) {
    const key = `${cursor.getFullYear()}-${cursor.getMonth()}`
    const bucket = buckets.get(key) ?? { chars: 0, count: 0 }
    const label = new Intl.DateTimeFormat('en-GB', {
      month: 'short',
      year: 'numeric',
    })
      .format(cursor)
      .replace(' ', '\n')
    const axisLabel = cursor.getMonth() === 0 ? `${cursor.getFullYear()}` : ''

    results.push({
      key,
      label,
      chars: bucket.chars,
      count: bucket.count,
      axisLabel,
    })
    cursor.setMonth(cursor.getMonth() + 1)
  }

  return results
})

const activeMonthLabel = computed(() => {
  if (!activeMonthKey.value) {
    return ''
  }
  const [year, month] = activeMonthKey.value.split('-').map((value) => Number(value))
  if (Number.isNaN(year) || Number.isNaN(month)) {
    return ''
  }
  return new Intl.DateTimeFormat('en-GB', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month))
})

const selectEntry = (id) => {
  if (isEditorOpen.value || !id || !hasMountedSource.value) {
    return
  }
  selectedId.value = id
  scrollToTopIfMobile()
}

const handleMonthSelect = (key) => {
  if (!key || isSearching.value || isEditorOpen.value || !hasMountedSource.value) {
    return
  }
  activeMonthKey.value = activeMonthKey.value === key ? '' : key
}

const clearMonthFilter = () => {
  activeMonthKey.value = ''
}

const scrollToTopIfMobile = () => {
  if (window.innerWidth <= 960) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const toggleArchiveJson = () => {
  if (!hasMountedSource.value) {
    return
  }
  showArchiveJson.value = !showArchiveJson.value
}

const copyArchiveJson = async () => {
  if (!hasMountedSource.value) {
    return
  }

  showArchiveJson.value = true
  archiveCopyStatus.value = ''
  try {
    await navigator.clipboard.writeText(archiveJson.value)
    archiveCopyStatus.value = 'Copied!'
  } catch (err) {
    archiveCopyStatus.value = 'Copy failed. Press Cmd/Ctrl+C.'
  }
  setTimeout(() => {
    archiveCopyStatus.value = ''
  }, 2000)
}

const persistEntries = (rawEntries, { skipStorage = false, resetView = false } = {}) => {
  if (!Array.isArray(rawEntries)) {
    throw new Error('Mounted data must be an array of entries.')
  }
  if (!skipStorage) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rawEntries))
    } catch (err) {
      throw new Error('Failed to save data to browser storage.')
    }
  }
  sourceEntries.value = rawEntries
  const normalized = rawEntries
    .map((item, index) => normalizeEntry(item, index))
    .sort((a, b) => b.timestamp - a.timestamp)
  entries.value = normalized
  hasMountedSource.value = true

  if (resetView) {
    activeMonthKey.value = ''
    searchQuery.value = ''
  }

  if (!normalized.length) {
    selectedId.value = ''
    return
  }

  if (!isCreating.value) {
    selectedId.value = normalized[0].id
  }
}

const loadEntriesFromStorage = () => {
  loading.value = true
  error.value = ''
  try {
    const cached = localStorage.getItem(STORAGE_KEY)
    if (!cached) {
      hasMountedSource.value = false
      entries.value = []
      sourceEntries.value = []
      selectedId.value = ''
      return
    }
    const parsed = JSON.parse(cached)
    persistEntries(parsed, { skipStorage: true, resetView: true })
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Stored data is invalid. Please remount.'
    hasMountedSource.value = false
    entries.value = []
    sourceEntries.value = []
    selectedId.value = ''
    localStorage.removeItem(STORAGE_KEY)
  } finally {
    loading.value = false
  }
}

const handleMountComplete = (payload) => {
  try {
    persistEntries(payload, { resetView: true })
    error.value = ''
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unable to mount JSON.'
  }
}

const handleDemount = () => {
  localStorage.removeItem(STORAGE_KEY)
  entries.value = []
  sourceEntries.value = []
  selectedId.value = ''
  activeMonthKey.value = ''
  searchQuery.value = ''
  isCreating.value = false
  editingEntry.value = null
  editorSeed.value = ''
  generatedJson.value = ''
  previousSelectedId.value = ''
  hasMountedSource.value = false
  showArchiveJson.value = false
}

const normalizeEntry = (entry, index) => {
  const date = parseDate(entry.time)
  const timestamp = date?.getTime() ?? Date.now() - index
  const sanitizedContent = DOMPurify.sanitize(entry.content ?? '', {
    USE_PROFILES: { html: true },
  })
  const plainText = stripHtml(sanitizedContent)
  const readingTime = Math.max(1, Math.round(plainText.split(/\s+/).length / 200))

  return {
    ...entry,
    id: `${timestamp}-${index}`,
    sourceIndex: index,
    timestamp,
    date,
    formattedDate: formatDate(date),
    sanitizedContent,
    snippet: createSnippet(plainText),
    readingTime,
    tags: Array.isArray(entry.tags) ? entry.tags : [],
    plainText,
  }
}

const parseDate = (value) => {
  if (!value) {
    return null
  }
  const parsed = new Date(value)
  if (!Number.isNaN(parsed.getTime())) {
    return parsed
  }
  return null
}

const formatDate = (date, options) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return 'Date unavailable'
  }
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...options,
  }).format(date)
}

const stripHtml = (html) => {
  const temp = document.createElement('div')
  temp.innerHTML = html
  return temp.textContent?.trim() ?? ''
}

const createSnippet = (text, limit = 180) => {
  if (!text) {
    return ''
  }
  if (text.length <= limit) {
    return text
  }
  return `${text.slice(0, limit).trim()}…`
}

const escapeHtml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const convertHtmlToDraftText = (raw) => {
  if (!raw) {
    return ''
  }
  const html = String(raw)
    .replace(/<\s*br\s*\/?>/gi, '\n')
    .replace(/<\/\s*p\s*>/gi, '\n\n')
    .replace(/<\/\s*div\s*>/gi, '\n\n')

  const temp = document.createElement('div')
  temp.innerHTML = html
  return (temp.textContent ?? '')
    .replace(/\u00a0/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

const convertDraftToHtml = (raw) => {
  if (!raw) {
    return ''
  }
  const segments = raw
    .split(/\n{2,}/)
    .map((segment) => segment.trim())
    .filter(Boolean)

  if (!segments.length) {
    return `<p>${escapeHtml(raw.trim()).replace(/\n/g, '<br />')}</p>`
  }

  return segments
    .map((segment) => {
      const escaped = escapeHtml(segment)
      return `<p>${escaped.replace(/\n/g, '<br />')}</p>`
    })
    .join('')
}

const formatCurrentDate = () =>
  new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())

const startCreate = () => {
  generatedJson.value = ''
  previousSelectedId.value = selectedId.value
  isCreating.value = true
  editingEntry.value = null
  editorSeed.value = `create-${Date.now()}`
}

const startEdit = (entry) => {
  if (!entry || !hasMountedSource.value) {
    return
  }
  generatedJson.value = ''
  previousSelectedId.value = selectedId.value
  selectedId.value = entry.id
  isCreating.value = false
  editingEntry.value = entry
  editorSeed.value = `edit-${entry.id}`
  scrollToTopIfMobile()
}

const deleteEntry = (entry) => {
  if (!entry || !hasMountedSource.value || isEditorOpen.value) {
    return
  }
  const index = entry.sourceIndex
  if (typeof index !== 'number' || index < 0) {
    error.value = 'Unable to locate the original entry to delete.'
    return
  }
  const nextSource = [...(sourceEntries.value ?? [])]
  if (index >= nextSource.length) {
    error.value = 'Unable to locate the original entry to delete.'
    return
  }
  nextSource.splice(index, 1)
  try {
    persistEntries(nextSource)
    error.value = ''
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unable to delete entry.'
  }
}

const editorDraft = computed(() => {
  if (!isEditing.value) {
    return { title: '', tags: [], content: '' }
  }
  return {
    title: editingEntry.value?.title ?? '',
    tags: Array.isArray(editingEntry.value?.tags) ? editingEntry.value.tags : [],
    content: convertHtmlToDraftText(editingEntry.value?.content ?? ''),
  }
})

const handleEditorCancel = () => {
  generatedJson.value = ''
  isCreating.value = false
  editingEntry.value = null
  if (previousSelectedId.value) {
    selectedId.value = previousSelectedId.value
  } else if (entries.value.length) {
    selectedId.value = entries.value[0].id
  }
  previousSelectedId.value = ''
}

const handleEditorSubmit = (draft) => {
  const basePayload = {
    title: draft.title,
    content: convertDraftToHtml(draft.content),
    tags: draft.tags,
  }

  if (isEditing.value) {
    const index = editingEntry.value?.sourceIndex
    if (typeof index !== 'number' || index < 0) {
      error.value = 'Unable to locate the original entry to edit.'
      return
    }
    const original = sourceEntries.value?.[index] ?? {}
    const payload = {
      ...original,
      ...basePayload,
      time: original.time ?? editingEntry.value?.time ?? formatCurrentDate(),
    }
    generatedJson.value = `${JSON.stringify(payload, null, 2)}`
    const nextSource = [...(sourceEntries.value ?? [])]
    nextSource[index] = payload
    try {
      persistEntries(nextSource)
      error.value = ''
      isCreating.value = false
      editingEntry.value = null
      editorSeed.value = ''
      previousSelectedId.value = ''
      generatedJson.value = ''
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unable to save entry.'
    }
    return
  }

  const payload = {
    ...basePayload,
    time: formatCurrentDate(),
  }
  generatedJson.value = `${JSON.stringify(payload, null, 2)}`
  const nextSource = [payload, ...(sourceEntries.value ?? [])]
  try {
    persistEntries(nextSource)
    error.value = ''
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unable to save entry.'
  }
}

onMounted(() => {
  loadEntriesFromStorage()
})

watch(filteredEntries, (list) => {
  if (isEditorOpen.value || !hasMountedSource.value) {
    return
  }
  if (!list.length) {
    selectedId.value = ''
    return
  }
  if (!list.some((entry) => entry.id === selectedId.value)) {
    selectedId.value = list[0].id
  }
})

watch(sourceEntries, (list) => {
  if (!Array.isArray(list) || !list.length) {
    showArchiveJson.value = false
  }
})
</script>

<template>
  <div class="app-shell">
    <header class="hero">
      <div class="hero__brand">
        <div class="logo">
          <img :src="logomark" alt="Memory Sequence logo" />
        </div>
      </div>
    </header>

    <JsonMountPanel
      v-if="!hasMountedSource"
      :loading="loading"
      :error="error"
      @mounted="handleMountComplete"
    />

    <template v-else>
      <AnalyticsBar
        :data="monthlyAnalytics"
        :active-key="activeMonthKey"
        :disabled="isSearching || isEditorOpen"
        @select="handleMonthSelect"
      />

      <div v-if="activeMonthKey" class="filter-notice" role="status">
        <span>Showing entries from {{ activeMonthLabel }}</span>
        <button type="button" class="filter-notice__clear" @click="clearMonthFilter">
          Clear filter
        </button>
      </div>

      <div class="search-bar">
        <span class="search-bar__icon" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="m12.657 11.243 3.05 3.05a1 1 0 0 1-1.414 1.414l-3.05-3.05a6 6 0 1 1 1.414-1.414ZM8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
              fill="currentColor"
            />
          </svg>
        </span>
        <input
          type="search"
          v-model="searchQuery"
          placeholder="Search memories by title, tags, or content..."
          aria-label="Search memories"
        />
      </div>

      <main class="layout">
        <MemoryList
          :entries="filteredEntries"
          :selected-id="selectedId"
          :loading="loading"
          :error="error"
          :creating="isEditorOpen"
          :is-filtered="isFiltered"
          :search-query="searchQuery"
          @select="selectEntry"
          @create="startCreate"
          @edit="startEdit"
          @delete="deleteEntry"
        />
        <MemoryDetail
          :entry="activeEntry"
          :loading="loading"
          :error="error"
        />
      </main>

      <div class="data-actions">
        <button
          type="button"
          class="generate-button"
          @click="copyArchiveJson"
          :disabled="!hasMountedSource || isEditorOpen"
        >
          Copy JSON
        </button>

        <button
          v-if="showArchiveJson"
          type="button"
          class="hide-json-button"
          @click="toggleArchiveJson"
          :disabled="!hasMountedSource || isEditorOpen"
        >
          Hide JSON
        </button>

        <button
          type="button"
          class="demount-button"
          @click="handleDemount"
          :disabled="isEditorOpen"
        >
          Demount JSON
        </button>

        <span v-if="archiveCopyStatus" class="data-actions__status" role="status">
          {{ archiveCopyStatus }}
        </span>
      </div>

      <textarea
        v-if="showArchiveJson"
        class="archive-json-viewer"
        :value="archiveJson"
        readonly
      ></textarea>

      <AppModal
        :open="isEditorOpen"
        :title="isEditing ? 'Edit Memory' : 'Compose New Memory'"
        width="90vw"
        height="90vh"
        @close="handleEditorCancel"
      >
        <MemoryEditor
          :json-result="generatedJson"
          :mode="isEditing ? 'edit' : 'create'"
          :seed="editorSeed"
          :initial-draft="editorDraft"
          embedded
          @cancel="handleEditorCancel"
          @submit="handleEditorSubmit"
        />
      </AppModal>
    </template>

    <footer class="footer">
      <p>© {{ new Date().getFullYear() }} Memory Sequence. Crafted in Vue 3.</p>
    </footer>
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  gap: clamp(2rem, 1.5rem + 2vw, 3rem);
  padding: clamp(1.5rem, 1.1rem + 2vw, 3.5rem) clamp(1rem, 0.8rem + 1.6vw, 4rem);
  max-width: 1200px;
  margin: 0 auto;
}

.hero {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.hero__brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.15rem;
}

.data-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}

.demount-button {
  border-radius: 999px;
  border: 1px solid rgba(255, 92, 92, 0.6);
  background: rgba(255, 92, 92, 0.15);
  color: #ffb4b4;
  padding: 0.45rem 1.4rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background 160ms ease, border-color 160ms ease, color 160ms ease, transform 160ms ease;
}

.demount-button:hover,
.demount-button:focus-visible {
  background: rgba(255, 92, 92, 0.3);
  border-color: rgba(255, 92, 92, 0.85);
  color: #fff1f1;
  transform: translateY(-1px);
  outline: none;
}

.demount-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none;
}

.generate-button {
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.08);
  color: var(--text);
  padding: 0.45rem 1.4rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background 160ms ease, border-color 160ms ease, color 160ms ease, transform 160ms ease;
}

.generate-button:hover,
.generate-button:focus-visible {
  background: rgba(255, 255, 255, 0.18);
  border-color: rgba(255, 255, 255, 0.7);
  color: #ffffff;
  transform: translateY(-1px);
  outline: none;
}

.generate-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none;
}

.hide-json-button {
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-soft);
  padding: 0.45rem 1.1rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background 160ms ease, border-color 160ms ease, color 160ms ease, transform 160ms ease;
}

.hide-json-button:hover,
.hide-json-button:focus-visible {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
  color: var(--text);
  transform: translateY(-1px);
  outline: none;
}

.hide-json-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none;
}

.data-actions__status {
  font-size: 0.82rem;
  color: #ffdabc;
}

.archive-json-viewer {
  width: 100%;
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(5, 7, 11, 0.85);
  color: var(--text);
  padding: 1rem;
  font-size: 0.9rem;
  font-family: 'SFMono-Regular', Consolas, Menlo, monospace;
  min-height: 320px;
  resize: vertical;
}

.logo {
  width: 100%;
  max-width: clamp(224px, 38vw, 420px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 clamp(1rem, 0.6rem + 1.4vw, 1.8rem);
  border-radius: 1.1rem;
  background: #000000;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 18px 40px rgba(5, 7, 11, 0.35);
  overflow: hidden;
}

.logo img {
  width: 100%;
  height: auto;
  border-radius: 0.8rem;
}

.filter-notice {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  border-radius: 0.9rem;
  background: rgba(255, 138, 61, 0.08);
  border: 1px solid rgba(255, 138, 61, 0.35);
  color: #ffdabc;
  font-size: 0.9rem;
  width: fit-content;
}

.filter-notice__clear {
  background: transparent;
  border: 1px solid rgba(255, 138, 61, 0.45);
  border-radius: 999px;
  padding: 0.35rem 0.9rem;
  color: var(--text);
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 160ms ease, color 160ms ease, border-color 160ms ease;
}

.filter-notice__clear:hover,
.filter-notice__clear:focus-visible {
  background: rgba(255, 138, 61, 0.18);
  border-color: rgba(255, 138, 61, 0.6);
  outline: none;
}

.search-bar {
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
}

.search-bar input {
  width: 100%;
  padding: 0.95rem 3rem 0.95rem 1.1rem;
  border-radius: 1rem;
  border: 1px solid rgba(255, 138, 61, 0.7);
  background: #090c15;
  color: var(--text);
  font-size: 0.95rem;
  letter-spacing: 0.01em;
  outline: none;
  transition: border-color 160ms ease, box-shadow 160ms ease, background 160ms ease;
  box-shadow: 0 12px 30px rgba(255, 120, 66, 0.2);
}

.search-bar input:focus-visible {
  border-color: rgba(255, 138, 61, 0.85);
  box-shadow: 0 14px 34px rgba(255, 120, 66, 0.28);
}

.search-bar__icon {
  position: absolute;
  right: 1.1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.2rem;
  height: 1.2rem;
  color: var(--accent);
  pointer-events: none;
}

.layout {
  display: grid;
  grid-template-columns: minmax(300px, 360px) minmax(0, 1fr);
  gap: clamp(1.5rem, 1rem + 2vw, 2.5rem);
  align-items: start;
}

.footer {
  text-align: center;
  color: var(--text-muted);
  font-size: 0.85rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 138, 61, 0.18);
}

@media (max-width: 960px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .app-shell {
    padding: 1.5rem;
    gap: 2rem;
  }
}

@media (max-width: 640px) {
  .hero__brand {
    align-items: flex-start;
  }

  .app-shell {
    padding: 1.25rem;
  }

  .filter-notice {
    width: 100%;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .filter-notice__clear {
    width: 100%;
    text-align: center;
  }

  .search-bar input {
    font-size: 0.9rem;
  }
}
</style>
