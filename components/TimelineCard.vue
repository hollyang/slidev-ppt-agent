<template>
  <div class="timeline-root relative border-l-2 ml-2 pl-4 py-1 mb-2 group transition-colors">
    <div class="timeline-dot absolute w-3 h-3 bg-white border-2 rounded-full -left-[7px] top-2 transition-colors"></div>
    <div class="timeline-date text-xs font-bold mb-0.5">{{ date }}</div>
    <h3 class="font-bold text-slate-800 text-sm leading-snug">{{ title }}</h3>
    <p class="text-slate-500 text-xs mt-0.5 leading-relaxed"><slot></slot></p>
  </div>
</template>

<script setup>
defineProps({
  date: String,
  title: String
})
</script>

<style scoped>
.timeline-root {
  border-left-color: var(--theme-neutral-border);
}

.timeline-root:hover {
  border-left-color: var(--theme-info-border);
}

.timeline-dot {
  border-color: var(--theme-neutral-border);
}

.timeline-root:hover .timeline-dot {
  border-color: var(--theme-info-border);
  background-color: var(--theme-info-bg);
}

.timeline-date {
  color: var(--theme-info-text);
}
</style>
