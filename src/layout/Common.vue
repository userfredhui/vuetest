<template>
  <div class="common-layout-container">
    <header>
      <h3>管理平台</h3>
      <el-dropdown trigger="click" @command="handleCommand">
        <span>昵称：{{user.nickname}}</span><i class="el-icon-arrow-down el-icon--right"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :command="item.command" v-for="item in dropdowns" :key="item.command">{{item.label}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </header>
    <main>
      <aside>
        <el-menu
          default-active="2"
          @select="handleSelect"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>文章管理</span>
            </template>
            <el-menu-item index="/article/list">文章列表</el-menu-item>
            <el-menu-item index="/article/new">发表文章</el-menu-item>
          </el-submenu>
          <el-menu-item index="/categorylist">
            <i class="el-icon-menu"></i>
            <span slot="title">栏目管理</span>
          </el-menu-item>
          <el-menu-item index="/register">
            <i class="el-icon-menu"></i>
            <span slot="title">注册页面</span>
          </el-menu-item>
          <el-menu-item index="/userlist">
            <i class="el-icon-document"></i>
            <span slot="title">用户列表</span>
          </el-menu-item>
        </el-menu>
      </aside>
      <section>
        <router-view></router-view>
      </section>
    </main>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import request from '../utils/request.js';
export default {
  data() {
    return {
      userName: '',
      dropdowns: [
        {
          command: 'loginout',
          label: '退出登录'
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      user: 'getUserInfo'
    })
  },
  methods: {
    ...mapActions(['fetchUserInfo']),
    handleSelect(key) {
      this.$router.push(key)
    },
    handleCommand(val) {
      if (val === 'loginout') {
        this.$confirm('即将退出登录，是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          request.get('/logout').then(() => {
            this.$router.push('/')
          })
        }).catch(() => {})
        
      }
    }
  },
  mounted() {
    if (this.$route.path !== '/') {
      this.fetchUserInfo()
    }
  },
}
</script>
<style lang="less" scoped>
  .common-layout-container {
    header {
      padding: 0 30px;
      height: 80px;
      background-color: skyblue;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #ffffff;
      .el-dropdown > * {
        color: #ffffff;
      }
    }
    main {
      position: relative;
      aside {
        width: 200px;
        position: absolute;
        left: 0;
        min-height: calc(100vh - 80px);
      }
      section {
        margin-left: 200px;
        padding-top: 20px;
      }
    }
    section {
      padding: 20px;
    }
  }
</style>

