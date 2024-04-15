<template>
  <div class="table">
    <div class="container">
      <div class="handle-box">
        <el-select class="select" size="mini" v-model="region" placeholder="查询条件">
          <el-option label="学校名" value="schoolName"></el-option>
          <el-option label="城市" value="city"></el-option>
          <el-option label="学校代码" value="SchoolCode"></el-option>
        </el-select>
        <el-input v-model="yourData" size="mini" placeholder="输入条件" class="handle-input"></el-input>
        <el-button type="primary" size="mini" round plain @click="getData" icon="el-icon-search">点击查询</el-button>
        <el-button type="primary" size="mini" @click="centerDialogVisible = true">添加学校</el-button>
      </div>
      <el-table :data="data" border size="mini" style="width: 100%" height="630px" ref="multipleTable">
        <el-table-column label="学校名" prop="schoolName" width="250" align="center"></el-table-column>
        <el-table-column label="学校图标" width="140" align="center">
          <template slot-scope="scope">
            <div id="user">
              <img :src="attachImageUrl(scope.row.img)" alt="头像" style="width: 80px " />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="所在城市" prop="city" width="200" align="center"></el-table-column>
        <el-table-column label="类型" prop="type" width="200" align="center"></el-table-column>
        <el-table-column label="学校代码" prop="schoolCode" width="240" align="center"></el-table-column>

        <el-table-column label="操作" width="400" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleForSelectAllMajorsBySchool(scope.row.schoolId)">调整学校所有专业</el-button>
            <el-button size="mini" type="success" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="primary" @click="updatePic(scope.row.schoolId)">更新图标</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row.schoolId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination @current-change="handleCurrentChange" background layout="total, prev, pager, next"
          :current-page="currentPage" :page-size="pageSize" :total="total">
        </el-pagination>
      </div>
    </div>
    <!--添加学校-->
    <el-dialog title="添加学校" :visible.sync="centerDialogVisible" width="400px" center>
      <el-form :model="registerForm" status-icon :rules="rules" ref="registerForm" label-width="100px"
        class="demo-ruleForm">
        <el-form-item label="学校名称" prop="title" size="mini">
          <el-input v-model="registerForm.schoolName" placeholder="学校名称"></el-input>
        </el-form-item>
        <el-form-item label="所在城市" prop="city" size="mini">
          <el-input v-model="registerForm.city" placeholder="所在城市"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type" size="mini">
          <el-input v-model="registerForm.type" placeholder="类型"></el-input>
        </el-form-item>
        <el-form-item label="级别" prop="keyFlag" size="mini">
          <el-select size="mini" v-model="registerForm.keyFlag">
          <el-option label="一本" value="1"></el-option>
          <el-option label="二本" value="2"></el-option>
          <el-option label="三本" value="3"></el-option>
        </el-select>
        </el-form-item>
  
        <el-form-item label="学校代码" prop="schoolCode" size="mini">
          <el-input v-model="registerForm.schoolCode" placeholder="学校代码"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="addSchool">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" :visible.sync="editVisible" width="430px">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="学校名称" prop="schoolName" size="mini">
          <el-input v-model="form.schoolName" placeholder="学校名称"></el-input>
        </el-form-item>
        <el-form-item label="所在城市" prop="city" size="mini">
          <el-input v-model="form.city" placeholder="所在城市"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type" size="mini">
          <el-input v-model="form.type" placeholder="类型"></el-input>
        </el-form-item>
        <el-form-item label="级别" prop="keyFlag" size="mini">
          <el-select size="mini" v-model="form.keyFlag">
          <el-option label="一本" value="1"></el-option>
          <el-option label="二本" value="2"></el-option>
          <el-option label="三本" value="3"></el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="学校代码" prop="schoolCode" size="mini">
          <el-input v-model="form.schoolCode" placeholder="学校代码"></el-input>
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

    <el-dialog title="更新图标" :visible.sync="editVisiblePic" width="400px">
      <template>
        <div class="upload">
          <div class="section">
            <el-upload drag :action=null :show-file-list="false" :before-upload="beforeAvatarUpload"
              :http-request="uploadFile">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>修改图标</em></div>
              <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过10M</div>
            </el-upload>
          </div>
        </div>
      </template>
    </el-dialog>

  </div>

</template>

<script>
import { mixin } from '../mixins'
import { getAllSchool, addOrUpdateSchool, deleteSchool, updateSchoolPic } from '../api/index'

export default {
  mixins: [mixin],
  data() {
    return {
      registerForm: { // 添加学校
        schoolName: '',
        city: '',
        type: '',
        schoolCode: '',
        keyFlag: ''
      },
      rules: {
        schoolName: [
          { required: true, trigger: 'blur' }
        ],
        city: [
          { required: true, trigger: 'blur' }
        ],
        type: [
          { required: true, trigger: 'blur' }
        ],
        schoolCode: [
          { required: true, trigger: 'blur' }
        ]
      },
      
      form: { // 记录编辑的信息
        schoolId: '',
        schoolName: '',
        city: '',
        type: '',
        schoolCode: ''
      },
      queryform: { //查询信息
        current: '',
        pageSize: '',
        city: '',
        schoolName: '',
        schoolCode: '',
        sortField: ''
      },
      deleteBatch: {
        ids: []
      },
      region: 'schoolName', //查询条件
      yourData: '',//查询内容
      tableData: [],
      tempDate: [],
      editVisiblePic: false,
      updatePicId: '',
      centerDialogVisible: false,
      editVisible: false,
      delVisible: false,
      schoolName: '',
      pageSize: 6, // 页数
      currentPage: 1, // 当前页
      total: '',
      idx: -1
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

    //根据学校查询所有专业
    handleForSelectAllMajorsBySchool(schoolId) {
      this.$router.push({ path: `/schoolProfession`, query: { schoolId: schoolId } })
    },
    // 获取专业院校信息
    getData() {
      this.tableData = []
      if (this.region === 'schoolName') {
        this.queryform.schoolName = this.yourData;
        this.queryform.current = this.currentPage;
        this.queryform.pageSize = this.pageSize;
        this.queryform.sortField = "city"
        getAllSchool(this.queryform).then(res => {
          this.tableData = res.data.records
          this.currentPage = parseInt(res.data.current)
          this.pageSize = parseInt(res.data.size)
          this.total = parseInt(res.data.total)
          this.queryform.schoolName = ''
        })
      } else if (this.region === 'schoolCode') {
        this.queryform.schoolCode = this.yourData;
        this.queryform.current = this.currentPage;
        this.queryform.pageSize = this.pageSize;
        getAllSchool(this.queryform).then(res => {
          this.tableData = res.data.records
          this.currentPage = parseInt(res.data.current)
          this.pageSize = parseInt(res.data.size)
          this.total = parseInt(res.data.total)
          this.queryform.schoolCode = ''
        })
      } else {
        this.queryform.city = this.yourData;
        this.queryform.current = this.currentPage;
        this.queryform.pageSize = this.pageSize;
        getAllSchool(this.queryform).then(res => {
          this.tableData = res.data.records
          this.currentPage = parseInt(res.data.current)
          this.pageSize = parseInt(res.data.size)
          this.total = parseInt(res.data.total)
          this.queryform.city = ''
        })
      }
    },
    // 获取当前页
    handleCurrentChange(val) {
      this.currentPage = val
      this.getData()
    },
    // 添加学校
    addSchool() {
      addOrUpdateSchool(this.registerForm).then(response => {
        // 根据 code 判断是否添加成功
        if (response.code === 1) {
          // 添加成功，显示相应内容
          this.notify('添加成功', 'success')
          this.centerDialogVisible = false
          this.getData()
        } else {
          // 登录失败，显示相应内容
          this.notify('添加失败', 'error')
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // 编辑
    handleEdit(row) {
      this.idx = row.schoolId
      this.form = {
        schoolId: row.schoolId,
        schoolName: row.schoolName,
        city: row.city,
        type: row.type,
        schoolCode: row.schoolCode,
        keyFlag: row.keyFlag
      }
      this.editVisible = true
    },
    // 保存编辑
    saveEdit() {
      let params = {
        schoolId: this.form.schoolId,
        schoolName: this.form.schoolName,
        city: this.form.city,
        type: this.form.type,
        schoolCode: this.form.schoolCode
      }
      addOrUpdateSchool(params)
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
    deleteRow() {
      this.deleteBatch.ids.push(this.idx)
      deleteSchool(this.deleteBatch)
        .then(res => {
          if (res.code === 1) {
            this.showError = false
            this.showSuccess = true
            this.$notify.success({
              title: '删除成功',
              showClose: true
            })
            this.deleteBatch.ids = []
            this.getData()
          } else {
            this.showSuccess = false
            this.showError = true
            this.$notify.error({
              title: '删除失败',
              showClose: true
            })
            this.deleteBatch.ids = []
          }
        })
      this.delVisible = false
    },
    updatePic(schoolId) {
      this.updatePicId = schoolId
      this.editVisiblePic = true;
    },
    handleAvatarSuccess(res, file) {
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
    uploadUrl() {
      return `${this.$store.state.configure.HOST}/school/updateSchoolPic?id=${this.updatePicId}`
    },
    beforeAvatarUpload(file) {
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
      let schoolId = this.updatePicId;
      let fileObj = item.file;
      const form = new FormData(); // FormData 对象
      form.append("file", fileObj); // 文件对象  'upload'是后台接收的参数名
      form.append("id", schoolId);
      //更新头像
      updateSchoolPic(form).then(res => {
        console.log(res.code)
        if (res.code === 1) {
          this.getData()
          this.editVisiblePic = false
          this.$message({
            message: '修改图标成功',
            type: 'success'
          })
        } else {
          this.notify('修改图标失败', 'error')
        }
      });

    }
  }
}
</script>

<style scoped>
.select {
  width: 120px;
  display: inline-block;
}

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