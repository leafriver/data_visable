<script setup lang="ts"></script>

<template>
  <div id="app">
    <header class="header">
      <nav class="nav">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/pie-chart" class="nav-link">饼图</router-link>
        <router-link to="/bar-chart" class="nav-link">柱状图</router-link>
        <router-link to="/line-chart" class="nav-link">折线图</router-link>
        <router-link to="/radar-chart" class="nav-link">雷达图</router-link>
        <router-link to="/scatter-chart" class="nav-link">散点图</router-link>
        <router-link to="/heatmap-chart" class="nav-link">热力图</router-link>
        <router-link to="/funnel-chart" class="nav-link">漏斗图</router-link>
        <router-link to="/gauge-chart" class="nav-link">仪表盘</router-link>
      </nav>
    </header>
    <main class="main">
      <router-view />
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  gap: 20px;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 4px;
  transition: background-color 0.3s;
  font-weight: 500;
}

.nav-link:hover,
.nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
}

.main {
  flex: 1;
  padding: 0;
}
</style>
