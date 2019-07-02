<template>
  <div class="user-list-container">
    <div style="text-align:center;margin-bottom:15px;">
      <p style="color:#ccc;font-size:13px;text-align:center;margin-bottom:10px;">
        温馨提示：这里最多展示20个用户，没看到的用户，请输入昵称查询
      </p>
      <el-input
        size="small"
        placeholder="请输入昵称查询"
        style="width:400px"
        v-model="form.nickname"
      ></el-input>
      <el-button style="margin-left: 15px;" type="primary" size="small" @click="search"
        >查询</el-button
      >
    </div>
    <section class="card-container">
      <el-card v-for="(item, index) in tableList" :key="item.id">
        <div slot="header" class="card-header">
          <b>{{ item.nickname }}</b>
          <span style="color:#f56c6c;" @click="handleDelete(item.id)"
            ><i class="el-icon-delete"></i>删除</span
          >
        </div>
        <div style="text-align: center;">
          <img :src="item.userface" />
        </div>
        <p>用户名：{{ item.username }}</p>
        <p>电子邮箱：{{ item.email }}</p>
        <p>注册时间：{{ item.showDate }}</p>
        <p>
          用户状态：
          {{ item.enabled ? '启用' : '禁用' }}
          <el-switch
            :value="item.enabled"
            @change="val => changeEnable(val, index)"
            active-color="#13ce66"
            inactive-color="#ccc"
          ></el-switch>
        </p>
        <p>
          用户角色：
          <el-tag size="small" type="success" v-for="item in item.roles" :key="item.id">
            {{ item.name }}
          </el-tag>
          <el-popover
            placement="right"
            title="角色列表"
            width="240"
            :value="roleSelectVisible"
            @show="setSelectRoles(item.roles)"
          >
            <el-select v-model="roles" multiple>
              <el-option
                v-for="item in allRoles"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <p style="text-align:center;padding: 15px;">
              <el-button type="primary" size="mini" @click="sureSetRoles(item.id)">确定</el-button>
            </p>
            <i slot="reference" style="margin-left:15px;" class="el-icon-more"></i>
          </el-popover>
        </p>
      </el-card>
    </section>
  </div>
</template>

<script>
import request from '@/utils/request';
import moment from 'moment';
const DateFormat = 'YYYY-MM-DD HH:mm:ss';
export default {
  data() {
    return {
      form: {
        nickname: '',
      },
      tableList: [],
      columns: [
        {
          label: '用户名',
          prop: 'username',
        },
        {
          label: '昵称',
          prop: 'nickname',
        },
        {
          label: '邮箱',
          prop: 'email',
        },
        {
          label: '头像',
          prop: 'userface',
        },
      ],
      allRoles: [],
      roles: [],
      roleSelectVisible: false,
    };
  },
  methods: {
    search() {
      request
        .get('/admin/user', {
          params: this.form,
        })
        .then(res => {
          if (res && res.code === '0') {
            this.tableList = res.data.map(item => ({
              ...item,
              showDate: moment(item.regTime).format(DateFormat),
            }));
          }
        });
    },
    handleClick() {},
    handleDelete(id) {
      request.delete(`/admin/user/${id}`, {}).then(res => {
        if (res && res.code === '0') {
          this.search();
        }
      });
    },
    changeEnable(enabled, index) {
      const uid = this.tableList[index].id;
      request
        .put(
          '/admin/user/enabled',
          {
            enabled,
            uid,
          },
          {},
          true
        )
        .then(res => {
          if (res.code === '0') {
            this.$message.success(res.message);
            this.tableList[index].enabled = enabled;
          }
        });
    },
    fetchAllRoles() {
      request.get('/admin/roles').then(res => {
        this.allRoles = res.data.roles;
      });
    },
    sureSetRoles(id) {
      if (this.roles.length < 1) {
        this.$message.warning('请至少选中一个角色');
        return;
      }
      request
        .put(
          '/admin/user/role',
          {
            rids: this.roles,
            id,
          },
          {},
          true
        )
        .then(res => {
          if (res.code === '0') {
            this.roleSelectVisible = false;
          }
        });
    },
    setSelectRoles(roles) {
      this.roles = roles.map(item => item.id);
    },
  },
  mounted() {
    this.fetchAllRoles();
    this.search();
  },
};
</script>

<style lang="less" scoped>
.user-list-container {
  .user-img {
    max-width: 50px;
  }
  .card-container {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    .el-card {
      width: 330px;
      margin-bottom: 15px;
      img {
        width: 70px;
      }
      .card-header {
        display: flex;
        justify-content: space-between;
      }
      p {
        font-size: 13px;
        line-height: 35px;
        color: #409eff;
      }
    }
  }
}
</style>
