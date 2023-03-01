<template>
  <div class="page">
    <div class="container">
      <div class="acting-box">
        <a-button type="primary" @click="openDialogBtnHandle">添加藏品</a-button>
        <a-button type="primary" style="margin-left: 10px;" @click="modfiyBtnHandle">修改藏品</a-button>
        <a-button type="primary" style="margin-left: 10px;" @click="deleteBtnHandle">删除藏品</a-button>
      </div>
      <div class="content-list">
        <a-radio-group @change="onRadioChange">
          <a-checkbox-group v-model="objectIDs" @change="onCheckboxChange">
            <a-list :grid="{ gutter: 16, column: 4 }" :data-source="listData">
              <a-list-item slot="renderItem" slot-scope="item, index" class="list_item-box">
                <div class="check-box">
                  <a-checkbox v-show="isDelete" :value="item.objectID" v-if="item.status !== 'inexchange'"></a-checkbox>
                  <a-radio v-show="isModify" :value="index" v-if="item.status === 'unexchange'"></a-radio>
                </div>
                <object-item :object-info="item" :class="objectItemClass"></object-item>
              </a-list-item>
            </a-list>
          </a-checkbox-group>
        </a-radio-group>
        <div class="operate-box" v-show="isDelete || isModify">
          <a-button type="primary" @click="executeActing">确定</a-button>
          <a-button style="margin-left: 10px;" @click="cancelActing">取消</a-button>
          <a-checkbox :indeterminate="indeterminate" @click="onCheckAllChange" :checked="checkAll" style="float: right;"
            v-show="isDelete">
            全选
          </a-checkbox>
        </div>
      </div>
    </div>
    <!-- 添加修改藏品弹窗 -->
    <div v-if="showDialog" role="document" class="dialog-box" style="z-index : 202">
      <div class="card-box">
        <div class="back_btn-box">
          <a-button class="btn btn-hover" icon="arrow-left" @click="handleClose"></a-button>
        </div>
        <a-card class="obj-box" :bordered="false">
          <header class="obj_header-box">
            <h3>请填写以下信息</h3>
          </header>
          <a-form-model ref="rules" :model="form" :rules="rules" @submit="onSubmit" @submit.native.prevent>
            <a-form-model-item ref="objectName" label="藏品名称" prop="objectName">
              <a-input v-model="form.objectName" />
            </a-form-model-item>
            <a-form-model-item label="藏品描述" prop="objectDescribe">
              <a-input v-model="form.objectDescribe" type="textarea" />
            </a-form-model-item>
            <a-form-model-item label="藏品图片(必填)" prop="objectPic">
              <a-upload name="file" list-type="picture" :beforeUpload="beforeUpload" :customRequest="triggerUpload"
                :remove="removeFile" :file-list="fileList" accept="image/*" :disabled="btnLoading">
                <a-button :loading="btnLoading"> <a-icon type="upload" /> 上传图片 </a-button>
              </a-upload>
            </a-form-model-item>
            <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
              <a-button type="primary" html-type="submit">
                保存
              </a-button>
              <a-button style="margin-left: 10px;" @click="resetForm">
                重置
              </a-button>
            </a-form-model-item>
          </a-form-model>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script>
import objectItem from '@/components/ObjectItem.vue'
import { fileUpload, fileDelete, addPeopleObject, getPeopleObjcetList, updatePeopleObjcet, deletePeopleObjcet } from '@/api/api'
import config from '@/config/index'
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'PeopleObect',
  components: {
    objectItem
  },
  data() {
    return {
      form: {
        objectName: '',
        objectDescribe: '',
        objectPic: '',
      },
      rules: {
        objectName: [
          { required: true, message: '请输入藏品名称', trigger: 'blur' },
        ]
      },
      fileList: [],
      showDialog: false,
      btnLoading: false,
      listData: [],
      isDelete: false,
      isModify: false,
      objectIDs: [],
      plainOptions: [],
      indeterminate: false,
      checkAll: false
    }
  },
  created() {
    this.getListData()
  },
  methods: {
    ...mapMutations(['noEventsUpdate']),
    openDialogBtnHandle() {
      this.showDialog = true
      this.noEventsUpdate(true)
    },
    handleClose() {
      this.showDialog = false
      this.noEventsUpdate(false)
      this.resetForm()
    },
    getListData() {
      if (this.userID === undefined) return false
      getPeopleObjcetList({ userID: this.userID }).then(res => {
        const { success, data: data } = res
        if (success) {
          this.listData = data.map(item => {
            this.plainOptions.push(item.objectID)
            item.isHome = false
            return item
          })
        }
      })
    },
    onSubmit() {
      if (this.form.objectPic === '') {
        this.$message.warning('请上传一张图片')
        return false
      }
      this.$refs.rules.validate(valid => {
        if (valid) {
          this.isModify ? this.objectModfiy() : this.objectAdd()
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.$refs.rules.resetFields();
      this.fileList = []
    },
    async objectAdd() {
      const data = {
        ...this.form,
        userID: this.userID
      }
      const { message } = await addPeopleObject(data)
      this.$message.info(message)
      this.getListData()
      this.handleClose()
    },
    objectModfiy() {
      updatePeopleObjcet(this.form).then(res => {
        const { message } = res
        this.$message.info(message)
        this.getListData()
      })
    },
    objectDelete() {
      deletePeopleObjcet({ objectIDs: this.objectIDs }).then(res => {
        this.$message.info(res.message)
        this.getListData()
      })
    },
    // 上传文件
    beforeUpload(file) {
      if (this.btnLoading) return false
      const isLt1M = file.size / 1024 / 1024 < 10
      if (!isLt1M) {
        this.$message.error('文件大小不能超出10MB')
        return false
      }
      return true
    },
    async triggerUpload(info) {
      this.btnLoading = true
      const formData = new FormData()
      formData.append('file', info.file)
      const res1 = await fileUpload(formData)
      const { success: success, data, message } = res1
      if (success) {
        const { imgName } = data
        this.form.objectPic = imgName
        info.file.thumbUrl = config.baseImgUrl + imgName
        info.file.imgName = imgName
        this.fileList.push(info.file)
        this.btnLoading = false
      }
      this.$message.info(message)
    },
    removeFile(file) {
      const { name, imgName } = file
      fileDelete({ imgName }).then(res => {
        const { message, success } = res
        if (success) {
          this.fileList = this.fileList.filter(item => item.name != name)
          this.form.objectPic = ''
        } else {
          this.$message.error(message)
        }
      })
    },
    modfiyBtnHandle() {
      if (this.listData.length > 0) {
        this.isModify = true
        this.isDelete = false
      } else {
        this.$message.info('无藏品数据')
      }
    },
    deleteBtnHandle() {
      if (this.listData.length > 0) {
        this.isDelete = true
        this.isModify = false
      } else {
        this.$message.info('无藏品数据')
      }
    },
    executeActing() {
      const { isModify, isDelete } = this
      if (isModify) {
        this.openDialogBtnHandle()
      }
      if (isDelete) {
        this.objectDelete()
      }
    },
    cancelActing() {
      this.isDelete = false
      this.isModify = false
    },
    onRadioChange(e) {
      const index = e.target.value
      this.form = this.listData[index]
      const { objectPic, objectName } = this.form
      this.fileList = [{
        uid: '-1',
        name: objectName,
        status: 'done',
        thumbUrl: config.baseImgUrl + objectPic
      }]
    },
    onCheckboxChange(checkedList) {
      const { plainOptions } = this
      this.indeterminate = !!checkedList.length && checkedList.length < plainOptions.length;
      this.checkAll = checkedList.length === plainOptions.length;
    },
    onCheckAllChange(e) {
      this.objectIDs = e.target.checked ? this.plainOptions : []
      this.indeterminate = false
      this.checkAll = e.target.checked
    }
  },
  computed: {
    ...mapGetters(['userID']),
    objectItemClass() {
      const { isDelete, isModify } = this
      return {
        'no-events': isDelete || isModify
      }
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

.acting-box {
  background: #fff;
  padding: 10px 12px;
}

.content-list {
  margin-top: 20px;
  padding: 16px 20px;
}

.obj_header-box h3 {
  color: #999;
  margin-bottom: 12px;
}

.obj-box /deep/ .ant-form-item-label {
  font-size: 16px;
  font-weight: 700;
}

.operate-box {
  padding: 10px 12px;
}

.check-box {
  position: absolute;
  z-index: 999;
  padding: 5px 10px;
}

.list_item-box /deep/ .ant-list-item{
  height: 365px;
}
</style>