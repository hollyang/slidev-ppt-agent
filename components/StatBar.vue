<template>
  <div class="mb-2">
    <div class="flex justify-between items-center mb-1">
      <span class="text-[11px] font-bold text-slate-700">{{ label }}</span>
      <span class="text-[11px] font-bold" :class="valueColorClass">{{ value }}%</span>
    </div>
    <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
      <div class="h-2 rounded-full transition-all duration-700" :class="barColorClass" :style="{ width: value + '%' }"></div>
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

const barColorClass = computed(() => {
  const map = {
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    emerald: 'bg-emerald-500',
    purple: 'bg-purple-500',
    amber: 'bg-amber-500'
  }
  return map[props.color] || map.blue
})

const valueColorClass = computed(() => {
  const map = {
    blue: 'text-blue-600',
    red: 'text-red-600',
    emerald: 'text-emerald-600',
    purple: 'text-purple-600',
    amber: 'text-amber-600'
  }
  return map[props.color] || map.blue
})
</script>
