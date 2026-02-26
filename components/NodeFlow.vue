<script setup lang="ts">
defineProps<{
  nodes: Array<{
    title: string
    type: 'input' | 'process' | 'output'
    icon?: string
  }>
}>()

function nodeStyle(type: 'input' | 'process' | 'output') {
  if (type === 'input') {
    return {
      backgroundColor: 'var(--theme-info-bg)',
      borderColor: 'var(--theme-info-border)',
      color: 'var(--theme-info-text)'
    }
  }
  if (type === 'output') {
    return {
      backgroundColor: 'var(--theme-success-bg)',
      borderColor: 'var(--theme-success-border)',
      color: 'var(--theme-success-text)'
    }
  }
  return {
    backgroundColor: '#ffffff',
    borderColor: 'var(--theme-neutral-border)',
    color: 'var(--theme-neutral-text)'
  }
}
</script>

<template>
  <div class="flex items-center justify-center gap-2 py-3">
    <template v-for="(node, index) in nodes" :key="index">
      <!-- 节点卡片 -->
      <div :class="[
        'px-4 py-3 rounded-xl border-2 shadow-sm transition-all duration-500 hover:scale-105'
      ]" :style="nodeStyle(node.type)">
        <div class="flex items-center gap-2">
          <div :class="[node.icon || 'i-carbon-cube', 'text-xl']"></div>
          <span class="text-[11px] font-bold uppercase tracking-wider">{{ node.title }}</span>
        </div>
      </div>
      
      <!-- 箭头 -->
      <div v-if="index < nodes.length - 1" class="animate-pulse" style="color: var(--theme-neutral-border);">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </div>
    </template>
  </div>
</template>
