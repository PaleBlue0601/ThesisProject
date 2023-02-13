<template>
  <a-layout id="components-layout-demo-top" :class="aLayoutClassObject">
    <toolbar :logo-title="title" @showLoginBox="switchLoginBox"></toolbar>
    <a-layout-content style="padding: 0 50px; position: relative;">
      <router-view />
    </a-layout-content>
    <a-layout-footer style="text-align: center;">
      {{ title }} ©2022 Created by {{ author }}
    </a-layout-footer>
    <login v-if="openlogin" @changeLoginBox="switchLoginBox"></login>
  </a-layout>
</template>

<script>
import toolbar from '@/components/Toolbar.vue'
import login from '@/components/Login.vue'
import config from "@/config"
import { mapMutations, mapActions, mapGetters } from 'vuex'
export default {
  components: {
    toolbar,
    login
  },
  data() {
    return {
      title: config.title,
      author: config.author,
      openlogin: false,
    }
  },
  created() {
    const userID = this.$cookies.get('userID')
    if (userID != undefined) {
      this.userIDUpdate(userID)
      this.userInfoUpdate()
    }
  },
  methods: {
    ...mapMutations(['userIDUpdate', 'noEventsUpdate']),
    ...mapActions(['userInfoUpdate']),
    switchLoginBox(data) {
      this.openlogin = data.openlogin
      this.noEventsUpdate(data.noEvents)
    }
  },
  computed: {
    ...mapGetters(['noEvents']),
    aLayoutClassObject() {
      return {
        'layout': true,
        'no-events': this.noEvents
      }
    }
  },
}
</script>

<style lang="less">
#components-layout-demo-top {
  min-height: 100vh;
}

.no-events {
  pointer-events: none; //禁止点击事件
}

.page {
  height: 100%;
}

// 弹窗样式
.dialog-box {
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  left: 0;
  pointer-events: none;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 6;
  outline: none;
  background: rgba(0, 0, 0, 0.5);
}
</style>
