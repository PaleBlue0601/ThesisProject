<template>
  <a-card class="card-box" title="个人资料" :bordered="false">
    <div class="list-item">
      <div class="labe">头像</div>
      <div class="content">
        <a-avatar class="avatar" :size="45" icon="user" :src="userInfo.avatarPath" />
        <span>支持 jpg、png、gif 格式大小 5M 以内的图片</span>
      </div>
      <div class="action">
        <a-upload name="file" :max-count="1" :beforeUpload="beforeUpload" :customRequest="triggerUpload"
          accept="image/*" :disabled="btnLoading">
          <a-button type="primary" :loading="btnLoading">
            点击上传
          </a-button>
        </a-upload>
      </div>
    </div>
    <div class="list-item" ref="list" v-for="(item, index) in form.list" :key="item.ref">
      <div class="labe">{{ item.labe }}</div>
      <div class="content">
        <a-input v-if="item.isEdit && item.fieldName != 'gender' && item.fieldName != 'birthday'"
          :placeholder="item.placeholder" v-model="item.value" />
        <a-select v-if="item.isEdit && item.fieldName == 'gender'" :placeholder="item.placeholder"
          @change="genderChange">
          <a-select-option value="男">
            男
          </a-select-option>
          <a-select-option value="女">
            女
          </a-select-option>
        </a-select>
        <a-date-picker v-if="item.isEdit && item.fieldName == 'birthday'" :placeholder="item.placeholder"
          @change="dateChange" />
        <div v-show="!item.isEdit" class="text">{{ item.value || item.placeholder }}</div>
      </div>
      <div class="action">
        <a-button v-show="!item.isEdit" type="primary" icon="edit" @click="handleEdit(index, true)"></a-button>
        <div v-show="item.isEdit" class="btns-box">
          <a-button size="small" type="primary" @click="onServe(index)">保存</a-button>
          <a-button size="small" @click="handleEdit(index, false)">取消</a-button>
        </div>
      </div>
    </div>
  </a-card>
</template>

<script>
import { fileUpload, updateUserInfo } from '@/api/api'
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'Profile',
  data() {
    return {
      inputDisabled: true,
      form: {
        list: [
          {
            labe: '昵称',
            isEdit: false,
            placeholder: '请输入用户名',
            value: '',
            oldValue: '',
            fieldName: 'petName'
          },
          {
            labe: '性别',
            isEdit: false,
            placeholder: '请选择性别',
            value: '',
            oldValue: '',
            fieldName: 'gender'
          },
          {
            labe: '生日',
            isEdit: false,
            placeholder: '请选择生日',
            value: '',
            oldValue: '',
            fieldName: 'birthday'
          },
          {
            labe: '电话',
            isEdit: false,
            placeholder: '请输入电话',
            value: '',
            oldValue: '',
            fieldName: 'telephone'
          },
          {
            labe: '邮箱',
            isEdit: false,
            placeholder: '请输入邮箱',
            value: '',
            oldValue: '',
            fieldName: 'mailbox'
          },
        ]
      },
      btnLoading: false,
    }
  },
  created() {
    if (this.userID !== undefined) {
      this.form.list.map(item => {
        const { fieldName } = item
        item.value = this.userInfo[fieldName]
        return item
      })
    }
  },
  methods: {
    ...mapMutations(['userInfoUpdate']),
    handleEdit(index, data) {
      let listItem = this.form.list[index]
      listItem.isEdit = data
      let { isEdit, value, oldValue, fieldName } = listItem
      if (isEdit) {
        listItem.oldValue = value
        this.form.list.map((item, n) => {
          item.isEdit = n === index ? item.isEdit : false
          return item
        })
        if (fieldName !== 'gender' && fieldName !== 'birthday') {
          this.$nextTick(() => {
            let refInput = this.$refs.list[index].childNodes[1].childNodes[0]
            refInput.focus()
          })
        }
      } else {
        listItem.value = oldValue
      }
    },
    genderChange(value) {
      this.form.list[1].value = value
    },
    dateChange(date, dateString) {
      this.form.list[2].value = dateString
    },
    onServe(index) {
      let listItem = this.form.list[index]
      let { value, fieldName, oldValue } = listItem
      const sendData = {
        data: {},
        userID: this.userID
      }
      sendData.data[fieldName] = value
      updateUserInfo(sendData).then(res => {
        const { success, message, data } = res
        if (success) {
          listItem.oldValue = value
          this.userInfoUpdate(data)
        } else {
          listItem.value = oldValue
        }
        this.$message.info(message)
      })
      listItem.isEdit = false
    },
    //上传文件
    beforeUpload(file) {
      if (this.btnLoading) return false
      const isLt1M = file.size / 1024 / 1024 < 5
      if (!isLt1M) {
        this.$message.error('文件大小不能超出5MB')
        return false
      }
      return true
    },
    async triggerUpload(info) {
      this.btnLoading = true
      const formData = new FormData()
      formData.append('file', info.file)
      const res1 = await fileUpload(formData)
      const { success: success1, data: data1 } = res1
      const res2 = await updateUserInfo({
        data: {
          avatarPath: data1.imgName
        },
        userID: this.userID
      })
      const { success: success2, message: message2, data: data2 } = res2
      if (success1 && success2) {
        this.userInfoUpdate(data2)
      }
      this.$message.info(message2)
      this.btnLoading = false
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'userID']),
  },
}
</script>

<style lang="less" scoped>
.card-box {
  width: 70%;

  /deep/ .ant-card-head {
    border: none;
    padding-left: 36px;
  }

  /deep/ .ant-card-body {
    padding: 0 24px;
  }
}

.list-item {
  padding: 15px 0;
  border-top: 1px solid #e8e8e8;
  display: flex;
  line-height: 44px;

  .labe {
    width: 15%;
    font-size: 16px;
    padding-left: 12px;
  }

  .content {
    flex: 1 1;

    .avatar {
      margin-right: 10px;
    }

    /deep/ .ant-input,
    /deep/ .ant-input:focus {
      border: none;
      box-shadow: none;
    }

    /deep/ .ant-select {
      width: 10vw;
    }



    .text {
      padding-left: 11px;
    }
  }

  .action {
    width: 130px;
    text-align: center;
    padding-left: 10px;

    .btns-box {
      display: flex;
      flex-wrap: wrap;
      align-content: center;
      justify-content: space-between;
      height: 100%;
    }

    /deep/ .ant-upload-list {
      display: none;
    }
  }
}
</style>