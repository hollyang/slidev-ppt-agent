<template>
  <div class="slidev-layout custom-layout relative h-full w-full text-slate-900 font-sans"
       :style="{ background: 'var(--theme-bg)' }">
    <!-- 页眉 -->
    <header class="custom-header absolute top-0 left-0 w-full px-6 py-2 flex justify-between items-center bg-white/90 backdrop-blur-sm z-10">
      <div class="flex items-center gap-2">
        <div class="brand-logo w-6 h-6 rounded flex items-center justify-center text-white text-[10px] font-black shadow-sm">
          {{ brandInitial }}
        </div>
        <div class="brand-name text-sm font-bold tracking-wide">{{ brand }}</div>
      </div>
      <div class="text-xs text-slate-400 font-medium tracking-wide">{{ subtitle }}</div>
    </header>

    <!-- 主内容区 -->
    <main class="custom-main w-full h-full pt-12 pb-6 px-8 overflow-y-auto">
      <slot />
    </main>

    <!-- 页脚 -->
    <footer class="custom-footer absolute bottom-0 left-0 w-full px-6 py-1.5 flex justify-between items-center bg-white/80 backdrop-blur-sm"
            v-if="$slidev.nav.currentPage !== 1">
      <div class="text-[10px] text-slate-400">{{ footer }}</div>
      <div class="text-[10px] font-semibold text-slate-400 flex gap-1">
        <span>{{ $slidev.nav.currentPage }}</span>
        <span>/</span>
        <span>{{ $slidev.nav.total }}</span>
      </div>
    </footer>
  </div>
</template>

<script setup>
/**
 * 品牌信息从 template.config.json 读取
 * 颜色从 styles/theme.css 的 CSS 变量控制
 */
import config from '../template.config.json'

const brand = config.brand || 'Presentation'
const subtitle = config.subtitle || ''
const footer = config.footer || ''
const brandInitial = brand.charAt(0)
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
@import url('../styles/theme.css');

.font-sans {
  font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

/* ━━━ 品牌色动态应用 ━━━ */
.brand-logo {
  background: linear-gradient(135deg, var(--theme-primary-hex), var(--theme-primary-dark-hex));
}
.brand-name {
  color: var(--theme-primary-hex);
}
.custom-header {
  border-bottom: 1px solid var(--theme-border);
}
.custom-footer {
  border-top: 1px solid var(--theme-border-light);
}

/* ━━━ 覆盖 Slidev 默认主题字号 ━━━ */
.custom-main h1 {
  font-size: 1.4rem !important;
  line-height: 1.3 !important;
  margin-top: 0 !important;
  margin-bottom: 0.25rem !important;
  font-weight: 800 !important;
}
.custom-main h2 {
  font-size: 1.1rem !important;
  line-height: 1.3 !important;
}
.custom-main h3 {
  font-size: 0.95rem !important;
  line-height: 1.3 !important;
}
.custom-main p {
  font-size: 0.8rem !important;
  line-height: 1.5 !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}
</style>
