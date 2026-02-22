<template>
  <div class="flex items-start gap-3 p-3 rounded-lg bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div class="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0" :class="iconBgClass">
      <slot name="icon" />
    </div>
    <div class="flex-1 min-w-0">
      <h4 class="text-xs font-bold text-slate-800 leading-snug mb-0.5">{{ title }}</h4>
      <p class="text-[11px] text-slate-500 leading-relaxed"><slot /></p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: String,
  color: { type: String, default: 'blue' }
})

const iconBgClass = computed(() => {
  const map = {
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-purple-50 text-purple-600',
    amber: 'bg-amber-50 text-amber-600',
    slate: 'bg-slate-100 text-slate-600'
  }
  return map[props.color] || map.blue
})
</script>
