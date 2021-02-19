<template>
  <div>
    <el-card>
      <!--查询表单-->
      <el-form :inline="true">
        <!-- 标题 -->
        <el-form-item>
          <el-input v-model="name" placeholder="分类名称" />
        </el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="getCategoryPage(current)"
          >查询</el-button
        >
        <el-button type="default" @click="resetName">清空</el-button>
        <el-button
          type="success"
          style="float: right"
          @click="openDialog(0)"
          v-if="hasPerm('category.add')"
          >添加分类</el-button
        >
      </el-form>

      <!-- 表格 -->
      <el-table
        :data="categorys"
        element-loading-text="数据加载中"
        border
        fit
        highlight-current-row
        row-class-name="myClassList"
      >
        <el-table-column label="序号" width="70" align="center" type="index">
        </el-table-column>
        <el-table-column
          label="分类名称"
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
              v-if="hasPerm('category.update')"
              >编辑分类</el-button
            >
            <el-button
              type="text"
              size="mini"
              icon="el-icon-delete"
              v-if="hasPerm('category.remove')"
              @click="deleteCate(scope.row.id)"
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
        @current-change="getCategoryPage"
      />

      <!-- 保存，编辑表单对话框 -->
      <el-dialog
        :title="dialogText + '分类'"
        :visible.sync="dialogFormVisible"
        width="40%"
      >
        <el-form :model="cateForm" :rules="cateFormRules" ref="cateFormRef">
          <el-form-item label="分类名称" label-width="110px" prop="name">
            <el-input v-model="cateForm.name" autocomplete="off"></el-input>
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
import cateApi from "@/api/blog/category";

export default {
  data() {
    return {
      /* 分类列表数据 */
      categorys: [],
      /* 当前页 */
      current: 1,
      /* 当页显示数 */
      limit: 10,
      /* 分类名 */
      name: "",
      /* 分类总数 */
      total: 0,
      /* 控制表单对话框 */
      dialogFormVisible: false,
      /* 分类表单 */
      cateForm: {},
      /* 分类id */
      cid: "",
      /* 分类表单验证规则 */
      cateFormRules: {
        name: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
      },
      dialogText: "",
    };
  },
  created() {
    this.getCategoryPage();
  },
  methods: {
    /* 保存或修改分类 */
    saveOrUpdate() {
      this.$refs["cateFormRef"].validate((valid) => {
        if (valid) {
          if (this.cid) {
            // 修改分类
            this.updateCate();
          } else {
            // 添加分类
            this.saveCate();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /* 获取分类分页数据 */
    getCategoryPage(current = 1) {
      this.current = current;
      // 调用api
      cateApi
        .selectCategoryPage(this.current, this.limit, this.name)
        .then((res) => {
          // 设置分类数据
          this.categorys = res.data.categories;
          this.total = res.data.total;
        });
    },
    /* 打开分类对话框 */
    openDialog(id) {
      if (id === 0) {
        // 打开添加对话框
        this.dialogText = "添加";
      } else {
        // 打开修改对话框
        this.dialogText = "编辑";
        // 设置分类id
        this.cid = id;
        // 查询分类名称
        this.getCategoryId();
      }
      // 打开表单对话框
      this.dialogFormVisible = true;
    },
    /* 关闭分类对话框 */
    cancelDialog() {
      // 关闭对话框
      this.dialogFormVisible = false;
      // 清空表单
      this.cateForm = {};
    },
    /* 查询分类信息 */
    getCategoryId() {
      // 调用api
      cateApi.selectCategoryById(this.cid).then((res) => {
        // 设置表单数据
        this.cateForm = res.data.category;
      });
    },
    /* 修改分类 */
    updateCate() {
      // 调用api
      cateApi.updateCategory(this.cateForm).then((res) => {
        // 提示
        this.$message.success("编辑分类成功");
        // 关闭对话框
        this.dialogFormVisible = false;
        // 清空表单
        this.cateForm = {};
        this.cid = "";
        // 刷新数据
        this.getCategoryPage();
      });
    },
    /* 保存分类 */
    saveCate() {
      // 调用api
      cateApi.saveCategory(this.cateForm).then((res) => {
        // 提示
        this.$message.success("添加分类成功");
        // 关闭对话框
        this.dialogFormVisible = false;
        // 清空表单
        this.cateForm = {};
        this.cid = "";
        // 刷新数据
        this.getCategoryPage();
      });
    },
    /* 删除分类 */
    deleteCate(id) {
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 调用api
          cateApi.deleteCategory(id).then((res) => {
            // 提示
            this.$message.success("删除分类成功");
            // 刷新数据
            this.getCategoryPage();
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
      this.getCategoryPage();
    },
  },
};
</script>

<style scoped>
</style>