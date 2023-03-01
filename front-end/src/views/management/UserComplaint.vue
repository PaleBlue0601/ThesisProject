<template>
  <div class="page">
    <div class="query-box">
      <a-input-search placeholder="输入用户名进行查询" style="width: 20vw" enter-button @search="onSearch" />
      <div class="right">
        <a-popconfirm title="是否删除全部举报记录?" ok-text="确定" cancel-text="取消" @confirm="deleteAllConfirm($event, tableData)">
          <a-button type="primary">
            删除全部
          </a-button>
        </a-popconfirm>
      </div>
    </div>
    <a-table class="table-box" :columns="columns" :data-source="tableData" rowKey="id" bordered>
      <span slot="oparate" slot-scope="text, record">
        <div class="operation-box">
          <a @click="onlook(record)">查看</a>
          <span style="margin: 0 5px;">|</span>
          <a-popconfirm title="是否删除此条举报?" ok-text="确定" cancel-text="取消" @confirm="deleteConfirm($event, record)">
            <a>删除</a>
          </a-popconfirm>
        </div>
      </span>
    </a-table>
    <!-- 查看内容详情弹窗 -->
    <div v-if="showDialog" role="document" class="dialog-box" style="z-index : 202">
      <div class="card-box">
        <div class="back_btn-box">
          <a-button class="btn btn-hover" icon="arrow-left" @click="handleClose"></a-button>
        </div>
        <a-card class="obj-box" :bordered="false">
          <header class="obj_header-box">
            <div style="display: flex; justify-content: space-between;margin-bottom: 12px;">
              <div><span>举报人：</span>{{ dialogInfo.complainant }}</div>
              <div><span>被举报人：</span>{{ dialogInfo.defendant }}</div>
            </div>
            <div style="margin-bottom: 12px;"><span>举报时间：</span>{{ dialogInfo.date }}</div>
          </header>
          <div class="content-box">
            <span>举报内容：</span>
            <p>{{ dialogInfo.content }}</p>
          </div>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { getComplains, deleteComplain } from "@/api/api";
export default {
  name: 'UserComplaint',
  data() {
    return {
      tableData: [],
      columns: [
        {
          title: '举报人',
          dataIndex: 'complainant',
          width: '15%',
        },
        {
          title: '被举报人',
          dataIndex: 'defendant',
          width: '15%',
        },
        {
          title: '内容',
          dataIndex: 'content',
          width: '40%',
          ellipsis: true,
        },
        {
          title: '时间',
          dataIndex: 'date',
          width: '20%',
        },
        {
          title: '操作',
          dataIndex: 'oparate',
          width: '10%',
          scopedSlots: { customRender: 'oparate' },
        },
      ],
      queryKey: '',
      showDialog: false,
      dialogInfo: {
        complainant: '',
        defendant: '',
        date: '',
        content: ''
      }
    }
  },
  created() {
    this.getTableData('')
  },
  methods: {
    ...mapMutations(['noEventsUpdate']),
    async onSearch(value) {
      this.queryKey = value
      const message = await this.getTableData(value)
      this.$message.info(message)
    },
    async getTableData(key) {
      return await getComplains({ key }).then(res => {
        const { success, data, message } = res
        if (success) {
          this.tableData = data
        }
        return message
      })
    },
    onlook(record) {
      this.showDialog = true
      this.noEventsUpdate(true)
      this.dialogInfo = { ...record }
    },
    deleteConfirm(e, record) {
      this.delete([record.id])
    },
    deleteAllConfirm(e, data) {
      const ids = data.map(item => {
        return item.id
      })
      this.delete(ids)
    },
    delete(ids) {
      deleteComplain({ ids }).then(res => {
        const { message, success } = res
        if(success) {
          this.getTableData(this.queryKey)
        }
        this.$message.info(message)
      })
    },
    handleClose() {
      this.showDialog = false
      this.noEventsUpdate(false)
    },
  },
}
</script>

<style lang="less" scoped>
.page {
  max-width: 1185px;
  margin-right: auto;
  margin-left: auto;
  background: #fff;
  padding: 20px;
}

.query-box {
  margin-bottom: 20px;
  position: relative;

  .right {
    float: right;
  }
}

.obj_header-box span {
  font-weight: bold;
}

.content-box {
  span {
    font-weight: bold;
  }

  p {
    margin-top: 5px;
    border: 2px solid #ccc;
    padding: 8px 6px;
    border-radius: 5px;
  }
}
</style>