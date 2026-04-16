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
  background: #FFFFFF;
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: clamp(1.5rem, 1.5rem + 1vw, 2.5rem);
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  min-height: min(640px, 72vh);
  position: relative;
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
  font-weight: 600;
  font-family: 'Newsreader', serif;
  color: var(--text);
}

.eyebrow {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--text-muted);
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  flex-wrap: wrap;
  font-family: 'DM Sans', sans-serif;
}

.subtext {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.9rem;
  font-family: 'DM Sans', sans-serif;
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
  border-radius: 4px;
  padding: 0.2rem 0.6rem;
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  background: var(--accent-soft);
  color: var(--accent);
  border: 1px solid rgba(196, 98, 45, 0.2);
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
}

.tag-chip--solid {
  background: var(--accent);
  color: #FFFFFF;
  font-weight: 600;
  border-color: var(--accent);
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
  color: var(--text);
  line-height: 1.85;
  font-size: 1.0625rem;
  font-family: 'Newsreader', serif;
}

.prose :deep(p:last-child) {
  margin-bottom: 0;
}

.prose :deep(a) {
  color: var(--accent);
  text-decoration: underline;
  text-decoration-color: rgba(196, 98, 45, 0.4);
  text-underline-offset: 3px;
}

.prose :deep(strong) {
  color: var(--text);
  font-weight: 600;
}

.state {
  padding: 1.25rem;
  border-radius: 4px;
  border: 1px solid var(--border);
  background: #FFFFFF;
  color: var(--text-soft);
}

.state--error {
  border-color: rgba(196, 98, 45, 0.3);
  background: #FFF8F5;
  color: var(--accent);
}

.state--blank {
  margin-top: 4rem;
  text-align: center;
  color: var(--text-muted);
  font-family: 'Newsreader', serif;
  font-style: italic;
  font-size: 1.05rem;
}

.skeleton-wrapper {
  display: grid;
  gap: 1rem;
}

.skeleton-line {
  height: 0.9rem;
  border-radius: 4px;
  background: linear-gradient(
    90deg,
    #F0EBE5 0%,
    #E5DDD3 50%,
    #F0EBE5 100%
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
    border-radius: 4px;
  }
}
</style>
