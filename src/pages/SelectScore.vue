<template>
  <div class="table">
    <div class="container">
       <div class="handle-box">
      <el-select class="select" size="mini"  v-model="region" placeholder="查询条件">
       <el-option label="报考院校" value="schoolName"></el-option>
       <el-option label="报考专业" value="professName"></el-option>
       <el-option label="专科专业" value="remarks"></el-option>
      </el-select>
      <el-input v-model="yourData" size="mini" placeholder="输入条件" class="handle-input" ></el-input> 
      <el-button type="primary" size="mini" round plain @click="getData" icon="el-icon-search">点击查询</el-button>
    </div>
      <el-table :data="data" stripe  border size="mini" style="width: 100%" height="600px" ref="multipleTable">
      <el-table-column label="类型" prop="type" width="80" align="center"></el-table-column>
      <el-table-column label="学校名称" prop="schoolName" width="120" align="center"></el-table-column>
      <el-table-column label="专业代码" prop="proCode" width="80" align="center"></el-table-column>
      <el-table-column label="学校图标" width="140" align="center">
          <template slot-scope="scope">
            <div id="user">
              <img :src="attachImageUrl(scope.row.img)" alt="头像" style="width: 80px " />
            </div>
          </template>
        </el-table-column>
      <el-table-column label="专业名" prop="professName" width="120" align="center"></el-table-column>
      <el-table-column label="所在城市" prop="city" width="120" align="center"></el-table-column>
      <el-table-column label="2021年" prop="twoYearBefore" width="120" align="center"></el-table-column>
      <el-table-column label="2022年" prop="oneYearBefore" width="120" align="center"></el-table-column>
     <el-table-column label="2023年" prop="currentYear" width="120" align="center"></el-table-column>
     <el-table-column label="报考专业要求"  prop="remarks" align="center">
      <template slot-scope="scope">
          <div class="scrollable custom-remarks">
          <p class="scrollable-content">{{ scope.row.remarks }}</p>
        </div>
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
        :total="total">
      </el-pagination>
    </div>
    </div>


  </div>
</template>

<script>
import { mixin } from '../mixins'
import {getScoreBySchool,getScoreLikeName,getScoreLikeRemark} from '../api/index'

export default {
  mixins: [mixin],
  data () {
    return {
      region: 'schoolName',
      yourData:'',
      tableData: [],
      centerDialogVisible: false,
      editVisible: false,
      delVisible: false,
      pageSize: 4, // 页数
      currentPage: 1, // 当前页
      total:0,
      idx: -1
    }
  },
  computed: {
    // 计算当前表格中的数据
    data () {
      return this.tableData
    }
  },
  created () {
    this.getData()
  },
  methods: {
    // 获取专业院校信息
    getData () {
      this.tableData = []
      
      if(this.region ==='schoolName'){
        getScoreBySchool({
        current:this.currentPage,
        pageSize:this.pageSize,
        schoolName:this.yourData
      }).then(res =>{
          this.tableData = res.data.records
          this.currentPage = parseInt(res.data.current)
          this.pageSize = parseInt(res.data.size)
          this.total = parseInt(res.data.total)
      })
    }else if(this.region ==='professName'){
      getScoreLikeName({
        current:this.currentPage,
        pageSize:this.pageSize,
        professName:this.yourData
      }).then(res =>{
          this.tableData = res.data.records
          this.currentPage = parseInt(res.data.current)
          this.pageSize = parseInt(res.data.size)
          this.total = parseInt(res.data.total)
      })
    }else if(this.region === 'remarks'){
      getScoreLikeRemark({
        current:this.currentPage,
        pageSize:this.pageSize,
        remarks:this.yourData
      }).then(res =>{
          this.tableData = res.data.records
          this.currentPage = parseInt(res.data.current)
          this.pageSize = parseInt(res.data.size)
          this.total = parseInt(res.data.total)
      })
    }
    },
    // 获取当前页
    handleCurrentChange (newPage) {
    this.currentPage = newPage
    this.getData()
  },

  }
}
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-input {
  width: 150px;
  margin-left: 5px;
  margin-right:5px;
  display: inline-block;
}

.select{
width: 120px;
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
.custom-remarks {
color: rgb(192, 0, 0); /* 更改文字颜色 */
background-color:  rgb(247, 247, 247);
/* 添加其他样式属性以满足你的需求 */
}
</style>
