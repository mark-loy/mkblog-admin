<template>
  <div>
    <el-card>
      <el-button type="primary" @click="socialFormDialog = true" v-if="hasPerm('social.add')"
        >新增</el-button
      >
      <!-- 表格 -->
      <el-table
        :data="socials"
        element-loading-text="数据加载中"
        border
        fit
        highlight-current-row
      >
        <el-table-column label="序号" width="70" align="center" type="index">
        </el-table-column>
        <el-table-column
          label="社交名称"
          align="center"
          prop="name"
          width="200"
        ></el-table-column>
        <el-table-column label="图标" align="center" width="200">
          <template slot-scope="scope">
            <i
            class="iconfont"
              :class="scope.row.icon"
              :style="'color:' + scope.row.color + '; font-size: 25px'"
            ></i>
          </template>
        </el-table-column>
        <el-table-column label="取色" align="center" prop="color" width="180">
          <template slot-scope="scope">
            <div class="color" :style="'background-color:' + scope.row.color">
              {{ scope.row.color }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="链接"
          align="center"
          prop="linkUrl"
        ></el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              icon="el-icon-edit"
              @click="showUpdateDialog(scope.row.id)"
              v-if="hasPerm('social.update')"
              >编辑</el-button
            >
            <el-button
              type="text"
              size="mini"
              icon="el-icon-delete"
              @click="deleteSocial(scope.row.id)"
              v-if="hasPerm('social.remove')"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
        :title="socialDialogText + '社交信息'"
        :visible.sync="socialFormDialog"
      >
        <el-form
          :model="socialForm"
          :rules="socialFormRules"
          label-position="right"
          label-width="80px"
          ref="socialFormRef"
        >
          <el-form-item label="社交名称" prop="name">
            <el-input v-model="socialForm.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="图标" prop="icon">
            <el-input v-model="socialForm.icon" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="取色" prop="color">
            <el-color-picker v-model="socialForm.color"></el-color-picker>
          </el-form-item>
          <el-form-item label="链接" prop="linkUrl">
            <el-input
              v-model="socialForm.linkUrl"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="socialFormDialog = false">取 消</el-button>
          <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import socialApi from "@/api/site/social";

export default {
  data() {
    return {
      /* 社交列表数据 */
      socials: [],
      /* 社交表单 */
      socialForm: {},
      /* 社交表单验证规则 */
      socialFormRules: {
        name: [{ required: true, message: "请输入社交名称", trigger: "blur" }],
        icon: [{ required: true, message: "请输入图标", trigger: "blur" }],
        color: [{ required: true, message: "请选择色彩", trigger: "change" }],
        linkUrl: [
          { required: true, message: "请输入链接地址", trigger: "blur" },
        ],
      },
      /* 控制新增表单对话框 */
      socialFormDialog: false,
      /* 社交对话框文本 */
      socialDialogText: "新增",
    };
  },
  created() {
    this.getAllSocials();
  },
  methods: {
    /* 获取所有社交信息 */
    getAllSocials() {
      // 调用api
      socialApi.selectAllSocial().then((res) => {
        this.socials = res.data.socials;
      });
    },
    /* 保存或修改社交信息 */
    saveOrUpdate() {
      this.$refs["socialFormRef"].validate((valid) => {
        if (valid) {
          if (this.socialForm.id) {
            // 修改
            this.updateSocial();
          } else {
            // 保存，调用api
            this.saveSocial();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /* 保存社交信息 */
    saveSocial() {
      // 调用api
      socialApi.saveSocial(this.socialForm).then((res) => {
        // 提示
        this.$message.success("保存社交信息成功");
        // 刷新数据
        this.getAllSocials();
        // 关闭对话框
        this.socialFormDialog = false;
        // 清空表单
        this.socialForm = {};
      });
    },
    /* 修改社交信息 */
    updateSocial() {
      // 调用api
      socialApi.updateSocial(this.socialForm).then((res) => {
        // 提示
        this.$message.success("修改社交信息成功");
        // 刷新数据
        this.getAllSocials();
        // 关闭对话框
        this.socialFormDialog = false;
        // 清空表单
        this.socialForm = {};
      });
    },
    /* 展示修改对话框 */
    showUpdateDialog(id) {
      // 修改社交对话框文本
      this.socialDialogText = "编辑";
      // 展示对话框
      this.socialFormDialog = true;
      this.socialForm.id = id;
      // 调用api，查询社交信息
      this.getSocialById();
    },
    /* 根据id查询社交信息 */
    getSocialById() {
      socialApi.selectSocialId(this.socialForm.id).then((res) => {
        // 设置表单数据
        this.socialForm = res.data.social;
      });
    },
    /* 删除社交信息 */
    deleteSocial(id) {
      this.$confirm("此操作将永久删除该社交信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 调用api
          socialApi.deleteSocial(id).then(res => {
            // 提示
            this.$message.success("删除社交信息成功")
            // 刷新数据
            this.getAllSocials()
          })
        })
        .catch(() => {
          console.log("取消删除");
        });
    },
  },
};
</script>

<style scoped>
.el-table {
  margin-top: 20px;
}

.color {
  color: #fff;
  padding: 6px 0;
}
</style>