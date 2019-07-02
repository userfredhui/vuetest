<template>
  <div class="register-container">
    <ul>
      <li>用户名：<el-input v-model="form.username" placeholder="请输入用户名"></el-input></li>
      <li>密码：<el-input v-model="form.password" placeholder="请输入密码"></el-input></li>
      <li>昵称：<el-input v-model="form.nickname" placeholder="请输入昵称"></el-input></li>
      <li>邮箱：<el-input v-model="form.email" placeholder="请输入邮箱"></el-input></li>
    </ul>
    <div class="img-container">
      头像：
      <input type="file" @change="uploadImg" />
      <img :src="form.userface" />
    </div>
    <el-button @click="submit">注册用户</el-button>
    <el-button @click="jumpToLogin">已有用户去登录</el-button>
  </div>
</template>

<script>
import request from '@/utils/request';
export default {
  data() {
    return {
      form: {
        username: '',
        password: '',
        nickname: '',
        userface: '',
      },
    };
  },
  methods: {
    submit() {
      const { username, password, nickname } = this.form;
      if (!username || !password || !nickname) {
        this.$message.warning('三项必填！');
        return;
      }
      request
        .get('/reg', {
          params: this.form,
        })
        .then(res => {
          if (res && res.code === '0') {
            this.$router.push('/userlist');
          }
        });
    },
    jumpToLogin() {
      this.$router.push('/');
    },
    uploadImg(e) {
      let formData = new FormData();
      const image = e.target.files[0];
      formData.append('image', image);
      request
        .post('/article/uploadimg', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(res => {
          if (res.code === '0') {
            this.form.userface = res.data;
          }
        });
    },
  },
};
</script>

<style lang="less" scoped>
.register-container {
  text-align: center;
  > * {
    margin: 10px 0;
  }
  button + button {
    margin-left: 10px;
  }
  ul {
    text-align: center;
    li {
      padding: 10px 0;
      .el-input {
        width: 250px;
      }
    }
  }
  .img-container {
    img {
      max-width: 200px;
    }
  }
}
</style>
