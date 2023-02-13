<template>
  <div class="page">
    <div class="container">
      <div class="ww">
        <div class="ww_conversation">
          <div class="ww_user_panel">
            <a-icon type="message" />
            <span>聊天列表</span>
          </div>
          <div class="ww_conversation_list">
            <div :class="{
              'ww_conversation_item': true,
              'ww_conversation_active': index == currentIndex
            }" v-for="(item,index) in conversationList" :key="item.userID" @click="onConversation(index)">
              <a-icon class="close" type="close" @click="deleteConversation(item.userID)" />
              <a-avatar :size="40" icon="user" :src="item.avatarPath" class="item_avatar" />
              <div class="item_content">
                <div class="info">
                  <div class="user_name">{{ item.petName }}</div>
                  <div class="date">{{ item.date }}</div>
                </div>
                <div class="msg">{{ item.latterMsg }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="ww_container">
          <div class="ww_header">{{ currentpetName }}</div>
          <div class="ww_body">
            <div class="ww_message" v-if="currentChatRecord.length > 0" ref="msglist">
              <div :class="{
                'msg-item': true,
                'is-me': userID == item.form
              }" v-for="(item, index) in currentChatRecord" :key="index">
                <div class="item_avatar">
                  <a-avatar :size="40" :src="userID == item.form ? myAvatarPath : otherAvatarPath" icon="user" />
                </div>
                <div class="item_content">
                  <div class="time">{{`${item.date} ${item.time}`}}</div>
                  <div class="msg" v-if="item.type == 'message'">{{ item.content }}</div>
                  <div class="address" v-else>
                    <p>收货人：{{ item.content.consignee }}</p>
                    <p>所在地区：{{ item.content.location }}</p>
                    <p>详细地址：{{ item.content.detailedAddress }}</p>
                    <p>邮编：{{ item.content.postalCode }}</p>
                    <p>电话/手机：{{ item.content.phoneNumber }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="ww_message_empt" v-else>
              <span>您尚未选择联系人</span>
            </div>
            <div class="ww_input">
              <div class="row">
                <div class="action">
                  <a-icon type="environment" class="action_icon" @click="openDialog" />
                </div>
                <div class="tips">{{ textareaValue.length }}/500</div>
              </div>
              <div class="input-box">
                <a-textarea placeholder="请输入消息" :disabled="currentIndex == -1" :auto-size="{ minRows: 5, maxRows: 5 }"
                  class="textarea" v-model="textareaValue" />
              </div>
              <div class="row right">
                <a-button type="primary" @click="onSendMsg">
                  发送
                </a-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 邮寄地址弹窗 -->
    <div v-if="showDialog" role="document" class="dialog-box" style="z-index : 202">
      <div class="card-box">
        <div class="back_btn-box">
          <a-button class="btn btn-hover" icon="arrow-left" @click="handleClose"></a-button>
        </div>
        <a-card class="address-box" :bordered="false">
          <header class="address_header-box">
            <h3>请以下地址的其中一个</h3>
          </header>
          <a-table class="table-box" :columns="columns" :data-source="tableData" rowKey="ID" bordered>
            <span slot="default" slot-scope="text, record">
              <div class="default-col">
                <a-button type="primary" @click="onsendAdress(record)">
                  确定
                </a-button>
              </div>
            </span>
          </a-table>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { chatGetRetainMsg, chatSendMsg, getAddressList } from '@/api/api'
import config from '@/config/index';
export default {
  name: "Chat",
  data() {
    return {
      showDialog: false,
      columns: [
        {
          title: '收货人',
          dataIndex: 'consignee',
          width: '16%',
        },
        {
          title: '所在地区',
          dataIndex: 'location',
          width: '15%',
        },
        {
          title: '详细地址',
          dataIndex: 'detailedAddress',
          width: '29%',
        },
        {
          title: '邮编',
          dataIndex: 'postalCode',
          width: '10%',
        },
        {
          title: '电话/手机',
          dataIndex: 'phoneNumber',
          width: '15%',
        },
        {
          title: '',
          dataIndex: 'default',
          width: '15%',
          scopedSlots: { customRender: 'default' },
        },
      ],
      tableData: [],
      chatData: {
        conversationList: [],
        chatRecord: {}
      },
      currentChatRecord: [],
      currentpetName: '',
      otherAvatarPath: '',
      currentIndex: -1,
      textareaValue: ''
    }
  },
  created() {
    if (this.userID != undefined) {
      this.chatData = this.getlocalStorage(this.userID)
      this.getRetainMsg()
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.userID != undefined) {
        this.$socketApi.initWebSocket(this.globalCallback, this.userID, this)
        const { params } = this.$route
        if (Object.getOwnPropertyNames(params).length > 0) {
          this.fromContact()
        }
      }
    })
  },
  methods: {
    ...mapMutations(['noEventsUpdate']),
    getNowDate(date) {
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const hours = date.getHours()
      const minutes = date.getMinutes()
      const seconds = date.getSeconds()
      return {
        date: `${year}/${month}/${day}`,
        time: `${hours}:${minutes}:${seconds}`
      }
    },
    scrollTOBottom() {// 使滚动条到底部
      this.$nextTick(() => {
        const msglist = this.$refs.msglist;
        msglist.scrollTo({ top: msglist.scrollHeight, behavior: 'smooth' });
      })
    },
    globalCallback(data, that) {
      const { form, date, content, timeStamp, type } = data
      let current = -1
      for (let i = 0; i < that.conversationList.length; i++) {
        if (that.conversationList[i].userID == form) {
          current = i
          break;
        }
      }
      that.conversationList[current].date = date
      that.conversationList[current].latterMsg = type == 'message' ? content : '[邮寄地址]'
      that.chatRecord[form].push(data)
      that.scrollTOBottom()
      that.setlocalStorage(that.userID, that.chatData)
      this.$socketApi.sendSock({
        data: { timeStamp },
        type: 'message'
      })
    },
    webSocketOnMessage(data) {
      chatSendMsg(data).then(res => {
        const { message } = res
        this.$message.info(message)
        this.setlocalStorage(this.userID, this.chatData)
      })
    },
    onSendMsg() {
      if (this.textareaValue == '') {
        this.$message.info('发送消息不能空')
        return false
      }
      const { userID: to } = this.conversationList[this.currentIndex]
      const nowDate = this.getNowDate(new Date())
      const msgObj = {
        to,
        form: this.userID,
        content: this.textareaValue,
        date: nowDate.date,
        time: nowDate.time,
        type: 'message'
      }
      this.webSocketOnMessage(msgObj)
      this.chatRecord[to].push(msgObj)
      this.scrollTOBottom()
      this.textareaValue = ''
    },
    getRetainMsg() {
      chatGetRetainMsg({ userID: this.userID }).then(res => {
        res.data.forEach(item => {
          const { form, date, avatarPath, petName, content } = item
          let current = -1
          for (let i = 0; i < this.conversationList.length; i++) {
            if (this.conversationList[i].userID == form) {
              current = i
              break;
            }
          }
          if (current == -1) {
            // 新会话
            this.conversationList.push({
              userID: form,
              petName,
              avatarPath: config.baseImgUrl + avatarPath,
              date,
              latterMsg: content
            })
            this.chatRecord[form] = [item]
          } else {
            this.conversationList[current].date = date
            this.conversationList[current].avatarPath = config.baseImgUrl + avatarPath
            this.conversationList[current].latterMsg = content
            this.chatRecord[form].push(item)
          }
          this.scrollTOBottom()
        });
        this.setlocalStorage(this.userID, this.chatData)
      })
    },
    openDialog() {
      if (this.currentIndex == -1) {
        this.$message.info('未选择联系人！')
        return false
      }
      this.showDialog = true
      this.noEventsUpdate(true)
      getAddressList({ userID: this.userID }).then(res => {
        const { success, data, message } = res
        if (success) {
          this.tableData = data
        } else {
          this.$message.error(message)
        }
      })
    },
    handleClose() {
      this.showDialog = false
      this.noEventsUpdate(false)
    },
    deleteConversation(userID) {
      const { conversationList } = this.chatData
      this.chatData.conversationList = conversationList.filter(item => item.userID != userID)
      this.chatData.chatRecord[userID] = []
      this.currentChatRecord = []
      this.currentpetName = ''
      this.setlocalStorage(this.userID, this.chatData)
    },
    onConversation(index) {
      const current = this.conversationList[index]
      const { userID, petName, avatarPath } = current
      this.currentChatRecord = this.chatRecord[userID]
      this.scrollTOBottom()
      this.currentpetName = petName
      this.otherAvatarPath = avatarPath
      this.currentIndex = index
    },
    fromContact() {
      const { avatarPath, petName, userID } = this.$route.params
      let current = -1
      for (let i = 0; i < this.conversationList.length; i++) {
        if (this.conversationList[i].userID == userID) {
          current = i
          break;
        }
      }
      const nowDate = this.getNowDate(new Date())
      const msgItem = {
        to: userID,
        form: this.userID,
        content: '你好',
        date: nowDate.date,
        time: nowDate.time,
        type: 'message'
      }
      if (current == -1) {
        // 新建立会话
        this.conversationList.push({
          userID,
          petName,
          avatarPath: config.baseImgUrl + avatarPath,
          date: nowDate.date,
          latterMsg: ''
        })
        this.chatRecord[userID] = [msgItem]
      } else {
        this.conversationList[current].avatarPath = config.baseImgUrl + avatarPath
        this.chatRecord[userID].push(msgItem)
      }
      this.scrollTOBottom()
      this.webSocketOnMessage(msgItem)
      this.currentpetName = petName
      this.currentChatRecord = this.chatRecord[userID]
      this.otherAvatarPath = config.baseImgUrl + avatarPath
      this.currentIndex = this.conversationList.length - 1
    },
    onsendAdress(row) {
      const { userID: to } = this.conversationList[this.currentIndex]
      const nowDate = this.getNowDate(new Date())
      const msgObj = {
        to,
        form: this.userID,
        content: { ...row },
        date: nowDate.date,
        time: nowDate.time,
        type: 'address'
      }
      this.webSocketOnMessage(msgObj)
      this.chatRecord[to].push(msgObj)
      this.scrollTOBottom()
      this.handleClose()
    },
    // localStorage
    setlocalStorage(userID, data) {
      localStorage.setItem(`userID${userID}`, JSON.stringify(data))
    },
    getlocalStorage(userID) {
      let res = localStorage.getItem(`userID${userID}`)
      res = res ? JSON.parse(res) : { conversationList: [], chatRecord: {} }
      return res;
    },
  },
  computed: {
    ...mapGetters(['userID', 'userInfo']),
    conversationList() {
      return this.chatData.conversationList
    },
    chatRecord() {
      return this.chatData.chatRecord
    },
    myAvatarPath() {
      return this.userInfo.avatarPath
    }
  },
  beforeDestroy() {
    this.$socketApi.closeWebSocket()
  }
}
</script>

<style lang="less" scoped>
.container {
  padding-top: 10vh;

}

.ww {
  margin-left: auto;
  margin-right: auto;
  background: #fff;
  width: 40vw;
  min-width: 945px;
  height: 60vh;
  min-height: 400px;
  padding: 12px;
  border-radius: 10px;
  display: flex;
}

.ww_conversation {
  width: 30%;
  display: flex;
  flex-direction: column;

  .ww_user_panel {
    margin-bottom: 10px;
    font-weight: 700;

    span {
      display: inline-block;
      margin-left: 5px;
      font-size: 12px;
    }

  }

  .ww_conversation_list {
    flex: 1 1;
    overflow-x: hidden;
    overflow-y: auto;
  }
}

.ww_conversation_item {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 0;
  position: relative;
  cursor: pointer;

  .close {
    position: absolute;
    left: 0px;
    display: none;
  }

  .item_avatar {
    margin: 0 14px;
    flex-shrink: 0;
  }

  .item_content {
    display: flex;
    flex-direction: column;

    .info {
      display: flex;
      justify-content: space-between;
    }

    .user_name {
      font-weight: 700;
      width: 6vw;
    }

    .msg {
      width: 11vw;
      height: 18px;
    }

    .msg,
    .date {
      font-size: 12px;
      color: #999;
    }

    .user_name,
    .msg {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}

.ww_conversation_active {
  background: #e4e5e6;
}

.ww_conversation_item:hover {
  background: #e4e5e6;

  .close {
    display: inline-block;
  }
}

.ww_container {
  flex: 1 1;
  display: flex;
  flex-direction: column;
  padding: 0 12px;

  .ww_header {
    height: 3vh;
    font-size: 18px;
    padding-bottom: 5px;
    border-bottom: 1px solid #000;
  }

  .ww_body {
    flex: 1 1;
    display: flex;
    flex-direction: column;
  }
}

.ww_message {
  flex: 1 1;
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 33vh;
  margin: 12px 0;
}

.ww_message_empt {
  flex: 1 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.msg-item {
  display: flex;
  margin-bottom: 10px;

  .item_avatar {
    width: 40px;
    margin-right: 12px;
  }

  .time {
    display: flex;
    font-size: 12px;
    margin-bottom: 12px;
    color: #999;
  }

  .msg,
  .address {
    padding: 10px 8px;
    background: #1890ff;
    color: #fff;
    border-radius: 8px;
  }
}

.is-me {
  flex-direction: row-reverse;

  .item_avatar {
    margin-left: 12px;
    margin-right: 0;
  }

  .time {
    flex-direction: row-reverse;
  }
}

.ww_input {
  height: 200px;
  border-top: 1px solid #000;
  display: flex;
  flex-direction: column;

  .row {
    height: 40px;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;

    .action_icon {
      cursor: pointer;
      font-size: 25px;
      color: #999;
    }
  }

  .input-box {
    flex: 1 1;

    .textarea {
      border: none;
    }

    .textarea:focus {
      border-color: #fff;
      border-right-width: o !important;
      outline: 0;
      box-shadow: none;
    }
  }

  .right {
    justify-content: flex-end;
  }
}

.btn {
  height: 36px;
  min-width: 64px;
  padding: 0 16px;
  border: none;
  font-size: 20px;
  box-shadow: none;
}

.btn-hover:hover {
  background: #1890ff;
  color: #fff !important;
}

.card-box {
  width: 700px;
  background: #fff;
  z-index: inherit;
  box-shadow: 0 11px 15px -7px rgb(0 0 0 / 20%), 0 24px 38px 3px rgb(0 0 0 / 14%), 0 9px 46px 8px rgb(0 0 0 / 12%);
  border-radius: 4px;
  margin: 24px;
  overflow-y: auto;
  pointer-events: auto;
  transform-origin: center center;
}

.back_btn-box {
  padding: 8px 6px 0;
}
</style>