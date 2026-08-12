<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  width: {
    type: String,
    default: '90vw',
  },
  height: {
    type: String,
    default: '90vh',
  },
})

const emit = defineEmits(['close'])

const dialogRef = ref(null)

const close = () => emit('close')

const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    event.preventDefault()
    close()
  }
}

const unlockScroll = () => {
  document.body.style.overflow = ''
}

watch(
  () => props.open,
  async (open) => {
    if (!open) {
      document.removeEventListener('keydown', handleKeydown)
      unlockScroll()
      return
    }

    document.addEventListener('keydown', handleKeydown)
    document.body.style.overflow = 'hidden'
    await nextTick()
    dialogRef.value?.focus?.()
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  unlockScroll()
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="modal-overlay" @click.self="close">
      <section
        ref="dialogRef"
        class="modal"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
        tabindex="-1"
        :style="{ '--modal-width': width, '--modal-height': height }"
      >
        <header class="modal__header">
          <h2 class="modal__title">{{ title }}</h2>
          <button type="button" class="modal__close" @click="close" aria-label="Close">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M6 6 18 18M18 6 6 18"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </button>
        </header>
        <div class="modal__body">
          <slot />
        </div>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1.25rem, 3vw, 2.5rem);
  z-index: 9999;
  animation: overlay-in 200ms ease both;
}

@keyframes overlay-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal {
  width: var(--modal-width, 75vw);
  max-width: 1080px;
  height: min(var(--modal-height, 90vh), calc(100dvh - 4rem));
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  border: 1px solid var(--border-strong);
  background: var(--surface);
  position: relative;
  overflow: hidden;
  outline: none;
  animation: modal-fade-in 200ms ease both;
}

@keyframes modal-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem 0;
  position: relative;
  z-index: 1;
  border-bottom: 1px solid var(--border);
  padding-bottom: 1rem;
}

.modal__title {
  margin: 0;
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-muted);
  font-weight: 500;
  font-family: var(--font-ui);
}

.modal__close {
  width: 2rem;
  height: 2rem;
  border-radius: 8px;
  border: 1px solid var(--ghost-border);
  background: transparent;
  color: var(--text-soft);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 150ms ease, border-color 150ms ease, color 150ms ease;
}

.modal__close:hover,
.modal__close:focus-visible {
  background: var(--tag-bg);
  border-color: var(--tag-text);
  color: var(--tag-text);
  outline: none;
}

.modal__body {
  flex: 1 1 auto;
  overflow: auto;
  padding: 1.5rem;
  position: relative;
  z-index: 1;
  background: var(--surface);
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: 0;
  }

  .modal {
    width: 100vw;
    max-width: none;
    height: 100dvh;
    border-radius: 0;
    border: none;
  }

  .modal__header,
  .modal__body {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .modal__body {
    padding-top: 1rem;
  }
}
</style>
