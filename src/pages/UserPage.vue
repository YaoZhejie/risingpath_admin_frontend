<template>
    <div class="table">
      <div class="container">
        <div class="handle-box">
          <el-button type="primary" size="mini" class="handle-del mr10" @click="delAll">批量删除</el-button>
          <el-input v-model="select_word" size="mini" placeholder="筛选相关用户" class="handle-input mr10"></el-input>
          <el-button type="primary" size="mini" @click="centerDialogVisible = true">添加新用户</el-button>
        </div>
        <el-table :data="data" border size="mini" style="width: 100%" ref="multipleTable" height="600px" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="40" align="center"></el-table-column>
          <el-table-column label="用户头像" width="102" align="center">
            <template slot-scope="scope">
              <div id="user">
                <img :src="attachImageUrl(scope.row.avatarUrl)" alt="头像" style="width: 80px "/>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="用户名" prop="userName" width="120" align="center"></el-table-column>
          <el-table-column label="专业" prop="professInfo" width="120" align="center"></el-table-column>
          <el-table-column label="密码" prop="userPassword" width="200" align="center"></el-table-column>
          <el-table-column label="用户账户" prop="userAccount" width="120" align="center"></el-table-column>
          <el-table-column label="用户角色" prop="userRole" width="60" align="center">
            <!-- 格式化单元格数据 -->
            <template slot-scope="scope">
                {{ scope.row.userRole === 1 ? '管理员' : '用户' }}
            </template>
          </el-table-column>
          <el-table-column label="手机号" prop="phone" width="120" align="center"></el-table-column>
          <el-table-column label="创建时间" prop="createTime" width="180" align="center"></el-table-column>
          <el-table-column label="更新时间" prop="updateTime" width="180" align="center"></el-table-column>
          <el-table-column label="操作" width="200" align="center">
              <template slot-scope="scope">
                  <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                  <el-button size="mini" type="danger" @click="handleDelete(scope.row.userId)">删除</el-button>
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
      <el-dialog title="添加用户" :visible.sync="centerDialogVisible" width="400px" center>
        <el-form :model="registerForm" status-icon :rules="rules" ref="registerForm" label-width="70px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="userName" size="mini">
            <el-input v-model="registerForm.userName" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item label="专业" prop="professInfo" size="mini">
            <el-input v-model="registerForm.professInfo" placeholder="专业"></el-input>
          </el-form-item>
          <el-form-item label="账户" prop="userAccount" size="mini">
            <el-input v-model="registerForm.userAccount" placeholder="用户账户"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="userPassword" size="mini">
          <el-input v-model="registerForm.userPassword"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPassword" size="mini">
          <el-input v-model="registerForm.checkPassword"></el-input>
        </el-form-item>
          <el-form-item label="用户角色" size="mini">
            <el-radio-group v-model="registerForm.userRole">
              <el-radio :label="0">普通用户</el-radio>
              <el-radio :label="1">管理员</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="手机" prop="phone" size="mini">
            <el-input  placeholder="手机" v-model="registerForm.phone"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" size="mini" @click="addPeople">确 定</el-button>
        </span>
      </el-dialog>
  
      <!-- 编辑弹出框 -->
      <el-dialog title="编辑" :visible.sync="editVisible" width="400px">
        <el-form ref="form" :model="form" label-width="60px">
            <el-form-item label="用户名" prop="userName" size="mini">
            <el-input v-model="form.userName" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="userPassword" size="mini">
            <el-input v-model="form.userPassword" placeholder="密码"></el-input>
          </el-form-item>
          <el-form-item label="专业" prop="professInfo" size="mini">
            <el-input v-model="form.professInfo" placeholder="专业"></el-input>
          </el-form-item>
          <el-form-item label="用户账户" prop="userAccount" size="mini">
            <el-input v-model="form.userAccount" placeholder="用户账户"></el-input>
          </el-form-item>
          <el-form-item label="用户角色" size="mini">
            <el-radio-group v-model="form.userRole">
              <el-radio :label="0">普通用户</el-radio>
              <el-radio :label="1">管理员</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="手机" prop="phone" size="mini">
            <el-input  placeholder="手机" v-model="form.phone"></el-input>
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
  import { getAllUser,updateUserMsg,deleteUser} from '../api/index'
  import axios from 'axios'

  export default {
    name: 'consumer-page',
    mixins: [mixin],
    data () {
      return {
        registerForm: { // 注册
          userName: '',
          professInfo: '',
          userPassword: '',
          checkPassword:'',
          userAccount: '',
          userRole: '',
          phone: '',
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
        tableData: [], // 记录用户信息，用于显示
        tempDate: [], // 记录用户信息，用于搜索时能临时记录一份用户信息
        is_search: false,
        multipleSelection: [], // 记录要删除的用户信息
        centerDialogVisible: false,
        editVisible: false, // 显示编辑框
        delVisible: false, // 显示删除框
        select_word: '', // 记录输入框输入的内容
        form: { // 记录编辑的信息
          userId: '',
          userName: '',
          professInfo: '',
          userPassword: '',
          userAccount: '',
          userRole: '',
          phone: '',
        },
        pageSize: 5, // 页数
        currentPage: 1, // 当前页
        idx: -1 // 记录当前点中的行
      }
    },
    computed: {
      // 计算当前表格中的数据
      data () {
        return this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
      }
    },
    watch: {
      select_word: function () {
        if (this.select_word === '') {
          this.tableData = this.tempDate
        } else {
          this.tableData = []
          for (let item of this.tempDate) {
            if (item.userName.includes(this.select_word)) {
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
      // 获取当前页
      handleCurrentChange (val) {
        this.currentPage = val
      },
      // 获取用户信息
      getData () {
        this.tableData = []
        this.tempDate = []
        getAllUser().then((res) => {
        //   console.log(res.data) //打印后端的信息
          this.tableData = res.data
          this.tempDate = res.data
          this.currentPage = 1
        })
      },
      // 添加用户
      addPeople () {
        let _this = this
        let UserRegisterRequest = {
        userAccount: this.registerForm.userAccount,
        userPassword: this.registerForm.userPassword,
        checkPassword: this.registerForm.checkPassword,
        userName: this.registerForm.userName,
        userRole: this.registerForm.userRole,
        professInfo: this.registerForm.professInfo,
        phone: this.registerForm.phone,

        }

      axios.post('/user/register', UserRegisterRequest, {
              headers: { 'Content-Type': 'application/json' }
          }).then(response => {
              // 根据 code 判断是否注册成功
              if (response.data.code === 1) {
                // 添加成功，显示相应内容
                _this.notify('添加成功', 'success')
                this.centerDialogVisible = false
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
        this.idx = row.userId
        this.form = {
          userId: row.userId,
          userName: row.userName,
          professInfo: row.professInfo,
          userPassword: row.userPassword,
          userAccount: row.userAccount,
          userRole: row.userRole,
          phone: row.phone
        }
        this.editVisible = true
      },
      // 保存编辑
      saveEdit () {
      let params = {
        userId :this.form.userId,
        userName:this.form.userName,
        userAccount: this.form.userAccount,
        professInfo: this.form.professInfo,
        userPassword: this.form.userPassword,
        userRole:this.form.userRole,
        phone:this.form.phone
      }
      updateUserMsg(params)
        .then(res => {
          if (res.code === 1) {
            this.showError = false
            this.showSuccess = true
            // this.$store.commit('setuserName', this.registerForm.userName)
            this.$notify.success({
              title: '编辑成功',
              showClose: true
            })
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
        userId :this.idx,
      }
        deleteUser(params)
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
    font-size: 12px;
  }
  
  .handle-input {
    width: 300px;
    display: inline-block;
  }
  
  .pagination {
    display: flex;
    justify-content: center;
  }

  #user {
    overflow: hidden;
    width: (70px / 3) * 2;
    height: (70px / 3) * 2;
    border-radius: 50%;
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
  