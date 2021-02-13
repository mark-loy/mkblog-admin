<template>
  <div>
    <el-card>
      <!-- 表格 -->
      <el-table
        :data="mails"
        element-loading-text="数据加载中"
        border
        fit
        highlight-current-row
        row-class-name="myClassList"
      >
        <el-table-column label="序号" width="70" align="center" type="index">
        </el-table-column>
        <el-table-column
          label="接收人"
          align="center"
          prop="toMail"
          width="160"
        ></el-table-column>
        <el-table-column
          label="发送人"
          align="center"
          prop="fromMail"
          width="160"
        ></el-table-column>
        <el-table-column
          label="邮件主题"
          align="center"
          prop="subject"
          width="300"
        ></el-table-column>
        <el-table-column
          label="邮件内容"
          align="center"
          prop="text"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="160">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              icon="el-icon-delete"
              @click="deleteMail(scope.row.id)"
              v-if="hasPerm('mail.remove')"
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
        @current-change="getMailPage"
      />
    </el-card>
  </div>
</template>

<script>
import mailApi from "@/api/mail/";

export default {
  data() {
    return {
      /* 邮件列表 */
      mails: [],
      /* 当前页 */
      current: 1,
      /* 当页显示数 */
      limit: 10,
      /* 总邮件数 */
      total: 0,
    };
  },
  created() {
    this.getMailPage();
  },
  methods: {
    /* 查询邮件分页数据 */
    getMailPage(current = 1) {
      this.current = current;
      // 调用api
      mailApi.selectMailPage(this.current, this.limit).then((res) => {
        console.log(res.data);
        // 设置邮件列表数据
        this.mails = res.data.mails;
        this.total = res.data.total;
      });
    },
    /* 删除邮件 */
    deleteMail(id) {
      this.$confirm("此操作将永久删除该邮件记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 调用api
          mailApi.deleteMail(id).then((res) => {
            // 提示
            this.$message.success("删除邮件成功");
            // 刷新数据
            this.getMailPage();
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