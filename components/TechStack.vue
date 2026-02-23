<script setup lang="ts">
defineProps<{
  title: string
  items: Array<{
    name: string
    icon?: string
    version?: string
  }>
}>()
</script>

<template>
  <div class="w-full">
    <div class="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2 ml-1">
      {{ title }}
    </div>
    <div class="grid grid-cols-4 gap-2">
      <div v-for="item in items" :key="item.name" 
           class="bg-slate-50 border border-slate-100 rounded-lg p-2 flex flex-col items-center justify-center text-center hover:border-red-200 transition-colors cursor-default group">
        <div class="text-xl mb-1 group-hover:scale-110 transition-transform">
          {{ item.icon || '🛠️' }}
        </div>
        <div class="text-[11px] font-bold text-slate-700 truncate w-full px-1">
          {{ item.name }}
        </div>
        <div v-if="item.version" class="text-[9px] text-slate-400">
          {{ item.version }}
        </div>
      </div>
    </div>
  </div>
</template>
