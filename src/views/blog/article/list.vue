<template>
  <div>

  </div>
</template>

<script>
  import articleApi from '@/api/blog/article';

  export default {
    data() {
      return {
        /* 文章数据列表 */
        articles: [],
        /* 文章总数 */
        total: 0,
        /* 当前页 */
        current: 1,
        /* 当页显示数 */
        limit: 5,
        /* 文章条件查询对象 */
        articleQuery: {}
      }
    },
    created () {
      this.getArticlePage();
    },
    methods: {
      /* 获取文章分页数据 */
      getArticlePage(current = 1) {
        this.current = current
        // 调用api
        articleApi.getArticlePage(this.current, this.limit, this.articleQuery).then(res => {
          // 设置文章数据
          this.articles = res.data.articles
          this.total = res.data.total
        })
      }
    },
  }
</script>

<style scoped>

</style>