<template>
  <div class="page">
    <a-card title="收货地址" :bordered="false">
      <div class="form-box">
        <div class="header">新增收货地址</div>
        <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" ref="ruleForm" :rules="rules">
          <a-form-model-item label="地址信息：" prop="location">
            <a-cascader :options="addressOptions" placeholder="请选择省/市/区"
              v-model="cascaderValue" @change="onAddressChange" />
          </a-form-model-item>
          <a-form-model-item label="详细地址：" prop="detailedAddress">
            <a-textarea v-model="form.detailedAddress" placeholder="请输入详细地址信息，如道路、门牌号、小区、楼栋号、单元等信息"
              :auto-size="{ minRows: 2, maxRows: 6 }" />
          </a-form-model-item>
          <a-form-model-item label="邮政编码：">
            <a-input v-model="form.postalCode" placeholder="请填写邮编" />
          </a-form-model-item>
          <a-form-model-item label="收货人姓名：" prop="consignee">
            <a-input v-model="form.consignee" placeholder="长度不超过5个字符" />
          </a-form-model-item>
          <a-form-model-item label="手机号码：" prop="phoneNumber">
            <a-input v-model="form.phoneNumber" placeholder="请填写手机号码" />
          </a-form-model-item>
          <a-form-model-item :wrapper-col="{ offset: 4 }">
            <a-checkbox @change="onCheckboxChange" :checked="form.isDefault === 'yes'">
              设置为默认收货地址
            </a-checkbox>
          </a-form-model-item>
          <a-form-model-item :wrapper-col="{ offset: 4 }">
            <a-button type="primary" @click="onSubmit">
              保存
            </a-button>
          </a-form-model-item>
        </a-form-model>
      </div>
      <a-alert :message="infoMessage" type="info" show-icon />
      <a-table class="table-box" :columns="columns" :data-source="tableData" rowKey="ID" bordered>
        <span slot="operation" slot-scope="text, record">
          <div class="operation-col">
            <a @click="onModify(record)">修改</a>
            <span>|</span>
            <a-popconfirm title="是否删除此地址?" ok-text="确定" cancel-text="取消" @confirm="deleteConfirm($event, record)">
              <a>删除</a>
            </a-popconfirm>
          </div>
        </span>
        <span slot="default" slot-scope="text, record">
          <div class="default-col">
            <a v-show="!(record.isDefault === 'yes')" @click="onDefault(record)">设为默认</a>
            <span v-show="record.isDefault === 'yes'">默认地址</span>
          </div>
        </span>
      </a-table>
    </a-card>
  </div>
</template>

<script>
import options from '@/utils/areadata'
import { getAddressList, addAddress, updateAddress, deleteAddress } from '@/api/api'
import { mapGetters } from 'vuex'
export default {
  name: 'DeliverAddress',
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        location: '',
        detailedAddress: '',
        postalCode: '',
        consignee: '',
        phoneNumber: '',
        isDefault: ''
      },
      rules: {
        location: [
          { required: true, message: '请填写地址信息', trigger: 'blur' }
        ],
        detailedAddress: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ],
        consignee: [
          { required: true, message: '请填写收货人姓名', trigger: 'blur' },
          { min: 1, max: 5, message: '长度不超过五个字符', trigger: 'blur' },
        ],
        phoneNumber: [
          { required: true, message: '请填写手机号码', trigger: 'blur' }
        ]
      },
      columns: [
        {
          title: '收货人',
          dataIndex: 'consignee',
          width: '8%',
        },
        {
          title: '所在地区',
          dataIndex: 'location',
          width: '15%',
        },
        {
          title: '详细地址',
          dataIndex: 'detailedAddress',
          width: '22%',
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
          title: '操作',
          dataIndex: 'operation',
          width: '15%',
          scopedSlots: { customRender: 'operation' },
        },
        {
          title: '',
          dataIndex: 'default',
          width: '15%',
          scopedSlots: { customRender: 'default' },
        },
      ],
      addressOptions: options,
      tableData: [],
      isModify: false,
      cascaderValue: []
    }
  },
  created() {
    if (this.userID !== undefined) {
      getAddressList({ userID: this.userID }).then(res => {
        const { success, data } = res
        if (success) {
          this.tableData = data
        }
      })
    }
  },
  methods: {
    onCheckboxChange(e) {
      const { target: { checked } } = e
      this.form.isDefault = checked ? 'yes' : 'no'
    },
    onAddressChange(value, selectedOptions) {
      if (selectedOptions !== undefined) {
        selectedOptions.forEach(item => {
          this.form.location += item.label + ' '
        });
      }
    },
    onSubmit() {
      if (this.isModify) {
        this.onUpdateAddress()
      } else {
        const usedNum = this.tableData.length
        if (usedNum <= 20) {
          this.onAddress()
        } else {
          this.$message.warning('保存地址已达最大值！')
        }
      }
    },
    onAddress() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const { postalCode } = this.form
          this.form.userID = this.userID
          addAddress({
            ...this.form,
            postalCode: postalCode === '' ? '0000' : postalCode
          }).then(res => {
            const { success, message, data } = res
            if (success) {
              this.tableData = data
            }
            this.$message.info(message)
          })
        } else {
          return false;
        }
      })
    },
    onUpdateAddress() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          updateAddress(this.form,).then(res => {
            const { success, message, data } = res
            if (success) {
              this.tableData = data
            }
            this.$message.info(message)
          })
          this.$refs.resetFields()
          this.isModify = false
        } else {
          return false;
        }
      })
    },
    onDefault(record) {
      updateAddress({ ...record, isDefault: 'yes' }).then(res => {
        const { success, data } = res
        if (success) {
          this.tableData = data
        }
      })
    },
    onModify(record) {
      const { location } = record
      if(location !== '') {
        this.cascaderValue = location.trim().split(' ')
      }
      this.form = record
      this.isModify = true
    },
    deleteConfirm(e, record) {
      const { ID, userID } = record
      deleteAddress({ ID, userID }).then(res => {
        const { success, message, data } = res
        if (success) {
          this.tableData = data
        }
        this.$message.info(message)
      })
    }
  },
  computed: {
    ...mapGetters(['userID']),
    infoMessage() {
      const usedNum = this.tableData.length
      const freeNum = 20 - usedNum
      return `已保存${usedNum}了条地址，还能保存${freeNum}条地址`
    }
  }
}
</script>

<style lang="less" scoped>
.form-box {
  width: 50%;
  min-width: 540px;

  .header {
    margin-bottom: 20px;
    color: #ccc;
  }
}

.table-box {
  margin: 15px 0;
}

.operation-col,
.default-col {
  display: flex;
  justify-content: center;
  font-size: 13px;
  color: #40a9ff;
}

.operation-col span {
  margin: 0 15px;
}

.default-col span {
  display: inline-block;
  padding: 6px 12px;
  border: 1px solid #40a9ff;
  border-radius: 5px;
  background-color: #aad7fc;
}
</style>