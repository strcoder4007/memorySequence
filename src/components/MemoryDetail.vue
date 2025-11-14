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
})
</script>

<template>
  <section class="detail panel">
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
  background:
    linear-gradient(155deg, rgba(16, 22, 33, 0.92), rgba(6, 8, 13, 0.75)),
    radial-gradient(120% 140% at 10% -20%, rgba(255, 138, 61, 0.1), transparent 65%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 1.5rem;
  padding: clamp(1.35rem, 1.2rem + 1vw, 2rem);
  box-shadow: 0 24px 50px rgba(5, 7, 11, 0.55);
  min-height: min(640px, 72vh);
  position: relative;
  overflow: hidden;
}

.panel::after {
  content: '';
  position: absolute;
  top: -40%;
  right: -35%;
  bottom: -40%;
  left: -35%;
  background: radial-gradient(circle at top, rgba(255, 138, 61, 0.18), transparent 70%);
  pointer-events: none;
}

.panel__header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.panel__header h2 {
  margin: 0;
  font-size: clamp(1.35rem, 1.2rem + 0.6vw, 1.85rem);
  line-height: 1.18;
  font-weight: 600;
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

.subtext {
  margin: 0;
  color: var(--text-soft);
  font-size: 0.95rem;
}

.tag-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.tag-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 0.3rem 0.85rem;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  background: rgba(255, 138, 61, 0.14);
  color: #ffd9bd;
}

.tag-chip--solid {
  background: var(--accent-gradient);
  color: #140a06;
  font-weight: 700;
}

.detail__body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.prose :deep(*) {
  max-width: 72ch;
}

.prose :deep(p) {
  margin: 0 0 1rem;
  color: var(--text-soft);
  line-height: 1.75;
  font-size: 0.98rem;
}

.prose :deep(p:last-child) {
  margin-bottom: 0;
}

.prose :deep(a) {
  color: var(--accent);
  text-decoration: underline;
  text-decoration-color: rgba(255, 138, 61, 0.5);
  text-decoration-thickness: 2px;
}

.prose :deep(strong) {
  color: var(--text);
}

.state {
  padding: 1.25rem;
  border-radius: 1rem;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.02);
  color: var(--text-soft);
}

.state--error {
  border-color: rgba(255, 94, 94, 0.35);
  background: rgba(255, 94, 94, 0.1);
  color: #ffb4b4;
}

.state--blank {
  margin-top: 4rem;
  text-align: center;
  color: var(--text-soft);
}

.skeleton-wrapper {
  display: grid;
  gap: 1rem;
}

.skeleton-line {
  height: 0.9rem;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.06) 0%,
    rgba(255, 255, 255, 0.16) 50%,
    rgba(255, 255, 255, 0.06) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite;
}

.skeleton-line.title {
  height: 1.5rem;
  width: 80%;
}

.skeleton-line.half {
  width: 40%;
}

.skeleton-line.long {
  height: 6rem;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@media (max-width: 960px) {
  .panel {
    padding: 1.25rem;
    border-radius: 1.25rem;
  }
}
</style>
