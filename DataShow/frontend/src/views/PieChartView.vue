<template>
  <div class="pie-chart-view">
    <h1>数据可视化平台 - 饼图</h1>

    <div class="controls">
      <div class="input-section">
        <h3>数据输入</h3>
        <div class="form-group">
          <label for="chartTitle">图表标题:</label>
          <input id="chartTitle" v-model="chartTitle" type="text" placeholder="请输入图表标题" />
          <!--这个label和input里面的for和id必须是相同的，并且这个label不写也没问题，照样可以传输数据。-->
        </div>

        <div class="form-group">
          <label for="dataInput">数据 (JSON格式):</label>
          <textarea
            id="dataInput"
            v-model="dataInput"
            placeholder='[{"name": "类别A", "value": 100}, {"name": "类别B", "value": 200}]'
            rows="12"
          ></textarea>
        </div>

        <div class="button-group">
          <button class="btn btn-primary" @click="renderChart">生成图表</button>
          <button class="btn btn-secondary" @click="loadSampleData">加载示例数据</button>
          <button class="btn btn-tertiary" @click="clearData">清空数据</button>
        </div>
      </div>

      <div class="file-import-section">
        <h3>文件导入</h3>
        <p class="hint">支持导入 JSON 文件，格式为 [{"name": "类别名", "value": 数值}]</p>
        <input ref="fileInput" type="file" accept=".json" @change="handleFileImport" />
        <button class="btn btn-primary" @click="triggerFileImport">选择文件导入</button>
      </div>
    </div>

    <div class="chart-section">
      <PieChart :data="chartData" :title="chartTitle" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PieChart from '../components/PieChart.vue'

interface PieData {
  name: string
  value: number
}

const chartTitle = ref('饼图')
const dataInput = ref('')
const chartData = ref<PieData[]>([])
const fileInput = ref<HTMLInputElement>()

const sampleData: PieData[] = [
  { name: '电子产品', value: 300 },
  { name: '服装', value: 200 },
  { name: '食品', value: 150 },
  { name: '家居', value: 100 },
  { name: '其他', value: 80 }
]

const renderChart = () => {
  try {
    const parsed = JSON.parse(dataInput.value)  // JSON.parse() 方法将一个字符串作为 JSON 解析并返回解析后的对象。
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
  chartData.value = [...sampleData]  // 这个地方是加载示例数据，sampleData就是示例数据
  dataInput.value = JSON.stringify(sampleData, null, 2)
}

const clearData = () => {
  chartData.value = []
  dataInput.value = ''
  chartTitle.value = '饼图'
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
</script>

<style scoped>
.pie-chart-view {
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
  transition: background-color 0.3s;
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

@media (max-width: 768px) {
  .controls {
    grid-template-columns: 1fr;
  }
}
</style>
