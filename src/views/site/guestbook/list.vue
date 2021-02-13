<template>
  <div>
    <el-card>
       <!-- 表格 -->
      <el-table
        :data="guestbooks"
        element-loading-text="数据加载中"
        border
        fit
        highlight-current-row
      >
        <el-table-column label="序号" width="70" align="center" type="index">
        </el-table-column>
        <el-table-column
          label="留言邮箱"
          align="center"
          prop="mail"
          width="200"
        ></el-table-column>
        <el-table-column
          label="留言内容"
          align="center"
          prop="content"
        ></el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              icon="el-icon-delete"
              @click="deleteGuestbook(scope.row.id)"
              v-if="hasPerm('guestbook.remove')"
              >删除</el-button
            >
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
        @current-change="getGuestbookPage"
      />
    </el-card>
  </div>
</template>

<script>
  import guestbookApi from '@/api/site/guestbook'

  export default {
    data() {
      return {
        /* 留言列表 */
        guestbooks: [],
        /* 当前页 */
        current: 1,
        /* 当页显示数 */
        limit: 10,
        /* 总留言数 */
        total: 0
      }
    },
    created () {
      this.getGuestbookPage();
    },
    methods: {
      /* 获取留言分页数据 */
      getGuestbookPage(current = 1) {
        this.current = current
        // 调用api
        guestbookApi.getGuestbookPage(this.current, this.limit).then(res => {
          // 设置留言列表数据
          this.guestbooks = res.data.guestbooks
          this.total = res.data.total
        })
      },
      /* 删除留言 */
      deleteGuestbook(id) {
        this.$confirm("此操作将永久删除该留言, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 调用api
          socialApi.deleteGuestbook(id).then(res => {
            // 提示
            this.$message.success("删除留言成功")
            // 刷新数据
            this.getGuestbookPage()
          })
        })
        .catch(() => {
          console.log("取消删除");
        });
      }
    },
  }
</script>

<style scoped>

</style>