<script setup>
import { computed } from 'vue'
const props = defineProps({
  entries: {
    type: Array,
    default: () => [],
  },
  selectedId: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
  creating: {
    type: Boolean,
    default: false,
  },
  isFiltered: {
    type: Boolean,
    default: false,
  },
  searchQuery: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['select', 'create'])

const handleSelect = (entry) => {
  if (!entry || props.loading || props.creating) {
    return
  }
  emit('select', entry.id)
}

const searchTerm = computed(() => (props.searchQuery || '').trim())

const visibleCount = computed(() => props.entries.length)

const blankMessage = computed(() => {
  if (props.isFiltered) {
    if (searchTerm.value) {
      return `No memories matched "${searchTerm.value}".`
    }
    return 'No memories found for this selection.'
  }
  return 'No memories available yet. Add an entry to populate the timeline.'
})
</script>

<template>
  <section class="panel panel--scroll">
    <header class="panel__header">
      <p class="eyebrow">
        Browse Memory Sequences
        <span class="eyebrow__count">({{ visibleCount }})</span>
      </p>
      <button
        type="button"
        class="panel__cta"
        @click="emit('create')"
        :disabled="creating || loading"
      >
        New Memory
      </button>
    </header>

    <div v-if="error" class="state state--error">
      <span>Something went wrong. {{ error }}</span>
    </div>

    <div v-else-if="loading" class="skeleton-list" aria-hidden="true">
      <div class="skeleton-card" v-for="index in 4" :key="index">
        <div class="skeleton-line short"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
      </div>
    </div>

    <TransitionGroup
      v-else
      name="fade"
      tag="ul"
      class="memory-list"
      aria-live="polite"
    >
      <li
        v-for="entry in entries"
        :key="entry.id"
        :class="['memory-card', { 'memory-card--active': entry.id === selectedId }]"
      >
        <button type="button" class="memory-card__button" @click="handleSelect(entry)">
          <span class="memory-card__date">{{ entry.formattedDate }}</span>
          <h3 class="memory-card__title">{{ entry.title }}</h3>
          <p class="memory-card__snippet">{{ entry.snippet }}</p>
          <div v-if="entry.tags?.length" class="memory-card__tags">
            <span v-for="tag in entry.tags" :key="tag" class="tag-chip">{{ tag }}</span>
          </div>
        </button>
      </li>
    </TransitionGroup>

    <p v-if="!loading && !error && !entries.length" class="state state--blank">
      {{ blankMessage }}
    </p>
  </section>
</template>

<style scoped>
.panel {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.35rem;
  background: #07090f;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1.1rem;
  box-shadow: 0 18px 40px rgba(5, 7, 11, 0.35);
}

.panel--scroll {
  max-height: min(101vh, 936px);
  overflow-y: auto;
  overscroll-behavior: contain;
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}

.panel--scroll::-webkit-scrollbar {
  width: 6px;
}

.panel--scroll::-webkit-scrollbar-track {
  background: transparent;
}

.panel--scroll::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.25);
  border-radius: 999px;
}

.panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.eyebrow {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--text-muted);
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.eyebrow__count {
  color: #ffdabc;
  letter-spacing: 0;
}

.panel__cta {
  padding: 0.55rem 1.15rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 138, 61, 0.55);
  background: rgba(255, 138, 61, 0.15);
  color: var(--text);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
}

.panel__cta:hover,
.panel__cta:focus-visible {
  background: rgba(255, 138, 61, 0.28);
  border-color: rgba(255, 138, 61, 0.8);
  box-shadow: 0 12px 26px rgba(255, 120, 66, 0.18);
  outline: none;
}

.panel__cta:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  background: rgba(255, 138, 61, 0.08);
  border-color: rgba(255, 138, 61, 0.35);
  box-shadow: none;
}

.panel__header h2 {
  margin: 0;
  font-size: clamp(1.35rem, 1.2rem + 0.6vw, 1.75rem);
  font-weight: 600;
}

.subtext {
  margin: 0;
  color: var(--text-soft);
  line-height: 1.45;
  font-size: 0.85rem;
}

.memory-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.memory-card {
  display: block;
  border-radius: 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: #05070d;
  transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
}

.memory-card--active {
  border-color: rgba(255, 145, 70, 0.7);
  box-shadow: 0 16px 32px rgba(255, 120, 66, 0.22);
}

.memory-card__button {
  width: 100%;
  padding: 0.95rem 1.05rem;
  text-align: left;
  background: transparent;
  border: 0;
  color: inherit;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  align-items: flex-start;
  border-radius: inherit;
  cursor: pointer;
}

.memory-card__button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

.memory-card:hover {
  transform: translateY(-6px);
  border-color: rgba(255, 142, 75, 0.6);
  box-shadow: 0 20px 40px rgba(12, 17, 27, 0.42), 0 10px 24px rgba(255, 120, 66, 0.18);
}

.memory-card__date {
  font-size: 0.75rem;
  letter-spacing: 0.14em;
  color: var(--text-muted);
  text-transform: uppercase;
  font-weight: 600;
}

.memory-card__title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.memory-card__snippet {
  margin: 0;
  color: var(--text-soft);
  font-size: 0.85rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.memory-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.tag-chip {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.25rem 0.7rem;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  background: rgba(255, 138, 61, 0.15);
  color: #ffd2b0;
  font-weight: 600;
}

.state {
  padding: 1rem 1.25rem;
  border-radius: 0.9rem;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.02);
  font-size: 0.95rem;
  color: var(--text-soft);
}

.state--error {
  border-color: rgba(255, 94, 94, 0.4);
  background: rgba(255, 94, 94, 0.12);
  color: #ff9d9d;
}

.state--blank {
  text-align: center;
  margin-top: auto;
}

.skeleton-list {
  display: grid;
  gap: 1rem;
}

.skeleton-card {
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 1.05rem;
  background: #05070d;
  display: grid;
  gap: 0.75rem;
  overflow: hidden;
}

.skeleton-line {
  height: 0.75rem;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0.18) 50%,
    rgba(255, 255, 255, 0.08) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-line.short {
  width: 45%;
  height: 0.65rem;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

@media (max-width: 960px) {
  .panel {
    padding: 1.1rem;
  }

  .memory-card__title {
    font-size: 1rem;
  }
}
</style>
