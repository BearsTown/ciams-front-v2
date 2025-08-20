<template>
  <div class="flex-container">
    <ckeditor
      :value="modelValue"
      :editor="editor"
      :config="editorConfig"
      @input="onEditorChange"
      @ready="onEditorReady"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import '@ckeditor/ckeditor5-build-classic/build/translations/ko'
  import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic'

  import { Bold, Italic } from '@ckeditor/ckeditor5-basic-styles'

  import { Heading } from '@ckeditor/ckeditor5-heading'
  import { Paragraph } from '@ckeditor/ckeditor5-paragraph'
  import { Font } from '@ckeditor/ckeditor5-font'
  import { Link } from '@ckeditor/ckeditor5-link'
  import { Indent } from '@ckeditor/ckeditor5-indent'
  import { Alignment } from '@ckeditor/ckeditor5-alignment'
  import { BlockQuote } from '@ckeditor/ckeditor5-block-quote'
  import { Essentials } from '@ckeditor/ckeditor5-essentials'
  import { HorizontalLine } from '@ckeditor/ckeditor5-horizontal-line'
  import { List, TodoList } from '@ckeditor/ckeditor5-list'

  import {
    Table,
    TableCaption,
    TableCellProperties,
    TableColumnResize,
    TableProperties,
    TableToolbar,
  } from '@ckeditor/ckeditor5-table'

  import {
    Image,
    ImageCaption,
    ImageEditing,
    ImageInsert,
    ImageResize,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
  } from '@ckeditor/ckeditor5-image'
  import { uploadEditorImage } from '@/api/app/file'
  import { FileLoader } from '@ckeditor/ckeditor5-upload'
  import CommonUtil from '@/utils/commonUtil'
  import { API_INFO_CIAMS } from '@/config/config'

  const props = withDefaults(
    defineProps<{
      modelValue: string
      typeCode: string
      linkId: string | number
    }>(),
    {
      modelValue: '',
      typeCode: '',
      linkId: '',
    },
  )

  const emits = defineEmits<{
    // (e: 'getData', contents: string): void
    (e: 'update:modelValue', contents: string): void
  }>()

  const imageFileIds = ref<string[]>([])

  // const modelValue = ref('')
  const editor = ClassicEditor
  const editorConfig = {
    language: 'ko',
    plugins: [
      Table,
      TableCaption,
      TableCellProperties,
      TableColumnResize,
      TableProperties,
      TableToolbar,
      Essentials,
      Image,
      ImageUpload,
      ImageToolbar,
      ImageInsert,
      ImageResize,
      ImageStyle,
      ImageCaption,
      ImageEditing,
      MyCustomUploadAdapterPlugin,
      RemoveMultipleFilePlugin,
      HorizontalLine,
      TodoList,
      List,
      Indent,
      Alignment,
      BlockQuote,
      Bold,
      Italic,
      Link,
      Paragraph,
      Heading,
      Font,
    ],
    toolbar: {
      items: [
        'undo',
        'redo',
        '|',
        'heading',
        'alignment',
        'indent',
        'outdent',
        'ImageUpload',
        'insertTable',
        'Horizontalline',
        '|',
        'Bold',
        'Italic',
        'Link',
        'NumberedList',
        'BulletedList',
        'TodoList',
        '|',
        'Alignment',
        'FontColor',
        'FontSize',
        'FontBackgroundColor',
        'FontFamily',
        '|',
        'blockQuote',
      ],
    },
    image: {
      styles: ['alignLeft', 'alignCenter', 'alignRight'],
      toolbar: [
        'imageStyle:alignLeft',
        'imageStyle:alignCenter',
        'imageStyle:alignRight',
        '|',
        'imageTextAlternative',
        'resizeImage',
      ],
    },

    fontSize: {
      options: [9, 10, 11, 12, 13, 15, 17, 19, 21, 23],
    },

    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells',
        'tableProperties',
        'tableCellProperties',
      ],
    },

    heading: {
      options: [
        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
        { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
        { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
        { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
        { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
        { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
        { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' },
      ],
    },
  }

  watch(props, () => {
    // if (props.content) {
    //   editorData.value = props.content
    // }
  })
  const updateValue = (value) => {
    debugger
    // emits('update:modelValue', value)
  }
  // watch(editorData, () => {
  // emits('getData', editorData.value)
  // emits('update:modelValue', editorData.value)
  // })

  class UploadAdapter {
    loader: FileLoader

    constructor(loader: FileLoader) {
      this.loader = loader
    }

    upload() {
      return this.loader.file.then(
        (file) =>
          new Promise((resolve, reject) => {
            this._sendRequest(file)
              .then((response) => {
                const fileId = response.data[0].id
                if (!fileId) {
                  return reject('파일을 업로드 할 수 없습니다.')
                }

                imageFileIds.value.push(fileId)

                resolve({
                  default: `${API_INFO_CIAMS.PREFIX}/api/v1/file/image/${fileId}`,
                })
              })
              .catch((error) => {
                console.log(error)
                CommonUtil.errorMessage('오류가 발생했습니다.')
                reject('오류가 발생했습니다.')
              })
          }),
      )
    }

    _sendRequest(file) {
      const data = new FormData()
      data.append('files', file)
      data.append('typeCode', props.typeCode)
      data.append('linkId', props.linkId?.toString())
      return uploadEditorImage(data)
    }

    abort() {
      // Axios doesn't provide a direct abort mechanism in the same way as XMLHttpRequest.
      // If you need to support abort, you may need to use Axios CancelToken.
      console.log('Upload aborted')
    }
  }

  function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new UploadAdapter(loader)
    }
  }

  function RemoveMultipleFilePlugin(editor) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const fileInputs = node.querySelectorAll
              ? node.querySelectorAll('input[type="file"]')
              : []
            fileInputs.forEach((input) => {
              input.removeAttribute('multiple')
              input.setAttribute('accept', '.jpg,.jpeg,.png')
            })
          }
        })
      })
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    editor._fileInputObserver = observer
  }

  let currentImages = new Set()
  let deleteImages = new Set()

  function onEditorChange(value) {
    emits('update:modelValue', value)

    // const editorContent = editorData.value
    // const parser = new DOMParser()
    // const doc = parser.parseFromString(editorContent, 'text/html')
    // const images = doc.querySelectorAll('img')
    // const newImages = new Set([...images].map((img) => img.src))

    // console.log(newImages)

    // // 삭제된 이미지 식별
    // const deletedImages = [...currentImages].filter((url) => !newImages.has(url))
    // if (deletedImages.length > 0) {
    //   deleteImages.add(deletedImages)
    // }
    //
    // // 현재 이미지 목록 업데이트
    // currentImages = newImages

    // console.log(`currentImages :: ${currentImages.keys()}`)
    // console.log(`deleteImages :: ${deleteImages.keys()}`)

    // console.log(images)
  }

  const editorInstance = ref(null)

  watch(
    () => props.modelValue,
    (newValue) => {
      if (editorInstance.value && newValue !== editorInstance.value.getData()) {
        editorInstance.value.setData(newValue)
      }
    },
    { immediate: true },
  )

  const onEditorReady = (editor) => {
    editorInstance.value = editor
    if (props.modelValue && editor.getData() !== props.modelValue) {
      editor.setData(props.modelValue)
    }
  }

  defineExpose({
    imageFileIds,
  })
</script>

<style scoped lang="scss">
  .flex-container {
    width: 100%;
    height: 100%;
    display: flex;
    line-height: 1.5;
    flex-direction: column;
  }

  :deep(.ck.ck-editor) {
    margin-right: 10px;
  }

  :deep(.ck-editor__editable_inline) {
    min-height: 450px !important;
    box-sizing: border-box;
  }
</style>
