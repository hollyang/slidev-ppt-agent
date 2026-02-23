<script setup lang="ts">
defineProps<{
  name: string
  role: string
  avatar?: string
  bio?: string
  tags?: string[]
}>()
</script>

<template>
  <div class="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex items-start gap-4 h-full">
    <div class="w-16 h-16 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center text-2xl overflow-hidden border-2 border-slate-50">
      <img v-if="avatar" :src="avatar" class="w-full h-full object-cover" />
      <span v-else>👤</span>
    </div>
    <div class="flex-1">
      <div class="flex items-center justify-between mb-1">
        <h4 class="font-bold text-slate-800">{{ name }}</h4>
        <span class="theme-badge text-[10px] px-2 py-0.5 rounded">{{ role }}</span>
      </div>
      <p v-if="bio" class="text-[11px] text-slate-500 leading-snug mb-2">
        {{ bio }}
      </p>
      <div v-if="tags" class="flex flex-wrap gap-1">
        <span v-for="tag in tags" :key="tag" class="text-[9px] bg-slate-50 text-slate-400 px-1.5 py-0.5 rounded">
          # {{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>
