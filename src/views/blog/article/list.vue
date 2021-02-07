<template>
  <div>
    <el-card>
      <!--查询表单-->
      <el-form :inline="true" :model="articleQuery" ref="articleQueryRef">
        <!-- 标题 -->
        <el-form-item>
          <el-input v-model="articleQuery.title" placeholder="文章标题" />
        </el-form-item>
        <!-- 文章状态 -->
        <el-form-item>
          <el-select
            v-model="articleQuery.isReleased"
            placeholder="请选择文章状态"
          >
            <el-option label="未发布" value="false"></el-option>
            <el-option label="已发布" value="true"></el-option>
          </el-select>
        </el-form-item>
        <!-- 文章创建时间段 -->
        <el-form-item label="添加时间">
          <el-date-picker
            v-model="articleQuery.begin"
            type="datetime"
            placeholder="选择开始时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
          />
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="articleQuery.end"
            type="datetime"
            placeholder="选择截止时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
          />
        </el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="getArticlePage(current)"
          >查询</el-button
        >
        <el-button type="default" @click="resetArticleData">清空</el-button>
      </el-form>

      <!-- 表格 -->
      <el-table
        :data="articles"
        element-loading-text="数据加载中"
        border
        fit
        highlight-current-row
        row-class-name="myClassList"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="top" class="demo-table-expand">
              <el-form-item label="文章概要">
                <div>{{ props.row.summary }}</div>
              </el-form-item>
              <el-form-item label="背景图">
                <img :src="props.row.imageUrl" :alt="props.row.imageTitle" />
              </el-form-item>
              <el-form-item label="文章内容">
                <div v-html="props.row.content"></div>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column label="序号" width="70" align="center" type="index">
        </el-table-column>
        <el-table-column
          label="文章标题"
          align="center"
          prop="title"
        ></el-table-column>

        <el-table-column
          label="发表人"
          align="center"
          prop="userName"
          width="140"
        ></el-table-column>
        <el-table-column label="所属分类" align="center" width="120">
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.categoryName"
              >{{ scope.row.categoryName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="所属标签" align="center" width="120">
          <template slot-scope="scope">
            <el-tag
              v-for="(tagName, index) in scope.row.tagsName"
              :key="index"
              size="small"
              type="success"
              >{{ tagName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="阅读数"
          align="center"
          prop="viewCount"
          width="90"
        ></el-table-column>
        <el-table-column
          label="点赞数"
          align="center"
          prop="likeCount"
          width="90"
        ></el-table-column>
        <el-table-column
          label="评论数"
          align="center"
          prop="commentCount"
          width="90"
        ></el-table-column>
        <el-table-column label="创建时间" align="center" width="120">
          <template slot-scope="scope">
            {{ scope.row.gmtCreate.substr(0, 10) }}
          </template>
        </el-table-column>

        <el-table-column label="是否置顶" width="100" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isTop"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="updateArticleTopStatus(scope.row.isTop, scope.row.id)"
            >
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column label="文章发布状态" width="100" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isReleased"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="updateArticleStatus(scope.row.isReleased, scope.row.id)"
            >
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <router-link :to="'/blog/article/form/' + scope.row.id">
              <el-button type="text" size="mini" icon="el-icon-edit"
                >编辑文章信息</el-button
              >
            </router-link>
            <router-link :to="'/blog/comment/' + scope.row.id">
              <el-button type="text" size="mini" icon="el-icon-view"
                >查看评论</el-button
              >
            </router-link>
            <div>
              <el-button
                type="text"
                size="mini"
                icon="el-icon-delete"
                @click="deleteArticle(scope.row.id)"
                >删除</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        :current-page="current"
        :page-size="limit"
        :total="total"
        style="padding: 30px 0; text-align: center"
        layout="total, prev, pager, next, jumper"
        @current-change="getArticlePage"
      />
    </el-card>
  </div>
</template>

<script>
import articleApi from "@/api/blog/article";

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
      articleQuery: {},
    };
  },
  created() {
    this.getArticlePage();
  },
  methods: {
    /* 获取文章分页数据 */
    getArticlePage(current = 1) {
      this.current = current;
      // 调用api
      articleApi
        .getArticlePage(this.current, this.limit, this.articleQuery)
        .then((res) => {
          // 设置文章数据
          this.articles = res.data.articles;
          this.total = res.data.total;
        });
    },
    /* 删除文章 */
    deleteArticle(id) {
      this.$confirm("此操作将永久删除该文章, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 调用api
          articleApi.deleteArticle(id).then((res) => {
            // 提示
            this.$message.success("删除文章成功");
            // 刷新数据
            this.getArticlePage();
          });
        })
        .catch(() => {
          console.log("取消了删除");
        });
    },
    /* 清空查询表单条件 */
    resetArticleData() {
      this.articleQuery = {};
      // 刷新数据
      this.getArticlePage(this.current);
    },
    /* 修改文章的发布状态 */
    updateArticleStatus(newStatus, id) {
      // 调用api
      articleApi.updateArticleStatus(id, newStatus).then((res) => {
        // 提示
        this.$message.success("修改文章发布状态成功");
      });
    },
    /* 修改文章的置顶状态 */
    updateArticleTopStatus(status, id) {
      // 调用api
      articleApi.updateArticleTopStatus(id, status).then((res) => {
        // 提示
        this.$message.success("修改文章置顶状态成功");
      });
    },
  },
};
</script>

<style scoped>
.el-tag {
  margin: 2px 2px;
}

.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>