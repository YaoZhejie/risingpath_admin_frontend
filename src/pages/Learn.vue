<template>
    <div class="table">
      <div class="container">
        <div class="handle-box">
          <el-button type="primary" size="mini" class="handle-del mr10" @click="delAllLearn">批量删除</el-button>
          <el-input v-model="title" size="mini" placeholder="筛选资料类型" class="handle-input mr10"></el-input>
          <el-button type="primary" size="mini" @click="centerDialogVisible = true">添加资料</el-button>
        </div>
        <el-table :data="data" border size="mini" style="width: 100%" height="650px" ref="multipleTable" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column label="资料类型" prop="title" width="250" align="center"></el-table-column>
        <el-table-column label="资料描述" prop="description" width="400" align="center"></el-table-column>
        <el-table-column
        label="链接地址"
        align="center"
        prop="downloadLink"
        :show-overflow-tooltip="true"
        >
            <template slot-scope="scope">
            <el-link type="primary" :underline="false" :href="scope.row.downloadLink" target="_blank">{{ scope.row.downloadLink }}</el-link>
            </template>
        </el-table-column>
        <el-table-column label="提取码" prop="code" width="120" align="center"></el-table-column>
        <el-table-column label="发布时间" prop="publishTime" width="240" align="center"></el-table-column>
        
        <el-table-column label="操作" width="200" align="center">
              <template slot-scope="scope">
                  <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                  <el-button size="mini" type="danger" @click="handleDelete(scope.row.learnId)">删除</el-button>
              </template>
          </el-table-column>
        </el-table>
  
        <div class="pagination">
          <el-pagination
            @current-change="handleCurrentChange"
            background
            layout="total, prev, pager, next"
            :current-page="currentPage"
            :page-size="pageSize"
            :total="tableData.length">
          </el-pagination>
        </div>
      </div>
            <!--添加新用户-->
            <el-dialog title="添加资料" :visible.sync="centerDialogVisible" width="400px" center>
        <el-form :model="registerForm" status-icon :rules="rules" ref="registerForm" label-width="70px" class="demo-ruleForm">
          <el-form-item label="资料类型" prop="title" size="mini">
            <el-input v-model="registerForm.title" placeholder="资料类型"></el-input>
          </el-form-item>
          <el-form-item label="资料描述" prop="description" size="mini">
            <el-input v-model="registerForm.description" placeholder="资料描述"></el-input>
          </el-form-item>
          <el-form-item label="资料链接" prop="downloadLink" size="mini">
            <el-input v-model="registerForm.downloadLink" placeholder="资料链接"></el-input>
          </el-form-item>
          <el-form-item label="提取码" prop="code" size="mini">
          <el-input v-model="registerForm.code" placeholder="提取码"></el-input>
        </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" size="mini" @click="addPeople">确 定</el-button>
        </span>
      </el-dialog>
  
      <!-- 编辑弹出框 -->
      <el-dialog title="编辑" :visible.sync="editVisible" width="430px">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="资料类型" prop="title" size="mini">
            <el-input v-model="form.title" placeholder="资料类型"></el-input>
          </el-form-item>
          <el-form-item label="资料描述" prop="description" size="mini">
            <el-input v-model="form.description" placeholder="资料描述"></el-input>
          </el-form-item>
          <el-form-item label="资料链接" prop="downloadLink" size="mini">
            <el-input v-model="form.downloadLink" placeholder="资料链接"></el-input>
          </el-form-item>
          <el-form-item label="提取码" prop="code" size="mini">
          <el-input v-model="form.code" placeholder="提取码"></el-input>
        </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="editVisible = false">取 消</el-button>
          <el-button type="primary" size="mini" @click="saveEdit">确 定</el-button>
        </span>
      </el-dialog>
  
      <!-- 删除提示框 -->
      <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
        <div class="del-dialog-cnt" align="center">删除不可恢复，是否确定删除？</div>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="delVisible = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="deleteRow">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  
  </template>
  
  <script>
  import { mixin } from '../mixins'
  import {getAllLeranLink,insertLearn,updateLearn,deleteLearn} from '../api/index'

  export default {
    mixins: [mixin],
    data () {
      return {
        registerForm: { // 注册
          title: '',
          description: '',
          downloadLink: '',
          code:''
        },
        rules: {
            userName: [
            { required: true, trigger: 'blur' }
          ],
          userPassword: [
            { required: true, trigger: 'blur' }
          ],
          userAccount: [
            {required: true, trigger: 'blur' }
          ],
          userRole: [
            { required: true, trigger: 'blur' }
          ],
          phone: [
            { required: true, trigger: 'blur' }
          ],
          professInfo: [
            { required: true, trigger: 'blur'}
          ]
        },
        form: { // 记录编辑的信息
          learnId: '',
          title: '',
          description: '',
          downloadLink: '',
          code:''
        },
        tableData: [],
        tempDate: [],
        centerDialogVisible: false,
        editVisible: false,
        delVisible: false,
        multipleSelection:[],
        title: '',
        pageSize: 5, // 页数
        currentPage: 1, // 当前页
        idx: -1
      }
    },
    computed: {
      // 计算当前表格中的数据
      data () {
        return this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
      }
    },
    watch: {
      //搜索框里面的内容发生变化时，搜索结果table列表内容跟着内容发生变化
      title: function () {
        if (this.title === '') {
          this.tableData = this.tempDate
        } else {
          this.tableData = []
          for (let item of this.tempDate) {
            if (item.title.includes(this.title)) {
              this.tableData.push(item)
            }
          }
        }
      }
    },
    created () {
      this.getData()
    },
    methods: {
      // 获取专业院校信息
      getData () {
        this.tableData = []
        this.tempDate = []
        getAllLeranLink().then((res) => {
          this.tableData = res
          this.tempDate = res
          this.currentPage = 1
        })
      },
      // 获取当前页
      handleCurrentChange (val) {
        this.currentPage = val
      },
      // 添加用户
      addPeople () {
        let _this = this
        let params = {
          title: this.registerForm.title,
          description: this.registerForm.description,
          downloadLink: this.registerForm.downloadLink,
          code: this.registerForm.code,

        }
       
      insertLearn(params).then(response => {
              // 根据 code 判断是否添加成功
              if (response.code === 1) {
                // 添加成功，显示相应内容
                _this.notify('添加成功', 'success')
                this.centerDialogVisible = false
                this.getData()
              } else {
                // 登录失败，显示相应内容
                _this.notify('添加失败', 'error')
              }
            }).catch(error => {
              console.log(error)
            })
      },
      // 编辑
      handleEdit (row) {
        this.idx = row.learnId
        this.form = {
          learnId: row.learnId,
          title: row.title,
          description: row.description,
          downloadLink: row.downloadLink,
          code: row.code,
        }
        this.editVisible = true
      },
      // 保存编辑
      saveEdit () {
      let params = {
        learnId :this.form.learnId,
        title:this.form.title,
        description: this.form.description,
        downloadLink: this.form.downloadLink,
        code: this.form.code
      }
      updateLearn(params)
        .then(res => {
          if (res.code === 1) {
            this.showError = false
            this.showSuccess = true
            this.$notify.success({
              title: '编辑成功',
              showClose: true
            })
            this.getData()
          } else {
            this.showSuccess = false
            this.showError = true
            this.$notify.error({
              title: '编辑失败',
              showClose: true
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
        this.editVisible = false
      },
      // 确定删除
      deleteRow () {
        let params = {
          learnId :this.idx,
      }
      deleteLearn(params)
        .then(res => {
          if (res.code === 1) {
            this.showError = false
            this.showSuccess = true
            this.$notify.success({
              title: '删除成功',
              showClose: true
            })
            this.getData()
          } else {
            this.showSuccess = false
            this.showError = true
            this.$notify.error({
              title: '删除失败',
              showClose: true
            })
          }
        })
        this.delVisible = false
      }
    }
  }
  </script>
  
  <style scoped>
  .handle-box {
      margin-bottom: 20px;
  }
  
  .handle-input {
      width: 163px;
      display: inline-block;
  }
  .pagination {
      display: flex;
      justify-content: center;
  }
  
  .scrollable {
  height: 120px;
  overflow: scroll;
  }
  .scrollable-content {
  margin: 0;
  padding: 0;
  }
  .dialog-footer {
display: flex;
justify-content: center; /* 水平居中 /
align-items: center; / 垂直居中 /
width: 100%; / 设置容器宽度 */
}

.dialog-footer button {
display: inline-block; /* 行内块元素 */
}
    
  </style>
  