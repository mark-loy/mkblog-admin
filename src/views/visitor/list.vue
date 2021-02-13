<template>
  <div>
    <el-card>
      <!--查询表单-->
      <el-form :inline="true" :model="visitorQuery">
        <!-- 昵称 -->
        <el-form-item>
          <el-input v-model="visitorQuery.nickname" placeholder="访客昵称" />
        </el-form-item>
        <!-- 访客状态 -->
        <el-form-item>
          <el-select
            v-model="visitorQuery.isDisabled"
            placeholder="请选择访客状态"
          >
            <el-option label="未禁用" value="false"></el-option>
            <el-option label="已禁用" value="true"></el-option>
          </el-select>
        </el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="getVisitorsPage(current)"
          >查询</el-button
        >
        <el-button type="default" @click="resetVisitorData">清空</el-button>
      </el-form>

      <!-- 表格 -->
      <el-table
        :data="visitors"
        element-loading-text="数据加载中"
        border
        fit
        highlight-current-row
        row-class-name="myClassList"
      >
        <el-table-column label="序号" width="70" align="center" type="index">
        </el-table-column>
        <el-table-column
          label="访客头像"
          align="center"
          prop="avatar"
          width="150"
        >
          <template slot-scope="scope">
            <el-avatar size="medium" :src="scope.row.avatar"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column
          label="访客昵称"
          align="center"
          prop="nickname"
          width="200"
        ></el-table-column>
        <el-table-column
          label="访客邮箱"
          align="center"
          prop="email"
        ></el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.gmtCreate.substr(0, 16) }}
          </template>
        </el-table-column>

        <el-table-column label="是否禁用" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isDisabled"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="updateVisitorState(scope.row.isDisabled, scope.row.id)"
              :disabled="!hasPerm('visitor.status')"
            >
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              icon="el-icon-delete"
              @click="deleteVisitor(scope.row.id)"
              v-if="hasPerm('visitor.remove')"
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
        @current-change="getVisitorsPage"
      />
    </el-card>
  </div>
</template>

<script>
import visitorApi from "@/api/visitor";

export default {
  data() {
    return {
      /* 访客列表数据 */
      visitors: [],
      /* 当前页 */
      current: 1,
      /* 当页显示数 */
      limit: 10,
      /* 总访客数 */
      total: 0,
      /* 访客查询表单 */
      visitorQuery: {},
    };
  },
  created() {
    this.getVisitorsPage();
  },
  methods: {
    getVisitorsPage(current = 1) {
      this.current = current;
      // 调用api
      visitorApi
        .getVisitorPage(this.current, this.limit, this.visitorQuery)
        .then((res) => {
          // 设置访客列表数据
          this.visitors = res.data.visitors;
          this.total = res.data.total;
        });
    },
    /* 清空访客查询表单 */
    resetVisitorData() {
      this.visitorQuery = {};
      this.getVisitorsPage();
    },
    /* 修改访客状态 */
    updateVisitorState(state, id) {
      // 调用api
      visitorApi.updateVisitorState(id, state).then((res) => {
        // 提示
        this.$message.success("修改访客状态成功");
        // 刷新刷剧
        this.getVisitorsPage();
      });
    },
    /* 删除访客 */
    deleteVisitor(id) {
      this.$confirm("此操作将永久删除该访客, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 调用api
          visitorApi.deleteVisitor(id).then((res) => {
            // 提示
            this.$message.success("删除访客成功");
            // 刷新数据
            this.getVisitorsPage();
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