<script setup lang="ts">
defineProps<{
  steps: Array<{
    title: string
    desc: string
    icon?: string
    status?: 'active' | 'done' | 'pending'
  }>
}>()

function doneLineStyle(status?: 'active' | 'done' | 'pending') {
  return status === 'done' ? { backgroundColor: 'var(--theme-primary-light-hex)' } : {}
}

function nodeStyle(status?: 'active' | 'done' | 'pending') {
  if (status === 'active') {
    return {
      borderColor: 'var(--theme-primary-hex)',
      color: 'var(--theme-primary-hex)'
    }
  }
  if (status === 'done') {
    return {
      backgroundColor: 'var(--theme-primary-hex)',
      borderColor: 'var(--theme-primary-hex)',
      color: '#ffffff'
    }
  }
  return {}
}

function titleStyle(status?: 'active' | 'done' | 'pending') {
  return status === 'active' ? { color: 'var(--theme-primary-hex)' } : {}
}
</script>

<template>
  <div class="flex items-start justify-between gap-4 w-full px-4 py-2">
    <div v-for="(step, index) in steps" :key="index" class="flex-1 relative">
      <!-- 连接线 -->
      <div v-if="index < steps.length - 1" 
           class="absolute top-5 left-1/2 w-full h-[2px] bg-slate-100 z-0">
        <div v-if="step.status === 'done'" class="h-full w-full" :style="doneLineStyle(step.status)"></div>
      </div>
      
      <!-- 内容 -->
      <div class="relative z-10 flex flex-col items-center text-center">
        <div :class="[
          'w-10 h-10 rounded-full flex items-center justify-center mb-3 border-2 transition-all duration-300',
          step.status === 'active' ? 'bg-white shadow-lg scale-110' : 
          step.status === 'done' ? '' : 
          'bg-slate-50 border-slate-200 text-slate-400'
        ]" :style="nodeStyle(step.status)">
          <div v-if="step.icon" :class="[step.icon, 'text-sm']"></div>
          <span v-else class="text-sm font-bold">{{ index + 1 }}</span>
        </div>
        <h4 :class="['font-bold text-sm mb-1', step.status === 'active' ? '' : 'text-slate-700']" :style="titleStyle(step.status)">
          {{ step.title }}
        </h4>
        <p class="text-[10px] text-slate-400 leading-snug px-2">
          {{ step.desc }}
        </p>
      </div>
    </div>
  </div>
</template>
