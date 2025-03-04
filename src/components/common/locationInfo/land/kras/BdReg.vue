<template>
  <div class="locationInfo-content">
    <div class="container customScroll">
    		<div class="customCard" style="padding: 5px 0">
		    	<InsideCollapse title="기타 정보" :is-open="true">
		        <template #content>
		            <div class="table-group">
		              <table class="customTable">
		                <colgroup>
		                  <col width="22%" />
		                  <col width="28%" />
		                  <col width="22%" />
		                  <col width="28%" />
		                </colgroup>
		                <tbody>                        
		                  <tr>
		                    <th>위반 여부</th>
		                    <td colspan="3">{{iswiban==0?'미포함':'포함'}}</td>
		                  </tr>
		                  <tr>
		                    <th>빈집 여부</th>
		                    <td colspan="3">{{isbinjib==0?'미포함':'포함'}}</td>
		                  </tr>
		                </tbody>
		              </table>
		            </div>
		            <br />
		        </template>
		      </InsideCollapse>
	      </div>	    
        <div class="customCard" style="padding: 5px 0">
          <InsideCollapse title="건축물대장" :is-open="true">
            <template #content v-if="bdRegDataList && bdRegDataList.data && bdRegDataList.data.length > 0">
              <template v-for="bdRegData of bdRegDataList!.data" :key="bdRegData.bdRegId">
                <div class="table-group">
                  <table class="customTable">
                    <colgroup>
                      <col width="22%" />
                      <col width="28%" />
                      <col width="22%" />
                      <col width="28%" />
                    </colgroup>
                    <tbody>
                      <tr>
                        <th>대지위치</th>
                        <td colspan="3">
                          (지번){{ bdRegData.address }}<br />
                          (도로명){{ bdRegData.addresRoad }}
                        </td>
                      </tr>
                      <tr>
                        <th>대장종류</th>
                        <td>{{ bdRegData.regTypeNm }}</td>
                        <th></th>
                        <td></td>
                      </tr>
                      <tr>
                        <th>대지구분</th>
                        <td>{{ bdRegData.landTypeNm }}</td>
                        <th>외필지수</th>
                        <td>{{ bdRegData.subParcel }}</td>
                      </tr>
                      <tr>
                        <th>동명</th>
                        <td>{{ bdRegData.dongNm }}</td>
                        <th>건축면적</th>
                        <td>{{ bdRegData.flArea }}</td>
                      </tr>
                      <tr>
                        <th>연면적</th>
                        <td>{{ bdRegData.grFlArea }}</td>
                        <th>대지면적</th>
                        <td>{{ bdRegData.landArea }}</td>
                      </tr>
                      <tr>
                        <th>허가일자</th>
                        <td>{{ bdRegData.perDate }}</td>
                        <th>착공일자</th>
                        <td>{{ bdRegData.conDate }}</td>
                      </tr>
                      <tr>
                        <th>사용승인일자</th>
                        <td>{{ bdRegData.appuseDate }}</td>
                        <th></th>
                        <td></td>
                      </tr>
                      <tr>
                        <th>주용도</th>
                        <td>{{ bdRegData.mainPurposeNm }}</td>
                        <th>기타용도</th>
                        <td>{{ bdRegData.etcPurposeNm }}</td>
                      </tr>
                      <tr>
                        <th>지붕</th>
                        <td>{{ bdRegData.roofNm }}</td>
                        <th>기타지붕</th>
                        <td>{{ bdRegData.etcRoofNm }}</td>
                      </tr>
                      <tr>
                        <th>지상층수</th>
                        <td>{{ bdRegData.floor }}</td>
                        <th>지하층수</th>
                        <td>{{ bdRegData.basement }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <br />
              </template>
            </template>
					</InsideCollapse>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { getBdReg, getBdEtc } from '@/api/app/buildReg'
  import { BdReg, BdEtc } from '@/api/app/buildReg/model'
  import { InsideCollapse } from '@/components/common/collapse'
  import { useGmpssStore } from '@/stores/app'
  import { storeToRefs } from 'pinia'
  import { onMounted, ref, watch } from 'vue'
  defineProps({
    detailItem: {
      type: Object,
    },
  })
  const bdRegDataList = ref<BdReg>()
  const iswiban = ref<int>(0)
  const isbinjib = ref<int>(0)
  const searchInput = ref<string>('')
  const gmpStore = useGmpssStore()
  const { searchAddressFeature } = storeToRefs(gmpStore)

  const getBdRegAndSetData = (params) => {
    getBdReg(params).then((bdReg) => {
      bdRegDataList.value = bdReg.data
    })
  }
  
  const getBdEtcAndSetData = (params) => {
    getBdEtc(params).then((bdEtc) => {
      isbinjib.value = bdEtc.data.data[0].isbinjib
      iswiban.value = bdEtc.data.data[0].iswiban      
    })
  }
  
  onMounted(() => {
    const pnu = searchAddressFeature.value.get('PNU')
    getBdRegAndSetData({ pnu })
    getBdEtcAndSetData({ pnu })
  })
  watch(searchAddressFeature, () => {
    const pnu = searchAddressFeature.value.get('PNU')
    getBdRegAndSetData({ pnu })
    getBdEtcAndSetData({ pnu })
  })
</script>
<style scoped lang="scss">
  .border-box-round {
    border: none;
  }
</style>
