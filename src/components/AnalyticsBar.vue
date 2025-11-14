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
  const max = Math.max(...props.data.map((item) => item.chars ?? 0))
  const safeMax = max === 0 ? 1 : max
  const scale = 180
  return props.data.map((item) => {
    const chars = item.chars ?? 0
    const ratio = chars / safeMax
    const computedHeight = Math.round(ratio * scale)
    const minHeight = chars === 0 ? 4 : 10
    const blogCount = item.count ?? 0
    const blogLabel = `${blogCount} ${blogCount === 1 ? 'blog' : 'blogs'}`
    const accessibleLabel = `${item.label?.replace(/\n/g, ' ') ?? ''} — ${blogLabel}`
    return {
      ...item,
      chars,
      count: blogCount,
      blogLabel,
      accessibleLabel,
      active: props.activeKey === item.key,
      height: Math.max(minHeight, computedHeight),
    }
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
  <section class="board" aria-labelledby="analytics-heading">

    <div v-if="!data.length" class="state">
      Analytics will appear once memories are added.
    </div>

    <div
      v-else
      :class="['chart', { 'chart--disabled': disabled }]"
      role="list"
      :aria-disabled="disabled ? 'true' : 'false'"
      :style="{ '--bar-count': enriched.length || 1 }"
    >
      <div
        v-for="item in enriched"
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
        <div
          :class="['chart__bar', { 'chart__bar--empty': item.chars === 0, 'chart__bar--active': item.active }]"
          :style="{ '--bar-height': item.height }"
        >
          <span v-if="item.chars" class="chart__value">{{ item.chars.toLocaleString() }}</span>
        </div>
        <div class="chart__tooltip" role="presentation">
          <span class="chart__tooltip-label">{{ item.label }}</span>
          <span class="chart__tooltip-count">{{ item.blogLabel }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.board {
  padding: clamp(1.5rem, 1.1rem + 1.4vw, 2.2rem);
  border-radius: 1.4rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: #07090f;
  box-shadow: 0 20px 50px rgba(4, 6, 10, 0.55);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
  overflow: hidden;
}

.board__header {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  position: relative;
}

.board__header h2 {
  margin: 0;
  font-size: clamp(1.35rem, 1.2rem + 0.5vw, 1.75rem);
  font-weight: 600;
  color: var(--text);
}

.state {
  border-radius: 1rem;
  border: 1px dashed rgba(255, 255, 255, 0.15);
  padding: 1.5rem;
  text-align: center;
  color: var(--text-soft);
  font-size: 0.95rem;
  background: rgba(255, 255, 255, 0.03);
}

.chart {
  display: grid;
  grid-template-columns: repeat(var(--bar-count, 1), minmax(2px, 1fr));
  align-items: end;
  gap: 1px;
  position: relative;
}

.chart::before {
  content: '';
  position: absolute;
  bottom: -0.25rem;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.2), transparent);
  pointer-events: none;
}

.chart__column {
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  position: relative;
  z-index: 1;
  cursor: pointer;
}

.chart--disabled {
  opacity: 0.7;
  pointer-events: none;
}

.chart--disabled .chart__column {
  cursor: not-allowed;
}

.chart__bar {
  width: 100%;
  height: calc(var(--bar-height) * 1px);
  border-radius: 0;
  background-color: rgba(255, 138, 61, 0.75);
  border: 1px solid rgba(255, 138, 61, 0.4);
  box-shadow: 0 12px 22px rgba(255, 120, 66, 0.22);
  position: relative;
  overflow: hidden;
  transition: transform 160ms ease, background-color 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
}

.chart__bar--empty {
  background-color: rgba(255, 138, 61, 0.12);
  border-color: rgba(255, 138, 61, 0.18);
  box-shadow: none;
}

.chart__bar--active {
  background-color: var(--accent);
  border-color: rgba(255, 138, 61, 0.7);
  box-shadow: 0 18px 34px rgba(255, 120, 66, 0.28);
}

.chart__value {
  position: absolute;
  top: -1.2rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.68rem;
  font-weight: 600;
  color: var(--text-soft);
  letter-spacing: 0.06em;
  white-space: nowrap;
}

.chart__column:focus-visible {
  outline: none;
}

.chart__column:hover .chart__bar:not(.chart__bar--empty),
.chart__column:focus-visible .chart__bar:not(.chart__bar--empty) {
  background-color: var(--accent);
  border-color: rgba(255, 138, 61, 0.7);
  box-shadow: 0 18px 34px rgba(255, 120, 66, 0.28);
  transform: translateY(-4px);
}

.chart--disabled .chart__column:hover .chart__bar,
.chart--disabled .chart__column:focus-visible .chart__bar {
  background-color: rgba(255, 138, 61, 0.75);
  border-color: rgba(255, 138, 61, 0.4);
  box-shadow: 0 12px 22px rgba(255, 120, 66, 0.22);
  transform: none;
}

.chart__tooltip {
  position: absolute;
  bottom: calc(100% + 0.85rem);
  left: 50%;
  transform: translate(-50%, 6px);
  padding: 0.45rem 0.65rem;
  border-radius: 0.6rem;
  background: #030304;
  border: 1px solid rgba(255, 138, 61, 0.45);
  color: var(--text);
  font-size: 0.66rem;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  opacity: 0;
  pointer-events: none;
  transition: opacity 150ms ease, transform 150ms ease;
  box-shadow: 0 12px 28px rgba(4, 6, 10, 0.48);
  z-index: 20;
}

.chart__tooltip-label {
  display: block;
  font-weight: 600;
  white-space: pre-line;
}

.chart__tooltip-count {
  display: block;
  margin-top: 0.15rem;
  color: rgba(255, 213, 182, 0.9);
  letter-spacing: 0.05em;
}

.chart__column:hover .chart__tooltip,
.chart__column:focus-visible .chart__tooltip {
  opacity: 1;
  transform: translate(-50%, 0);
}

@media (max-width: 768px) {
  .board {
    margin-top: 2rem;
  }
}
</style>
