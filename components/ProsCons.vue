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
    <div class="pros-box border rounded-xl p-3">
      <div class="flex items-center gap-2 mb-2 pros-text font-bold">
        <div class="w-6 h-6 pros-dot-badge text-white rounded-full flex items-center justify-center text-xs">✓</div>
        {{ prosTitle || '优势 / 收益' }}
      </div>
      <ul class="space-y-2">
        <li v-for="item in pros" :key="item" class="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
          <span class="pros-dot mt-0.5">•</span>
          {{ item }}
        </li>
      </ul>
    </div>

    <!-- 劣势/挑战 -->
    <div class="cons-box border rounded-xl p-3">
      <div class="flex items-center gap-2 mb-2 cons-text font-bold">
        <div class="w-6 h-6 cons-dot-badge text-white rounded-full flex items-center justify-center text-xs">!</div>
        {{ consTitle || '风险 / 挑战' }}
      </div>
      <ul class="space-y-2">
        <li v-for="item in cons" :key="item" class="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
          <span class="cons-dot mt-0.5">•</span>
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.pros-box {
  background-color: var(--theme-success-bg);
  border-color: var(--theme-success-border);
}

.pros-text {
  color: var(--theme-success-text);
}

.pros-dot-badge {
  background-color: var(--theme-success-solid);
}

.pros-dot {
  color: var(--theme-success-solid);
}

.cons-box {
  background-color: var(--theme-danger-bg);
  border-color: var(--theme-danger-border);
}

.cons-text {
  color: var(--theme-danger-text);
}

.cons-dot-badge {
  background-color: var(--theme-danger-solid);
}

.cons-dot {
  color: var(--theme-danger-solid);
}
</style>
