<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  type?: 'info' | 'warning' | 'success' | 'tip'
  title?: string
}>()

const variantClass = computed(() => {
  if (props.type === 'warning') return 'callout-warning'
  if (props.type === 'success') return 'callout-success'
  if (props.type === 'tip') return 'callout-tip'
  return 'callout-info'
})
</script>

<template>
  <div :class="[
    'w-full p-4 rounded-xl border-l-4 flex gap-3 my-2',
    variantClass
  ]">
    <div class="text-xl flex-shrink-0">
      <span v-if="props.type === 'warning'">⚠️</span>
      <span v-else-if="props.type === 'success'">✅</span>
      <span v-else-if="props.type === 'tip'">💡</span>
      <span v-else>ℹ️</span>
    </div>
    <div>
      <h4 v-if="props.title" class="font-bold text-sm mb-1 uppercase tracking-tight">{{ props.title }}</h4>
      <div class="text-xs leading-relaxed opacity-90 font-medium">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.callout-info {
  background-color: var(--theme-info-bg);
  border-color: var(--theme-info-border);
  color: var(--theme-info-text);
}

.callout-warning {
  background-color: var(--theme-warning-bg);
  border-color: var(--theme-warning-border);
  color: var(--theme-warning-text);
}

.callout-success {
  background-color: var(--theme-success-bg);
  border-color: var(--theme-success-border);
  color: var(--theme-success-text);
}

.callout-tip {
  background-color: var(--theme-tip-bg);
  border-color: var(--theme-tip-border);
  color: var(--theme-tip-text);
}
</style>
