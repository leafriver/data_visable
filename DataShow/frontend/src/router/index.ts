import { createRouter, createWebHistory } from 'vue-router'
import ChartView from '../views/ChartView.vue'
import Home from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/pie-chart',
      name: 'PieChart',
      component: ChartView
    },
    {
      path: '/bar-chart',
      name: 'BarChart',
      component: ChartView
    },
    {
      path: '/line-chart',
      name: 'LineChart',
      component: ChartView
    },
    {
      path: '/radar-chart',
      name: 'RadarChart',
      component: ChartView
    },
    {
      path: '/scatter-chart',
      name: 'ScatterChart',
      component: ChartView
    },
    {
      path: '/heatmap-chart',
      name: 'HeatmapChart',
      component: ChartView
    },
    {
      path: '/funnel-chart',
      name: 'FunnelChart',
      component: ChartView
    },
    {
      path: '/gauge-chart',
      name: 'GaugeChart',
      component: ChartView
    }
  ],
})

export default router
