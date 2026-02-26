<template>
  <div class="relative bg-white rounded-xl p-5 shadow-sm border border-slate-100 italic text-slate-600 text-sm leading-relaxed
              hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
    <div class="quote-mark absolute -top-3 -left-1 text-4xl font-serif opacity-50">"</div>
    <div class="relative z-10"><slot></slot></div>
    <div class="mt-3 flex items-center gap-2 not-italic">
      <div class="quote-avatar w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm">
        {{ initials }}
      </div>
      <div>
        <div class="font-bold text-slate-800 text-xs tracking-wide">{{ author }}</div>
        <div class="text-[10px] text-slate-400 font-medium">{{ role }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  author: String,
  role: String
})

const initials = computed(() => {
  if (!props.author) return 'U'
  return props.author.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
})
</script>

<style scoped>
.quote-mark {
  color: var(--theme-info-border);
}

.quote-avatar {
  background: linear-gradient(135deg, var(--theme-primary-bg), var(--theme-primary-bg-subtle));
  color: var(--theme-neutral-text);
}
</style>
