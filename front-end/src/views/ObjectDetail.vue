<template>
  <div class="page">
    <div class="container">
      <header class="header-box">
        <h1 class="title">
          {{ objectInfo.objectName }}
        </h1>
        <div class="user-box">
          <div class="avatar">
            <a-avatar :src="avatarSrc" :size="40" @click="toUserPage" />
          </div>
          <div class="info">
            <span class="name">{{ userInfo.petName }}</span>
            <span class="date">{{ objectInfo.modifyDate }}</span>
          </div>
          <div class="acting">
            <span class="views"><a-icon type="eye" />{{ objectInfo.views || 0 }}</span>
            <span :class="likeClass" @click="giveLikes"><a-icon type="like" />{{ objectInfo.likes || 0 }}</span>
          </div>
        </div>
      </header>
      <p class="describe-box">{{ objectInfo.objectDescribe }}</p>
      <img class="img-box" slot="cover" alt="藏品图片" :src="imgSrc" />
      <hr />
      <div class="acting-box">
        <template v-if="objectInfo.status === 'unexchange' && objectInfo.userID != userID">
          <a-button type="primary" style="margin-right: 10px" @click="handleOpenDialog">
            申请交换
          </a-button>
          <a-button @click="contactOther">
            联系对方
          </a-button>
        </template>
        <a-button disabled v-else>
          {{ statusText }}
        </a-button>
      </div>
    </div>
    <!-- 选择自己藏品弹窗 -->
    <div v-if="showDialog" role="document" class="dialog-box" style="z-index : 202">
      <div class="card-box">
        <div class="back_btn-box">
          <a-button class="btn btn-hover" icon="arrow-left" @click="handleClose"></a-button>
        </div>
        <a-card class="obj-box" :bordered="false">
          <header class="obj_header-box">
            <h3>请选择需要交换的藏品</h3>
          </header>
          <div class="list-box">
            <a-radio-group @change="onRadioChange">
              <a-list :grid="{ gutter: 16, column: 4 }" :data-source="listData">
                <a-list-item slot="renderItem" slot-scope="item" v-if="item.status === 'unexchange'">
                  <div class="check-box">
                    <a-radio :value="item.objectID"></a-radio>
                  </div>
                  <object-item :object-info="item" class="no-events"></object-item>
                </a-list-item>
              </a-list>
            </a-radio-group>
          </div>
          <div class="btn-box">
            <a-button type="primary" style="margin-right: 10px" @click="onExchange">
              确定
            </a-button>
            <a-button @click="handleClose">
              取消
            </a-button>
          </div>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import objectItem from '@/components/ObjectItem.vue'
import {
  getoObjectInfo,
  getUserInfo,
  objectDetailView,
  objectDetailLikes,
  objectDetailChecklike,
  getPeopleObjcetList,
  objectDetailExchange
} from '@/api/api'
import config from '../config/index';
export default {
  name: 'ObjectDetail',
  components: {
    objectItem
  },
  created() {
    this.getobjectInfo()
  },
  data() {
    return {
      objectInfo: {
        objectPic: null
      },
      userInfo: {
        avatarPath: null
      },
      showDialog: false,
      listData: [],
      likeClass: {
        likes: true,
        active: false
      },
      alObjectID: -1
    }
  },
  methods: {
    ...mapMutations(['noEventsUpdate']),
    async getobjectInfo() {
      const { id } = this.$route.params
      const objectRes = await getoObjectInfo({ objectID: id })
      const { success: objectSuccess, data: objectData } = objectRes
      if (objectSuccess) {
        const { userID } = objectData[0]
        const userRes = await getUserInfo({ userID })
        const { success: userSuccess, data: userData } = userRes
        if (userSuccess) {
          this.objectInfo = objectData[0]
          this.userInfo = userData
          this.increaseViews()
          if (this.userID !== undefined) this.checkLikes({ userID: this.userID, objectID: id })
        } else {
          this.$message.error('用户信息获取失败')
        }
      } else {
        this.$message.error('藏品信息获取失败')
      }
    },
    handleOpenDialog() {
      if (this.userID === undefined) {
        this.$message.info('请先登录')
        return false
      } else if(this.userInfo.status == 'ban') {
        this.$message.warning('对方账号封禁中')
        return false
      }
      this.showDialog = true
      this.noEventsUpdate(true)
      getPeopleObjcetList({ userID: this.userID }).then(res => {
        this.listData = res.data
      })
    },
    handleClose() {
      this.showDialog = false
      this.noEventsUpdate(false)
    },
    increaseViews() {
      const { objectID } = this.objectInfo
      let views = this.objectInfo.views || 0
      objectDetailView({
        views: views + 1,
        objectID
      }).then(res => {
        const { success, message, data: { newViews } } = res
        if (success) {
          this.objectInfo.views = newViews
        } else {
          this.$message.error(message)
        }
      })
    },
    giveLikes() {
      if (this.userID == undefined) {
        this.$message.info('请先登录')
        return false
      }
      let likes = this.objectInfo.likes || 0
      const { objectID } = this.objectInfo
      const { active } = this.likeClass
      const whether = active ? 'no' : 'yes'
      likes = active ? --likes : ++likes
      objectDetailLikes({ objectID, userID: this.userID, whether, likes }).then(res => {
        const { success, message, data: { newLikes } } = res
        if (success) {
          this.objectInfo.likes = newLikes
          this.likeClass.active = !active
        } else {
          this.$message.error(message)
        }
      })
    },
    checkLikes(data) {
      objectDetailChecklike(data).then(res => {
        const { data: { whether } } = res
        this.likeClass.active = whether === 'yes' ? true : false;
      })
    },
    onRadioChange(e) {
      this.alObjectID = e.target.value
    },
    onExchange() {
      if (this.alObjectID === -1) {
        this.$message.info('请选择交换的藏品')
        return false
      }
      const { objectID: rsObjectID, userID: rsUserID } = this.objectInfo
      objectDetailExchange({
        rsObjectID,
        rsUserID,
        alObjectID: this.alObjectID,
        alUserID: this.userID
      }).then(res => {
        const { success, message } = res
        if (success) {
          this.$router.push({
            path: '/objectexchange'
          })
        }
        this.$message.info(message)
      })
    },
    toUserPage() {
      this.$router.push({
        path: `/user/${this.userInfo.userID}`
      })
    },
    contactOther() {// 联系对方
      if (this.userID == undefined) {
        this.$message.info('请先登录')
        return false
      } else if(this.userInfo.status == 'ban') {
        this.$message.warning('对方账号封禁中')
        return false
      }
      const { avatarPath, petName, userID } = this.userInfo
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
    avatarSrc() {
      const { avatarPath } = this.userInfo
      if (avatarPath !== null) {
        return config.baseImgUrl + avatarPath
      } else {
        return ''
      }
    },
    imgSrc() {
      const { objectPic } = this.objectInfo
      if (objectPic !== null) {
        return config.baseImgUrl + objectPic
      } else {
        return ''
      }
    },
    statusText() {
      const { status } = this.objectInfo
      const statusMapText = {
        'unexchange': '未交换',
        'inexchange': '交换中',
        'exchangeed': '交换完毕'
      }
      return statusMapText[status]
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  max-width: 985px;
  padding: 12px 30px;
  margin-right: auto;
  margin-left: auto;
  background: #fff;
}

.header-box {
  .title {
    font-size: 2.5em;
    margin: 0 0 30px;
    font-weight: 400;
  }
}

.user-box {
  display: flex;
  margin-bottom: 20px;

  .avatar {
    cursor: pointer;
  }

  .info {
    flex: 1 1;
    display: flex;
    flex-direction: column;
    margin-left: 12px;

    .name {
      font-weight: 700;
      font-size: 16px;
    }

    .date {
      font-size: 13px;
    }
  }
}

.user-box .acting {
  display: flex;
  align-content: center;
  flex-wrap: wrap;
  font-size: 18px;
  cursor: pointer;

  span {
    padding: 10px 12px;
    border-radius: 5px;
    display: inline-block;
  }

  span:hover {
    background: #f0f2f5;
  }

  .active {
    color: #ff000078;
  }

  .active:hover {
    background: #ff000040;
  }

  .anticon {
    margin-right: 10px;
  }
}

.describe-box {
  font-size: 16px;
  line-height: 30px;
  font-weight: 500;
  text-indent: 2em;
}

hr {
  margin: 20px 0;
}

.card-box {
  max-width: 985px;
  max-height: 80vh;
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
}

.obj_header-box h3 {
  color: #999;
  margin-bottom: 12px;
}

.check-box {
  position: absolute;
  z-index: 999;
  padding: 5px 10px;
}

.img-box {
  max-width: 925px;
}
</style>