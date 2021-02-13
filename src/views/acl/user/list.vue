<template>
  <div class="app-container">
    <!-- 工具条 -->
    <div>
      <el-button
        type="danger"
        size="mini"
        @click="showUserDialog(-1)"
        v-if="hasPerm('user.add')"
        >添加</el-button
      >
    </div>

    <!-- 讲师列表 -->
    <el-table
      v-loading="listLoading"
      :data="users"
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="avatar" label="用户头像" width="150">
        <template slot-scope="scope">
          <el-avatar size="medium" :src="scope.row.avatar"></el-avatar>
        </template>
      </el-table-column>

      <el-table-column prop="username" label="用户名" width="200" />

      <el-table-column prop="nickname" label="用户昵称" width="200" />

      <el-table-column prop="sign" label="签名" />

      <el-table-column prop="gmtCreate" label="创建时间" width="180" />

      <el-table-column label="操作" width="230" align="center">
        <template slot-scope="scope">
          <el-button
            type="info"
            size="mini"
            icon="el-icon-info"
            v-if="hasPerm('user.assgin')"
            @click="showUserRoleDialog(scope.row.id)"
          ></el-button>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            v-if="hasPerm('user.update')"
            @click="showUserDialog(scope.row.id)"
          ></el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeDataById(scope.row.id)"
            v-if="hasPerm('user.remove')"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
      style="padding: 30px 0; text-align: center"
      layout="sizes, prev, pager, next, jumper, ->, total, slot"
      @current-change="fetchData"
      @size-change="changeSize"
    />

    <!-- 添加用户对话框 -->
    <el-dialog
      :title="userFormText + '用户'"
      :visible.sync="userFormVisible"
      width="40%"
    >
      <el-form
        ref="userFormRef"
        :model="userForm"
        :rules="userFormRules"
        label-width="120px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" />
        </el-form-item>
        <el-form-item v-if="!userForm.id" label="密码" prop="password">
          <el-input v-model="userForm.password" />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="userForm.nickname" />
        </el-form-item>
        <el-form-item label="签名">
          <el-input v-model="userForm.sign" />
        </el-form-item>
        <!-- 用户头像 -->
        <el-form-item label="用户头像">
          <!-- 头衔缩略图 -->
          <pan-thumb :image="userForm.avatar" />
          <!-- 文件上传按钮 -->
          <el-button
            type="primary"
            icon="el-icon-upload"
            @click="imagecropperShow = true"
            >更换头像
          </el-button>
          <!--
            v-show：是否显示上传组件
            :key：类似于id，如果一个页面多个图片上传控件，可以做区分
            :url：后台上传的url地址
            @close：关闭上传组件
            @crop-upload-success：上传成功后的回调 -->
          <image-cropper
            v-show="imagecropperShow"
            :width="300"
            :height="300"
            :key="imagecropperKey"
            :url="server_url + 'api/oss/file'"
            field="file"
            @close="imagecropperShow = false"
            @crop-upload-success="cropSuccess"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetUserForm">取 消</el-button>
        <el-button
          type="primary"
          :disabled="userBtnDisabled"
          @click="saveOrUpdateUser"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="assignRoleVisible" width="40%">
      <el-checkbox
        :indeterminate="isIndeterminate"
        v-model="checkAll"
        @change="handleCheckAllChange"
        >全选</el-checkbox
      >
      <div style="margin: 15px 0"></div>
      <el-checkbox-group
        v-model="checkedRoles"
        @change="handleCheckedRolesChange"
      >
        <el-checkbox v-for="role in roles" :label="role.id" :key="role.id">{{
          role.roleName
        }}</el-checkbox>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="assignRoleVisible = false">取 消</el-button>
        <el-button
          type="primary"
          :disabled="assignRoleBtnDisabled"
          @click="assignRole"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import userApi from "@/api/acl/user";

import ImageCropper from "@/components/ImageCropper";
import PanThumb from "@/components/PanThumb";

export default {
  components: {
    ImageCropper,
    PanThumb,
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码不能小于6位"));
      } else {
        callback();
      }
    };
    return {
      listLoading: true, // 数据是否正在加载
      users: [], // 用户列表
      total: 0, // 数据库中的总记录数
      page: 1, // 默认页码
      limit: 10, // 每页记录数
      multipleSelection: [], // 批量选择中选择的记录列表
      /* 用户表单对话框文本 */
      userFormText: "添加",
      /* 用户表单 */
      userForm: {},
      /* 用户表单校验规则 */
      userFormRules: {
        username: [
          { required: true, trigger: "blur", message: "用户名必须输入" },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePass },
        ],
      },
      /* 控制用户表单提交按钮状态 */
      userBtnDisabled: false,
      /* 控制用户表单对话框状态 */
      userFormVisible: false,
      /* 控制分配角色对话框 */
      assignRoleVisible: false,
      /* 控制分配角色提交按钮 */
      assignRoleBtnDisabled: false,
      /* 控制全选角色 */
      checkAll: false,
      /* 已选中角色 */
      checkedRoles: [],
      /* 所有角色 */
      roles: [],
      /* 控制选中样式 */
      isIndeterminate: true,
      /* 用户id */
      userId: "",
      /* 图片上传的唯一key */
      imagecropperKey: 0,
      /* 是否显示上传图片弹框 */
      imagecropperShow: false,
      /* 获取图片上传接口地址 */
      server_url: process.env.VUE_APP_BASE_API,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    // 当页码发生改变的时候
    changeSize(size) {
      this.limit = size;
      this.fetchData(1);
    },
    // 加载讲师列表数据
    fetchData(page = 1) {
      // 异步获取远程数据（ajax）
      this.page = page;
      userApi.getPageList(this.page, this.limit).then((response) => {
        this.users = response.data.users;
        this.total = response.data.total;
        // 数据加载并绑定成功
        this.listLoading = false;
      });
    },
    // 重置查询表单
    resetData() {
      this.fetchData();
    },
    // 根据id删除数据
    removeDataById(id) {
      // debugger
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // promise
          // 点击确定，远程调用ajax
          return userApi.removeById(id);
        })
        .then((response) => {
          this.fetchData(this.page);
          if (response.success) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          }
        })
        .catch(() => {
          console.log("取消删除");
        });
    },
    // 当表格复选框选项发生变化的时候触发
    handleSelectionChange(selection) {
      this.multipleSelection = selection;
    },
    /* 展示对话框 */
    showUserDialog(id) {
      // 展示对话框
      this.userFormVisible = true;
      if (id !== -1) {
        // 修改用户
        this.userFormText = "修改";
        this.getUserById(id);
      } else {
        this.userFormText = "添加";
      }
    },
    /* 重置用户表单 */
    resetUserForm() {
      // 关闭对话框
      this.userFormVisible = false;
      // 重置表单数据
      this.$refs.userFormRef.resetFields();
      this.userForm = {};
      // 还原提交按钮状态
      this.userBtnDisabled = false;
    },
    /* 添加或修改用户 */
    saveOrUpdateUser() {
      // 验证表单
      this.$refs["userFormRef"].validate((valid) => {
        if (valid) {
          // 防止表单重复提交
          this.userBtnDisabled = true;
          // 判断提交方式
          if (this.userForm.id) {
            // 修改角色
            this.updateUser();
          } else {
            // 添加角色
            this.saveUser();
          }
          // 重置表单
          this.resetUserForm();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /* 添加用户 */
    saveUser() {
      // 调用api
      userApi.save(JSON.stringify(this.userForm)).then((res) => {
        // 提示
        this.$message.success("添加用户成功");
        // 刷新数据
        this.fetchData();
      });
    },
    /* 修改用户 */
    updateUser() {
      // 调用api
      userApi.updateById(JSON.stringify(this.userForm)).then((res) => {
        // 提示
        this.$message.success("修改用户成功");
        // 刷新数据
        this.fetchData();
      });
    },
    /* 通过id查询用户数据 */
    getUserById(id) {
      // 调用api
      userApi.getById(id).then((res) => {
        // 设置表单数据
        this.userForm = res.data.user;
      });
    },
    /* 展示分配角色对话框 */
    showUserRoleDialog(id) {
      this.getById(id);
      this.assignRoleVisible = true;
      this.userId = id;
    },
    /* 分配角色 */
    assignRole() {
      this.saveBtnDisabled = true; // 防止表单重复提交
      var ids = this.checkedRoles.join(",");
      //修改权限
      userApi.saveAssign(this.userId, ids).then((response) => {
        this.$message({
          type: "success",
          message: "保存成功",
        });
      });
      this.assignRoleVisible = false;
    },
    /* 当全选状态改变 */
    handleCheckAllChange(val) {
      this.checkedRoles = val ? this.getJsonToList(this.roles, "id") : [];
      this.isIndeterminate = false;
    },
    /* 当选择角色 */
    handleCheckedRolesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.roles.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.roles.length;
    },
    /* 通过用户id获取角色数据 */
    getById(userId) {
      // 调用api
      userApi.getAssign(userId).then((response) => {
        var jsonObj = response.data.assignRoles;
        this.checkedRoles = this.getJsonToList(jsonObj, "id");
        this.roles = response.data.roles;
        this.isIndeterminate =
          this.checkedRoles.length > 0 &&
          this.checkedRoles.length < this.roles.length;
        this.checkAll = this.checkedRoles.length === this.roles.length;
      });
    },
    //把json数据转成string再转成对象，根据Key获取value数据
    getJsonToList(json, key) {
      //把JSON字符串转成对象
      var list = JSON.parse(JSON.stringify(json));
      //var list = JSON.parse(json)
      var strText = [];
      //遍历这个集合对象，获取key的值
      for (var i = 0; i < list.length; i++) {
        strText.push(list[i][key]);
      }
      return strText;
    },
    /* 头像上传成功 */
    cropSuccess(data) {
      this.userForm.avatar = data.url;
    },
  },
};
</script>


