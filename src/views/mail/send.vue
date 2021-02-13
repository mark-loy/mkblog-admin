<template>
  <div>
    <el-card>
       <!-- 邮件表单 -->
      <el-form
        label-width="120px"
        ref="articleFormRef"
        :model="mailForm"
      >
        <el-form-item
          label="收件人"
          style="width: 50%; min-width: 350px"
          prop="toMail"
        >
          <el-input v-model="mailForm.toMail" placeholder="请输入收件人" />
        </el-form-item>

        <el-form-item
          label="邮件主题"
          style="width: 50%; min-width: 350px"
          prop="subject"
        >
          <el-input v-model="mailForm.subject" placeholder="请输入邮件主题" />
        </el-form-item>

        <el-form-item label="邮件内容" style="width: 80%; min-width: 700px">
          <!--  <tinymce :height="600" v-model="articleForm.content" /> -->
          <markdown-editor
            @inputContent="inputContent"
            :value="mailForm.text"
            placeholder="请输入邮件内容"
            height="500px"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            :disabled="saveBtnDisabled"
            type="primary"
            @click="sendMail"
            >发送</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import MarkdownEditor from "@/components/MarkdownEditor";

import mailApi from '@/api/mail'
  export default {
    components: {
      MarkdownEditor,
    },
    data() {
      return {
        /* 邮件表单 */
        mailForm: {},
        /* 控制邮件发送按钮 */
        saveBtnDisabled: false
      }
    },
    methods: {
      /* 发送邮件 */
      sendMail() {
        // 校验表单
        if (this.mailForm.toMail && this.mailForm.text) {
          // 调用api
          mailApi.sendMail(this.mailForm).then(res => {
            // 提示
            this.$message.success("邮件发送成功")
            // 路由跳转到列表页
            this.$router.push("/mail/list")
          })
        } else {
          this.$message.warning("请将邮件表单填写完整");
        }
      },
      inputContent(v) {
        this.mailForm.text = v
      }
    },
  }
</script>

<style scoped>

</style>