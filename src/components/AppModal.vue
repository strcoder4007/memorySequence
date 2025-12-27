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
  background: rgba(0, 0, 0, 0.62);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: clamp(1.25rem, 3vw, 2.5rem);
  z-index: 9999;
  overflow-y: auto;
}

.modal {
  width: var(--modal-width, 75vw);
  max-width: 1100px;
  height: min(var(--modal-height, 90vh), calc(100vh - 4rem));
  display: flex;
  flex-direction: column;
  margin-top: clamp(1rem, 4vh, 3rem);
  border-radius: 1.4rem;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background:
    linear-gradient(155deg, rgba(16, 22, 33, 0.96), rgba(6, 8, 13, 0.88)),
    radial-gradient(120% 140% at 10% -20%, rgba(255, 138, 61, 0.12), transparent 65%);
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.55);
  position: relative;
  overflow: hidden;
  outline: none;
}

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.1rem 1.35rem 0;
  position: relative;
  z-index: 1;
}

.modal__title {
  margin: 0;
  font-size: 0.95rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(255, 213, 182, 0.82);
  font-weight: 700;
}

.modal__close {
  width: 2.35rem;
  height: 2.35rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 138, 61, 0.45);
  background: rgba(255, 138, 61, 0.1);
  color: var(--text);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
}

.modal__close:hover,
.modal__close:focus-visible {
  background: rgba(255, 138, 61, 0.22);
  border-color: rgba(255, 138, 61, 0.75);
  box-shadow: 0 10px 24px rgba(255, 120, 66, 0.18);
  outline: none;
}

.modal__body {
  flex: 1 1 auto;
  overflow: auto;
  padding: 1.1rem 1.35rem 1.35rem;
  position: relative;
  z-index: 1;
}

@media (max-width: 960px) {
  .modal {
    width: 94vw;
    border-radius: 1.2rem;
  }

  .modal__header,
  .modal__body {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>
