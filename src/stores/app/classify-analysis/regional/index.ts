import { defineStore } from 'pinia'
import { reactive } from 'vue'

import { TagCategory } from '@/types/common'
import { CiamsZoneDTO } from '@/api/app/zone/model'
import { getCiamsZoneOverView } from '@/api/app/zone'
import { getCodeList } from '@/api/app/common'
import { getClassDescs } from '@/api/app/classify-analysis/desc'
import { ClassifyAnalysisDto } from '@/models/api/app/classify-analysis/ciams-analysis'

interface State {
  tags: TagCategory[]
  desc?: {}
  overview?: CiamsZoneDTO.Overview.Find.Result
}

export const useClassifyAnalysisRegionalStore = defineStore('classifyAnalysisRegionalStore', () => {
  const state = reactive<State>({
    tags: [],
  })

  async function setOverview(params: CiamsZoneDTO.Overview.Find.Params) {
    const { data } = await getCiamsZoneOverView(params)
    state.overview = data
  }

  async function setDesc(params: ClassifyAnalysisDto.Desc.Find.Params) {
    const { data } = await getClassDescs(params)

    state.desc = data
      .find((item) => item.category === params.category)
      ?.list.reduce((acc, item) => {
        const type = item.type
        if (!acc[type]) {
          acc[type] = []
        }
        acc[type].push(item)
        return acc
      }, {})
  }

  async function setTagList(code: string) {
    const { data } = await getCodeList(code)

    state.tags = data.map((item) => ({
      label: item.codeName,
      value: item.code,
      color: item.codeVal,
    }))
  }

  function clear() {
    state.overview = undefined
    state.desc = undefined
  }

  return {
    state,
    clear,
    setTagList,
    setOverview,
    setDesc,
  }
})
