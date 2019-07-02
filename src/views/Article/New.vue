<template>
  <div class="new-article-container">
    <el-select v-model="form.cid" placeholder="请选择栏目">
      <el-option
        :key="item.id"
        v-for="item in catogoryList"
        :value="item.id"
        :label="item.cateName"
      >
      </el-option>
    </el-select>
    <el-input
      placeholder="请输入标题"
      v-model="form.title"
      style="width:400px;margin:0 20px;"
    ></el-input>
    <el-tag
      class="tag"
      v-for="(item, index) in form.dynamicTags"
      :key="index"
      closable
      @close="handleCloseTag(index)"
      >{{ item.tagName }}</el-tag
    >
    <el-input
      @keyup.enter.native="pushTagToArr"
      @blur="pushTagToArr"
      v-show="isInputTag"
      v-model="tagName"
      style="width:80px;"
    ></el-input>
    <el-button v-show="!isInputTag" @click="addTag">+Tag</el-button>
    <div class="mavon-editor-container">
      <mavon-editor
        ref="md"
        @imgAdd="imgAdd"
        style="height:100%"
        v-model="form.mdContent"
      ></mavon-editor>
    </div>
    <div style="margin-top: 20px;" v-if="!queryId">
      <el-button @click="save(0, '保存到草稿箱成功')">保存到草稿箱</el-button>
      <el-button type="primary" @click="save(1, '发表文章成功')">发表文章</el-button>
    </div>
    <div style="margin-top: 20px;" v-if="queryId">
      <el-button @click="jumpToListPage">放弃修改</el-button>
      <el-button type="primary" @click="save(1, '修改文章成功')">保存修改</el-button>
    </div>
  </div>
</template>
<script>
import request from '@/utils/request';
import { mavonEditor } from 'mavon-editor';
// https://github.com/hinesboy/mavonEditor
import 'mavon-editor/dist/css/index.css';
export default {
  data() {
    return {
      form: {
        id: '-1',
        cid: '',
        title: '',
        dynamicTags: [],
        mdContent: '',
      },
      catogoryList: [],
      isInputTag: false,
      tagName: '',
      queryId: this.$route.query.id,
    };
  },
  components: {
    mavonEditor,
  },
  methods: {
    addTag() {
      this.isInputTag = true;
    },
    pushTagToArr() {
      if (this.tagName) {
        this.form.dynamicTags.push({ id: '', tagName: this.tagName });
        this.isInputTag = false;
      }
      this.tagName = '';
    },
    handleCloseTag(index) {
      this.form.dynamicTags.splice(index, 1);
    },
    imgAdd(pos, $file) {
      let formData = new FormData();
      const image = $file;
      formData.append('image', image);
      request
        .post('/article/uploadimg', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(res => {
          if (res.code === '0') {
            this.$refs.md.$img2Url(pos, res.data);
          }
        });
    },
    save(state, text) {
      if (!this.form.cid || !this.form.title || !this.form.mdContent) {
        this.$message.warning('栏目，标题，文章内容必填项');
        return;
      }
      const dynamicTags = this.form.dynamicTags.map(item => item.tagName); // 给后台提交时候仅传字符串
      const { id, cid, title, mdContent } = this.form;
      request
        .post(
          '/article/',
          {
            id,
            cid,
            title,
            mdContent,
            dynamicTags,
            state,
            htmlContent: this.$refs.md.d_render,
          },
          {},
          true
        )
        .then(res => {
          if (res && res.code === '0') {
            this.$message.success(text);
            this.$router.push('/article/list');
          }
        });
    },
    jumpToListPage() {
      this.$router.push('/article/list');
    },
  },
  mounted() {
    request.get('/admin/category/all').then(res => {
      this.catogoryList = res.data;
    });
    const queryAid = this.$route.query.id;
    if (queryAid) {
      request.get('/article/' + queryAid).then(res => {
        this.form = res.data;
        this.form.dynamicTags = res.data.tags;
      });
    }
  },
};
</script>
<style lang="less" scoped>
.new-article-container {
  .tag {
    margin: 0 10px;
  }
  .mavon-editor-container {
    margin-top: 20px;
    height: 600px;
  }
}
</style>
