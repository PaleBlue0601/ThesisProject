<template>
  <a-layout-header class="container">
    <div class="logo">{{ logoTitle }}</div>
    <a-menu class="menu-box" mode="horizontal" :selectedKeys="current" @click="menuChange"
      :style="{ lineHeight: '64px', fontSize: '18px' }">
      <a-menu-item v-for="item in menuItemData" :key="item.key">
        {{ item.text }}
      </a-menu-item>
    </a-menu>
    <a-button class="login-btn" type="primary" @click="openLgoinBox" v-show="!loginState">
      登录
    </a-button>
    <a-popover v-if="loginState" trigger="click" placement="bottom">
      <template slot="content">
        <div class="popover-content-box">
          <a-button icon="user" @click="toUserPage" v-if="userInfo.status == 'user'">我的账号</a-button>
          <a-button icon="logout" @click="hanldeLogout">退出</a-button>
        </div>
      </template>
      <a-avatar :size="45" icon="user" :src="userInfo.avatarPath" style="cursor: pointer;"/>
    </a-popover>
  </a-layout-header>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'Toolbar',
  props: {
    logoTitle: {
      type: String,
      default: 'logo'
    }
  },
  created() {

  },
  data() {
    return {
      menuUserData: [
        {
          text: '首页',
          key: 'home'
        },
        {
          text: '个人藏品',
          key: 'peopleobject'
        },
        {
          text: '藏品交换',
          key: 'objectexchange'
        },
        {
          text: '消息',
          key: 'chat'
        },
      ],
      menuAdminData: [
        {
          text: '用户管理',
          key: 'usermanagement'
        },
        {
          text: '举报管理',
          key: 'usercomplaint'
        },
      ],
      current: ['home'],
    }
  },
  methods: {
    ...mapMutations(['loginStateUpdate', 'userIDUpdate', 'userInfoUpdate']),
    openLgoinBox() {
      const data = {
        openlogin: true,
        noEvents: true
      }
      this.$emit('showLoginBox', data)
    },
    menuChange({ item, key, keyPath }) {
      const { userID } = this.userInfo
      if (userID == undefined && key != 'home') {
        this.$message.info('请先登录')
        this.current = ['home']
        return
      }
      this.current = keyPath
      const path = key === 'home' ? '/' : `/${key}`
      if (this.$route.path !== path) {
        this.$router.push({ path })
      }
    },
    toUserPage() {
      this.current = ['']
      const { userID } = this.userInfo
      this.$router.push({ path: `/user/${userID}` })
    },
    hanldeLogout() {
      this.toHomePage()
      this.loginStateUpdate(false)
      this.userIDUpdate(undefined)
      this.userInfoUpdate({})
      this.$cookies.remove('userID')
      this.current = ['home']
    },
    toHomePage() {
      if (this.$route.path !== "/") {
        this.$router.replace("/")
      }
    }
  },
  computed: {
    ...mapGetters(['loginState', 'userInfo', 'indexPageName']),
    menuItemKeyMap() {
      const res = {}
      this.menuItemData.forEach(item => {
        res[item.key] = item.key
      })
      return res
    },
    menuItemData() {
      const { status } = this.userInfo
      return status == 'user' || status == undefined ? this.menuUserData : this.menuAdminData
    }
  },
  watch: {
    indexPageName(val, oldVal) {
      if (this.menuItemKeyMap[val] === undefined) {
        this.current = [val]
      }
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background: #fff !important;
  padding-right: 7vw !important;
  margin-bottom: 10px;
}

.logo {
  height: 31px;
  margin: 16px 24px 16px 0;
  float: left;
  line-height: 31px;
  font-size: 20px;
  font-weight: bold;

  a {
    color: #000;
  }
}

.login-btn {
  float: right;
}

.popover-content-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100px;

  button {
    border: none;
    box-shadow: none;
    text-align: left;
  }

  button:hover {
    background: #1890ff;
    color: #fff;
  }
}
</style>
