<script setup lang="ts">
defineProps<{
  number?: string | number
  title: string
  subtitle?: string
}>()
</script>

<template>
  <div class="h-full flex flex-col justify-center items-center text-center">
    <div v-if="number" class="theme-number w-12 h-12 flex items-center justify-center rounded-full text-xl font-bold mb-6">
      {{ number }}
    </div>
    <h2 class="!text-5xl font-extrabold !mb-4 tracking-tight">
      <span class="theme-gradient-text">{{ title }}</span>
    </h2>
    <div v-if="subtitle" class="h-1 w-16 bg-slate-200 mb-4"></div>
    <p v-if="subtitle" class="text-slate-500 text-lg max-w-xl leading-relaxed">
      {{ subtitle }}
    </p>
  </div>
</template>
