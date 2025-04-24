import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'virtual:svg-icons-register'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import CKEditor from '@ckeditor/ckeditor5-vue'
import slider from 'vue3-slider'
import InlineSvg from 'vue-inline-svg'

import { use as echartsUse } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart, PieChart, ScatterChart } from 'echarts/charts'
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  DataZoomComponent,
  MarkLineComponent,
  VisualMapComponent,
} from 'echarts/components'

import App from './App.vue'
import pinia from './stores'
import router from './router'

import './styles/index.scss'
import './styles/custom-element-plus.scss'
import './styles/content-style.css'

// import 'uno.css'
import Empty from '@/components/common/Empty.vue'
import SvgIcon from '@/components/common/SvgIcon.vue'

const app = createApp(App)

//element ui 아이콘 적용
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.component('Vue3Slider', slider)

//글로벌 사용 설정
app.use(ElementPlus, {})
app.use(router)
app.use(pinia)
app.use(CKEditor)

app.component('Empty', Empty)
app.component('SvgIcon', SvgIcon)
app.component('InlineSvg', InlineSvg)
// app.component(ElCollapseTransition.name, ElCollapseTransition)

app.mount('#app')

echartsUse([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  ScatterChart,
  GridComponent,
  TitleComponent,
  TooltipComponent,
  MarkLineComponent,
  DataZoomComponent,
  VisualMapComponent,
  LegendComponent,
])
