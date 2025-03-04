<template>
  <div style="width: 100%">
    <ckeditor v-model="editorData" :editor="editor" :config="editorConfig" style="width: 100%" />
  </div>
</template>

<script setup lang="ts">
  import { Ref, computed, ref, toRefs, watch } from 'vue'
  import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic'
  import EssentialsPlugin from '@ckeditor/ckeditor5-essentials/src/essentials'
  import {
    Image,
    ImageUpload,
    ImageToolbar,
    ImageInsert,
    ImageResize,
    ImageStyle,
  } from '@ckeditor/ckeditor5-image/src'
  import Base64UploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/base64uploadadapter'
  import BlockQuotePlugin from '@ckeditor/ckeditor5-block-quote/src/blockquote'
  import AlignmentPlugin from '@ckeditor/ckeditor5-alignment/src/alignment'
  import IndentPlugin from '@ckeditor/ckeditor5-indent/src/indent'
  import TablePlugin from '@ckeditor/ckeditor5-table/src/table'
  import { TodoList, List } from '@ckeditor/ckeditor5-list/src'
  import HorizontalLinePlugin from '@ckeditor/ckeditor5-horizontal-line/src/horizontalline'
  import BoldPlugin from '@ckeditor/ckeditor5-basic-styles/src/bold'
  import ItalicPlugin from '@ckeditor/ckeditor5-basic-styles/src/italic'
  import LinkPlugin from '@ckeditor/ckeditor5-link/src/link'
  import ParagraphPlugin from '@ckeditor/ckeditor5-paragraph/src/paragraph'
  import HeadingPlugin from '@ckeditor/ckeditor5-heading/src/heading'
  import FontPlugin from '@ckeditor/ckeditor5-font/src/font'

  const props = withDefaults(
    defineProps<{
      content: string
    }>(),
    {
      content: '',
    },
  )

  const emits = defineEmits<{
    (e: 'getData', contents: string): void
  }>()

  const editorData = ref('')
  const editor = ClassicEditor
  const editorConfig = {
    language: 'ko',
    plugins: [
      EssentialsPlugin,
      Image,
      ImageUpload,
      ImageToolbar,
      ImageInsert,
      ImageResize,
      ImageStyle,
      TablePlugin,
      Base64UploadAdapter,
      HorizontalLinePlugin,
      TodoList,
      List,
      IndentPlugin,
      AlignmentPlugin,
      BlockQuotePlugin,
      BoldPlugin,
      LinkPlugin,
      ParagraphPlugin,
      HeadingPlugin,
      FontPlugin,
      ItalicPlugin,
    ],
    toolbar: {
      items: [
        'heading',
        'alignment',
        'indent',
        'outdent',
        'Undo',
        'Redo',
        '|',
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
      ],
    },

    fontSize: {
      options: [9, 11, 13, 15, 17, 19, 21, 23],
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
  }

  watch(props, () => {
    if (props.content) {
      editorData.value = props.content
    }
  })

  watch(editorData, () => {
    emits('getData', editorData.value)
  })
</script>
<!-- <style>
  @import './../../../styles/content-style.css';
</style> -->
