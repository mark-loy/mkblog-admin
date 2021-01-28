<template>
  <div>
    <el-card>

    </el-card>
  </div>
</template>

<script>
  import contentApi from '@/api/blog/articleContent'

  export default {
    data() {
      return {
        /* 文章内容表单 */
        contentForm: {
          // 文章id
          id: '',
          // 文章内容
          content: ''
        }
      }
    },
    created () {
      // 判断并获取路由中文章id
      if (this.$route.params && this.$route.params.id) {
        this.contentForm.id = this.$route.params.id
      }
      this.getArticleContent()
    },
    methods: {
      // 查询文章内容
      getArticleContent() {
        // 调用api
        contentApi.selectArticleContent(this.contentForm.id).then(res => {
          this.contentForm = res.data.content
        })
      },
      /* 修改文章内容 */
      updateArticle() {
        // 调用api
        contentApi.updateArticleContent(this.contentForm).then(res => {
          // 提示
          this.$message.sucess("修改文章内容成功")
          // 路由跳转到发布页
          
        })
      }
    },
  }
</script>

<style scoped>

</style>