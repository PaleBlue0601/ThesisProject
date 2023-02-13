<template>
  <a-card hoverable>
    <img slot="cover" alt="藏品图片" :src="imgSrc" @click="toObjectDetail" />
    <a-card-meta>
      <template slot="title">
        <div class="title-box">
          <span>{{ objectInfo.objectName }}</span>
          <span class="views"><a-icon type="eye" />{{ objectInfo.views || 0 }}</span>
        </div>
      </template>
      <template slot="description">
        <div class="user-box" v-if="objectInfo.isHome" @click="toUserPage">
          <a-avatar :size="30" :src="avatarSrc" />
          <span class="user-name">{{ objectInfo.petName }}</span>
        </div>
        <div class="status-box">
          {{ statusMap[objectInfo.status] }}
        </div>
      </template>
    </a-card-meta>
  </a-card>
</template>

<script>
import config from '@/config/index'
export default {
  name: 'ObjectItem',
  props: {
    objectInfo: {
      type: Object,
      default: function () {
        return {
          objectPic: '',
          objectName: '',
          avatarPath: '',
          petName: '',
          isHome: true
        }
      }
    }
  },
  data() {
    return {
      statusMap: {
        'unexchange': '',
        'inexchange': '交换中',
        'exchangeed': '交换完'
      }
    }
  },
  methods: {
    toObjectDetail() {
      const { objectID } = this.objectInfo
      this.$router.push({
        path: `/objectdetail/${objectID}`
      })
    },
    toUserPage() {
      this.$router.push({
        path: `/user/${this.objectInfo.userID}`
      })
    }
  },
  computed: {
    avatarSrc() {
      const { avatarPath } = this.objectInfo
      return avatarPath !== null ? config.baseImgUrl + avatarPath : ''
    },
    imgSrc() {
      const { objectPic } = this.objectInfo
      return objectPic !== null ? config.baseImgUrl + objectPic : ''
    }
  }
}
</script>

<style lang="less" scoped>
.user-box {
  display: flex;

  .user-name {
    display: inline-block;
    margin-left: 7px;
    line-height: 30px;
  }
}

.status-box {
  text-align: center;
  font-size: 16px;
}

.title-box {
  display: flex;
  justify-content: space-between;
}

.views {
  color: #ccc;
  .anticon {
    margin-right: 5px;
  }
}
</style>