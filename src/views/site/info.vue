<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>站点信息</span>
        <el-button style="float: right; padding: 3px 0" type="text" v-show="readOnly"  @click="changeFormStatue"
          >编辑</el-button
        >
        <el-button style="float: right; padding: 3px 0" type="text" v-show="!readOnly" @click="changeFormStatue"
          >保存</el-button
        >
      </div>
      <div class="siteForm">
        <el-form ref="siteFormRef" :model="siteForm" label-width="80px">
          <el-form-item label="站名">
            <el-input v-model="siteForm.name" :readonly="readOnly"></el-input>
          </el-form-item>
          <el-form-item label="域名">
            <el-input v-model="siteForm.domain" :readonly="readOnly"></el-input>
          </el-form-item>
          <el-form-item label="标语">
            <el-input v-model="siteForm.slogan" :readonly="readOnly"></el-input>
          </el-form-item>
          <el-form-item label="通知">
            <el-input
              v-model="siteForm.notice"
              type="textarea"
              :rows="3"
              placeholder="请输入通知内容"
              :readonly="readOnly"
            ></el-input>
          </el-form-item>
          <!-- 文章背景 -->
          <el-form-item label="背景图">
            <el-upload
              class="avatar-uploader"
              :action="BASE_API + 'oss/file/'"
              name="file"
              :limit="1"
              :on-success="handleSuccess"
              :on-remove="handleRemove"
              :on-exceed="handleExceed"
              :before-upload="beforeUpload"
              :disabled="readOnly"
            >
              <img
                v-if="siteForm.banner"
                :src="siteForm.banner"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>

            <el-button type="primary" size="mini" @click="handlePreview"
              >预览</el-button
            >

            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="siteForm.banner" alt="" />
            </el-dialog>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import siteInfoApi from "@/api/site/info";
import ossApi from "@/api/oss/index";

export default {
  data() {
    return {
      /* 站点信息表单 */
      siteForm: {},
      /* 控制表单只读 */
      readOnly: true,
      /* 图片上传api */
      BASE_API: process.env.VUE_APP_BASE_API,
      /* 预览图片对话框 */
      dialogVisible: false
    };
  },
  created() {
    this.getSiteInfo();
  },
  methods: {
    /* 获取站点信息 */
    getSiteInfo() {
      // 调用api
      siteInfoApi.selectSiteInfo().then((res) => {
        this.siteForm = res.data.siteInfo;
      });
    },
    /* 改变表单状态 */
    changeFormStatue() {
      this.readOnly = ! this.readOnly
      if (this.readOnly) {
        // 调用api,提交表单
        siteInfoApi.updateSiteInfo(this.siteForm).then(res => {
          // 提示
          this.$message.success("站点信息修改成功")

        })
      }
    },
    /* 上传文件前校验文件 */
    beforeUpload(file) {
      const isType = file.type === "image/jpeg" || "image/png";
      const isLt4M = file.size / 1024 / 1024 < 4;

      if (!isType) {
        this.$message.error("上传头像图片只能是 JPG 或 PNG 格式!");
      }
      if (!isLt4M) {
        this.$message.error("上传头像图片大小不能超过 4MB!");
      }
      return isType && isLt4M;
    },
    /* 上传背景图成功 */
    handleSuccess(res, file) {
      console.log(file);
      // 提示
      this.$message.success("背景图上传成功");
      this.siteForm.banner = res.data.url;
    },
    /* 移除上传文件 */
    handleRemove() {
      // 调用api
      ossApi.deleteFileUrl(this.siteForm.banner).then((res) => {
        // 提示
        this.$message.success("图片移除成功");
        // 清空表单中的图片地址
        this.siteForm.banner = "";
      });
    },
    /* 预览已上传的图片 */
    handlePreview() {
      if (this.siteForm.banner) {
        this.dialogVisible = true;
      } else {
        this.$message.warning("还没有上传图片");
      }
    },
    /* 上传文件超过限制的个数 */
    handleExceed() {
      this.$message.warning(`当前限制了上传文件的个数为1个`);
    },
  },
};
</script>

<style scoped>
.el-card {
  margin: 20px 15px;
}

.siteForm {
  width: 50%;
  margin: 0px auto;
}
</style>