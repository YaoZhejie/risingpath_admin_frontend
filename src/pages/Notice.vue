<template>
  <div class="mail">
    <el-form label-width="100px">
      <h2>系统公告管理</h2>
      <el-form-item label="主题" prop="title">
        <el-input v-model="Notice.title"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <el-input type="textarea" v-model="Notice.content" rows="18"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">修改</el-button>
      </el-form-item>
      <p class="announcement-item-date">{{ "发布时间：" + Notice.publishTime }}</p>
    </el-form>
  </div>
</template>

<script>
import { mixin } from '../mixins'
import { getNotice, updateNotice } from '../api/index'
export default {
  name: 'Notice',
  data() {
    return {
      Notice: {
        noticeId: '',
        title: '',
        content: '',
        publishTime: '',
      },
      formattedTime: null
    }
  },
  mixins: [mixin],
  methods: {
    handleSubmit() {
      let _this = this
      let params = {
        noticeId: this.Notice.noticeId,
        title: this.Notice.title,
        content: this.Notice.content,
      }
      console.log(params.publishTime)
      //调用封装的发送信息方法
      updateNotice(params, {
        headers: { 'Content-Type': 'application/json' }
      }).then(response => {
        // 根据 code 判断是否修改成功
        if (response.code === 1) {
          // 修改成功，显示相应内容
          _this.notify('修改成功', 'success');
          this.getData()
        } else {
          // 修改失败，显示相应内容
          _this.notify('修改失败', 'error')
        }
      }).catch(error => {
        console.log(error)
      })
    },
    getData() {
      getNotice().then((res) => {
        this.Notice = res.data
      })
    },
  },
  created() {
    this.getData()
  },
}
</script>

<style scoped>
.mail {
  width: 1400px;
  height: 740px;
  margin: auto;
  padding: 20px;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
}

h2 {
  margin-top: 0;
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  color: #2b0185;
}

.el-form-item__label {
  font-weight: bold;
}

.el-button {
  margin-top: 20px;
  width: 100%;
}

.el-button--primary {
  background-color: #409EFF;
  border-color: #409EFF;
}

.el-button--primary:hover {
  background-color: #66B1FF;
  border-color: #66B1FF;
}

.announcement-item-date {
  padding: 30px;
  font-size: 25px;
  color: #888;
}
</style>