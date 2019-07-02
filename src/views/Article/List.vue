<template>
  <div class="article-list-container">
    <el-tabs :value="getSearchForm.state" type="card" @tab-click="handleClickTab">
      <el-tab-pane v-for="tab in tabs" :key="tab.name" :label="tab.label" :name="tab.name">
      </el-tab-pane>
    </el-tabs>
    <div v-show="getSearchForm.state !== '-3'">
      <el-input
        @input="changeKeywords"
        size="small"
        style="width: 300px;margin-right:20px;"
        placeholder="通过标题搜索该分类下的文章"
        prefix-icon="el-icon-search"
        :value="getSearchForm.keywords"
      ></el-input>
      <el-button size="small" type="primary" @click="search">搜索</el-button>
      <!-- 全部文章走这个，不要那个勾选框 -->
      <el-table v-show="getSearchForm.state === '-1'" :data="dataList" style="margin-top:20px;">
        <el-table-column label="标题" prop="title">
          <template slot-scope="scope">
            <router-link :to="{ path: '/article/detail/' + scope.row.id }">{{
              scope.row.title
            }}</router-link>
          </template>
        </el-table-column>
        <el-table-column
          v-for="column in columns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
        ></el-table-column>
      </el-table>
      <el-table
        v-show="getSearchForm.state !== '-1'"
        :data="dataList"
        @selection-change="handleSelectionChange"
        style="margin-top:20px;"
      >
        <el-table-column v-show="isCanDelete" type="selection" width="55"></el-table-column>
        <el-table-column label="标题" prop="title">
          <template slot-scope="scope">
            <router-link :to="{ path: '/article/detail/' + scope.row.id }">{{
              scope.row.title
            }}</router-link>
          </template>
        </el-table-column>
        <el-table-column
          v-for="column in columns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
        ></el-table-column>
        <!-- 全部文章和博客配置不应该编辑 -->
        <el-table-column label="操作" v-show="isCanDelete">
          <template slot-scope="scope">
            <el-button v-show="isCanEdit" size="small" @click="jumpToModifyPage(scope.row.id)"
              >编辑</el-button
            >
            <el-button type="danger" size="small" @click="handleDelete([scope.row.id])"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top:20px;text-align:right;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="getSearchForm.page"
        :page-sizes="[3, 10, 20]"
        :page-size="getSearchForm.count"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        background
      >
      </el-pagination>
      <el-button v-if="isCanDelete" size="small" type="danger" @click="betchDelete"
        >批量删除</el-button
      >
    </div>
    <div v-show="getSearchForm.state === '-3'" class="email-card">
      <el-card>
        <p>开启博客评论通知</p>
        <el-input style="width: 300px;" size="small" v-model="email"></el-input>
        <el-button size="small" type="primary" @click="updateEmail">确定</el-button>
      </el-card>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
import request from '@/utils/request';
import moment from 'moment';
const DateFormat = 'YYYY-MM-DD HH:mm:ss';
const StaticTabs = [
  {
    name: '-1',
    label: '全部文章',
  },
  {
    name: '1',
    label: '已发表',
  },
  {
    name: '0',
    label: '草稿箱',
  },
  {
    name: '2',
    label: '回收站',
  },
  {
    name: '-2',
    label: '博客管理',
  },
  {
    name: '-3',
    label: '博客配置',
  },
];
const StaticColumns = [
  {
    prop: 'editTime',
    label: '最近编辑时间',
  },
  {
    prop: 'nickname',
    label: '作者',
  },
  {
    prop: 'cateName',
    label: '所属分类',
  },
];
export default {
  data() {
    return {
      tabs: StaticTabs,
      columns: StaticColumns,
      dataList: [],
      totalCount: 0,
      aids: [],
      email: '',
    };
  },
  computed: {
    isCanDelete() {
      return this.getSearchForm.state !== '-1' && this.getSearchForm.state !== '-3';
    },
    isCanEdit() {
      return this.getSearchForm.state === '1' || this.getSearchForm.state === '0';
    },
    ...mapGetters({
      getUserInfo: 'getUserInfo',
      getSearchForm: 'article/getSearchForm',
    }),
  },
  methods: {
    ...mapMutations({
      setSearchForm: 'article/setSearchForm',
    }),
    changeKeywords(val) {
      this.setSearchForm({ keywords: val });
    },
    handleClickTab(tab) {
      this.setSearchForm({ state: tab.name });
      if (tab.name === '-3') {
        // this.email = this.getUserInfo.email
        this.fetchUserInfo();
      } else {
        this.search();
      }
    },
    handleSizeChange(val) {
      this.setSearchForm({ count: val });
      this.search();
    },
    handleCurrentChange(val) {
      this.setSearchForm({ page: val });
      this.search();
    },
    search() {
      let requestUrl = '/article/all';
      if (this.getSearchForm.state === '-2') {
        // 博客管理只有admin才能有权限看到
        requestUrl = '/admin/article/all';
      }
      request
        .get(requestUrl, {
          params: this.getSearchForm,
        })
        .then(res => {
          this.dataList = res.data.articles.map(item => ({
            ...item,
            editTime: moment(item.editTime).format(DateFormat),
          }));
          this.totalCount = res.data.totalCount;
        });
    },
    jumpToModifyPage(id) {
      this.$router.push({
        path: '/article/new',
        query: {
          id,
        },
      });
    },
    handleDelete(aids) {
      request
        .put(
          '/article/dustbin',
          {
            aids,
            state: this.getSearchForm.state,
          },
          {},
          true
        )
        .then(res => {
          if (res.code === '0') {
            this.search();
          }
        });
    },
    betchDelete() {
      if (this.aids.length < 1) {
        this.$message.warning('请至少选中一行');
        return;
      }
      this.handleDelete(this.aids);
    },
    handleSelectionChange(val) {
      this.aids = val;
    },
    updateEmail() {
      request
        .put(
          '/update-user-email',
          {
            email: this.email,
          },
          {},
          true
        )
        .then(res => {
          this.$message.success(res.message);
        });
    },
    fetchUserInfo() {
      request
        .get('/user-by-id', {
          params: {
            id: this.getUserInfo.id,
          },
        })
        .then(res => {
          this.email = res.data.email;
        });
    },
  },
  mounted() {
    this.search();
  },
};
</script>
<style lang="less" scoped>
.article-list-container {
  a {
    text-decoration: none;
  }
  .email-card {
    width: 500px;
    p {
      margin-bottom: 20px;
    }
    button {
      margin-left: 20px;
    }
  }
}
</style>
