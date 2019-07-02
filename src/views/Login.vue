<template>
  <div class="login-container">
    <div class="register-container">
      <h3>系统登录</h3>
      <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      <el-input v-model="form.password" placeholder="请输入密码"></el-input>
      <el-button type="primary" @click="submit">登录</el-button>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request';
export default {
  data() {
    return {
      form: {
        username: 'lph',
        password: '123',
      },
    };
  },
  methods: {
    submit() {
      const redirecturl = this.$route.query.redirecturl;
      let jumpToUrl = '/home';
      if (redirecturl) {
        jumpToUrl = decodeURIComponent(redirecturl);
      }
      request.post('/login', this.form, {}, true).then(res => {
        if (res && res.code === '0') {
          this.$router.push(jumpToUrl);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login-container {
  box-sizing: border-box;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('../assets/login-bg.jpg');
  background-size: 100% 100%;
}
.register-container {
  width: 350px;
  padding: 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  button {
    width: 100%;
    margin-top: 40px;
  }
  h3 {
    text-align: center;
    padding: 20px 0;
  }
}
</style>
<style lang="less">
.login-container {
  .el-input {
    margin: 10px 0;
  }
}
</style>
