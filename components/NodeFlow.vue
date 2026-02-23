<script setup lang="ts">
defineProps<{
  nodes: Array<{
    title: string
    type: 'input' | 'process' | 'output'
    icon?: string
  }>
}>()
</script>

<template>
  <div class="flex items-center justify-center gap-2 py-8">
    <template v-for="(node, index) in nodes" :key="index">
      <!-- 节点卡片 -->
      <div :class="[
        'px-4 py-3 rounded-xl border-2 shadow-sm transition-all duration-500 hover:scale-105',
        node.type === 'input' ? 'bg-blue-50 border-blue-200 text-blue-700' :
        node.type === 'output' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
        'bg-white border-slate-200 text-slate-700'
      ]">
        <div class="flex items-center gap-2">
          <div :class="[node.icon || 'i-carbon-cube', 'text-xl']"></div>
          <span class="text-[11px] font-bold uppercase tracking-wider">{{ node.title }}</span>
        </div>
      </div>
      
      <!-- 箭头 -->
      <div v-if="index < nodes.length - 1" class="text-slate-300 animate-pulse">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </div>
    </template>
  </div>
</template>
