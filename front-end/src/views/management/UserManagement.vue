<template>
  <div class="page">
    <div class="query-box">
      <a-input-search placeholder="输入用户名进行查询" style="width: 20vw" enter-button @search="onSearch" />
    </div>
    <a-table class="table-box" :columns="columns" :data-source="tableData" rowKey="userID" bordered>
      <span slot="avatarPath" slot-scope="text">
        <a-avatar :size="45" icon="user" :src="text" />
      </span>
      <span slot="status" slot-scope="text, record">
        <a-select :default-value="text" style="width: 120px" @change="handleChange($event, record)">
          <a-select-option value="user">
            正常用户
          </a-select-option>
          <a-select-option value="ban">
            封禁用户
          </a-select-option>
        </a-select>
      </span>
    </a-table>
  </div>
</template>

<script>
import { getuserinfos, statusedit } from '@/api/api'
import config from '@/config/index';
export default {
  name: 'UserManagement',
  data() {
    return {
      tableData: [],
      columns: [
        {
          title: '头像',
          dataIndex: 'avatarPath',
          width: '10%',
          scopedSlots: { customRender: 'avatarPath' },
        },
        {
          title: '用户名',
          dataIndex: 'petName',
          width: '15%',
        },
        {
          title: '性别',
          dataIndex: 'gender',
          width: '10%',
        },
        {
          title: '生日',
          dataIndex: 'birthday',
          width: '20%',
        },
        {
          title: '电话',
          dataIndex: 'telephone',
          width: '20%',
        },
        {
          title: '用户状态',
          dataIndex: 'status',
          width: '25%',
          scopedSlots: { customRender: 'status' },
        },
      ],
      queryKey: ''
    }
  },
  created() {
    this.getTableData('')
  },
  methods: {
    async onSearch(value) {
      this.queryKey = value
      const message = await this.getTableData(value)
      this.$message.info(message)
    },
    async getTableData(key) {
      return await getuserinfos({ key }).then(res => {
        const { success, data, message } = res
        if (success) {
          this.tableData = data.map(item => {
            const { avatarPath } = item
            if (avatarPath != '') {
              item.avatarPath = config.baseImgUrl + avatarPath
            }
            return item
          })
        }
        return message
      })
    },
    handleChange(value, record) {
      statusedit({
        status: value,
        userID: record.userID
      }).then(res => {
        const { message, success } = res
        if(success) {
          this.getTableData(this.queryKey)
        }
        this.$message.info(message)
      })
    }
  }
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
}
</style>