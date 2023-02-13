<template>
  <div class="page">
    <div class="container">
      <a-tabs type="card" class="tabs-box" default-active-key="pending" @change="tabChangeCallback">
        <a-tab-pane key="pending" tab="待处理"></a-tab-pane>
        <a-tab-pane key="success" tab="已完成"></a-tab-pane>
      </a-tabs>
      <div class="content-list">
        <a-list :grid="{ gutter: 48, column: 2 }" :data-source="listData">
          <a-list-item slot="renderItem" slot-scope="item">
            <div class="item-box">
              <a-row type="flex" justify="space-around" align="middle">
                <a-col :span="10">
                  <h2>申请方</h2>
                  <object-item :object-info="item.applicantObejctInfo"></object-item>
                </a-col>
                <a-col :span="4" style="text-align: center;">
                  <a-icon type="swap" style="font-size: 3em;" />
                </a-col>
                <a-col :span="10">
                  <h2>处理方</h2>
                  <object-item :object-info="item.respondentObejctInfo"></object-item>
                </a-col>
              </a-row>
              <hr />
              <div class="item_acting-box">
                <template v-if="item.respondentObejctInfo.userID == userID && status == 'pending'">
                  <a-button type="primary" class="btn" @click="onAgreeExhange(item.id)">
                    同意
                  </a-button>
                  <a-button class="btn" @click="onCancelExhange(item.id)">
                    取消
                  </a-button>
                </template>
                <a-button type="primary" class="btn" @click="onCancelExhange(item.id)"
                  v-if="item.applicantObejctInfo.userID == userID && status == 'pending'">
                  取消申请
                </a-button>
                <a-button type="primary" class="btn" v-if="item.status !== 'pending'" @click="onDelete(item.id)">
                  删除记录
                </a-button>
                <a-button class="btn" @click="contactOther(item)">
                  联系对方
                </a-button>
              </div>
            </div>
          </a-list-item>
        </a-list>
      </div>
    </div>
  </div>
</template>

<script>
import objectItem from '@/components/ObjectItem.vue'
import { mapGetters } from 'vuex'
import {
  objectExchangeGetListData,
  agreeExhange,
  cancelExhange,
  objectexchangeDelete
} from '@/api/api'
export default {
  name: 'ObjectExchange',
  components: {
    objectItem
  },
  created() {
    if (this.userID !== null) {
      this.getListData()
    }
  },
  data() {
    return {
      pendingListData: [],
      noneListData: [],
      status: 'pending'
    }
  },
  methods: {
    tabChangeCallback(key) {
      this.status = key
      this.getListData()
    },
    getListData() {
      const { userID } = this
      objectExchangeGetListData({
        status: this.status,
        userID
      }).then(res => {
        const { success, data } = res
        if (success) {
          const filterData = data.filter(item => item.noneUserID != userID)
          this.status === 'pending' ? this.pendingListData = filterData : this.noneListData = filterData
        }
      })
    },
    onAgreeExhange(id) {
      agreeExhange({ id }).then(res => {
        const { success, message } = res
        if (success) {
          this.$message.info(message)
          this.getListData()
        }
      })
    },
    onCancelExhange(id) {
      cancelExhange({ id }).then(res => {
        const { success, message } = res
        if (success) {
          this.$message.info(message)
          this.getListData()
        }
      })
    },
    onDelete(id) {
      objectexchangeDelete({ id, userID: this.userID }).then(res => {
        const { success, message } = res
        if (success) {
          this.$message.info(message)
          this.getListData()
        }
      })
    },
    contactOther(row) {
      let res = {}
      if (row.applicantObejctInfo.userID == this.userID) {
        res = row.respondentObejctInfo
      } else {
        res = row.applicantObejctInfo
      }
      const { avatarPath, petName, userID } = res
      this.$router.push({
        name: `chat`,
        params: {
          avatarPath,
          petName,
          userID
        }
      })
    }
  },
  computed: {
    ...mapGetters(['userID']),
    listData() {
      const { status, pendingListData, noneListData } = this
      return status === 'pending' ? pendingListData : noneListData
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  max-width: 1185px;
  width: 100%;
  padding: 12px;
  margin-right: auto;
  margin-left: auto;
}

.content-list {
  padding: 12px;
  background: #fff;
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
}

.item-box {
  h2 {
    text-align: center;
  }

  hr {
    margin: 20px 0;
  }

  .btn {
    margin-right: 10px;
  }
}
</style>