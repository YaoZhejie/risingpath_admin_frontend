<template>
  <div class="sidebar">
    <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#FBFFFD"
      text-color="#009100" active-text-color="#0080FF" unique-opened router>
      <template v-for="item in items">
        <template>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from '../assets/js/bus'

export default {
  data() {
    return {
      collapse: false,
      items: [
        {
          icon: 'el-icon-pie-chart',
          index: 'Info',
          title: '首页'
        },
        {
          icon: 'el-icon-user',
          index: 'UserPage',
          title: '用户管理页面'
        },
        {
          icon: 'el-icon-s-home',
          index: 'School',
          title: '学校管理页面'
        },
        {
          icon: 'el-icon-setting',
          index: 'SelectInfo',
          title: '专业管理页面'
        },
        {
          icon: 'el-icon-view',
          index: 'SelectScore',
          title: '分数线查询'
        },
        {
          icon: 'el-icon-edit',
          index: 'Learn',
          title: '学习资料管理'
        },
        {
          icon: 'el-icon-chat-line-round',
          index: 'Notice',
          title: '系统公告管理'
        },
        {
          icon: 'el-icon-message',
          index: 'Letter',
          title: '信箱查看'
        }
      ]
    }
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace('/', '')
    }
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on('collapse', msg => {
      this.collapse = msg
    })
  }
}
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  background-color: #FBFFFD;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 150px;
}

.sidebar>ul {
  height: 100%;
}
</style>