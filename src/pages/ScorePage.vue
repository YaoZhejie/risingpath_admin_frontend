<template>
  <div class="table">
    {{id}}
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" size="mini" class="handle-del mr10" @click="handleForAddScore">添加</el-button>
        <el-input v-model="select_word" size="mini" placeholder="筛选关键词" class="handle-input mr10"></el-input>
      </div>

      <!-- 添加删除框框 -->
 
  <!-- 编辑弹出框 -->
  <el-dialog :title="dialogType" :visible.sync="dialogVisible" width="430px">
        <el-form ref="yearScore" :model="yearScore" label-width="80px">
          <el-form-item label="学校名称" prop="schoolName" size="mini">
            <el-input v-model="yearScore.schoolName" placeholder="学校名称"></el-input>
          </el-form-item>
          <el-form-item label="专业名" prop="city" size="mini">
            <el-input v-model="yearScore.professName" placeholder="专业名"></el-input>
          </el-form-item>
          <el-form-item label="年份" prop="schoolPhone" size="mini">
            <el-input v-model="yearScore.scoreYear" placeholder="年份"></el-input>
          </el-form-item>
          <el-form-item label="最高分数" prop="schoolCode" size="mini">
          <el-input v-model="yearScore.maxScore" placeholder="最高分数"></el-input>
        </el-form-item>
        <el-form-item label="最低分数" prop="schoolCode" size="mini">
          <el-input v-model="yearScore.minScore" placeholder="最低分数"></el-input>
        </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="cancelDialog">取 消</el-button>
          <el-button type="primary" size="mini" @click="addOrUpdate()">确 定</el-button>
        </span>
      </el-dialog>

      <el-table :data="tableData" border size="mini" style="width: 100%" height="700px" ref="multipleTable">
        <el-table-column label="学校名称" prop="schoolName" width="120" align="center"></el-table-column>
        <el-table-column label="专业名" prop="professName" width="120" align="center"></el-table-column>
        <el-table-column label="年份" prop="year" width="120" align="center"></el-table-column>
        <el-table-column label="最高分数" prop="maxScore" width="120" align="center"></el-table-column>
        <el-table-column label="最低分数" prop="minScore" width="120" align="center"></el-table-column>
       <el-table-column label="报考专业要求"  prop="remarks" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleForUpateScore(scope.row)">修改</el-button>
          <el-button size="mini" type="primary" @click="handleForDeleteScore(scope.row.scoreId)">删除</el-button>
        </template>
  </el-table-column>
        </el-table>
    </div>

    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt" align="center">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="delVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="deleteRow">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mixin } from '../mixins'
import {getAllScoreBySchool, deleteCollectiongetAllScoreBySchool,deleteScore,updateScore,addScore } from '../api/index'

export default {
  name: 'collect-page',
  mixins: [mixin],
  props: ['id'],
  data () {
    return {

    
      dialogVisible: false,
      dialogType: '', // 框框的主题类型
      yearScore:{
        scoreId:'',
        maxScore: 0,
        minScore: 0,
        scoreYear: '',
        schoolName:'',
        professName:''
      },
      tableData: [], // 记录歌曲，用于显示
      tempDate: [], // 记录歌曲，用于搜索时能临时记录一份歌曲列表
      tempId: [], // 记录列表中歌曲的id
      multipleSelection: [], // 记录要删除的歌曲
      delVisible: false, // 显示删除框
      select_word: '', // 记录输入框输入的内容
      idx: -1 // 记录当前要删除的歌曲
    }
  },
  watch: {
    select_word: function () {
      if (this.select_word === '') {
        this.tableData = this.tempDate
      } else {
        this.tableData = []
        for (let item of this.tempDate) {
          if (item.name.includes(this.select_word)) {
            this.tableData.push(item)
          }
        }
      }
    }
  },
  mounted () {
    this.getData()
  },
  methods: {


    cancelDialog(){
      this.yearScore={}
      this.dialogVisible=false
    },
    // 获取全部的分数
    getData () {
      console.log(this.$route.query.schoolId)
      getAllScoreBySchool(this.$route.query.schoolId,this.$route.query.proId).then(res=>{
            this.tableData=res.data;
      }).catch(error=>{
        console.log(error)
      })
    },


   //修改分数信息
    handleForUpateScore(row){
      this.yearScore.maxScore=row.maxScore
      this.yearScore.minScore=row.minScore

      this.yearScore.professName=row.professName
      this.yearScore.schoolName=row.schoolName
      this.yearScore.scoreId=row.scoreId
      this.yearScore.scoreYear=row.year
      
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
         addScore(this.yearScore).then(res=>{
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
          updateScore(this.yearScore).then(res=>{
               let flag=res.data;
               if(flag){
                this.$message({
                  message: '修改成功',
                  type: 'success'
                 });
                 this.dialogVisible=false
                 this.yearScore={}
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


   //删除分数

   handleForDeleteScore(id){


    this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteScore(id).then(res=>{
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
    }
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
</style>
