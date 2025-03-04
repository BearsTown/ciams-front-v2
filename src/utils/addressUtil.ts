import { getAddressEmdList, getAddressRiList, getPnuInfo } from '@/api/app/address'
import { ref } from 'vue'

// export default {
export const getLoadAllEMD = async function () {
  const { data } = await getAddressEmdList()
  return data
}

export const getLoadRI = async function (params: PNU.Search.Params.RI) {
  const { data } = await getAddressRiList(params)
  return data
}

//  Jibun -> PNU
export const convertJibunToPNU = async function (list: {
  emdCd: string
  riCd: string
  mountain: boolean
  jibun1: string
  jibun2: string
}) {
  const address = {
    emd: '', // 8
    ri: '', // 2
    mountYN: '', // 1
    mainJibun: '', // 4
    subJibun: '', //4
  }

  const params = { emdCd: '' }
  const pnu = ref<string>()

  const allEmd = await getLoadAllEMD()
  allEmd.forEach(async (a) => {
    if (a.codeName === list.emdCd) {
      params.emdCd = a.codeName
      address.emd = a.codeName
    }
  })

  const allRi = await getLoadRI(params)
  allRi.forEach((a) => {
    if (a.codeName === list.riCd) {
      address.ri = a.codeName.slice(-2)
    }
  })

  if (!list.jibun1 && list.jibun2) {
    address.mainJibun = '0000'
  } else if (list.jibun1 && list.jibun1.length !== 4) {
    address.mainJibun = list.jibun1.padStart(4, '0')
  } else {
    address.mainJibun = list.jibun1
  }

  if (list.jibun2 && list.jibun2.length !== 4) {
    address.subJibun = list.jibun2.padStart(4, '0')
  } else {
    address.subJibun = list.jibun2
  }

  pnu.value = address.emd.concat(address.ri, address.mountYN, address.mainJibun, address.subJibun)

  return pnu.value
}

// PNU -> Jibun
export const convertPNUtoJibun = async function (pnu: string) {
  const { data } = await getPnuInfo(pnu)
  const concatJibun = data.address2.concat(' ', data.address3)

  return concatJibun
}
