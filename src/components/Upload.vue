<template>
  <div class="upload">
    <p class="title">修改头像</p>
    <hr/>
    <div class="section">
      <el-upload
        drag
        :action=null
        :show-file-list="false"
        :before-upload="beforeAvatarUpload"
        :http-request="uploadFile">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>修改头像</em></div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过10M</div>
      </el-upload>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { mixin } from '../mixins'
import {updatePic} from '../api/index'

export default {
  name: 'upload',
  mixins: [mixin],
  data () {
    return {
      imageUrl: ''
    }
  },
  computed: {
    ...mapGetters([
      'userId'
    ])
  },
  methods: {
    uploadUrl () {
       return `${this.$store.state.configure.HOST}/user/updateUserPic?id=${this.userId}` 
    },
    handleAvatarSuccess (res, file) {
      console.log(res.data)
      if (res.code === 1) {
        this.imageUrl = URL.createObjectURL(file.raw)
        this.$store.commit('setAvator', res.data.avatarUrl)
        this.$message({
          message: '修改成功',
          type: 'success'
        })
      } else {
        this.notify('修改失败', 'error')
      }
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
      let userId = this.userId;
      console.log(userId)
      let fileObj = item.file;
      const form = new FormData(); // FormData 对象
      form.append("file", fileObj); // 文件对象  'upload'是后台接收的参数名
      form.append("id", userId);
      //更新头像
      updatePic(form).then(res => {
        console.log(res.code)
        if (res.code === 1) {
        // this.imageUrl = URL.createObjectURL(file.raw)
        this.$store.commit('setAvator', res.data.avatarUrl)
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

<style lang="scss" scoped>
@import '../assets/css/upload.scss';
</style>
