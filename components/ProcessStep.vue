<script setup lang="ts">
defineProps<{
  steps: Array<{
    title: string
    desc: string
    icon?: string
    status?: 'active' | 'done' | 'pending'
  }>
}>()
</script>

<template>
  <div class="flex items-start justify-between gap-4 w-full px-4 py-6">
    <div v-for="(step, index) in steps" :key="index" class="flex-1 relative">
      <!-- 连接线 -->
      <div v-if="index < steps.length - 1" 
           class="absolute top-5 left-1/2 w-full h-[2px] bg-slate-100 z-0">
        <div v-if="step.status === 'done'" class="h-full bg-red-400 w-full"></div>
      </div>
      
      <!-- 内容 -->
      <div class="relative z-10 flex flex-col items-center text-center">
        <div :class="[
          'w-10 h-10 rounded-full flex items-center justify-center mb-3 border-2 transition-all duration-300',
          step.status === 'active' ? 'bg-white border-red-500 text-red-500 shadow-lg scale-110' : 
          step.status === 'done' ? 'bg-red-500 border-red-500 text-white' : 
          'bg-slate-50 border-slate-200 text-slate-400'
        ]">
          <span v-if="step.icon">{{ step.icon }}</span>
          <span v-else class="text-sm font-bold">{{ index + 1 }}</span>
        </div>
        <h4 :class="['font-bold text-sm mb-1', step.status === 'active' ? 'text-red-600' : 'text-slate-700']">
          {{ step.title }}
        </h4>
        <p class="text-[10px] text-slate-400 leading-snug px-2">
          {{ step.desc }}
        </p>
      </div>
    </div>
  </div>
</template>
