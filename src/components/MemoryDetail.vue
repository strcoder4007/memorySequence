<script setup>
const props = defineProps({
  entry: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
  embedded: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <section class="detail panel" :class="{ 'panel--embedded': embedded }">
    <div class="panel__header">
      <p class="eyebrow">Memory</p>
      <h2 v-if="entry">{{ entry.title }}</h2>
      <h2 v-else>Choose an entry</h2>
      <p class="subtext" v-if="entry">
        {{ entry.formattedDate }} · {{ entry.readingTime }} min read
      </p>
      <p class="subtext" v-else>Tap a card to load the full story.</p>
    </div>

    <div v-if="error" class="state state--error">
      {{ error }}
    </div>

    <div v-else-if="loading" class="skeleton-wrapper" aria-hidden="true">
      <div class="skeleton-line title"></div>
      <div class="skeleton-line half"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line long"></div>
    </div>

    <div v-else-if="entry" class="detail__body">
      <div v-if="entry.tags?.length" class="tag-group">
        <span v-for="tag in entry.tags" :key="tag" class="tag-chip tag-chip--solid">{{ tag }}</span>
      </div>

      <article
        class="prose"
        v-html="entry.sanitizedContent"
      ></article>
    </div>

    <div v-else class="state state--blank">
      Select an entry from the archive to read it in full.
    </div>
  </section>
</template>

<style scoped>
.panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: clamp(1.5rem, 1.5rem + 1vw, 2.5rem);
  min-height: min(640px, 72vh);
  position: relative;
}

.panel--embedded {
  border: none;
  border-radius: 0;
  min-height: 0;
  padding: 0;
}

.panel__header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border);
}

.panel__header h2 {
  margin: 0;
  font-size: clamp(1.4rem, 1.2rem + 0.8vw, 2rem);
  line-height: 1.2;
  font-weight: 700;
  font-family: var(--font-body);
  color: var(--text-heading);
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
  font-family: var(--font-body);
}

.subtext {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.9rem;
  font-family: var(--font-body);
}

.tag-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.tag-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  padding: 0.2rem 0.6rem;
  font-size: 0.65rem;
  letter-spacing: 0.04em;
  background: var(--tag-bg);
  color: var(--tag-text);
  border: 1px solid var(--tag-border);
  font-family: var(--font-body);
  font-weight: 600;
  text-transform: uppercase;
}

.tag-chip--solid {
  background: var(--tag-bg);
  color: var(--tag-text);
  font-weight: 700;
  border-color: var(--tag-border);
}

.detail__body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.prose :deep(*) {
  max-width: 65ch;
}

.prose :deep(p) {
  margin: 0 0 1.25rem;
  color: var(--prose-color);
  line-height: 1.9;
  font-size: 1.05rem;
  letter-spacing: 0.01em;
  font-family: var(--font-body);
}

.prose :deep(p:last-child) {
  margin-bottom: 0;
}

.prose :deep(a) {
  color: var(--tag-text);
  text-decoration: underline;
  text-decoration-color: rgba(96, 165, 250, 0.4);
  text-underline-offset: 3px;
  transition: color 200ms ease, text-decoration-color 200ms ease;
}

.prose :deep(a:hover) {
  color: var(--accent);
  text-decoration-color: var(--accent);
}

.prose :deep(strong) {
  color: var(--text);
  font-weight: 600;
}

.state {
  padding: 1.25rem;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-soft);
}

.state--error {
  border-color: rgba(255, 77, 77, 0.3);
  background: var(--error-dim);
  color: var(--error);
}

.state--blank {
  margin-top: 4rem;
  text-align: center;
  color: var(--text-muted);
  font-family: var(--font-body);
  font-style: italic;
  font-size: 1.05rem;
}

.skeleton-wrapper {
  display: grid;
  gap: 1rem;
}

.skeleton-line {
  height: 0.9rem;
  border-radius: 2px;
  background: linear-gradient(
    90deg,
    var(--surface-raised) 0%,
    var(--surface-high) 50%,
    var(--surface-raised) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite;
}

.skeleton-line.title {
  height: 1.5rem;
  width: 75%;
}

.skeleton-line.half {
  width: 35%;
}

.skeleton-line.long {
  height: 5rem;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@media (max-width: 960px) {
  .panel {
    padding: 1.25rem;
    border-radius: 2px;
  }
}
</style>
