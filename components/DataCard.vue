<template>
  <div class="bg-white rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-slate-100 p-4 transition-all duration-300 hover:shadow-[0_4px_20px_rgb(0,0,0,0.08)] hover:-translate-y-0.5">
    <div class="flex items-center gap-3 mb-2">
      <div :class="`w-9 h-9 rounded-lg flex items-center justify-center text-lg ${colorClass}`">
        <slot name="icon"></slot>
      </div>
      <div>
        <h3 class="text-slate-500 text-xs font-semibold uppercase tracking-wider leading-tight">{{ title }}</h3>
        <div class="text-xl font-bold text-slate-800 tracking-tight leading-tight">{{ value }}</div>
      </div>
    </div>
    <div class="text-xs font-medium" :class="trend > 0 ? 'text-emerald-500' : 'text-rose-500'">
      <span class="font-bold">{{ trend > 0 ? '+' : '' }}{{ trend }}%</span>
      <span class="text-slate-400 font-normal ml-1">vs last quarter</span>
    </div>
    <div class="mt-2 text-slate-600 text-xs leading-relaxed">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: String,
  value: String,
  trend: Number,
  colorVariant: {
    type: String,
    default: 'blue'
  }
})

const colorClass = computed(() => {
  const map = {
    blue: 'bg-blue-50 text-blue-600 border border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    purple: 'bg-purple-50 text-purple-600 border border-purple-100',
    rose: 'bg-rose-50 text-rose-600 border border-rose-100',
  }
  return map[props.colorVariant] || map.blue
})
</script>
