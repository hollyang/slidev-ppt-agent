<template>
  <div class="grid grid-cols-3 text-[11px]">
    <div class="p-2 bg-slate-50/50 font-semibold text-slate-700 border-b border-r border-slate-100 flex items-center">{{ dimension }}</div>
    <div class="p-2 border-b border-r border-slate-100 text-slate-500">
      <slot name="old" />
    </div>
    <div class="p-2 border-b border-slate-100 text-slate-700 font-medium">
      <slot name="new" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  dimension: String
})
</script>
