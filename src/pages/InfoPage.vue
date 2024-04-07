<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover" :body-style="{padding: '0px'}">
          <div class="grid-content grid-con-1">
            <div class="grid-cont-right">
              <div class="grid-num">{{ schoolCount }}</div>
              <div>招生院校数量</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" :body-style="{padding: '0px'}">
          <div class="grid-content grid-con-2">
            <div class="grid-cont-right">
              <div class="grid-num">{{ professinfoCount }}</div>
              <div>招生专业数量</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" :body-style="{padding: '0px'}">
          <div class="grid-content grid-con-3">
            <div class="grid-cont-right">
              <div class="grid-num">{{ totalPlan }}</div>
              <div>总招生人数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" :body-style="{padding: '0px'}">
          <div class="grid-content grid-con-4">
            <div class="grid-cont-right">
              <div class="grid-num">49.67%</div>
              <div>23年报录比</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
    <el-col :span="12">
      <h3 style="margin-bottom: 20px">2024公办招收人数</h3>
      <div  style="background-color: rgb(237, 243, 233)">
        <ve-pie :data="learn" :theme="options"></ve-pie>
      </div>
    </el-col>
    <el-col :span="12">
      <h3 style="margin-bottom: 20px">招生专业数量</h3>
      <div  style="background-color: rgb(237, 243, 233)">
        <ve-histogram :data="professType" :theme="options3"></ve-histogram>
      </div>
    </el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="12">
      <h3 style="margin: 20px 0">学校类别比例</h3>
      <div  style="background-color: rgb(237, 243, 233)">
        <ve-pie :data="school" :theme="options1"></ve-pie>
      </div>
    </el-col>
    <el-col :span="12">
      <h3 style="margin: 20px 0">23年各大类分数线</h3>
      <div  style="background-color: rgb(237, 243, 233)">
        <ve-histogram :data="country" :theme="options2"></ve-histogram>
      </div>
    </el-col>
  </el-row>
  </div>
</template>

<script>
import { allTotalPlan,
        allProfessinfoCount,
         allSchoolCount,
          privateSchoolCount,
          publicSchoolCount,
          sumPrivateProfession,
          sumPublicProfession,
          CountOfMajorsByType} from '../api/index'
export default {


  data () {
    return {
      learn: {
        columns: ['人数', '总数'],
        rows: [
          { '人数': '公办招生人数', '总数': 0 },
          { '人数': '民办招生人数', '总数': 0 }
        ]
      },
      school: {
        columns: ['院校类别', '总数'],
        rows: [
          { '院校类别': '公办院校', '总数': 0 },
          { '院校类别': '民办院校', '总数': 0 }
        ]
      },
      professType: {
      columns: ['类型', '专业数量'],
      rows: [
        { '类型': '文史', '专业数量': 0 },
        { '类型': '法学', '专业数量': 0 },
        { '类型': '教育', '专业数量': 0 },
        { '类型': '艺术', '专业数量': 0 },
        { '类型': '理工', '专业数量': 0 },
        { '类型': '经管', '专业数量': 0 },
        { '类型': '农学', '专业数量': 0 },
        { '类型': '医学', '专业数量': 0 }
      ]
    },
      country: {
      columns: ['类型', '23分数线'],
      rows: [
        { '类型': '文史', '23分数线': 221 },
        { '类型': '法学', '23分数线': 177 },
        { '类型': '教育', '23分数线': 227 },
        { '类型': '艺术', '23分数线': 206 },
        { '类型': '理工', '23分数线': 182 },
        { '类型': '经管', '23分数线': 188 },
        { '类型': '农学', '23分数线': 179 },
        { '类型': '医学', '23分数线': 211 }
      ]
      },
      options: {
        color: ['#87CEFA', '#FFC0CB']
      },
      options1: {
        color: ['#1E90FF', '#7B68EE']
      },
      options2: {
        color: ['rgb(151, 101, 237)'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        }
      },
      options3: {
        color: ['skyblue'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
      },
      schoolCount: 0,
      professinfoCount:0,
      totalPlan:0
    }
  },
  mounted() {
    this.getSchoolCount(),
    this.getProfessinfoCount(),
    this.getAllTotalPlan(),
    this.getSchoolTypeCount(),
    this.getTypeOfSum(),
    this.CountOfMajorsByType()
  },

  methods:{
    getSchoolCount(){
      allSchoolCount().then(res =>{
        this.schoolCount = res.data
      })
    },
    getProfessinfoCount(){
      allProfessinfoCount().then(res =>{
        this.professinfoCount = res.data
      })
    },
    getAllTotalPlan(){
      allTotalPlan().then(res =>{
        this.totalPlan = res.data
      })
    },
    getSchoolTypeCount(){
      privateSchoolCount().then(res =>{
        this.school.rows[1]['总数'] = res.data
      }),
      publicSchoolCount().then(res =>{
        this.school.rows[0]['总数'] = res.data
      })
    },
    getTypeOfSum(){
      sumPrivateProfession().then(res =>{
        this.learn.rows[1]['总数'] = res.data
      }),
      sumPublicProfession().then(res =>{
        this.learn.rows[0]['总数'] = res.data
      })
    },
    setNumber (type, arr) {
    let count = 0
    for (let item of arr) {
      if (type === item.type) {
        count = item.professinfoNumber
      }
    }
    return count
  },
  CountOfMajorsByType(){
    CountOfMajorsByType().then(res =>{
      this.professType.rows[0]['专业数量'] = this.setNumber('文史类',res.data)
      this.professType.rows[1]['专业数量'] = this.setNumber('法学类',res.data)
      this.professType.rows[2]['专业数量'] = this.setNumber('教育类',res.data)
      this.professType.rows[3]['专业数量'] = this.setNumber('艺术类',res.data)
      this.professType.rows[4]['专业数量'] = this.setNumber('理工类',res.data)
      this.professType.rows[5]['专业数量'] = this.setNumber('经管类',res.data)
      this.professType.rows[6]['专业数量'] = this.setNumber('农学类',res.data)
      this.professType.rows[7]['专业数量'] = this.setNumber('医学类',res.data)
    })
  }
  }
}
</script>

<style>
  .grid-content {
    display: flex;
    align-items: center;
    height: 100px;
  }

  .grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #fa1c10;
  }

  .grid-num {
    font-size: 30px;
    font-weight: bold;
  }
</style>
