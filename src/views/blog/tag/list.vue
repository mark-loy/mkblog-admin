<template>
  <div>
    <el-card>
      <!--查询表单-->
      <el-form :inline="true">
        <!-- 标题 -->
        <el-form-item>
          <el-input v-model="name" placeholder="标签名称" />
        </el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="getTagPage(current)"
          >查询</el-button
        >
        <el-button type="default" @click="resetName">清空</el-button>
        <el-button
          type="success"
          style="float: right"
          @click="openDialog(0)"
          v-if="hasPerm('tag.add')"
          >添加标签</el-button
        >
      </el-form>

      <!-- 表格 -->
      <el-table
        :data="tags"
        element-loading-text="数据加载中"
        border
        fit
        highlight-current-row
        row-class-name="myClassList"
      >
        <el-table-column label="序号" width="70" align="center" type="index">
        </el-table-column>
        <el-table-column
          label="标签名称"
          align="center"
          prop="name"
        ></el-table-column>

        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.gmtCreate.substr(0, 16) }}
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              icon="el-icon-edit"
              @click="openDialog(scope.row.id)"
              v-if="hasPerm('tag.update')"
              >编辑标签</el-button
            >
            <el-button
              type="text"
              size="mini"
              icon="el-icon-delete"
              @click="deleteTag(scope.row.id)"
              v-if="hasPerm('tag.remove')"
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
        @current-change="getTagPage"
      />

      <!-- 保存，编辑表单对话框 -->
      <el-dialog
        :title="dialogText + '标签'"
        :visible.sync="dialogFormVisible"
        width="40%"
      >
        <el-form :model="tagForm" :rules="tagFormRules" ref="tagFormRef">
          <el-form-item label="标签名称" label-width="110px" prop="name">
            <el-input v-model="tagForm.name" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelDialog">取 消</el-button>
          <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import tagApi from "@/api/blog/tag";

export default {
  data() {
    return {
      /* 标签列表数据 */
      tags: [],
      /* 当前页 */
      current: 1,
      /* 当页显示数 */
      limit: 5,
      /* 标签名 */
      name: "",
      /* 标签总数 */
      total: 0,
      /* 控制表单对话框 */
      dialogFormVisible: false,
      /* 标签表单 */
      tagForm: {},
      /* 标签id */
      tid: "",
      /* 标签表单验证规则 */
      tagFormRules: {
        name: [{ required: true, message: "请输入标签名称", trigger: "blur" }],
      },
      dialogText: "",
    };
  },
  created() {
    this.getTagPage();
  },
  methods: {
    /* 保存或修改标签 */
    saveOrUpdate() {
      this.$refs["tagFormRef"].validate((valid) => {
        if (valid) {
          if (this.tid) {
            // 修改标签
            this.updateTag();
          } else {
            // 添加标签
            this.saveTag();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /* 获取标签分页数据 */
    getTagPage(current = 1) {
      this.current = current;
      // 调用api
      tagApi.selectTagPage(this.current, this.limit, this.name).then((res) => {
        // 设置标签数据
        this.tags = res.data.tags;
        this.total = res.data.total;
      });
    },
    /* 打开标签对话框 */
    openDialog(id) {
      if (id === 0) {
        // 打开添加对话框
        this.dialogText = "添加";
      } else {
        // 打开修改对话框
        this.dialogText = "编辑";
        // 设置标签id
        this.tid = id;
        // 查询标签名称
        this.getTagId();
      }
      // 打开表单对话框
      this.dialogFormVisible = true;
    },
    /* 关闭标签对话框 */
    cancelDialog() {
      // 关闭对话框
      this.dialogFormVisible = false;
      // 清空表单
      this.tagForm = {};
    },
    /* 查询标签信息 */
    getTagId() {
      // 调用api
      tagApi.selectTagById(this.tid).then((res) => {
        // 设置表单数据
        this.tagForm = res.data.tag;
      });
    },
    /* 修改标签 */
    updateTag() {
      // 调用api
      tagApi.updateTag(this.tagForm).then((res) => {
        // 提示
        this.$message.success("编辑标签成功");
        // 关闭对话框
        this.dialogFormVisible = false;
        // 清空表单
        this.tagForm = {};
        this.tid = "";
        // 刷新数据
        this.getTagPage();
      });
    },
    /* 保存标签 */
    saveTag() {
      // 调用api
      tagApi.saveTag(this.tagForm).then((res) => {
        // 提示
        this.$message.success("添加标签成功");
        // 关闭对话框
        this.dialogFormVisible = false;
        // 清空表单
        this.tagForm = {};
        this.tid = "";
        // 刷新数据
        this.getTagPage();
      });
    },
    /* 删除标签 */
    deleteTag(id) {
      this.$confirm("此操作将永久删除该标签, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 调用api
          tagApi.deleteTag(id).then((res) => {
            // 提示
            this.$message.success("删除标签成功");
            // 刷新数据
            this.getTagPage();
          });
        })
        .catch(() => {
          console.log("取消了删除");
        });
    },
    /* 重置查询条件 */
    resetName() {
      this.name = "";
      // 刷新数据
      this.getTagPage();
    },
  },
};
</script>

<style scoped>
</style>