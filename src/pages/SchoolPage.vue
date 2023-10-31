<template>
    <div class="table">
      <div class="container">
        <div class="handle-box">
          <el-input v-model="schoolName" size="mini" placeholder="筛选资料类型" class="handle-input mr10"></el-input>
          <el-button type="primary" size="mini" @click="centerDialogVisible = true">添加学校</el-button>
        </div>
        <el-table :data="data" border size="mini" style="width: 100%" height="620px" ref="multipleTable">
        <el-table-column label="学校名" prop="schoolName" width="300" align="center"></el-table-column>
        <el-table-column label="所在城市" prop="city" width="300" align="center"></el-table-column>
        <el-table-column label="招生办电话" prop="schoolPhone" width="300" align="center"></el-table-column>
        <el-table-column label="学校代码" prop="schoolCode" width="240" align="center"></el-table-column>
        
        <el-table-column label="操作" width="300" align="center">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleForSelectAllMajorsBySchool(scope.row.schoolId)">调整学校所有专业</el-button>
                  <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                  <el-button size="mini" type="danger" @click="handleDelete(scope.row.schoolId)">删除</el-button>
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
            <!--添加学校-->
            <el-dialog title="添加学校" :visible.sync="centerDialogVisible" width="400px" center>
        <el-form :model="registerForm" status-icon :rules="rules" ref="registerForm" label-width="70px" class="demo-ruleForm">
          <el-form-item label="学校名称" prop="title" size="mini">
            <el-input v-model="registerForm.schoolName" placeholder="学校名称"></el-input>
          </el-form-item>
          <el-form-item label="所在城市" prop="city" size="mini">
            <el-input v-model="registerForm.city" placeholder="所在城市"></el-input>
          </el-form-item>
          <el-form-item label="招生办" prop="schoolPhone" size="mini">
            <el-input v-model="registerForm.schoolPhone" placeholder="招生办"></el-input>
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
          <el-form-item label="招生办" prop="schoolPhone" size="mini">
            <el-input v-model="form.schoolPhone" placeholder="招生办"></el-input>
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
    </div>
  
  </template>
  
  <script>
  import { mixin } from '../mixins'
  import {getAllSchool,insertSchool,updateSchool,deleteSchool} from '../api/index'
 
  export default {
    mixins: [mixin],
    data () {
      return {
        registerForm: { // 注册
          schoolName: '',
          city: '',
          schoolPhone: '',
          schoolCode:''
        },
        rules: {
         schoolName: [
            { required: true, trigger: 'blur' }
          ],
          city: [
            { required: true, trigger: 'blur' }
          ],
          schoolPhone: [
            {required: true, trigger: 'blur' }
          ],
          schoolCode: [
            { required: true, trigger: 'blur' }
          ]
        },
        form: { // 记录编辑的信息
          schoolId: '',
          schoolName: '',
          city: '',
          schoolPhone: '',
          schoolCode:''
        },
        tableData: [],
        tempDate: [],
        centerDialogVisible: false,
        editVisible: false,
        delVisible: false,
        schoolName: '',
        pageSize: 14, // 页数
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
      schoolName: function () {
        if (this.schoolName === '') {
          this.tableData = this.tempDate
        } else {
          this.tableData = []
          for (let item of this.tempDate) {
            if (item.schoolName.includes(this.schoolName)) {
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

       //根据学校查询所有专业
      handleForSelectAllMajorsBySchool(schoolId){
        this.$router.push({path: `/schoolProfession`, query: {schoolId: schoolId}})
      },
      // 获取专业院校信息
      getData () {
        this.tableData = []
        this.tempDate = []
        getAllSchool().then((res) => {
          this.tableData = res
          this.tempDate = res
          this.currentPage = 1
        })
      },
      // 获取当前页
      handleCurrentChange (val) {
        this.currentPage = val
      },
      // 添加学校
      addSchool () {
        let _this = this
        let params = {
         schoolName: this.registerForm.schoolName,
         city: this.registerForm.city,
         schoolPhone: this.registerForm.schoolPhone,
         schoolCode: this.registerForm.schoolCode,

        }
       
      insertSchool(params).then(response => {
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
        this.idx = row.schoolId
        this.form = {
          schoolId: row.schoolId,
          schoolName: row.schoolName,
          city: row.city,
          schoolPhone: row.schoolPhone,
          schoolCode: row.schoolCode,
        }
        this.editVisible = true
      },
      // 保存编辑
      saveEdit () {
      let params = {
        schoolId :this.form.schoolId,
        schoolName:this.form.schoolName,
        city: this.form.city,
        schoolPhone: this.form.schoolPhone,
        schoolCode: this.form.schoolCode
      }
      updateSchool(params)
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
          schoolId :this.idx,
      }
      deleteSchool(params)
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
  