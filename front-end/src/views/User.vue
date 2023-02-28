<template>
  <div class="page">
    <div class="container">
      <a-row type="flex" justify="space-between" :gutter="20">
        <a-col :span="16">
          <a-card class="user-header-box" :bordered="false">
            <a-avatar class="user-avatar" :size="80" icon="user" :src="userInfoShow.avatarPath" />
            <div class="user-content">
              <div class="title">{{ userInfoShow.petName }}</div>
              <div class="favour">|</div>
            </div>
            <div class="user-action">
              <a-button @click="toUserSettingsPage" v-if="pageUserID == userID">编辑个人信息</a-button>
              <span v-if="userInfoShow.status == 'ban'" style="color: red;font-weight: bold;">账号封禁中</span>
            </div>
          </a-card>
          <a-tabs type="card" class="tabs-box">
            <a-tab-pane key="object" tab="藏品" class="tab_pane-box">
              <a-list :grid="{ gutter: 16, column: 2 }" :data-source="objectListData">
                <a-list-item slot="renderItem" slot-scope="item" class="list_item-box">
                  <object-item :object-info="item"></object-item>
                </a-list-item>
              </a-list>
            </a-tab-pane>
            <a-tab-pane key="statistic" tab="数据统计" class="tab_pane-box" v-if="pageUserID == userID">
              <statistic-echarts :option="histogramOption"></statistic-echarts>
              <statistic-echarts :option="pieChartOption"></statistic-echarts>
            </a-tab-pane>
          </a-tabs>
        </a-col>
        <a-col :span="8">
          <a-card class="record-box" title="个人成就" :bordered="false">
            <a-list class="record-list" item-layout="horizontal">
              <a-list-item>
                <a-icon type="eye" />
                <div class="lable">浏览数</div>
                <div class="number">{{ achievements.views || 0 }}</div>
              </a-list-item>
              <a-list-item>
                <a-icon type="heart" />
                <div class="lable">获得点赞数</div>
                <div class="number">{{ achievements.likes || 0 }}</div>
              </a-list-item>
              <a-list-item>
                <a-icon type="gold" />
                <div class="lable">藏品数</div>
                <div class="number">{{ achievements.collections || 0 }}</div>
              </a-list-item>
            </a-list>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getUserInfo, getPeopleObjcetList, userInfoAchievement } from '@/api/api'
import config from '@/config/index'
import { histogramOption, pieChartOption } from '@/config/echartsOptions'
import objectItem from '@/components/ObjectItem.vue'
import statisticEcharts from "@/components/StatisticEcharts.vue"
export default {
  name: "User",
  components: {
    objectItem,
    statisticEcharts
  },
  created() {
    const { id } = this.$route.params
    this.pageUserID = id
    if (id != this.userID) {
      this.getUserInfo()
    }
    this.getObjectListData(id)
    this.getAchievement(id)
  },
  data() {
    return {
      pageUserInfo: {},
      pageUserID: -1,
      objectListData: [],
      achievements: {},
      pieChartOption,
      histogramOption
    }
  },
  methods: {
    toUserSettingsPage() {
      this.$router.push({ path: '/user/settings/profile' })
    },
    getUserInfo() {
      getUserInfo({ userID: this.pageUserID }).then(res => {
        const { success, message, data } = res
        if (success) {
          data.avatarPath = config.baseImgUrl + data.avatarPath
          this.pageUserInfo = data
        } else {
          this.$message.error(message)
        }
      })
    },
    getObjectListData(userID) {
      getPeopleObjcetList({ userID }).then(res => {
        const { success, data } = res
        if (success) {
          this.objectListData = data.map(item => {
            item.isHome = false
            return item
          })
          const pieChartData = {
            unexchange: 0,
            inexchange: 0,
            exchangeed: 0
          }
          data.forEach(item => {
            pieChartData[item.status]++
          });
          const { unexchange, inexchange, exchangeed } = pieChartData
          this.pieChartOption.series[0].data = [
            { value: unexchange, name: '未交换' },
            { value: inexchange, name: '交换中' },
            { value: exchangeed, name: '交换完' },
          ]
        }
      })
    },
    getAchievement(userID) {
      userInfoAchievement({ userID }).then(res => {
        const { success, message, data } = res
        if (success) {
          this.achievements = data
          const seriesData = []
          seriesData.push(data.views)
          seriesData.push(data.likes)
          seriesData.push(data.collections)
          this.histogramOption.series[0].data = seriesData
        } else {
          this.$message.error(message)
        }
      })
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'userID']),
    userInfoShow() {
      return this.pageUserID == this.userID ? this.userInfo : this.pageUserInfo
    }
  }
}
</script>

<style lang="less" scoped>
.page {
  margin: 20px 50px;
}

.container {
  max-width: 1185px;
  padding: 12px;
  margin-right: auto;
  margin-left: auto;
}

.tabs-box {
  margin-top: 20px;
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

  /deep/ .ant-tabs-nav {
    width: 100%;
  }

  /deep/ .ant-tabs-nav>div {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .tab_pane-box {
    padding: 12px;
  }
}

.user-header-box {
  /deep/ .ant-card-body {
    align-items: center;
    display: flex;
    letter-spacing: normal;
    outline: none;
    position: relative;
    text-decoration: none;
  }

  .user-avatar {
    margin-right: 16px;
  }

  .user-content {
    display: flex;
    flex-wrap: wrap;
    flex: 1 1;
    overflow: hidden;
    flex-direction: column;
    line-height: 1.2;

    .title {
      font-size: 1.5rem;
      font-weight: 400;
    }

    .favour {
      margin: 8px 0 0 4px;
      font-size: 0.875rem;
    }
  }

  .user-action {
    margin-left: 16px;
  }
}

.record-box /deep/ .ant-card-head-title {
  font-weight: 500;
  font-size: 24px;
}

.record-list {
  font-size: 16px;

  .ant-list-item {
    justify-content: left;
  }

  .anticon {
    //list-item图标样式
    margin-right: 20px;
  }

  .lable {
    margin-right: 4px;
    width: 100px;
  }

  .number {
    font-weight: 700;
    font-size: 16px;
  }
}
</style>