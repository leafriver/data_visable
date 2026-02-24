<template>
  <div class="chart-view">
    <h1>数据可视化平台 - {{ chartTypeLabel }}</h1>

    <div class="controls">
      <div class="input-section">
        <h3>数据输入</h3>
        <div class="form-group">
          <label for="chartTitle">图表标题:</label>
          <input id="chartTitle" v-model="chartTitle" type="text" placeholder="请输入图表标题" />
        </div>

        <div class="form-group">
          <label for="dataInput">数据 (JSON格式):</label>
          <textarea
            id="dataInput"
            v-model="dataInput"
            placeholder='[{"name": "类别A", "value": 100}, {"name": "类别B", "value": 200}]'
            rows="8"
          ></textarea>
        </div>

        <div class="button-group">
          <button class="btn btn-primary" @click="renderChart">生成图表</button>
          <button class="btn btn-secondary" @click="loadSampleData">加载示例数据</button>
          <button class="btn btn-tertiary" @click="clearData">清空数据</button>
        </div>
      </div>

      <div class="file-import-section">
        <h3>文件导入/导出</h3>
        <p class="hint">支持导入 JSON 文件，格式为 [{"name": "类别名", "value": 数值}]</p>
        <input ref="fileInput" type="file" accept=".json" @change="handleFileImport" />
        <div class="button-group">
          <button class="btn btn-primary" @click="triggerFileImport">选择文件导入</button>
          <button class="btn btn-secondary" @click="exportData">导出数据</button>
        </div>
      </div>
    </div>

    <div class="chart-section">
      <div class="chart-header">
        <h2>{{ chartTitle }}</h2>
        <button class="btn btn-primary" @click="saveChart">保存图表为图片</button>
      </div>
      <div ref="chartContainerRef" class="chart-container">
        <BarChart v-if="chartType === 'bar'" ref="barChartRef" :data="chartData" :title="chartTitle" />
        <LineChart v-if="chartType === 'line'" ref="lineChartRef" :data="chartData" :title="chartTitle" />
        <RadarChart v-if="chartType === 'radar'" ref="radarChartRef" :data="chartData" :title="chartTitle" />
        <PieChart v-if="chartType === 'pie'" ref="pieChartRef" :data="chartData" :title="chartTitle" />
        <ScatterChart v-if="chartType === 'scatter'" ref="scatterChartRef" :data="chartData" :title="chartTitle" />
        <HeatmapChart v-if="chartType === 'heatmap'" ref="heatmapChartRef" :data="chartData" :title="chartTitle" />
        <FunnelChart v-if="chartType === 'funnel'" ref="funnelChartRef" :data="chartData" :title="chartTitle" />
        <GaugeChart v-if="chartType === 'gauge'" ref="gaugeChartRef" :data="chartData" :title="chartTitle" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import PieChart from '../components/PieChart.vue'
import BarChart from '../components/BarChart.vue'
import LineChart from '../components/LineChart.vue'
import RadarChart from '../components/RadarChart.vue'
import ScatterChart from '../components/ScatterChart.vue'
import HeatmapChart from '../components/HeatmapChart.vue'
import FunnelChart from '../components/FunnelChart.vue'
import GaugeChart from '../components/GaugeChart.vue'
import * as echarts from 'echarts'

interface ChartData {
  name: string
  value: number | [number, number]
}

const route = useRoute()

const chartType = computed(() => {
  const path = route.path
  if (path.includes('bar')) return 'bar'
  if (path.includes('line')) return 'line'
  if (path.includes('radar')) return 'radar'
  if (path.includes('scatter')) return 'scatter'
  if (path.includes('heatmap')) return 'heatmap'
  if (path.includes('funnel')) return 'funnel'
  if (path.includes('gauge')) return 'gauge'
  return 'pie'
})

const chartTypeLabel = computed(() => {
  const labels: Record<string, string> = {
    bar: '柱状图',
    line: '折线图',
    radar: '雷达图',
    pie: '饼图',
    scatter: '散点图',
    heatmap: '热力图',
    funnel: '漏斗图',
    gauge: '仪表盘'
  }
  return labels[chartType.value]
})

const chartTitle = ref(chartTypeLabel.value)
const dataInput = ref('')
const chartData = ref<ChartData[]>([])
const fileInput = ref<HTMLInputElement>()
const chartContainerRef = ref<HTMLElement>()
const pieChartRef = ref<InstanceType<typeof PieChart>>()
const barChartRef = ref<InstanceType<typeof BarChart>>()
const lineChartRef = ref<InstanceType<typeof LineChart>>()
const radarChartRef = ref<InstanceType<typeof RadarChart>>()
const scatterChartRef = ref<InstanceType<typeof ScatterChart>>()
const heatmapChartRef = ref<InstanceType<typeof HeatmapChart>>()
const funnelChartRef = ref<InstanceType<typeof FunnelChart>>()
const gaugeChartRef = ref<InstanceType<typeof GaugeChart>>()

const sampleData: Record<string, ChartData[]> = {
  bar: [
    { name: '一月', value: 320 },
    { name: '二月', value: 302 },
    { name: '三月', value: 301 },
    { name: '四月', value: 334 },
    { name: '五月', value: 390 }
  ],
  line: [
    { name: '周一', value: 150 },
    { name: '周二', value: 230 },
    { name: '周三', value: 224 },
    { name: '周四', value: 218 },
    { name: '周五', value: 135 },
    { name: '周六', value: 147 },
    { name: '周日', value: 260 }
  ],
  radar: [
    { name: '销售', value: 4200 },
    { name: '管理', value: 3000 },
    { name: '信息技术', value: 20000 },
    { name: '客服', value: 35000 },
    { name: '研发', value: 50000 },
    { name: '市场', value: 18000 }
  ],
  pie: [
    { name: '电子产品', value: 300 },
    { name: '服装', value: 200 },
    { name: '食品', value: 150 },
    { name: '家居', value: 100 },
    { name: '其他', value: 80 }
  ],
  scatter: [
    { name: '点1', value: [10, 20] },
    { name: '点2', value: [15, 30] },
    { name: '点3', value: [25, 15] },
    { name: '点4', value: [35, 40] },
    { name: '点5', value: [40, 25] }
  ],
  heatmap: Array.from({ length: 168 }, (_, i) => ({
    name: `数据${i}`,
    value: Math.floor(Math.random() * 100)
  })),
  funnel: [
    { name: '展示', value: 100 },
    { name: '点击', value: 80 },
    { name: '访问', value: 60 },
    { name: '咨询', value: 40 },
    { name: '订单', value: 20 }
  ],
  gauge: [
    { name: 'CPU使用率', value: 75 }
  ]
}

const renderChart = () => {
  try {
    const parsed = JSON.parse(dataInput.value)
    if (Array.isArray(parsed)) {
      const validData = parsed.filter((item) => item.name && typeof item.value === 'number')
      if (validData.length > 0) {
        chartData.value = validData
      } else {
        alert('数据格式不正确，请确保包含 name 和 value 字段')
      }
    } else {
      alert('数据必须是数组格式')
    }
  } catch (error) {
    alert('JSON 格式错误，请检查输入')
    console.error(error)
  }
}

const loadSampleData = () => {
  const data = sampleData[chartType.value] || []
  chartData.value = [...data]
  dataInput.value = JSON.stringify(data, null, 2)
}

const clearData = () => {
  chartData.value = []
  dataInput.value = ''
  chartTitle.value = chartTypeLabel.value
}

const triggerFileImport = () => {
  fileInput.value?.click()
}

const handleFileImport = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string
      const parsed = JSON.parse(content)
      if (Array.isArray(parsed)) {
        const validData = parsed.filter((item) => item.name && typeof item.value === 'number')
        if (validData.length > 0) {
          chartData.value = validData
          dataInput.value = JSON.stringify(parsed, null, 2)
          alert('数据导入成功！')
        } else {
          alert('文件数据格式不正确，请确保包含 name 和 value 字段')
        }
      } else {
        alert('文件数据必须是数组格式')
      }
    } catch (error) {
      alert('文件解析失败，请确保是有效的 JSON 文件')
      console.error(error)
    }
  }
  reader.readAsText(file)

  target.value = ''
}

const exportData = () => {
  if (chartData.value.length === 0) {
    alert('没有数据可导出，请先生成图表')
    return
  }

  const jsonString = JSON.stringify(chartData.value, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const timestamp = Date.now()
  const randomNum = Math.floor(Math.random() * 10000)

  const link = document.createElement('a')
  link.href = url
  link.download = `${timestamp}_${randomNum}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
  alert('数据导出成功！')
}

const saveChart = () => {
  if (chartData.value.length === 0) {
    alert('没有图表可保存，请先生成图表')
    return
  }

  let chartInstance: echarts.ECharts | null = null

  switch (chartType.value) {
    case 'pie':
      chartInstance = pieChartRef.value?.getInstance() || null
      break
    case 'bar':
      chartInstance = barChartRef.value?.getInstance() || null
      break
    case 'line':
      chartInstance = lineChartRef.value?.getInstance() || null
      break
    case 'radar':
      chartInstance = radarChartRef.value?.getInstance() || null
      break
    case 'scatter':
      chartInstance = scatterChartRef.value?.getInstance() || null
      break
    case 'heatmap':
      chartInstance = heatmapChartRef.value?.getInstance() || null
      break
    case 'funnel':
      chartInstance = funnelChartRef.value?.getInstance() || null
      break
    case 'gauge':
      chartInstance = gaugeChartRef.value?.getInstance() || null
      break
  }

  if (!chartInstance) {
    alert('图表实例不存在')
    return
  }

  const url = chartInstance.getDataURL({
    type: 'png',
    pixelRatio: 2,
    backgroundColor: '#fff'
  })

  const timestamp = Date.now()
  const randomNum = Math.floor(Math.random() * 10000)

  const link = document.createElement('a')
  link.href = url
  link.download = `${timestamp}_${randomNum}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  alert('图表保存成功！')
}
</script>

<style scoped>
.chart-view {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.input-section,
.file-import-section {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
}

h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #555;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-group textarea {
  font-family: 'Courier New', monospace;
  resize: vertical;
}

.button-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s, transform 0.1s;
}

.btn-primary {
  background-color: #409eff;
  color: white;
}

.btn-primary:hover {
  background-color: #66b1ff;
}

.btn-secondary {
  background-color: #67c23a;
  color: white;
}

.btn-secondary:hover {
  background-color: #85ce61;
}

.btn-tertiary {
  background-color: #f56c6c;
  color: white;
}

.btn-tertiary:hover {
  background-color: #f78989;
}

.btn:active {
  transform: translateY(-2px);
  transition: transform 0.1s;
}

.file-import-section input[type='file'] {
  display: none;
}

.hint {
  font-size: 12px;
  color: #666;
  margin-bottom: 10px;
}

.chart-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-header h2 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.chart-container {
  min-height: 500px;
}

@media (max-width: 768px) {
  .controls {
    grid-template-columns: 1fr;
  }
}
</style>
