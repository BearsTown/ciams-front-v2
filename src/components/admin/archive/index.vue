<template>
  <div id="archive" style="width: 100%; height: 100%">
    <div style="height: 100%">
      <div class="l-header">
        <span class="header-title"
          >{{ selectedCategory?.name }}
          <div class="customPopover" :class="{ active: popoverActive }">
            <button type="button" class="btn-popoverMenu" @click.prevent.stop="editCategory('add')">
              추가
            </button>
            <button
              type="button"
              class="btn-popoverMenu"
              @click.prevent.stop="editCategory('modify')"
            >
              수정
            </button>
            <button type="button" class="btn-popoverMenu" @click.prevent.stop="removeCategory">
              삭제
            </button>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="20"
            viewBox="0 0 18 20"
            fill="none"
            style="cursor: pointer"
            @click="modifyPopup"
          >
            <path
              d="M9.00052 7.50192C8.50607 7.50192 8.02272 7.64854 7.6116 7.92324C7.20047 8.19795 6.88004 8.58839 6.69082 9.04521C6.50161 9.50202 6.4521 10.0047 6.54856 10.4896C6.64502 10.9746 6.88312 11.4201 7.23276 11.7697C7.58239 12.1193 8.02785 12.3574 8.5128 12.4539C8.99775 12.5503 9.50042 12.5008 9.95723 12.3116C10.414 12.1224 10.8045 11.802 11.0792 11.3908C11.3539 10.9797 11.5005 10.4964 11.5005 10.0019C11.5005 9.33888 11.2371 8.70299 10.7683 8.23415C10.2994 7.76531 9.66356 7.50192 9.00052 7.50192ZM9.00052 10.8353C8.83571 10.8353 8.67459 10.7864 8.53755 10.6948C8.40051 10.6032 8.2937 10.4731 8.23062 10.3208C8.16755 10.1685 8.15105 10.001 8.1832 9.83934C8.21536 9.67769 8.29472 9.52921 8.41127 9.41266C8.52781 9.29612 8.6763 9.21675 8.83795 9.1846C8.9996 9.15244 9.16716 9.16895 9.31943 9.23202C9.4717 9.29509 9.60185 9.4019 9.69341 9.53894C9.78498 9.67598 9.83386 9.8371 9.83386 10.0019C9.83386 10.2229 9.74606 10.4349 9.58978 10.5912C9.4335 10.7475 9.22154 10.8353 9.00052 10.8353ZM16.3422 10.6769C16.2063 10.5228 16.1321 10.324 16.1339 10.1186V9.88525C16.1321 9.67982 16.2063 9.48099 16.3422 9.32692L16.8755 8.72692C17.2843 8.26808 17.5098 7.67476 17.5089 7.06025C17.5048 6.62216 17.3902 6.19218 17.1755 5.81025L16.7089 4.97692C16.4893 4.59663 16.1735 4.28089 15.7931 4.06145C15.4127 3.84202 14.9813 3.72664 14.5422 3.72692C14.3743 3.72703 14.2068 3.74378 14.0422 3.77692L13.2589 3.93525H13.0839C12.9409 3.93303 12.8007 3.89584 12.6755 3.82692L12.4672 3.70192C12.306 3.62324 12.1745 3.49465 12.0922 3.33525L11.8339 2.57692C11.661 2.08794 11.3403 1.66484 10.9163 1.36622C10.4922 1.0676 9.98582 0.908251 9.46719 0.91025H8.53386C8.01923 0.905791 7.51576 1.06027 7.09219 1.35259C6.66862 1.64492 6.34558 2.06084 6.16719 2.54358L5.90886 3.33525C5.84419 3.52879 5.71076 3.69187 5.53386 3.79358L5.33386 3.91858C5.2052 3.98639 5.06258 4.02347 4.91719 4.02692H4.75052L4.00052 3.81858C3.83592 3.78544 3.66843 3.76869 3.50052 3.76858C3.05601 3.75922 2.61705 3.86857 2.22887 4.08536C1.8407 4.30215 1.51736 4.61854 1.29219 5.00192L0.825524 5.83525C0.563972 6.29017 0.4522 6.81586 0.506043 7.33785C0.559886 7.85983 0.776615 8.35163 1.12552 8.74358L1.65886 9.34358C1.79475 9.49765 1.86894 9.69649 1.86719 9.90192V10.1353C1.86894 10.3407 1.79475 10.5395 1.65886 10.6936L1.12552 11.2936C0.71675 11.7524 0.491289 12.3457 0.49219 12.9603C0.496211 13.3983 0.610871 13.8283 0.825524 14.2103L1.29219 15.0436C1.51175 15.4239 1.82759 15.7396 2.20795 15.9591C2.5883 16.1785 3.01974 16.2939 3.45886 16.2936C3.62677 16.2935 3.79425 16.2767 3.95886 16.2436L4.74219 16.0853H4.90886C5.05177 16.0875 5.19197 16.1247 5.31719 16.1936L5.52552 16.3186C5.70242 16.4203 5.83586 16.5834 5.90052 16.7769L6.16719 17.5019C6.34007 17.9909 6.66073 18.414 7.08477 18.7126C7.50881 19.0112 8.01523 19.1706 8.53386 19.1686H9.46719C9.98582 19.1706 10.4922 19.0112 10.9163 18.7126C11.3403 18.414 11.661 17.9909 11.8339 17.5019L12.0922 16.7436C12.1569 16.55 12.2903 16.387 12.4672 16.2853L12.6672 16.1603C12.7958 16.0924 12.9385 16.0554 13.0839 16.0519H13.2505L14.0422 16.2103C14.2068 16.2434 14.3743 16.2601 14.5422 16.2603C14.9813 16.2605 15.4127 16.1452 15.7931 15.9257C16.1735 15.7063 16.4893 15.3905 16.7089 15.0103L17.1755 14.1769C17.3902 13.795 17.5048 13.365 17.5089 12.9269C17.5098 12.3124 17.2843 11.7191 16.8755 11.2603L16.3422 10.6769ZM15.1005 11.7769L15.6339 12.3769C15.7697 12.531 15.8439 12.7298 15.8422 12.9353C15.8407 13.082 15.8004 13.2257 15.7255 13.3519L15.2589 14.1853C15.1861 14.3112 15.0817 14.4159 14.956 14.489C14.8303 14.5621 14.6876 14.601 14.5422 14.6019H14.3755L13.5922 14.4436C12.9912 14.319 12.3653 14.4198 11.8339 14.7269L11.6339 14.8436C11.1032 15.1487 10.7029 15.638 10.5089 16.2186L10.2589 16.9853C10.203 17.1508 10.0964 17.2945 9.95438 17.3962C9.81232 17.4979 9.64189 17.5524 9.46719 17.5519H8.53386C8.35915 17.5524 8.18873 17.4979 8.04667 17.3962C7.90461 17.2945 7.79809 17.1508 7.74219 16.9853L7.49219 16.2186C7.29818 15.638 6.89789 15.1487 6.36719 14.8436L6.15886 14.7269C5.7811 14.5095 5.35306 14.3946 4.91719 14.3936C4.74652 14.3937 4.57627 14.4104 4.40886 14.4436L3.62552 14.6019H3.45886C3.31202 14.6025 3.16763 14.5643 3.04031 14.4911C2.913 14.4179 2.80728 14.3124 2.73386 14.1853L2.27552 13.3519C2.20063 13.2257 2.16038 13.082 2.15886 12.9353C2.14779 12.7341 2.20996 12.5358 2.33386 12.3769L2.86719 11.7769C3.27596 11.3181 3.50143 10.7248 3.50052 10.1103V9.87692C3.50143 9.26241 3.27596 8.66909 2.86719 8.21025L2.33386 7.62692C2.19797 7.47285 2.12377 7.27401 2.12552 7.06858C2.13992 6.92448 2.19162 6.78662 2.27552 6.66858L2.74219 5.83525C2.8149 5.7093 2.91931 5.60458 3.04504 5.53148C3.17076 5.45838 3.31343 5.41946 3.45886 5.41858H3.62552L4.40886 5.57692C4.57622 5.61045 4.7465 5.62719 4.91719 5.62692C5.35306 5.62595 5.7811 5.51104 6.15886 5.29358L6.36719 5.17692C6.89166 4.87993 7.29118 4.40346 7.49219 3.83525L7.74219 3.06858C7.79809 2.90307 7.90461 2.7593 8.04667 2.65762C8.18873 2.55593 8.35915 2.50147 8.53386 2.50192H9.46719C9.64189 2.50147 9.81232 2.55593 9.95438 2.65762C10.0964 2.7593 10.203 2.90307 10.2589 3.06858L10.5089 3.83525C10.7029 4.41586 11.1032 4.90511 11.6339 5.21025L11.8422 5.32692C12.2199 5.54437 12.648 5.65928 13.0839 5.66025C13.2545 5.66053 13.4248 5.64378 13.5922 5.61025L14.3755 5.45192H14.5422C14.689 5.45133 14.8334 5.48956 14.9607 5.56273C15.0881 5.6359 15.1938 5.74141 15.2672 5.86858L15.7255 6.70192C15.8004 6.82811 15.8407 6.97185 15.8422 7.11858C15.8439 7.32401 15.7697 7.52285 15.6339 7.67692L15.1005 8.27692C14.6917 8.73575 14.4663 9.32907 14.4672 9.94358V10.1769C14.4663 10.7914 14.6917 11.3847 15.1005 11.8436"
              fill="#8A8A8A"
            />
          </svg>
        </span>
        <div class="right">
          <div class="search">
            <input
              type="text"
              class="customInput"
              v-model="searchKeyword"
              @keyup.enter="searchArchive"
              placeholder="검색어를 입력하세요."
            />
            <button type="button" class="btn-search">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M8.12195 1.31707C4.36372 1.31707 1.31707 4.36372 1.31707 8.12195C1.31707 11.8802 4.36372 14.9268 8.12195 14.9268C11.8802 14.9268 14.9268 11.8802 14.9268 8.12195C14.9268 4.36372 11.8802 1.31707 8.12195 1.31707ZM0 8.12195C0 3.63632 3.63632 0 8.12195 0C12.6076 0 16.2439 3.63632 16.2439 8.12195C16.2439 12.6076 12.6076 16.2439 8.12195 16.2439C3.63632 16.2439 0 12.6076 0 8.12195Z"
                  fill="#757575"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M12.9243 12.9233C13.1815 12.6662 13.5985 12.6662 13.8556 12.9233L17.8069 16.8746C18.064 17.1317 18.064 17.5487 17.8069 17.8059C17.5497 18.0631 17.1327 18.0631 16.8755 17.8059L12.9243 13.8547C12.6672 13.5975 12.6672 13.1805 12.9243 12.9233Z"
                  fill="#757575"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div class="content-wrap">
        <div class="content download">
          <div class="customCard customScroll scrollY">
            <archiveList
              v-if="!selectedCategory.isLink"
              style="flex: 1"
              :active-archive-list="activeArchiveList"
              :page-info="pageInfo"
              @edit-category="editCategory"
              @delete-archive-all="deleteArchiveAll"
              @modify-archives="modifyArchives"
            />
            <div v-else class="content">
              <div class="customCard maple">
                <table class="customTable">
                  <thead>
                    <tr>
                      <th scope="col">실행링크</th>
                    </tr>
                  </thead>
                </table>

                <!-- 데이터 있을때 -->
                <table class="customTable body">
                  <tbody>
                    <tr>
                      <td
                        class="hover-point"
                        @click="linkOpen(selectedCategory.linkUrl)"
                        style="cursor: pointer"
                      >
                        {{ selectedCategory.linkUrl }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="l-footer">
        <span class="num">총 {{ pageInfo.totalCount }}건</span>
        <div class="customPagination">
          <el-pagination
            @current-change="activePage"
            style="padding: 0"
            layout="prev, pager, next"
            :total="pageInfo.totalCount"
            :page-size="pageInfo.pageSize"
            :current-page="pageInfo.pageNo"
          />
        </div>
      </div>

      <el-dialog v-model="addCategoryDialog" width="30%" top="30vh">
        <span class="el-dialog__title">
          <span v-if="mode === 'add'">카테고리 추가</span>
          <span v-else-if="mode === 'modify'">카테고리 수정</span>
        </span>
        <el-form
          style="padding-top: 10px"
          :model="modifyCategory"
          label-width="150px"
          :rules="rules"
          ref="categoryFormRef"
        >
          <el-form-item prop="name">
            <template #label>
              <span class="label"> 카테고리명 </span>
            </template>
            <el-input
              clearable
              v-model="modifyCategory.name"
              autocomplete="off"
              placeholder="카테고리명을 입력하세요"
            />
          </el-form-item>
          <el-form-item label="URL링크여부" prop="isOpen">
            <el-switch v-model="modifyCategory.isLink" />
          </el-form-item>
          <el-form-item prop="linkUrl" v-if="modifyCategory.isLink === true">
            <template #label>
              <span class="label"> URL링크 </span>
            </template>
            <el-input
              clearable
              v-model="modifyCategory.linkUrl"
              autocomplete="off"
              placeholder="URL링크를 입력하세요"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="addCategoryDialog = false">취소</el-button>
            <el-button v-if="mode === 'add'" type="primary" @click="addCategory">추가</el-button>
            <el-button v-else-if="mode === 'modify'" type="primary" @click="modifyActiveCategory"
              >수정</el-button
            >
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<script setup lang="ts">
  import archiveList from '@/components/admin/archive/ArchiveList.vue'
  import { useAdminConfigStore } from '@/stores/admin/config'
  import { ref } from 'vue'
  import { useArchiveStore } from '@/stores/admin/archive'
  import commonUtil from '@/utils/commonUtil'
  import { cloneDeep } from 'lodash-es'
  import { storeToRefs } from 'pinia'
  const archiveStore = useArchiveStore()
  const {
    archiveList: activeArchiveList,
    categoryList,
    pageInfo,
    search,
    selectedCategory,
  } = storeToRefs(archiveStore)

  const mode = ref('add')
  const searchKeyword = ref('')
  const addCategoryDialog = ref(false)
  const categoryFormRef = ref()
  const popoverActive = ref(false)

  // const props = withDefaults(
  //   defineProps<{
  //     category: {}
  //   }>(),
  //   {},
  // )

  const modifyCategory = ref({
    categoryId: '',
    name: '',
    isLink: false,
    linkUrl: '',
    sortSn: 0,
  })

  const rules = {
    name: [{ required: true, message: '카테고리명을 입력해주세요', trigger: 'blur' }],
  }

  const selectTypeObj = ref('')

  const modifyPopup = () => {
    setTimeout(() => {
      popoverActive.value = false
    }, 2000)
    popoverActive.value = !popoverActive.value
  }

  function linkOpen(url) {
    window.open(url, '_blank')
  }

  function editCategory(_mod) {
    mode.value = _mod
    addCategoryDialog.value = true
    if (_mod == 'modify') modifyCategory.value = cloneDeep(selectedCategory.value)
    else
      modifyCategory.value = {
        categoryId: '',
        name: '',
        isLink: false,
        linkUrl: '',
        sortSn: categoryList.value.length,
      }
  }

  function addCategory() {
    categoryFormRef.value.validate((valid) => {
      if (valid) {
        let params = cloneDeep(modifyCategory.value)
        params.sortSn = categoryList.value.length + 1
        archiveStore
          .addCategory(params)
          .then(() => {
            commonUtil.successMessage('추가 되었습니다.')
            addCategoryDialog.value = false
            clear()
            archiveStore.reloadAction()
          })
          .catch(() => {
            commonUtil.errorMessage('카테고리 등록중 오류가 발생했습니다.')
          })
      }
    })
  }

  function clear() {
    modifyCategory.value.categoryId = ''
    modifyCategory.value.name = ''
    modifyCategory.value.isLink = false
    modifyCategory.value.linkUrl = ''
    modifyCategory.value.sortSn = 0

    archiveStore.reloadAction()
  }

  function modifyActiveCategory() {
    categoryFormRef.value.validate((valid) => {
      if (valid) {
        let params = cloneDeep(modifyCategory.value)
        archiveStore
          .modifyCategory(params)
          .then(() => {
            commonUtil.successMessage('수정 되었습니다.')
            addCategoryDialog.value = false
            clear()
            archiveStore.getCategoryList()
          })
          .catch(() => {
            commonUtil.errorMessage('카테고리 수정중 오류가 발생했습니다.')
          })
      }
    })
  }

  function removeCategory() {
    const _category = selectedCategory.value
    if (!_category) {
      return false
    }
    commonUtil
      .confirm(`[${_category.name}] 카테고리를 삭제하시겠습니까?`)
      .then(() => {
        return archiveStore.deleteCategory(_category.categoryId)
      })
      .then(() => {
        commonUtil.successMessage('삭제 되었습니다.')
        archiveStore.reloadAction()
      })
      .catch((err) => {
        console.log(err)
        if (err.response.status == 409) {
          commonUtil.errorMessage(err.response.data)
        } else {
          commonUtil.errorMessage('카테고리 삭제 중 오류가 발생했습니다.')
        }
      })
  }

  function deleteArchiveAll(ids) {
    commonUtil
      .confirm('게시글을 삭제 하시겠습니까?', '게시글 삭제')
      .then(() => {
        return archiveStore.deleteArchive(ids)
      })
      .then(() => {
        commonUtil.successMessage('삭제 되었습니다.')
        archiveStore.getArchiveList()
      })
  }

  function modifyArchives(ids, hidden) {
    const param = {
      ids: ids,
      hidden: hidden,
    }

    archiveStore
      .modifyHidden(param)
      .then(() => {
        commonUtil.successMessage('변경되었습니다.')
        return archiveStore.getArchiveList()
      })
      .catch(() => {
        commonUtil.errorMessage('수정 중에 에러가 발생했습니다.')
      })
  }

  function activePage(curPage: number) {
    pageInfo.value.pageNo = curPage
    archiveStore.getArchiveList()
  }

  function searchArchive() {
    search.value.keyword = searchKeyword
    archiveStore.getArchiveList()
  }
</script>
<style scoped>
  @import '@/assets/css/referencePage.css';

  #reference .content.download .customCard {
    flex: auto;
  }

  .customPopover {
    top: 20px;
    transform: translate(150%, 0);
  }
  .customPopover.active {
    opacity: 1;
    visibility: visible;
    transform: translate(160%, 0);
    transition: 0.3s;
  }
</style>
