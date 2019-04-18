<template>
  <div class="category-list-container">
    <div style="text-align:left;margin-bottom:20px;">
      <el-input placeholder="请输入栏目名称" style="width:200px;margin-right:20px;" v-model="cateName"></el-input>
      <el-button type="primary" @click="addCategory">新增栏目</el-button>
    </div>
    <el-button @click="betchDeleteCategory">批量删除</el-button>
    <section>
      <el-table :data="tableList"  @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label"></el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-button type="primary" @click="handleClick(scope.row)" size="small">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>
  </div>
</template>
<script>
const staticColumns = [
  {
    prop: 'id',
    label: '编号'
  },
  {
    prop: 'cateName',
    label: '栏目名称'
  },
  {
    prop: 'date',
    label: '启用时间'
  }
]
const DataFormatStr = 'YYYY-MM-DD'
import request from '../utils/request.js';
import moment from 'moment';
export default {
  data() {
    return {
      cateName: '',
      tableList: [],
      columns: staticColumns,
      selectedIds: []
    }
  },
  methods: {
    addCategory() {
      if (!this.cateName) {
        this.$message.warning('请填写名称')
        return
      }
      request.post('/admin/category/', {
        cateName: this.cateName
      }, {}, true).then(res => {
        if (res && res.code === '0') {
          this.fetchList()
        }
      })
    },
    handleClick(row) {
      this.$prompt('请输入栏目名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: row.cateName
      }).then(({value}) => {
        request.put('/admin/category/', {
          cateName: value,
          id: row.id
        }, {}, true).then(res => {
          if (res && res.code === '0') {
            this.fetchList()
          }
        })
      }).catch(() => {})
    },
    handleDelete(ids) {
      this.$confirm('确定删除吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.postDeleteRequest(ids)
      }).catch(() => {})
      
    },
    fetchList() {
      request.get('/admin/category/all').then(res => {
        if (res && res.code === '0') {
          this.tableList = res.data.map(item => {
            item.date = moment(item.date).format(DataFormatStr)
            return item
          })
        }
      })
    },
    handleSelectionChange(val) {
      this.selectedIds = val.map(item => item.id)
    },
    postDeleteRequest(ids) {
      request.delete('/admin/category/' + ids).then(res => {
        if (res && res.code === '0') {
          this.fetchList()
        }
      })
    },
    betchDeleteCategory() {
      if (this.selectedIds.length < 1) {
        this.$message.warning('请至少选中一条')
        return
      }
      this.postDeleteRequest(this.selectedIds)
    }
  },
  mounted() {
    this.fetchList()
  },
}
</script>
<style lang="less" scoped>
  .category-list-container {
    text-align: left;
  }
</style>

