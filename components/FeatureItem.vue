<template>
  <div class="flex items-start gap-3 p-3 rounded-lg bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div class="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0" :style="iconBgStyle">
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

const iconBgStyle = computed(() => {
  const map = {
    blue: { backgroundColor: 'var(--theme-info-bg)', color: 'var(--theme-info-text)' },
    red: { backgroundColor: 'var(--theme-danger-bg)', color: 'var(--theme-danger-text)' },
    emerald: { backgroundColor: 'var(--theme-success-bg)', color: 'var(--theme-success-text)' },
    purple: { backgroundColor: 'var(--theme-tip-bg)', color: 'var(--theme-tip-text)' },
    amber: { backgroundColor: 'var(--theme-warning-bg)', color: 'var(--theme-warning-text)' },
    slate: { backgroundColor: 'var(--theme-neutral-bg)', color: 'var(--theme-neutral-text)' }
  }
  return map[props.color] || map.blue
})
</script>
