<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  activeKey: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['select'])

const enriched = computed(() => {
  if (!props.data.length) {
    return []
  }
  const max = Math.max(...props.data.map((item) => item.words ?? 0))
  const safeMax = max === 0 ? 1 : max
  const scale = 120
  return props.data.map((item) => {
    const chars = item.chars ?? 0
    const words = item.words ?? 0
    // Use logarithmic scale for better visual distribution across word counts
    const logMax = Math.log1p(safeMax)
    const logWords = Math.log1p(words)
    const ratio = logWords / logMax
    const computedHeight = Math.round(ratio * scale)
    const minHeight = words === 0 ? 4 : 16
    const blogCount = item.count ?? 0
    const blogLabel = blogCount === 1 ? '1 blog' : `${blogCount} blogs`
    const wordLabel = words === 1 ? '1 word' : `${words.toLocaleString()} words`
    const accessibleLabel = `${item.label?.replace(/\n/g, ' ') ?? ''} — ${wordLabel}`
    return {
      ...item,
      chars,
      words,
      count: blogCount,
      blogLabel,
      wordLabel,
      accessibleLabel,
      active: props.activeKey === item.key,
      height: Math.max(minHeight, computedHeight),
    }
  })
})

// Detect year boundaries
const enrichedWithYear = computed(() => {
  if (!enriched.value.length) return []
  return enriched.value.map((item, index) => {
    const label = item.label ?? ''
    const yearMatch = label.match(/(\d{4})$/)
    const year = yearMatch ? yearMatch[1] : null
    const prev = index > 0 ? enriched.value[index - 1] : null
    const prevYearMatch = prev?.label?.match(/(\d{4})$/)
    const prevYear = prevYearMatch ? prevYearMatch[1] : null
    const showYear = year !== null && (index === 0 || year !== prevYear)
    return { ...item, year, showYear }
  })
})

const handleSelect = (item) => {
  if (props.disabled) {
    return
  }
  if (!item?.key) {
    return
  }
  emit('select', item.key)
}
</script>

<template>
  <section class="board">
    <span class="eyebrow">Monthly Activity</span>

    <div v-if="!data.length" class="state">
      Analytics will appear once memories are added.
    </div>

    <!-- Chart wrapper -->
    <div v-else class="chart-scroll">
      <div
        :class="['chart', { 'chart--disabled': disabled }]"
        role="list"
        :aria-disabled="disabled ? 'true' : 'false'"
      >
        <!-- Baseline -->
        <div class="chart__baseline" aria-hidden="true" />

        <!-- Bars row -->
        <div class="chart__bars-region">
          <div
            v-for="item in enrichedWithYear"
            :key="item.key ?? item.label"
            :class="[
              'chart__column',
              { 'chart__column--active': item.active, 'chart__column--empty': item.chars === 0 },
            ]"
            :aria-label="item.accessibleLabel"
            :aria-selected="item.active ? 'true' : 'false'"
            :tabindex="disabled ? -1 : 0"
            role="listitem"
            @click="handleSelect(item)"
            @keydown.enter.prevent="handleSelect(item)"
            @keydown.space.prevent="handleSelect(item)"
          >
            <!-- Value label above bar — hover only -->
            <span class="chart__value">
              {{ item.words.toLocaleString() }}
            </span>

            <!-- The bar -->
            <div
              :class="['chart__bar', { 'chart__bar--empty': item.chars === 0, 'chart__bar--active': item.active }]"
              :style="{ '--bar-height': item.height }"
            >
              <span v-if="item.active" class="chart__bar-dot" aria-hidden="true" />
            </div>

            <!-- Tooltip — hover only -->
            <div class="chart__tooltip" role="presentation">
              <span class="chart__tooltip-label">{{ item.label }}</span>
              <span class="chart__tooltip-count">{{ item.wordLabel }}</span>
              <span class="chart__tooltip-sub">{{ item.blogLabel }}</span>
            </div>

            <!-- Year label — only for first month of each year -->
            <div v-if="item.showYear" class="chart__year-label" aria-hidden="true">
              {{ item.year }}
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
.board {
  padding: clamp(1.25rem, 1rem + 1.5vw, 2rem);
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--surface);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  overflow: hidden;
}

.eyebrow {
  font-size: 0.62rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-muted);
  font-weight: 600;
  flex-shrink: 0;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.state {
  border-radius: 10px;
  border: 1px dashed var(--border-strong);
  padding: 2rem 1.5rem;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.875rem;
  background: var(--surface-raised);
  font-family: 'Plus Jakarta Sans', sans-serif;
}

/* Scrollable container */
.chart-scroll {
  overflow: visible;
}

.chart {
  position: relative;
  width: 100%;
  min-width: 0;
}

.chart--disabled {
  opacity: 0.5;
  pointer-events: none;
}

.chart__baseline {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    var(--border-strong) 8%,
    var(--border-strong) 92%,
    transparent
  );
  pointer-events: none;
  z-index: 0;
}

.chart__bars-region {
  display: flex;
  align-items: flex-end;
  gap: 0;
  padding-bottom: 1.5rem;
  padding-top: 1.2rem;
  position: relative;
  z-index: 1;
}

.chart__column {
  min-width: 0;
  flex: 1 1 0%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  position: relative;
  z-index: 1;
  cursor: pointer;
}

.chart--disabled .chart__column {
  cursor: not-allowed;
}

.chart__value {
  font-size: 0.6rem;
  font-weight: 600;
  color: var(--accent);
  letter-spacing: 0.03em;
  margin-bottom: 0.35rem;
  white-space: nowrap;
  font-family: 'Outfit', sans-serif;
  opacity: 0;
  transition: opacity 150ms ease;
  height: 0;
  overflow: hidden;
}

.chart__column:hover .chart__value {
  opacity: 1;
  height: auto;
  overflow: visible;
}

/* Year label — always visible, only for first month of year */
.chart__year-label {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.58rem;
  letter-spacing: 0.06em;
  color: var(--text-soft);
  font-weight: 600;
  font-family: 'Outfit', sans-serif;
  white-space: nowrap;
  pointer-events: none;
}

.chart__bar {
  width: 100%;
  height: calc(var(--bar-height) * 1px);
  min-height: 4px;
  border-radius: 4px;
  background: linear-gradient(
    160deg,
    color-mix(in srgb, var(--accent) 75%, var(--bg) 25%) 0%,
    var(--accent) 100%
  );
  position: relative;
  transition:
    transform 220ms cubic-bezier(0.34, 1.3, 0.64, 1),
    box-shadow 200ms ease;
  box-shadow: 0 0 8px var(--accent-glow);
}

.chart__bar--empty {
  background: var(--border-strong);
  border-radius: 4px;
  height: 6px !important;
  min-height: 6px;
  box-shadow: none;
}

.chart__bar--active {
  background: linear-gradient(160deg, var(--accent) 0%, color-mix(in srgb, var(--accent) 60%, var(--bg) 40%) 100%);
  box-shadow:
    0 0 12px var(--accent-glow),
    0 0 24px var(--accent-glow);
}

.chart__bar-dot {
  position: absolute;
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 2px var(--accent-glow);
}

.chart__column:focus-visible {
  outline: none;
}

.chart__column:focus-visible .chart__bar:not(.chart__bar--empty) {
  outline: 2px solid var(--accent-dim);
  outline-offset: 2px;
}

.chart__column:hover .chart__bar:not(.chart__bar--empty):not(.chart__bar--active) {
  transform: translateY(-3px);
  box-shadow: 0 0 20px var(--accent-glow);
}

.chart__tooltip {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translate(-50%, 6px);
  padding: 0.6rem 0.9rem;
  border-radius: 8px;
  background: var(--surface-high);
  border: 1px solid var(--border-strong);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  opacity: 0;
  pointer-events: none;
  transition: opacity 180ms ease, transform 180ms cubic-bezier(0.34, 1.2, 0.64, 1);
  z-index: 20;
  white-space: nowrap;
}

.chart__tooltip-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-heading);
  margin-bottom: 0.15rem;
}

.chart__tooltip-count {
  display: block;
  font-size: 0.75rem;
  color: var(--accent);
  font-weight: 600;
}

.chart__tooltip-sub {
  display: block;
  font-size: 0.68rem;
  color: var(--text-muted);
  margin-top: 0.1rem;
}

.chart__column:hover .chart__tooltip,
.chart__column:focus-visible .chart__tooltip {
  opacity: 1;
  transform: translate(-50%, 0);
}


@media (max-width: 768px) {
  .board {
    margin-top: 1.5rem;
  }
}
</style>
