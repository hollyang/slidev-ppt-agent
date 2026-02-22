<template>
  <div class="relative border-l-2 border-slate-200 ml-2 pl-4 py-1 mb-2 group hover:border-blue-500 transition-colors">
    <div class="absolute w-3 h-3 bg-white border-2 border-slate-300 rounded-full -left-[7px] top-2 group-hover:border-blue-500 group-hover:bg-blue-50 transition-colors"></div>
    <div class="text-xs font-bold text-blue-600 mb-0.5">{{ date }}</div>
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
