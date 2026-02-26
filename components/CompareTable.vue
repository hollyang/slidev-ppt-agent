<template>
  <div class="rounded-xl overflow-hidden border border-slate-100 shadow-sm">
    <!-- 表头 -->
    <div class="grid grid-cols-3 text-xs font-bold">
      <div class="p-2 text-center border-b border-r border-slate-100 ct-dimension">{{ dimensionLabel || '对比维度' }}</div>
      <div class="p-2 text-center border-b border-r" :style="oldHeaderStyle">{{ oldLabel }}</div>
      <div class="p-2 text-center border-b" :style="newHeaderStyle">{{ newLabel }}</div>
    </div>
    <!-- 行 -->
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  oldLabel: { type: String, default: '旧方案' },
  newLabel: { type: String, default: '新方案' },
  dimensionLabel: { type: String, default: '对比维度' },
  oldColor: { type: String, default: 'slate' },
  newColor: { type: String, default: 'emerald' }
})

const colorMap = {
  slate: { backgroundColor: 'var(--theme-neutral-bg)', color: 'var(--theme-neutral-text)' },
  emerald: { backgroundColor: 'var(--theme-success-bg)', color: 'var(--theme-success-text)' },
  blue: { backgroundColor: 'var(--theme-info-bg)', color: 'var(--theme-info-text)' },
  red: { backgroundColor: 'var(--theme-danger-bg)', color: 'var(--theme-danger-text)' },
  purple: { backgroundColor: 'var(--theme-tip-bg)', color: 'var(--theme-tip-text)' },
  orange: { backgroundColor: 'var(--theme-warning-bg)', color: 'var(--theme-warning-text)' },
  amber: { backgroundColor: 'var(--theme-warning-bg)', color: 'var(--theme-warning-text)' },
  rose: { backgroundColor: 'var(--theme-danger-bg)', color: 'var(--theme-danger-text)' }
}

const oldHeaderStyle = computed(() => colorMap[props.oldColor] || colorMap.slate)
const newHeaderStyle = computed(() => colorMap[props.newColor] || colorMap.emerald)
</script>

<style scoped>
.ct-dimension {
  background-color: var(--theme-neutral-bg);
  color: var(--theme-neutral-text);
}
</style>
