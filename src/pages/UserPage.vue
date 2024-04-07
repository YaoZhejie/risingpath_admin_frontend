<template>
  <div class="table">
    <div class="container">
      <div class="handle-box">
        <el-button type="danger" size="mini" @click="handleDeleteAll">批量删除</el-button>
        <el-input v-model="select_word" size="mini" placeholder="筛选相关用户" class="handle-input mr10"></el-input>
        <el-button type="primary" size="mini" @click="centerDialogVisible = true">添加新用户</el-button>
      </div>
      <el-table :data="data" border size="mini" style="width: 100%" ref="multipleTable" height="600px"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column label="用户头像" width="140" align="center">
          <template slot-scope="scope">
            <div id="user">
              <img :src="attachImageUrl(scope.row.avatarUrl)" alt="头像" style="width: 80px " />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="用户名" prop="userName" width="130" align="center"></el-table-column>
        <el-table-column label="专业" prop="professInfo" width="130" align="center"></el-table-column>
        <el-table-column label="用户账户" prop="userAccount" width="130" align="center"></el-table-column>
        <el-table-column label="用户角色" prop="userRole" width="130" align="center">
          <!-- 格式化单元格数据 -->
          <template slot-scope="scope">
            {{ scope.row.userRole === 'admin' ? '管理员' : '用户' }}
          </template>
        </el-table-column>
        <el-table-column label="手机号" prop="phone" width="110" align="center"></el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="170" align="center"></el-table-column>
        <el-table-column label="更新时间" prop="updateTime" width="170" align="center"></el-table-column>
        <el-table-column label="操作" width="300" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini"type="success"  @click="updatePic(scope.row.userId)">更新头像</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row.userId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination @current-change="handleCurrentChange" background layout="total, prev, pager, next"
          :current-page="currentPage" :page-size="pageSize" :total="total">
        </el-pagination>
      </div>
    </div>

    <!--添加新用户-->
    <el-dialog title="添加用户" :visible.sync="centerDialogVisible" width="400px" center>
      <el-form :model="registerForm" status-icon :rules="rules" ref="registerForm" label-width="80px"
        class="demo-ruleForm">
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
        <el-form-item label="用户角色" prop="userRole" size="mini">
          <template>
            <el-select v-model="form.userRole" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="手机" prop="phone" size="mini">
          <el-input placeholder="手机" v-model="registerForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="addPeople">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="更新头像" :visible.sync="editVisiblePic" width="400px">
      <template>
        <div class="upload">
          <div class="section">
            <el-upload drag :action=null :show-file-list="false" :before-upload="beforeAvatarUpload"
              :http-request="uploadFile">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>修改头像</em></div>
              <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过10M</div>
            </el-upload>
          </div>
        </div>
      </template>
    </el-dialog>




    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" :visible.sync="editVisible" width="400px">
      <el-form ref="form" :model="form" label-width="70px">
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
        <el-form-item label="用户角色" prop="userRole" size="mini">
          <template>
            <el-select v-model="form.userRole" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-form-item>

        <el-form-item label="手机" prop="phone" size="mini">
          <el-input placeholder="手机" v-model="form.phone"></el-input>
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

    <!-- 批量删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisibleAll" width="300px" center>
      <div class="del-dialog-cnt" align="center">批量删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="delVisibleAll = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="delAll">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mixin } from '../mixins'
import { getAllUser, updateUserMsg, deleteUser, addUser ,updatePic} from '../api/index'

export default {
  name: 'consumer-page',
  mixins: [mixin],
  data() {
    return {
      registerForm: { // 注册
        userName: '',
        professInfo: '',
        userPassword: '',
        checkPassword: '',
        userAccount: '',
        userRole: '',
        phone: '',
      },
      options: [{
        value: 'admin',
        label: '管理员'
      }, {
        value: 'user',
        label: '用户'
      }, {
        value: 'ban',
        label: '禁用'
      }],
      rules: {
        userName: [
          { required: true, trigger: 'blur' }
        ],
        userPassword: [
          { required: true, trigger: 'blur' }
        ],
        userAccount: [
          { required: true, trigger: 'blur' }
        ],
        userRole: [
          { required: true, trigger: 'blur' }
        ],
        phone: [
          { required: true, trigger: 'blur' }
        ],
        professInfo: [
          { required: true, trigger: 'blur' }
        ]
      },
      tableData: [], // 记录用户信息，用于显示
      tempDate: [], // 记录用户信息，用于搜索时能临时记录一份用户信息
      is_search: false,
      multipleSelection: [], // 记录要删除的用户信息
      centerDialogVisible: false,
      editVisible: false, // 显示编辑框
      delVisible: false, // 显示删除框
      delVisibleAll: false, //删除全部
      editVisiblePic:false,
      updatePicId:'',
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
      total: 0,
      idx: -1 // 记录当前点中的行
    }
  },
  computed: {
    // 计算当前表格中的数据
    data() {
      return this.tableData
    }
  },
  created() {
    this.getData()
  },
  methods: {
    // 获取当前页
    handleCurrentChange(val) {
      this.currentPage = val
      this.getData()
    },
    // 获取用户信息
    getData() {
      this.tableData = []
      let params = {
        userName: this.select_word,
        pageSize: this.pageSize,
        current: this.currentPage
      }
      getAllUser(params).then((res) => {
        this.tableData = res.data.records
        this.currentPage = parseInt(res.data.current)
        this.pageSize = parseInt(res.data.size)
        this.total = parseInt(res.data.total)
      })
    },
    // 添加用户
    addPeople() {
      let _this = this

      addUser(this.registerForm).then(response => {
        // 根据 code 判断是否注册成功
        if (response.code === 1) {
          console.log("success")
          _this.notify('添加成功', 'success')
          this.centerDialogVisible = false
        } else {
          _this.notify('添加失败', 'error')
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // 编辑
    handleEdit(row) {
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
    saveEdit() {
      let params = {
        userId: this.form.userId,
        userName: this.form.userName,
        userAccount: this.form.userAccount,
        professInfo: this.form.professInfo,
        userPassword: this.form.userPassword,
        userRole: this.form.userRole,
        phone: this.form.phone
      }
      updateUserMsg(params)
        .then(res => {
          if (res.code === 1) {
            this.showError = false
            this.showSuccess = true
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
    deleteRow() {
      let params = {
        userId: this.idx,
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
    },
    // 批量删除用户
    handleDeleteAll() {
      this.delVisibleAll = true
      console.log(updatePicId)
    },
    delAll() {
      for (let item of this.multipleSelection) {
        this.handleDelete(item.userId)
        this.deleteRow(item.userId)
      }
      this.delVisibleAll = false
      this.multipleSelection = []
    },
    updatePic(userId){
      this.updatePicId = userId
      this.editVisiblePic = true;
    },
    handleAvatarSuccess (res, file) {
      console.log(res.data)
      if (res.code === 1) {
        this.imageUrl = URL.createObjectURL(file.raw)
        this.$message({
          message: '修改成功',
          type: 'success'
        })
      } else {
        this.notify('修改失败', 'error')
      }
    },
    uploadUrl () {
       return `${this.$store.state.configure.HOST}/user/updateUserPic?id=${this.updatePicId}` 
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 10MB!')
      }
      return isJPG && isLt2M
    },
    uploadFile(item) {
      let userId = this.updatePicId;
      let fileObj = item.file;
      const form = new FormData(); // FormData 对象
      form.append("file", fileObj); // 文件对象  'upload'是后台接收的参数名
      form.append("id", userId);
      //更新头像
      updatePic(form).then(res => {
        console.log(res.code)
        if (res.code === 1) {
          this.getData()
          this.editVisiblePic = false
        this.$message({
          message: '修改成功',
          type: 'success'
        })
      } else {
        this.notify('修改失败', 'error')
      }
      });

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
  width: 200px;
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
  justify-content: center;
  /* 水平居中 /
align-items: center; / 垂直居中 /
width: 100%; / 设置容器宽度 */
}

.dialog-footer button {
  display: inline-block;
  /* 行内块元素 */
}
</style>