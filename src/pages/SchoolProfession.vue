<template>
    <div class="table">
      <div class="container">
        <div class="handle-box">
          <el-button type="primary" size="mini" class="handle-del mr10" @click="handleForAddScore">添加专业</el-button>
        </div>
        <el-table :data="data" border size="mini" style="width: 100%" height="650px" ref="multipleTable">
        <el-table-column label="类型" prop="type" width="80" align="center"></el-table-column>
        <el-table-column label="专业名" prop="professName" width="100" align="center"></el-table-column>
        <el-table-column label="总计划数" prop="totalPlan" width="80" align="center"></el-table-column>
        <el-table-column label="普通计划数" prop="troublePlan" width="80" align="center"></el-table-column>
        <el-table-column label="免试计划数" prop="soldierPlan" width="80" align="center"></el-table-column>
        <el-table-column label="学费" prop="tuition" width="120" align="center"></el-table-column>
        <el-table-column label="英语要求" prop="englishReq" width="180" align="center"></el-table-column>
        <el-table-column label="报考专业要求"  prop="remarks" width="550" align="center">
      <template slot-scope="scope">
      <div class="scrollable">
      <p class="scrollable-content">{{ scope.row.remarks }}</p>
    </div>
  </template>
    </el-table-column>
        
        <el-table-column label="操作"  prop="tuition" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleForUpateScore(scope.row)">修改</el-button>
          <el-button size="mini" type="primary" @click="handleForDeleteProfession(scope.row.proId)">删除</el-button>
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
   <!-- 编辑弹出框 -->
   <el-dialog :title="dialogType" :visible.sync="dialogVisible" width="430px">
          <el-form ref="profession" :model="profession" label-width="80px">
            <el-form-item label="专业Id" prop="proId" size="mini">
              <el-input v-model="profession.proId" placeholder="专业Id"></el-input>
            </el-form-item>
            <el-form-item label="学校Id" prop="schoolId" size="mini">
              <el-input v-model="profession.schoolId" placeholder="学校Id" readonly></el-input>
            </el-form-item>
            <el-form-item label="专业类型" prop="type" size="mini">
              <el-input v-model="profession.type" placeholder="专业类型"></el-input>
            </el-form-item>
            <el-form-item label="专业名" prop="professName" size="mini">
              <el-input v-model="profession.professName" placeholder="专业名"></el-input>
            </el-form-item>
            <el-form-item label="总计划数" prop="totalPlan" size="mini">
            <el-input v-model="profession.totalPlan" placeholder="总计划数"></el-input>
          </el-form-item>
          <el-form-item label="普通计划数" prop="troublePlan" size="mini">
            <el-input v-model="profession.troublePlan" placeholder="普通计划数"></el-input>
          </el-form-item>
          <el-form-item label="免试计划数" prop="soldierPlan" size="mini">
            <el-input v-model="profession.soldierPlan" placeholder="免试计划数"></el-input>
          </el-form-item>
          <el-form-item label="学费" prop="tuition" size="mini">
            <el-input v-model="profession.tuition" placeholder="学费"></el-input>
          </el-form-item>
          <el-form-item label="英语要求" prop="englishReq" size="mini">
            <el-input v-model="profession.englishReq" placeholder="英语要求"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remarks" size="mini">
            <el-input v-model="profession.remarks" placeholder="备注"></el-input>
          </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="cancelDialog">取 消</el-button>
            <el-button type="primary" size="mini" @click="addOrUpdate()">确 定</el-button>
          </span>
        </el-dialog>

    </div>
  </template>
  
  <script>
  import { mixin } from '../mixins'
  import {getProfessinfoBySchoolId,deleteProfession,updateProfession,insertProfession } from '../api/index'
  
  export default {
    name: 'collect-page',
    mixins: [mixin],
    props: ['id'],
    data () {
      return {
        dialogVisible: false,
        dialogType: '', // 框框的主题类型
        profession:{
          type: '',
          proId:'',
          schoolId: this.$route.query.schoolId,
          professName:'',
          totalPlan:'',
          troublePlan:'',
          soldierPlan:'',
          tuition:'',
          englishReq:'',
          remarks:'',

        },
        professionName:'',
        tableData: [], // 记录数据，用于显示
        tempDate: [], // 记录数据，用于搜索时能临时记录一份歌曲列表
        tempId: [], // 记录列表中数据的id
        multipleSelection: [], // 记录要删除的数据
        delVisible: false, // 显示删除框
        idx: -1 ,// 记录当前要删除的数据
        pageSize: 6, // 页数
        currentPage: 1, // 当前页
      }
    },
    mounted () {
      this.getData()
    },
  computed: {
    // 计算当前表格中的数据
    data () {
      return this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    }
  },
    methods: {
      cancelDialog(){
        this.profession={}
        this.dialogVisible=false
      },
      // 获取全部的专业信息
      getData () {
        getProfessinfoBySchoolId(this.$route.query.schoolId).then(res=>{  
              this.tableData=res.data;
        }).catch(error=>{
          console.log(error)
        })
      },
  
  
     //修改分数信息
      handleForUpateScore(row){
        this.profession.type=row.type
        this.profession.proId=row.proId
        this.profession.schoolId=row.schoolId
        this.profession.professName=row.professName
        this.profession.totalPlan=row.totalPlan
        this.profession.troublePlan=row.troublePlan
        this.profession.soldierPlan=row.soldierPlan
        this.profession.tuition=row.tuition
        this.profession.englishReq=row.englishReq
        this.profession.remarks=row.remarks
        this.dialogType="编辑";
        this.dialogVisible=true;
        
      },
       
      handleForAddScore(){
        this.dialogType="添加";
        this.dialogVisible=true;
      },
        
      
      addOrUpdate(){
  
         //添加
        if(this.dialogType=="添加"){
          console.log(this.profession)
          insertProfession(this.profession).then(res=>{
            let flag=res.data;
                 if(flag){
                  this.$message({
                    message: '添加成功',
                    type: 'success'
                   });
                 }else{
                  this.$message({
                    message: '添加失败',
                    type: 'success'
                   });
                 }
           }).catch(error=>{
            console.log(error)
           })
  
        }else{  //修改
          updateProfession(this.profession).then(res=>{
                 let flag=res.data;
                 if(flag){
                  this.$message({
                    message: '修改成功',
                    type: 'success'
                   });
                   this.dialogVisible=false
                   this.profession={}
                 }else{
                  this.$message({
                    message: '修改失败',
                    type: 'success'
                   });
                 }
            }).catch(error=>{
              console.log(error)
            })
  
        }
      },
  
  
     //删除专业以及对应的分数
     handleForDeleteProfession(id){
  
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            deleteProfession(id).then(res=>{
            let flag=res.data;
  
          if(flag){
            this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.getData()
          }else{
            this.$message({
            message: '删除失败',
            type: 'error'
          });
          }
       }).catch(error=>{
       console.log(error)
       })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });          
          });
      
     },
  
  
      // 删除一首歌曲
      deleteRow () {
        deleteCollection(this.$route.query.id, this.idx.id)
          .then(res => {
            if (res) {
              this.getData()
              this.notify('删除成功', 'success')
            } else {
              this.notify('删除失败', 'error')
            }
          })
          .catch(err => {
            console.log(err)
          })
        this.delVisible = false
      },

          // 获取当前页
    handleCurrentChange (val) {
      this.currentPage = val
    },
    }
  }
  </script>
  
  <style scoped>
  .handle-box {
    margin-bottom: 20px;
  }
  
  .handle-input {
    width: 300px;
    display: inline-block;
  }
  .scrollable {
height: 80px;
overflow: scroll;
}
.scrollable-content {
margin: 0;
padding: 0;
}

.pagination {
    display: flex;
    justify-content: center;
}
  </style>
  