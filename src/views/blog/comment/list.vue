<template>
  <div>
    <el-card>
      <el-table
        :data="comments"
        style="width: 100%; margin-bottom: 20px"
        row-key="id"
        border
        default-expand-all
        :tree-props="{ children: 'children' }"
      >
        <el-table-column label="序号" width="70" align="center" type="index">
        </el-table-column>
        <el-table-column prop="visitorName" label="评论人" width="120">
        </el-table-column>
        <el-table-column prop="acceptName" label="接收人" width="120">
        </el-table-column>
        <el-table-column prop="content" label="评论内容"> </el-table-column>
        <el-table-column label="是否禁用" width="120">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isDisabled"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="updateCommentState(scope.row.isDisabled, scope.row.id)"
              :disabled="!hasPerm('comment.status')"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="gmtCreate"
          label="创建时间"
          width="180"
        ></el-table-column>

        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              icon="el-icon-delete"
              @click="deleteComment(scope.row.id)"
              v-if="hasPerm('comment.remove')"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import commentApi from "@/api/blog/comment";

export default {
  data() {
    return {
      /* 品论列表数据 */
      comments: [],
      /* 文章id */
      articleId: "",
    };
  },
  created() {
    // 判断路由
    if (this.$route.params && this.$route.params.id) {
      this.articleId = this.$route.params.id;
    }
    this.getCommentPage();
  },
  methods: {
    /* 获取评论的分页数据 */
    getCommentPage() {
      // 调用api
      commentApi.selectArticleCommentPage(this.articleId).then((res) => {
        console.log(res.data);
        // 设置评论列表数据
        this.comments = res.data.comments;
      });
    },
    /* 修改评论状态 */
    updateCommentState(state, cid) {
      // 调用api
      commentApi.updateCommentState(cid, state).then((res) => {
        // 提示
        this.$message.success("修改评论状态成功");
        // 刷新数据
        this.getCommentPage();
      });
    },
    /* 删除评论 */
    deleteComment(id) {
      this.$confirm("此操作将永久删除该文章, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 调用api
          commentApi.deleteComment(id).then((res) => {
            // 提示
            this.$message.success("删除评论成功");
            // 刷新数据
            this.getCommentPage();
          });
        })
        .catch(() => {
          console.log("取消了删除");
        });
    },
  },
};
</script>

<style scoped>
</style>