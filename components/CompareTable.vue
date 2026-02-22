<template>
  <div class="rounded-xl overflow-hidden border border-slate-100 shadow-sm">
    <!-- 表头 -->
    <div class="grid grid-cols-3 text-xs font-bold">
      <div class="bg-slate-50 p-2 text-slate-500 text-center border-b border-r border-slate-100">{{ dimensionLabel || '对比维度' }}</div>
      <div class="p-2 text-center border-b border-r" :class="oldBgClass">{{ oldLabel }}</div>
      <div class="p-2 text-center border-b" :class="newBgClass">{{ newLabel }}</div>
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

const oldBgClass = computed(() => `bg-${props.oldColor}-50 text-${props.oldColor}-700`)
const newBgClass = computed(() => `bg-${props.newColor}-50 text-${props.newColor}-700`)
</script>
