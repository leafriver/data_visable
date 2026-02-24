<template>
  <div class="gauge-chart-container">
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
  title: '仪表盘'
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

  const maxValue = Math.max(...props.data.map(d => d.value))
  const mainValue = props.data[0]?.value || 0

  const option: echarts.EChartsOption = {
    title: {
      text: props.title,
      left: 'center'
    },
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: maxValue * 1.2,
        splitNumber: 8,
        axisLine: {
          lineStyle: {
            width: 6,
            color: [
              [0.25, '#FF6E76'],
              [0.5, '#FDDD60'],
              [0.75, '#58D9F9'],
              [1, '#7CFFB2']
            ]
          }
        },
        pointer: {
          icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
          length: '12%',
          width: 20,
          offsetCenter: [0, '-60%'],
          itemStyle: {
            color: 'auto'
          }
        },
        axisTick: {
          length: 12,
          lineStyle: {
            color: 'auto',
            width: 2
          }
        },
        splitLine: {
          length: 20,
          lineStyle: {
            color: 'auto',
            width: 5
          }
        },
        axisLabel: {
          color: '#464646',
          fontSize: 14,
          distance: -60,
          formatter: function (value: number) {
            return value.toFixed(0)
          }
        },
        title: {
          offsetCenter: [0, '-20%'],
          fontSize: 20,
          color: '#999'
        },
        detail: {
          fontSize: 30,
          offsetCenter: [0, '0%'],
          valueAnimation: true,
          formatter: function (value: number) {
            return value.toFixed(2)
          },
          color: 'auto'
        },
        data: [
          {
            value: mainValue,
            name: props.data[0]?.name || '指标'
          }
        ]
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
.gauge-chart-container {
  width: 100%;
  height: 100%;
}

.chart {
  width: 100%;
  height: 500px;
}
</style>
