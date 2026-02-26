<template>
  <div class="bg-white rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-slate-100 p-4 transition-all duration-300 hover:shadow-[0_4px_20px_rgb(0,0,0,0.08)] hover:-translate-y-0.5">
    <div class="flex items-center gap-3 mb-2">
      <div class="w-9 h-9 rounded-lg flex items-center justify-center text-lg border" :style="iconStyle">
        <slot name="icon"></slot>
      </div>
      <div>
        <h3 class="text-slate-500 text-xs font-semibold uppercase tracking-wider leading-tight">{{ title }}</h3>
        <div class="text-xl font-bold text-slate-800 tracking-tight leading-tight">{{ value }}</div>
      </div>
    </div>
    <div class="text-xs font-medium" :style="trendStyle">
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

const iconStyle = computed(() => {
  const map = {
    blue: { backgroundColor: 'var(--theme-info-bg)', color: 'var(--theme-info-text)', borderColor: 'var(--theme-info-border)' },
    emerald: { backgroundColor: 'var(--theme-success-bg)', color: 'var(--theme-success-text)', borderColor: 'var(--theme-success-border)' },
    purple: { backgroundColor: 'var(--theme-tip-bg)', color: 'var(--theme-tip-text)', borderColor: 'var(--theme-tip-border)' },
    rose: { backgroundColor: 'var(--theme-danger-bg)', color: 'var(--theme-danger-text)', borderColor: 'var(--theme-danger-border)' },
    orange: { backgroundColor: 'var(--theme-warning-bg)', color: 'var(--theme-warning-text)', borderColor: 'var(--theme-warning-border)' }
  }
  return map[props.colorVariant] || map.blue
})

const trendStyle = computed(() => ({
  color: props.trend > 0 ? 'var(--theme-success-solid)' : 'var(--theme-danger-solid)'
}))
</script>
