<script setup lang="ts">
defineProps<{
  prosTitle?: string
  consTitle?: string
  pros: string[]
  cons: string[]
}>()
</script>

<template>
  <div class="grid grid-cols-2 gap-4 w-full">
    <!-- 优势 -->
    <div class="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3">
      <div class="flex items-center gap-2 mb-2 text-emerald-700 font-bold">
        <div class="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs">✓</div>
        {{ prosTitle || '优势 / 收益' }}
      </div>
      <ul class="space-y-2">
        <li v-for="item in pros" :key="item" class="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
          <span class="text-emerald-500 mt-0.5">•</span>
          {{ item }}
        </li>
      </ul>
    </div>

    <!-- 劣势/挑战 -->
    <div class="bg-rose-50/50 border border-rose-100 rounded-xl p-3">
      <div class="flex items-center gap-2 mb-2 text-rose-700 font-bold">
        <div class="w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs">!</div>
        {{ consTitle || '风险 / 挑战' }}
      </div>
      <ul class="space-y-2">
        <li v-for="item in cons" :key="item" class="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
          <span class="text-rose-500 mt-0.5">•</span>
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
</template>
