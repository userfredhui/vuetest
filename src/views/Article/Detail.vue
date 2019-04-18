<template>
  <div class="article-detail-container">
    <h3 class="title">{{detail.title}}</h3>
    <p class="text-info">
      <span class="text">
        {{detail.nickname}}
      </span>
      <span class="text">
        浏览{{detail.pageView}}
      </span>
      <span class="text">
        {{ detail.showDate}}
      </span>
      <el-tag type="primary" v-for="item in detail.tags" :key="item.id">{{item.tagName}}</el-tag>
    </p>
    <div class="html-container" v-html="detail.htmlContent">

    </div>
  </div>
</template>
<script>
import request from '@/utils/request';
import moment from 'moment';
import 'mavon-editor/dist/css/index.css';
const DateFormat = 'YYYY-MM-DD HH:mm:ss';
export default {
  data() {
    return {
      aid: this.$route.params.id,
      detail: {
        htmlContent: ''
      }
    }
  },
  mounted() {
    request.get('/article/' + this.aid).then(res => {
      this.detail = res.data
      this.detail.showDate = moment(res.data.publishDate).format(DateFormat)
    })
  }
}
</script>
<style lang="less" scoped>
  .article-detail-container {
    h3.title {
      text-align: center;
    }
    p.text-info {
      text-align: right;
      font-size: 13px;
      span.text {
        padding: 0 10px;
        color: #409EFF;
      }
      .el-tag {
        margin: 0 8px;
      }
    }
  }
</style>

