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

const emit = defineEmits(['select', 'create', 'edit', 'delete'])

const handleSelect = (entry) => {
  if (!entry || props.loading || props.creating) {
    return
  }
  emit('select', entry.id)
}

const handleEdit = (entry, event) => {
  event?.stopPropagation?.()
  if (!entry || props.loading || props.creating) {
    return
  }
  emit('edit', entry)
}

const handleDelete = (entry, event) => {
  event?.stopPropagation?.()
  if (!entry || props.loading || props.creating) {
    return
  }
  const confirmed = window.confirm(
    `Delete "${entry.title || 'memory'}"? This will remove it from local storage.`,
  )
  if (!confirmed) {
    return
  }
  emit('delete', entry)
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
        <button
          type="button"
          class="memory-card__delete"
          :aria-label="`Delete ${entry.title || 'memory'}`"
          :disabled="creating || loading"
          @click="handleDelete(entry, $event)"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M3 6h18"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
            <path
              d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M10 11v6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
            <path
              d="M14 11v6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>
        <button
          type="button"
          class="memory-card__edit"
          :aria-label="`Edit ${entry.title || 'memory'}`"
          :disabled="creating || loading"
          @click="handleEdit(entry, $event)"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M12 20h9"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
            <path
              d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

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
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
}

.panel--scroll {
  max-height: min(101vh, 936px);
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--border-strong) transparent;
}

.panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.eyebrow {
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--text-muted);
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  flex-wrap: wrap;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.eyebrow__count {
  color: var(--accent);
  letter-spacing: 0;
}

.panel__cta {
  padding: 0.55rem 1.2rem;
  border-radius: 10px;
  border: 1px solid var(--accent);
  background: var(--accent);
  color: var(--accent-text);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 200ms cubic-bezier(0.34, 1.2, 0.64, 1), color 200ms cubic-bezier(0.34, 1.2, 0.64, 1), box-shadow 200ms cubic-bezier(0.34, 1.2, 0.64, 1), transform 200ms cubic-bezier(0.34, 1.2, 0.64, 1);
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.panel__cta:hover,
.panel__cta:focus-visible {
  background: transparent;
  color: var(--accent);
  box-shadow: 0 0 0 2px var(--accent-glow), 0 0 24px var(--accent-glow);
  transform: translateY(-2px) scale(1.02);
  outline: none;
}

.panel__cta:disabled {
  opacity: 0.35;
  cursor: not-allowed;
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
  gap: 0;
}

.memory-card {
  position: relative;
  display: block;
  border-radius: 0;
  border: none;
  border-left: 3px solid transparent;
  background: transparent;
  transition: border-color 200ms cubic-bezier(0.34, 1.2, 0.64, 1), background 200ms cubic-bezier(0.34, 1.2, 0.64, 1), box-shadow 200ms cubic-bezier(0.34, 1.2, 0.64, 1), transform 200ms cubic-bezier(0.34, 1.2, 0.64, 1);
}

.memory-card + .memory-card {
  border-top: 1px solid var(--border);
}

.memory-card__edit {
  position: absolute;
  top: 0.75rem;
  right: 0.5rem;
  width: 1.8rem;
  height: 1.8rem;
  border-radius: 8px;
  border: 1px solid var(--ghost-border);
  background: var(--surface);
  color: var(--text-soft);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 200ms cubic-bezier(0.34, 1.2, 0.64, 1), border-color 200ms cubic-bezier(0.34, 1.2, 0.64, 1), color 200ms cubic-bezier(0.34, 1.2, 0.64, 1), background 200ms cubic-bezier(0.34, 1.2, 0.64, 1), box-shadow 200ms cubic-bezier(0.34, 1.2, 0.64, 1), transform 200ms cubic-bezier(0.34, 1.2, 0.64, 1);
  pointer-events: none;
  z-index: 2;
}

.memory-card__delete {
  position: absolute;
  top: 0.75rem;
  right: 2.5rem;
  width: 1.8rem;
  height: 1.8rem;
  border-radius: 8px;
  border: 1px solid var(--ghost-border);
  background: var(--surface);
  color: var(--text-soft);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 200ms cubic-bezier(0.34, 1.2, 0.64, 1), border-color 200ms cubic-bezier(0.34, 1.2, 0.64, 1), color 200ms cubic-bezier(0.34, 1.2, 0.64, 1), background 200ms cubic-bezier(0.34, 1.2, 0.64, 1), box-shadow 200ms cubic-bezier(0.34, 1.2, 0.64, 1), transform 200ms cubic-bezier(0.34, 1.2, 0.64, 1);
  pointer-events: none;
  z-index: 2;
}

.memory-card:hover .memory-card__edit,
.memory-card:hover .memory-card__delete,
.memory-card:focus-within .memory-card__edit,
.memory-card:focus-within .memory-card__delete {
  opacity: 1;
  pointer-events: auto;
}

.memory-card__edit:hover,
.memory-card__edit:focus-visible {
  background: var(--accent-dim);
  border-color: var(--accent);
  color: var(--accent);
  box-shadow: 0 0 16px var(--accent-glow);
  transform: scale(1.1);
  outline: none;
}

.memory-card__delete:hover,
.memory-card__delete:focus-visible {
  background: var(--error-dim);
  border-color: var(--error);
  color: var(--error);
  box-shadow: 0 0 16px rgba(248, 113, 113, 0.25);
  transform: scale(1.1);
  outline: none;
}

.memory-card__edit:disabled,
.memory-card__delete:disabled {
  opacity: 0;
  pointer-events: none;
}

.memory-card--active {
  border-left-color: var(--accent);
  border-left-width: 3px;
  background: var(--accent-dim);
}

.memory-card__button {
  width: 100%;
  padding: 1rem 3.5rem 1rem 1rem;
  text-align: left;
  background: transparent;
  border: 0;
  color: inherit;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  align-items: flex-start;
  border-radius: inherit;
  cursor: pointer;
  transition: transform 200ms cubic-bezier(0.34, 1.2, 0.64, 1), box-shadow 200ms cubic-bezier(0.34, 1.2, 0.64, 1);
}

.memory-card__button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: -2px;
}

.memory-card:hover:not(.memory-card--active) {
  background: var(--surface-raised);
  transform: translateX(4px);
  box-shadow: -4px 0 20px var(--accent-glow);
}

.memory-card__date {
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 500;
  text-transform: uppercase;
}

.memory-card__title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-heading);
  font-family: 'Plus Jakarta Sans', sans-serif;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.35;
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
  gap: 0.4rem;
}

.tag-chip {
  display: inline-flex;
  align-items: center;
  border-radius: 6px;
  padding: 0.2rem 0.55rem;
  font-size: 0.65rem;
  letter-spacing: 0.04em;
  background: var(--tag-bg);
  color: var(--tag-text);
  font-weight: 600;
  border: 1px solid var(--tag-border);
  font-family: 'Plus Jakarta Sans', sans-serif;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 200ms ease;
}
.memory-card__tags .tag-chip:hover {
  transform: scale(1.05);
  box-shadow: 0 0 12px var(--accent-glow);
}

.state {
  padding: 1rem 1.25rem;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--surface);
  font-size: 0.9rem;
  color: var(--text-soft);
}

.state--error {
  border-color: rgba(255, 77, 77, 0.3);
  background: var(--error-dim);
  color: var(--error);
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
  border-radius: 10px;
  border: 1px solid var(--border);
  padding: 1.05rem;
  background: var(--surface);
  display: grid;
  gap: 0.75rem;
  overflow: hidden;
}

.skeleton-line {
  height: 0.75rem;
  border-radius: 2px;
  background: linear-gradient(
    90deg,
    var(--surface-raised) 0%,
    var(--surface-high) 50%,
    var(--surface-raised) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-line.short {
  width: 40%;
  height: 0.65rem;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 220ms cubic-bezier(0.34, 1.1, 0.64, 1), transform 220ms cubic-bezier(0.34, 1.1, 0.64, 1);
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
