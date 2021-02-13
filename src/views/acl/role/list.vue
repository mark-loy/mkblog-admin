<template>
  <div class="app-container">
    <!-- 工具条 -->
    <div>
      <el-button
        type="danger"
        size="mini"
        @click="showRoleVisiable(-1)"
        v-if="hasPerm('role.add')"
        >添加</el-button
      >
    </div>

    <!-- 讲师列表 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="roleName" label="角色名称" />
      <el-table-column prop="roleCode" label="角色code" />
      <el-table-column prop="remark" label="说明" />

      <el-table-column label="操作" width="250" align="center">
        <template slot-scope="scope">
          <el-button
            type="info"
            size="mini"
            icon="el-icon-info"
            v-if="hasPerm('role.acl')"
            @click="showRoleMenuVisiable(scope.row.id)"
          ></el-button>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            v-if="hasPerm('role.update')"
            @click="showRoleVisiable(scope.row.id)"
          ></el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeDataById(scope.row.id)"
            v-if="hasPerm('role.remove')"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      style="padding: 30px 0; text-align: center"
      layout="sizes, prev, pager, next, jumper, ->, total, slot"
      @current-change="fetchData"
      @size-change="changeSize"
    />

    <!-- 添加角色对话框 -->
    <el-dialog
      :title="roleFormText + '角色'"
      :visible.sync="roleFormVisible"
      width="40%"
    >
      <el-form
        ref="roleFormRef"
        :model="roleForm"
        :rules="roleFormRules"
        label-width="120px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" />
        </el-form-item>
        <el-form-item label="角色code" prop="roleCode">
          <el-input v-model="roleForm.roleCode" />
        </el-form-item>
        <el-form-item label="说明">
          <el-input v-model="roleForm.remark" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetRoleForm">取 消</el-button>
        <el-button
          type="primary"
          :disabled="saveBtnDisabled"
          @click="saveOrUpdate"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- 给角色分配菜单对话框 -->
    <el-dialog title="分配菜单" :visible.sync="roleMenuVisible" width="40%">
      <el-tree
        :data="roleMenus"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
        highlight-current
        :props="defaultProps"
      >
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleMenuVisible = false">取 消</el-button>
        <el-button
          type="primary"
          :disabled="roleMenuBtnDisabled"
          @click="assignRoleMenu"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import roleApi from "@/api/acl/role";

const roleFormDefault = {
  id: '',
  roleName: '',
  roleCode: '',
  remark: ''
}

export default {
  data() {
    return {
      listLoading: true, // 数据是否正在加载
      list: null, // 讲师列表
      total: 0, // 数据库中的总记录数
      page: 1, // 默认页码
      limit: 10, // 每页记录数
      multipleSelection: [], // 批量选择中选择的记录列表
      /* 角色表单 */
      roleForm: roleFormDefault,
      /* 角色表单校验规则 */
      roleFormRules: {
        roleName: [
          { required: true, trigger: "blur", message: "请输入角色名称" },
        ],
      },
      /* 角色表单提交按钮状态 */
      saveBtnDisabled: false,
      /* 角色表单对话框显示、隐藏 */
      roleFormVisible: false,
      /* 角色表单对话框标题文本 */
      roleFormText: "添加",
      /* 分配菜单对话框显示、隐藏 */
      roleMenuVisible: false,
      /* 分配菜单tree数据 */
      roleMenus: [],
      /* 树状结构读取的参数 */
      defaultProps: {
        children: "children",
        label: "name",
      },
      /* 控制分配菜单提交按钮状态 */
      roleMenuBtnDisabled: false,
      /* 角色id */
      roleId: "",
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
    /* 展示角色对话框 */
    showRoleVisiable(id) {
      // 展示对话框
      this.roleFormVisible = true;
      if (id === -1) {
        this.roleFormText = "添加";
      } else {
        // 修改角色对话框
        this.getRoleById(id);
        this.roleFormText = "修改";
      }
    },
    // 加载讲师列表数据
    fetchData(page = 1) {
      // 异步获取远程数据（ajax）
      this.page = page;
      roleApi.getPageList(this.page, this.limit).then((response) => {
        this.list = response.data.roles;
        this.total = response.data.total;
        // 数据加载并绑定成功
        this.listLoading = false;
      });
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
          return roleApi.removeById(id);
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
    /* 添加或修改角色 */
    saveOrUpdate() {
      // 验证表单
      this.$refs["roleFormRef"].validate((valid) => {
        if (valid) {
          // 防止表单重复提交
          this.saveBtnDisabled = true;
          // 判断提交方式
          if (this.roleForm.id) {
            // 修改角色
            this.updateRole();
          } else {
            // 添加角色
            this.saveRole();
          }
          // 重置表单
          this.resetRoleForm();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /* 重置角色表单 */
    resetRoleForm() {
      // 关闭对话框
      this.roleFormVisible = false;
      // 还原提交按钮
      this.saveBtnDisabled = false;
      // 重置表单
      this.$refs.roleFormRef.resetFields();
      this.roleForm = {}
    },
    /* 添加角色 */
    saveRole() {
      // 调用api
      roleApi.save(JSON.stringify(this.roleForm)).then((res) => {
        // 提示
        this.$message.success("添加角色成功");
        // 刷新数据
        this.fetchData();
      });
    },
    /* 修改角色 */
    updateRole() {
      // 调用api
      roleApi.updateById(JSON.stringify(this.roleForm)).then((res) => {
        // 提示
        this.$message.success("修改角色成功");
        // 刷新数据
        this.fetchData();
      });
    },
    /* 通过id查询角色 */
    getRoleById(id) {
      // 调用api
      roleApi.getById(id).then((response) => {
        this.roleForm = response.data.role;
      });
    },
    /* 展示角色菜单对话框 */
    showRoleMenuVisiable(rid) {
      this.roleMenuVisible = true;
      this.getAssignRoleMenu(rid);
      this.roleId = rid;
    },
    /* 分配角色菜单 */
    assignRoleMenu() {
      this.roleMenuBtnDisabled = true;
      var ids = this.$refs.tree
        .getCheckedKeys()
        .concat(this.$refs.tree.getHalfCheckedKeys())
        .join(",");
      // 调用api
      roleApi.doAssign(this.roleId, ids).then((response) => {
        if (response.success) {
          this.$message({
            type: "success",
            message: "保存成功",
          });
          // 关闭对话框
          this.roleMenuVisible = false;
        }
      });
      // 还原提交按钮状态
      this.roleMenuBtnDisabled = false;
    },
    /* 获取所有菜单列表，并勾选已分配的菜单 */
    getAssignRoleMenu(roleId) {
      roleApi.getAssign(roleId).then((response) => {
        this.roleMenus = response.data.permissions;
        var jsonList = JSON.parse(JSON.stringify(this.roleMenus));
        var list = [];
        this.getJsonToList(list, jsonList[0]["children"]);
        this.setCheckedKeys(list);
      });
    },
    //把json数据转成string再转成对象，根据Key获取value数据
    getJsonToList(list, jsonList) {
      //遍历这个集合对象，获取key的值
      for (var i = 0; i < jsonList.length; i++) {
        if (jsonList[i]["isSelect"] == true && jsonList[i]["level"] == 4) {
          list.push(jsonList[i]["id"]);
        }
        if (jsonList[i]["children"] != null) {
          this.getJsonToList(list, jsonList[i]["children"]);
        }
      }
    },
    /* 勾选已分配菜单 */
    setCheckedKeys(list) {
      this.$refs.tree.setCheckedKeys(list);
    },
  },
};
</script>

