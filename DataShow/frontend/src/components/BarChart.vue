<template>
  <div class="bar-chart-container">
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
  horizontal?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '柱状图',
  horizontal: false
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

  const xAxis = props.horizontal ? { type: 'value' } : { type: 'category', data: props.data.map(d => d.name) }
  const yAxis = props.horizontal ? { type: 'category', data: props.data.map(d => d.name) } : { type: 'value' }

  const option: echarts.EChartsOption = {
    title: {
      text: props.title,
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: xAxis,
    yAxis: yAxis,
    series: [
      {
        name: props.title,
        type: 'bar',
        data: props.data.map(d => d.value),
        itemStyle: {
          borderRadius: props.horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
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
.bar-chart-container {
  width: 100%;
  height: 100%;
}

.chart {
  width: 100%;
  height: 500px;
}
</style>
