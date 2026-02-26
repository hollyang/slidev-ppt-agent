<template>
  <div class="mb-2">
    <div class="flex justify-between items-center mb-1">
      <span class="text-[11px] font-bold text-slate-700">{{ label }}</span>
      <span class="text-[11px] font-bold" :style="valueStyle">{{ value }}%</span>
    </div>
    <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
      <div class="h-2 rounded-full transition-all duration-700" :style="{ ...barStyle, width: value + '%' }"></div>
    </div>
    <div v-if="$slots.default" class="text-[10px] text-slate-400 mt-0.5"><slot /></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: String,
  value: Number,
  color: { type: String, default: 'blue' }
})

const barStyle = computed(() => {
  const map = {
    blue: { backgroundColor: 'var(--theme-info-text)' },
    red: { backgroundColor: 'var(--theme-danger-solid)' },
    emerald: { backgroundColor: 'var(--theme-success-solid)' },
    purple: { backgroundColor: 'var(--theme-tip-solid)' },
    amber: { backgroundColor: 'var(--theme-warning-solid)' }
  }
  return map[props.color] || map.blue
})

const valueStyle = computed(() => {
  const map = {
    blue: { color: 'var(--theme-info-text)' },
    red: { color: 'var(--theme-danger-text)' },
    emerald: { color: 'var(--theme-success-text)' },
    purple: { color: 'var(--theme-tip-text)' },
    amber: { color: 'var(--theme-warning-text)' }
  }
  return map[props.color] || map.blue
})
</script>
