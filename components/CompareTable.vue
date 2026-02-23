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

const colorMap = {
  slate: 'bg-slate-50 text-slate-700',
  emerald: 'bg-emerald-50 text-emerald-700',
  blue: 'bg-blue-50 text-blue-700',
  red: 'bg-red-50 text-red-700',
  purple: 'bg-purple-50 text-purple-700',
  orange: 'bg-orange-50 text-orange-700',
  amber: 'bg-amber-50 text-amber-700',
  rose: 'bg-rose-50 text-rose-700',
}

const oldBgClass = computed(() => colorMap[props.oldColor] || colorMap.slate)
const newBgClass = computed(() => colorMap[props.newColor] || colorMap.emerald)
</script>
