<template>
  <div class="table">
    <div class="container">
      <div class="handle-box">
        <el-select class="select" size="mini" v-model="region" placeholder="查询条件">
          <el-option label="报考院校" value="schoolName"></el-option>
          <el-option label="报考专业" value="professName"></el-option>
          <el-option label="专科专业" value="remarks"></el-option>
        </el-select>
        <el-input v-model="yourData" size="mini" placeholder="输入条件" class="handle-input"></el-input>
        <el-button type="primary" size="mini" round plain @click="getData" icon="el-icon-search">点击查询</el-button>
      </div>
      <el-table :data="data" border size="mini" style="width: 100%" height="600px" ref="multipleTable">
        <el-table-column label="类型" prop="type" width="80" align="center"></el-table-column>
        <el-table-column label="学校代码" prop="schoolCode" width="80" align="center"></el-table-column>
        <el-table-column label="学校名称" prop="schoolName" width="120" align="center"></el-table-column>
        <el-table-column label="专业名" prop="professName" width="100" align="center"></el-table-column>
        <el-table-column label="总计划" prop="totalPlan" width="50" align="center"></el-table-column>
        <el-table-column label="普通计划" prop="troublePlan" width="50" align="center"></el-table-column>
        <el-table-column label="免试计划" prop="soldierPlan" width="50" align="center"></el-table-column>
        <el-table-column label="学费" prop="tuition" width="120" align="center"></el-table-column>
        <el-table-column label="英语要求" prop="englishReq" width="160" align="center"></el-table-column>
        <el-table-column label="报考专业要求" prop="remarks" align="center">
          <template slot-scope="scope">
            <div class="scrollable">
              <p class="scrollable-content">{{ scope.row.remarks }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="分数管理" width="110" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="scoreEdit(scope.row.schoolId, scope.row.proId)">分数管理</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row.proId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination @current-change="handleCurrentChange" background layout="total, prev, pager, next"
          :current-page="currentPage" :page-size="pageSize" :total="tableData.length">
        </el-pagination>
      </div>
    </div>


    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" :visible.sync="editVisible" width="430px">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="专业类型" prop="type" size="mini">
          <el-input v-model="form.type" placeholder="专业类型"></el-input>
        </el-form-item>
        <el-form-item label="学校ID" prop="schoolId" size="mini">
          <el-input disabled v-model="form.schoolId" placeholder="学校ID"></el-input>
        </el-form-item>
        <el-form-item label="专业名称" prop="professName" size="mini">
          <el-input v-model="form.professName" placeholder="专业名称"></el-input>
        </el-form-item>
        <el-form-item label="总计划数" prop="totalPlan" size="mini">
          <el-input v-model="form.totalPlan" placeholder="总计划数"></el-input>
        </el-form-item>
        <el-form-item label="普通计划数" prop="troublePlan" size="mini">
          <el-input v-model="form.troublePlan" placeholder="普通计划数"></el-input>
        </el-form-item>
        <el-form-item label="免试计划数" prop="soldierPlan" size="mini">
          <el-input v-model="form.soldierPlan" placeholder="免试计划数"></el-input>
        </el-form-item>
        <el-form-item label="学费" prop="tuition" size="mini">
          <el-input v-model="form.tuition" placeholder="学费"></el-input>
        </el-form-item>
        <el-form-item label="英语要求" prop="englishReq" size="mini">
          <el-input v-model="form.englishReq" placeholder="英语要求"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remarks" size="mini">
          <el-input v-model="form.remarks" placeholder="备注"></el-input>
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
import {
  getProfessinfoBySchool,
  getProfessinfoLikeName,
  getProfessinfoLikeRemark, updateProfession, deleteProfession
} from '../api/index'

export default {
  mixins: [mixin],
  data() {
    return {
      form: { // 记录编辑的信息
        proId: '',
        type: '',
        schoolId: '',
        professName: '',
        totalPlan: '',
        troublePlan: '',
        soldierPlan: '',
        tuition: '',
        englishReq: '',
        remarks: '',
      },
      region: 'schoolName',
      yourData: '',
      tableData: [],
      tempDate: [],
      multipleSelection: [], // 记录要删除的歌单
      centerDialogVisible: false,
      editVisible: false,
      delVisible: false,
      school: '',
      profession: '',
      yourProfession: '',
      pageSize: 5, // 页数
      currentPage: 1, // 当前页
      idx: -1
    }
  },
  computed: {
    // 计算当前表格中的数据
    data() {
      return this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    }
  },
  watch: {
    //搜索框里面的内容发生变化时，搜索结果table列表内容跟着内容发生变化
    profession: function () {
      if (this.profession === '') {
        this.tableData = this.tempDate
      } else {
        this.tableData = []
        for (let item of this.tempDate) {
          if (item.professName.includes(this.profession)) {
            this.tableData.push(item)
          }
        }
      }
    },
    school: function () {
      if (this.school === '') {
        this.tableData = this.tempDate
      } else {
        this.tableData = []
        for (let item of this.tempDate) {
          if (item.school.schoolName.includes(this.school)) {
            this.tableData.push(item)
          }
        }
      }
    },
    yourProfession: function () {
      if (this.yourProfession === '') {
        this.tableData = this.tempDate
      } else {
        this.tableData = []
        for (let item of this.tempDate) {
          if (item.remarks.includes(this.yourProfession)) {
            this.tableData.push(item)
          }
        }
      }
    }

  },
  created() {
    this.getData()
  },
  methods: {
    // 获取专业院校信息
    getData() {
      this.tableData = []

      if (this.region === 'schoolName') {
        getProfessinfoBySchool(this.yourData).then(res => {
          this.tableData = res.data
          this.currentPage = 1
        })
      } else if (this.region === 'professName') {
        getProfessinfoLikeName(this.yourData).then(res => {
          this.tableData = res.data
          this.currentPage = 1
        })
      } else if (this.region === 'remarks') {
        getProfessinfoLikeRemark(this.yourData).then(res => {
          this.tableData = res.data
          this.currentPage = 1
        })
      }
    },
    // 获取当前页
    handleCurrentChange(val) {
      this.currentPage = val
    },
    scoreEdit(schoolId, proId) {
      this.$router.push({ path: `/score`, query: { schoolId: schoolId, proId: proId } })
    },
    // 编辑
    handleEdit(row) {
      this.idx = row.proId
      this.form = {
        proId: row.proId,
        type: row.type,
        professName: row.professName,
        schoolId: row.schoolId,
        totalPlan: row.totalPlan,
        troublePlan: row.troublePlan,
        soldierPlan: row.soldierPlan,
        tuition: row.tuition,
        englishReq: row.englishReq,
        remarks: row.remarks,
      }
      this.editVisible = true
    },
    // 保存编辑
    saveEdit() {
      let params = {
        proId: this.form.proId,
        type: this.form.type,
        professName: this.form.professName,
        schoolId: this.form.schoolId,
        totalPlan: this.form.totalPlan,
        troublePlan: this.form.troublePlan,
        soldierPlan: this.form.soldierPlan,
        tuition: this.form.tuition,
        englishReq: this.form.englishReq,
        remarks: this.form.remarks,
      }
      updateProfession(params)
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
      deleteProfession(this.idx)
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
  height: 80px;
  overflow: scroll;
}

.scrollable-content {
  margin: 0;
  padding: 0;
}

.select {
  width: 120px;
  display: inline-block;
}
</style>
