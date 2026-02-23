<script setup lang="ts">
defineProps<{
  type?: 'info' | 'warning' | 'success' | 'tip'
  title?: string
}>()
</script>

<template>
  <div :class="[
    'w-full p-4 rounded-xl border-l-4 flex gap-3 my-2',
    type === 'warning' ? 'bg-amber-50 border-amber-400 text-amber-900' :
    type === 'success' ? 'bg-emerald-50 border-emerald-400 text-emerald-900' :
    type === 'tip' ? 'bg-purple-50 border-purple-400 text-purple-900' :
    'bg-blue-50 border-blue-400 text-blue-900'
  ]">
    <div class="text-xl flex-shrink-0">
      <span v-if="type === 'warning'">⚠️</span>
      <span v-else-if="type === 'success'">✅</span>
      <span v-else-if="type === 'tip'">💡</span>
      <span v-else>ℹ️</span>
    </div>
    <div>
      <h4 v-if="title" class="font-bold text-sm mb-1 uppercase tracking-tight">{{ title }}</h4>
      <div class="text-xs leading-relaxed opacity-90 font-medium">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
