<template>
  <div class="radar-chart-container">
    <div ref="chartRef" class="chart"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

interface ChartData {
  name: string
  value: number
}

interface Props {
  data: ChartData[]
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '雷达图'
})

const chartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null

const initChart = () => {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)
  updateChart()

  window.addEventListener('resize', handleResize)
}

const updateChart = () => {
  if (!chartInstance) return

  const option: echarts.EChartsOption = {
    title: {
      text: props.title,
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      data: [props.title],
      top: 'bottom'
    },
    radar: {
      indicator: props.data.map(d => ({
        name: d.name,
        max: Math.max(...props.data.map(item => item.value)) * 1.2
      })),
      radius: '60%'
    },
    series: [
      {
        name: props.title,
        type: 'radar',
        data: [
          {
            value: props.data.map(d => d.value),
            name: props.title,
            areaStyle: {
              color: 'rgba(64, 158, 255, 0.2)'
            },
            lineStyle: {
              color: '#409eff',
              width: 2
            },
            itemStyle: {
              color: '#409eff'
            }
          }
        ],
        emphasis: {
          lineStyle: {
            width: 4
          }
        }
      }
    ]
  }

  chartInstance.setOption(option)
}

const handleResize = () => {
  chartInstance?.resize()
}

watch(
  () => props.data,
  () => {
    updateChart()
  },
  { deep: true }
)

onMounted(() => {
  initChart()
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  window.removeEventListener('resize', handleResize)
})

defineExpose({
  updateChart,
  resize: handleResize,
  getInstance: () => chartInstance
})
</script>

<style scoped>
.radar-chart-container {
  width: 100%;
  height: 100%;
}

.chart {
  width: 100%;
  height: 500px;
}
</style>
