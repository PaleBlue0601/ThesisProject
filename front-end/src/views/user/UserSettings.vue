<template>
  <div class="page">
    <a-tabs type="card" class="tabs-box" v-model="current" @change="handleChangeTab">
      <a-tab-pane key="profile" tab="个人资料"></a-tab-pane>
      <a-tab-pane key="deliver_address" tab="收货地址"></a-tab-pane>
    </a-tabs>
    <div class="content-box">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserSttings',
  data() {
    return {
      current: 'profile'
    }
  },
  methods: {
    handleChangeTab(activeKey) {
      this.$router.push({path: `/user/settings/${activeKey}`})
    }
  }
}
</script>

<style lang="less" scoped>
.page {
  max-width: 1185px;
  width: 100%;
  padding: 12px;
  margin-right: auto;
  margin-left: auto;
}
.tabs-box {
  background: #fff;

  /deep/ .ant-tabs-bar {
    border-color: #fff;
    margin-bottom: 0;
  }

  /deep/ .ant-tabs-bar .ant-tabs-tab {
    border-color: #fff;
    background: #fff;
    width: 100%;
    text-align: center;
    border: none;
    margin-right: 0;
    border-radius: 0 0 0 0;
  }

  /deep/ .ant-tabs-bar .ant-tabs-tab:hover {
    background: rgba(0, 0, 0, 0.1);
  }

  /deep/ .ant-tabs-bar .ant-tabs-tab-active {
    border-bottom: 2px solid #1890ff;
  }

  /deep/ .ant-tabs-bar .ant-tabs-tab-active:hover {
    background: rgba(102, 175, 243, 0.3);
  }

  /deep/ .ant-tabs-nav>div {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
}

.content-box {
  margin-top: 20px;
  height: 100%;
}
</style>