import { mapGetters } from 'vuex'

export const mixin = {
  computed: {
    ...mapGetters([
      'userId',
      'loginIn',
    ])
  },
  methods: {
    // 提示信息
    notify (title, type) {
      this.$notify({
        title: title,
        type: type
      })
    },
    // 获取头像图片信息
    attachImageUrl (srcUrl) {
      return srcUrl ? this.$store.state.configure.HOST + srcUrl : 'https://bpic.51yuansu.com/pic2/cover/00/30/60/581089402dbcb_610.jpg' 
    },
        // 获取要删除列表的id
        handleDelete (id) {
          this.idx = id
          this.delVisible = true
        },
        // 获取批量要删除的列表
        handleSelectionChange (val) {
          this.multipleSelection = val
        },
        // 批量删除用户
        delAll () {
          for (let item of this.multipleSelection) {
            this.handleDelete(item.userId)
            this.deleteRow(item.userId)
          }
          this.multipleSelection = []
        },
        //批量删除学习资料
        delAllLearn () {
          for (let item of this.multipleSelection) {
            this.handleDelete(item.learnId)
            this.deleteRow(item.learnId)
          }
          this.multipleSelection = []
        },
        //批量删除信件
        delAllLetter() {
          for (let item of this.multipleSelection) {
            this.handleDelete(item.letterId)
            this.deleteRow(item.letterId)
          }
          this.multipleSelection = []
        },
  }
}
