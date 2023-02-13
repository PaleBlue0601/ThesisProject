<template>
  <div class="page">
    <!-- 搜索 -->
    <header class="acting-box">
      <h2>搜索</h2>
      <a-input-search class="input-search" placeholder="请输入关键词..." enter-button size="large" @search="onSearch" />
    </header>
    <!-- 藏品列表 -->
    <div class="content-box">
      <a-list :grid="{ gutter: 16, column: 4 }" :data-source="listData">
        <a-list-item class="list_item-box" slot="renderItem" slot-scope="item" v-if="item.status == 'unexchange'">
          <object-item :object-info="item"></object-item>
        </a-list-item>
      </a-list>
    </div>
  </div>
</template>

<script>
import objectItem from '@/components/ObjectItem.vue'
import { mapGetters } from 'vuex'
import { search, getHomeListData } from '@/api/api'
export default {
  name: "Home",
  components: {
    objectItem
  },
  data() {
    return {
      listData: []
    }
  },
  created() {
    this.onSearch('')
  },
  methods: {
    onSearch(value) {
      if (this.userID !== null) {
        search({
          userID: this.userID || -1,
          key: value
        }).then(res => {
          const { success, data } = res
          if (success) {
            data.map(item => {
              item.isHome = true
              return item
            })
            this.listData = data
          }
        })
      } else {
        getHomeListData({ key: value }).then(res => {
          const { success, data } = res
          if (success) {
            data.map(item => {
              item.isHome = true
              return item
            })
          }
          this.listData = data
        })
      }
    },
    getListData() {

    },
  },
  computed: {
    ...mapGetters(['userID'])
  }
}
</script>

<style lang="less" scoped>
.acting-box {
  background: #fff;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;

  .input-search {
    width: 50%;
    position: relative;
    right: 25%;
  }
}

.content-box {
  margin-top: 20px;
  padding: 10px 20px;
}

.list_item-box {
  min-height: 500px;
}
</style>