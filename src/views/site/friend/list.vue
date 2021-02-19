<template>
  <div class="friends">
    <el-button type="primary" class="add-friend" @click="showFriendFormDialog" v-if="hasPerm('friend.add')"
      >新增友站</el-button
    >
    <el-row :gutter="24">
      <el-col :span="5" v-for="friend in friends" :key="friend.id">
        <div class="friend-item">
          <a :href="friend.friendUrl" target="_blank" class="link">
            <div class="item-container">
              <img :src="friend.imageUrl" alt="" />
              <div class="site-info">
                <div class="site-name">{{ friend.name }}</div>
                <div class="site-summary">{{ friend.friendSummary }}</div>
              </div>
            </div>
          </a>
          <div class="operation">
            <i
              @click="showUpdateFriendDialog(friend.id)"
              class="el-icon-edit"
              style="color: rgb(64, 158, 255); cursor: pointer"
              v-if="hasPerm('friend.update')"
            ></i>
            <i
              @click="deleteFriend(friend.id)"
              class="el-icon-delete"
              style="color: rgb(245, 108, 108); cursor: pointer"
              v-if="hasPerm('friend.remove')"
            ></i>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 友站表单对话框 -->
    <el-dialog
      :title="friendFormText + '友站'"
      :visible.sync="friendFormVisible"
      width="40%"
    >
      <el-form
        :model="friendForm"
        :rules="friendFormRules"
        ref="friendFormRef"
        label-position="left"
        label-width="80px"
      >
        <el-form-item label="友站名称" prop="name">
          <el-input v-model="friendForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="友站链接" prop="friendUrl">
          <el-input
            v-model="friendForm.friendUrl"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="图片链接" prop="imageUrl">
          <el-input v-model="friendForm.imageUrl" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="友站简介" prop="friendSummary">
          <el-input
            v-model="friendForm.friendSummary"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetFriendForm">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import friendApi from "@/api/site/friend";

export default {
  data() {
    return {
      /* 友站列表 */
      friends: [],
      /* 友站表单 */
      friendForm: {
        id: "",
        name: "",
        friendUrl: "",
        imageUrl: "",
        friendSummary: "",
      },
      /* 友站表单验证规则 */
      friendFormRules: {
        name: [{ required: true, message: "请输入友站名称", trigger: "blur" }],
        friendUrl: [
          { required: true, message: "请输入友站链接", trigger: "blur" },
        ],
        imageUrl: [
          { required: true, message: "请输入图片链接", trigger: "blur" },
        ],
        friendSummary: [
          { required: true, message: "请输入友站简介", trigger: "blur" },
        ],
      },
      /* 控制友站表单对话框显示隐藏 */
      friendFormVisible: false,
      /* 对话框文本 */
      friendFormText: "添加",
    };
  },
  created() {
    this.getAllFriends();
  },
  methods: {
    /* 查询所有的友站信息 */
    getAllFriends() {
      friendApi.selectAllFriends().then((res) => {
        console.log(res.data);
        // 设置友站列表数据
        this.friends = res.data.friends;
      });
    },
    /* 展示新增表单对话框 */
    showFriendFormDialog() {
      this.friendFormVisible = true;
      this.friendFormText = "添加";
    },
    /* 展示修改表单对话框 */
    showUpdateFriendDialog(id) {
      this.friendFormVisible = true;
      this.friendFormText = "修改";
      this.friendForm.id = id;
      this.getFriendId();
    },
    /* 重置表单数据 */
    resetFriendForm() {
      this.friendFormVisible = false;
      this.$refs["friendFormRef"].resetFields();
    },
    /* 添加或修改友站信息 */
    saveOrUpdate() {
      // 验证表单
      this.$refs["friendFormRef"].validate((valid) => {
        if (valid) {
          // 判断id非空
          if (this.friendForm.id) {
            // 修改
            this.updateFriend();
          } else {
            // 添加
            this.saveFriend();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /* 添加友站信息 */
    saveFriend() {
      // 调用api
      friendApi.saveFriend(this.friendForm).then((res) => {
        // 关闭对话框
        this.friendFormVisible = false;
        // 提示
        this.$message.success("添加友站成功");
        // 清空表单
        this.friendForm = {};
        // 刷新刷剧
        this.getAllFriends();
      });
    },
    /* 修改友站信息 */
    updateFriend() {
      // 调用api
      friendApi.updateFriend(this.friendForm).then((res) => {
        // 关闭对话框
        this.friendFormVisible = false;
        // 提示
        this.$message.success("修改友站成功");
        // 清空表单
        this.friendForm = {};
        // 刷新刷剧
        this.getAllFriends();
      });
    },
    /* 查询友站信息 */
    getFriendId() {
      // 调用api
      friendApi.getFriendById(this.friendForm.id).then((res) => {
        // 设置数据
        this.friendForm = res.data.friend;
      });
    },
    /* 删除友站信息 */
    deleteFriend(fid) {
      this.$confirm("此操作将永久删除该友站, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 调用api
          friendApi.deleteFriend(fid).then((res) => {
            // 提示
            this.$message.success("删除友站成功");
            // 刷新数据
            this.getAllFriends();
          });
        })
        .catch(() => {
          console.log('取消删除');
        });
    },
  },
};
</script>

<style scoped>
.friends {
  margin: 24px 20px;
}

.add-friend {
  margin-bottom: 20px;
}

.friend-item {
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 10px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
}

.link {
  width: 90%;
}

.item-container {
  display: flex;
  flex-direction: row;
}

.item-container img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 50%;
  padding: 2px;
  border: 1px solid #dadada;
  position: relative;
  transition: all 0.4s linear;
  margin-right: 10px;
}

.friend-item:hover .item-container img {
  -webkit-transform: rotate(1turn);
  transform: rotate(1turn);
}

.site-info {
  overflow: hidden;
  width: 100%;
}

.site-name {
  -webkit-line-clamp: 1;
  border-bottom: 1px dotted #ececec;
  font-weight: 700;
  font-size: 20px;
}

.site-summary {
  padding-top: 10px;
  font-size: 13px;
  line-height: 1.1rem;
}

.operation {
  width: 10%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -ms-flex-pack: distribute;
  justify-content: space-around;
}
</style>