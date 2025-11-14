<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import DOMPurify from 'dompurify'

import MemoryDetail from './components/MemoryDetail.vue'
import MemoryList from './components/MemoryList.vue'
import AnalyticsBar from './components/AnalyticsBar.vue'
import logomark from './assets/img/logo.png'

const entries = ref([])
const loading = ref(false)
const error = ref('')
const selectedId = ref('')
const activeMonthKey = ref('')
const searchQuery = ref('')

const latestEntry = computed(() => (entries.value.length ? entries.value[0] : null))

const isSearching = computed(() => searchQuery.value.trim().length > 0)
const isFiltered = computed(() => Boolean(activeMonthKey.value) || isSearching.value)

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
    results.push({
      key,
      label,
      chars: bucket.chars,
      count: bucket.count,
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
  selectedId.value = id
  scrollToTopIfMobile()
}

const handleMonthSelect = (key) => {
  if (!key || isSearching.value) {
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

const loadEntries = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}data.json?cache=${Date.now()}`)
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }
    const payload = await response.json()
    const normalized = payload
      .map((item, index) => normalizeEntry(item, index))
      .sort((a, b) => b.timestamp - a.timestamp)
    entries.value = normalized
    if (normalized.length) {
      selectedId.value = normalized[0].id
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error'
  } finally {
    loading.value = false
  }
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

onMounted(() => {
  loadEntries()
})

watch(filteredEntries, (list) => {
  if (!list.length) {
    selectedId.value = ''
    return
  }
  if (!list.some((entry) => entry.id === selectedId.value)) {
    selectedId.value = list[0].id
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

    <AnalyticsBar
      :data="monthlyAnalytics"
      :active-key="activeMonthKey"
      :disabled="isSearching"
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
        :is-filtered="isFiltered"
        :search-query="searchQuery"
        @select="selectEntry"
      />
      <MemoryDetail :entry="activeEntry" :loading="loading" :error="error" />
    </main>

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

.logo {
  width: 100%;
  max-width: clamp(320px, 54vw, 600px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 clamp(1rem, 0.6rem + 1.4vw, 1.8rem);
  border-radius: 1.1rem;
  background: #07090f;
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
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: #07090f;
  color: var(--text);
  font-size: 0.95rem;
  letter-spacing: 0.01em;
  outline: none;
  transition: border-color 160ms ease, box-shadow 160ms ease, background 160ms ease;
}

.search-bar input:focus-visible {
  border-color: rgba(255, 138, 61, 0.7);
  box-shadow: 0 12px 30px rgba(255, 120, 66, 0.2);
  background: #090c15;
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
