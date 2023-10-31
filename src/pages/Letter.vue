<template>
  <div class="table">
    <div class="container">
      <div class="handle-box">
          <el-button type="primary" size="mini" class="handle-del mr10" @click="delAllLetter">批量删除</el-button>
        </div>
      <el-table :data="data" border size="mini" style="width: 100%" height="620px" ref="multipleTable"  @selection-change="handleSelectionChange">
       <el-table-column type="selection" width="40" align="center"></el-table-column>
      <el-table-column label="标题" prop="title" width="150" align="center"></el-table-column>
      <el-table-column label="投稿时间" prop="publishTime" width="200" align="center"></el-table-column>
      <el-table-column label="信件内容"  prop="content" width="950" align="center">
    <template slot-scope="scope">
    <div class="scrollable">
    <p class="scrollable-content">{{ scope.row.content }}</p>
  </div>
</template>
  </el-table-column>
  <el-table-column label="操作" width="100" align="center">
              <template slot-scope="scope">
                  <el-button size="mini" type="danger" @click="handleForDeleteProfession(scope.row.letterId)">删除</el-button>
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
 
  </div>
</template>

<script>
import { mixin } from '../mixins'
import {getAllLetter,deleteLetter} from '../api/index'

export default {
  name: 'collect-page',
  mixins: [mixin],
  props: ['id'],
  data () {
    return {
      dialogVisible: false,
      dialogType: '', // 框框的主题类型
      letterBox:{
        letterId:'',
        title: '',
        content:'',
        publishTime: '',
      },
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
    deleteRow () {    
      deleteLetter(this.idx)
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
    cancelDialog(){
      this.profession={}
      this.dialogVisible=false
    },
    // 获取全部的信件
    getData () {
      getAllLetter().then(res=>{  
        console.log(res)
            this.tableData=res;
      }).catch(error=>{
        console.log(error)
      })
    },



   //删除专业以及对应的分数
   deleteLetter(id){

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
     //删除专业以及对应的分数
     handleForDeleteProfession(id){
  
  this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteLetter(id).then(res=>{
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
