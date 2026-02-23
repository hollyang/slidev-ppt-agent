<script setup lang="ts">
defineProps<{
  number?: string | number
  title: string
  subtitle?: string
}>()
</script>

<template>
  <div class="mb-6 flex flex-col items-start border-b border-slate-100 pb-4">
    <div class="flex items-center gap-3 mb-2">
      <div v-if="number" class="theme-number w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold">
        {{ number }}
      </div>
      <h2 class="!text-3xl font-extrabold !mb-0 tracking-tight">
        <span class="theme-gradient-text">{{ title }}</span>
      </h2>
    </div>
    <p v-if="subtitle" class="text-slate-500 text-sm mt-2 max-w-2xl leading-relaxed">
      {{ subtitle }}
    </p>
  </div>
</template>
