<template>
  <div>
    <el-card>
      <!-- 文章表单 -->
      <el-form
        label-width="120px"
        ref="articleFormRef"
        :model="articleForm"
        :rules="articleFormRules"
      >
        <el-form-item
          label="文章标题"
          style="width: 50%; min-width: 350px"
          prop="title"
        >
          <el-input v-model="articleForm.title" placeholder="请输入文章标题" />
        </el-form-item>

        <!-- 发表人 -->
        <el-form-item label="发表人" prop="userId">
          <el-select v-model="articleForm.userId" placeholder="请选择">
            <el-option
              v-for="user in users"
              :key="user.id"
              :label="user.nickname"
              :value="user.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- 所属分类 -->
        <el-form-item label="文章分类" prop="categoryId">
          <el-select v-model="articleForm.categoryId" placeholder="请选择">
            <el-option
              v-for="category in categorys"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- 所属标签 -->
        <el-form-item label="文章标签" prop="tagIds">
          <el-select multiple v-model="articleForm.tagIds" placeholder="请选择">
            <el-option
              v-for="tag in tags"
              :key="tag.id"
              :label="tag.name"
              :value="tag.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="文章概要" style="width: 50%; min-width: 350px">
          <el-input
            type="textarea"
            autosize
            placeholder="请输入文章概要"
            v-model="articleForm.summary"
          >
          </el-input>
        </el-form-item>

        <!-- 文章背景 -->
        <el-form-item label="背景图">
          <el-upload
            class="avatar-uploader"
            :action="BASE_API + 'api/oss/file'"
            name="file"
            :limit="1"
            :on-success="handleSuccess"
            :on-remove="handleRemove"
            :on-exceed="handleExceed"
            :before-upload="beforeUpload"
          >
            <img
              v-if="articleForm.imageUrl"
              :src="articleForm.imageUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>

          <el-button type="primary" size="mini" @click="handlePreview"
            >预览</el-button
          >

          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="articleForm.imageUrl" alt="" />
          </el-dialog>
        </el-form-item>
        <el-form-item label="背景图标题" style="width: 50%; min-width: 350px">
          <el-input v-model="articleForm.imageTitle" placeholder="请输入图片标题" />
        </el-form-item>
        <el-form-item label="背景图链接" style="width: 50%; min-width: 350px">
          <el-input v-model="articleForm.linkUrl" placeholder="请输入图片链接" />
        </el-form-item>

        <el-form-item label="文章内容" style="width: 80%; min-width: 700px">
          <!--  <tinymce :height="600" v-model="articleForm.content" /> -->
          <markdown-editor
            @inputContent="inputContent"
            :value="articleForm.content"
            placeholder="请输入文章内容"
            height="700px"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            :disabled="saveBtnDisabled"
            type="primary"
            @click="saveOrUpdate"
            >保存</el-button
          >
          <el-button
            :disabled="saveBtnDisabled"
            type="primary"
            @click="saveOrUpdatePublish"
            >保存并发布</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import articleApi from "@/api/blog/article";
import categoryApi from "@/api/blog/category";
import tagApi from "@/api/blog/tag";
import ossApi from "@/api/oss/index";
import {selectAllUser} from '@/api/login'

// 引入markdown
import MarkdownEditor from "@/components/MarkdownEditor";

export default {
  components: {
    MarkdownEditor,
  },
  data() {
    return {
      /* 文章表单 */
      articleForm: {
        /* 文章标题 */
        title: "",
        /* 用户id */
        userId: "",
        /* 分类id */
        categoryId: "",
        /* 标签数组 */
        tagIds: [],
        /* 图片标题 */
        imageTitle: "",
        /* 图片路径 */
        imageUrl: "",
        /* 图片链接 */
        linkUrl: "",
        /* 文章内容 */
        content: "",
      },
      /* 文章表单验证规则 */
      articleFormRules: {
        title: [{ required: true, message: "请输入文章标题", trigger: "blur" }],
        userId: [
          { required: true, message: "请选择发表人", trigger: "change" },
        ],
        categoryId: [
          { required: true, message: "请选择文章分类", trigger: "change" },
        ],
        tagIds: [
          {
            required: true,
            message: "请选择至少一个文章标签",
            trigger: "change",
          },
        ],
      },
      /* 所有用户 */
      users: [],
      /* 所有分类 */
      categorys: [],
      /* 所有标签 */
      tags: [],
      /* 文件上传api前缀 */
      BASE_API: process.env.VUE_APP_BASE_API,
      /* 控制保存按钮状态 */
      saveBtnDisabled: false,
      /* 控制背景图的显示 */
      dialogVisible: false,
    };
  },
  created() {
    this.getAllUser();
    this.getAllCategory();
    this.getAllTag();

    // 判断路由
    if (this.$route.params && this.$route.params.id) {
      // 修改文章路由
      // 获取路由中的id
      this.articleForm.id = this.$route.params.id;
      // 获取文章基本数据
      this.getArticleById();
    }
  },
  methods: {
    /* 保存或修改文章数据 */
    saveOrUpdate() {
      // 验证文章表单
      this.$refs["articleFormRef"].validate((valid) => {
        if (valid) {
          // 判断是保存还是修改路由
          if (this.articleForm.id) {
            // 修改文章数据
            this.updateArticle();
          } else {
            // 保存文章数据
            this.saveArticle();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /* 保存或修改并发布文章数据 */
    saveOrUpdatePublish() {
      // 验证文章表单
      this.$refs["articleFormRef"].validate((valid) => {
        if (valid) {
          // 判断是保存还是修改路由
          if (this.articleForm.id) {
            // 修改发布文章数据
            this.updateArticlePublish();
          } else {
            // 保存发布文章数据
            this.saveArticlePublish();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /* 保存文章信息 */
    saveArticle() {
      // 调用api
      articleApi.saveArticle(this.articleForm).then((res) => {
        // 提示
        this.$message.success("保存文章成功");
        // 路由跳转到内容页
        this.$router.push("/blog/article/list");
      });
    },
    /* 修改文章信息 */
    updateArticle() {
      // 调用api
      articleApi.updateArticle(this.articleForm).then((res) => {
        // 提示
        this.$message.success("修改文章成功");
        // 路由跳转到内容页
        this.$router.push("/blog/article/list");
      });
    },
    /* 保存发布文章信息 */
    saveArticlePublish() {
      articleApi.saveArticlePublish(this.articleForm).then((res) => {
        // 提示
        this.$message.success("保存并发布文章成功");
        // 路由跳转到内容页
        this.$router.push("/blog/article/list");
      });
    },
    /* 修改并发布文章信息 */
    updateArticlePublish() {
      // 调用api
      articleApi.updateArticlePublish(this.articleForm).then((res) => {
        // 提示
        this.$message.success("修改并发布文章成功");
        // 路由跳转到内容页
        this.$router.push("/blog/article/list");
      });
    },
    /* 根据id获取文章的基本信息 */
    getArticleById() {
      // 调用api
      articleApi.getArticleById(this.articleForm.id).then((res) => {
        // 设置表单数据
        this.articleForm = res.data.article;
      });
    },
    /* 获取所有用户数据 */
    getAllUser() {
      // 调用api
      selectAllUser().then((res) => {
        // 设置数据源
        this.users = res.data.users;
      });
    },
    /* 获取所有分类 */
    getAllCategory() {
      // 调用api
      categoryApi.selectAllCategory().then((res) => {
        // 设置数据源
        this.categorys = res.data.categories;
      });
    },
    /* 获取所有标签 */
    getAllTag() {
      // 调用api
      tagApi.selectAllTag().then((res) => {
        // 设置数据源
        this.tags = res.data.tags;
      });
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
      this.articleForm.imageUrl = res.data.url;
    },
    /* 移除上传文件 */
    handleRemove() {
      // 调用api
      ossApi.deleteFileUrl(this.articleForm.imageUrl).then((res) => {
        // 提示
        this.$message.success("图片移除成功");
        // 清空表单中的图片地址
        this.articleForm.imageUrl = "";
      });
    },
    /* 预览已上传的图片 */
    handlePreview() {
      if (this.articleForm.imageUrl) {
        this.dialogVisible = true;
      } else {
        this.$message.warning("还没有上传图片");
      }
    },
    /* 上传文件超过限制的个数 */
    handleExceed() {
      this.$message.warning(`当前限制了上传文件的个数为1个`);
    },
    /* 监听markdown编辑器内容改变 */
    inputContent(content) {
      this.articleForm.content = content;
    },
  },
};
</script>

<style>
</style>