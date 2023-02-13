<template>
  <div role="document" class="dialog-box" style="z-index : 202">
    <div class="dialog-content">
      <div class="card-box">
        <div class="back_btn-box">
          <a-button class="btn btn-hover" icon="arrow-left" @click="handleClose"></a-button>
        </div>
        <a-card class="login-box" :bordered="false">
          <header class="login_header-box">
            <h2>欢迎你，<a-button class="btn btn-hover" @click="handlechange">{{ btnText }}</a-button></h2>
            <h3>请填写以下信息进行{{ tipText }}</h3>
          </header>
          <a-form-model v-if="LRswitch" ref="loginRules" :model="loginForm" :rules="loginRules" @submit="loginSubmit"
            @submit.native.prevent>
            <a-form-model-item label="账号" prop="userName">
              <a-input v-model="loginForm.userName" placeholder="账号">
                <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
              </a-input>
            </a-form-model-item>
            <a-form-model-item label="密码" prop="password">
              <a-input v-model="loginForm.password" type="password" placeholder="密码">
                <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
              </a-input>
            </a-form-model-item>
            <a-form-model-item class="flex-conter">
              <a-button type="primary" html-type="submit"
                :disabled="loginForm.userName === '' || loginForm.password === ''">
                {{ tipText }}
              </a-button>
            </a-form-model-item>
          </a-form-model>
          <a-form-model v-else ref="registerRules" :model="registerForm" :rules="registerRules" @submit="registerSubmit"
            @submit.native.prevent>
            <a-form-model-item label="账号" prop="userName">
              <a-input v-model="registerForm.userName" placeholder="账号">
                <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
              </a-input>
            </a-form-model-item>
            <a-form-model-item label="邮箱" prop="mailbox">
              <a-input v-model="registerForm.mailbox" placeholder="邮箱">
                <a-icon slot="prefix" type="mail" style="color:rgba(0,0,0,.25)" />
              </a-input>
            </a-form-model-item>
            <a-row type="flex" justify="space-between" align="middle">
              <a-col :span="19">
                <a-form-model-item label="验证码" prop="code">
                  <a-input v-model="registerForm.code" placeholder="验证码">
                    <a-icon slot="prefix" type="safety" style="color:rgba(0,0,0,.25)" />
                  </a-input></a-form-model-item>
              </a-col>
              <a-col :span="4" style="paddingTop: 12px">
                <a-button v-if="!sendCodeCheck" icon="message" class="btn btn-hover" @click="sendCode"></a-button>
                <a-button v-else class="btn btn-hover">{{ codeBtnText }}</a-button>
              </a-col>
            </a-row>

            <a-form-model-item label="密码" prop="password">
              <a-input v-model="registerForm.password" type="password" placeholder="密码">
                <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
              </a-input>
            </a-form-model-item>
            <a-form-model-item class="flex-conter">
              <a-button type="primary" html-type="submit" :disabled="registerCheck">
                {{ tipText }}
              </a-button>
            </a-form-model-item>
          </a-form-model>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script>
import { sendEmailCode, login, register } from '@/api/api'
import { mapMutations, mapActions } from 'vuex'
export default {
  name: 'Login',
  data() {
    return {
      btnText: '注册',
      codeBtnText: '60',
      sendCodeCheck: false,
      loginForm: {
        userName: '',
        password: '',
      },
      registerForm: {
        userName: '',
        mailbox: '',
        code: '',
        password: '',
      },
      loginRules: {
        userName: [
          { required: true, message: '请输入账号', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ]
      },
      registerRules: {
        userName: [
          { required: true, message: '请输入账号', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度最少为6位', trigger: 'blur' },
        ],
        mailbox: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
        ]
      }
    }
  },
  methods: {
    ...mapMutations(['loginStateUpdate', 'userIDUpdate']),
    ...mapActions(['userInfoUpdate']),
    handleClose() { //关闭登录注册弹窗
      const data = {
        openlogin: false,
        noEvents: false
      }
      this.$emit('changeLoginBox', data)
    },
    handlechange() {
      this.btnText = this.btnText === '注册' ? '登录' : '注册';
    },
    loginSubmit() {
      this.$refs.loginRules.validate(valid => {
        if (valid) {
          const data = this.strTirm(this.loginForm)
          login(data).then(res => {
            const { data, success, message } = res
            if (success) {
              //登录成功
              const { userID } = data
              this.$cookies.set('userID', userID, '48h')
              this.loginStateUpdate(true)
              this.userIDUpdate(userID)
              this.userInfoUpdate()
              this.handleClose()
              this.$message.info(message)
              window.location.href = '/'
            } else {
              this.$message.error(message)
            }
          })
        } else {
          console.log('error login submit!!');
          return false;
        }
      })
    },
    registerSubmit() {
      this.$refs.registerRules.validate(valid => {
        if (valid) {
          const data = this.strTirm(this.registerForm)
          register(data).then(res => {
            const { success, message } = res
            if (success) {
              //注册成功
              const { userName, password } = data
              this.loginForm = {
                userName,
                password
              }
              this.handlechange()
              this.$message.info(message)
            } else {
              this.$message.error(message)
            }
          })
        } else {
          console.log('error register submit!!');
          return false;
        }
      })
    },
    sendCode() { //发送验证码
      if (this.sendCodeCheck) return;
      const { userName, mailbox } = this.registerForm
      if (userName !== '' && mailbox !== '') {
        const data = { userName, mailbox }
        sendEmailCode(data).then(res => {
          const { success, message } = res
          if (success) {
            //发送成功
            this.sendCodeCheck = true
            this.codeBtnText = 60
            let timer = setInterval(() => {
              this.codeBtnText--
              if (this.codeBtnText < 0) {
                clearInterval(timer)
                this.codeBtnText = ''
                this.sendCodeCheck = false
              }
            }, 1000)
          }
          this.$message.info(message);
        })
      } else {
        this.$message.error('账号和邮箱不能为空');
      }
    },
    strTirm(obj) { //去除对象属性值字符的前后空白
      for (const key in obj) {
        if (typeof obj[key] === 'string')
          obj[key] = obj[key].trim()
      }
      return obj
    }
  },
  computed: {
    tipText() {
      return this.btnText === '登录' ? '注册' : '登录';
    },
    LRswitch() {
      return this.btnText === '注册';
    },
    registerCheck() {
      const { userName, password, mailbox, code } = this.registerForm
      return userName === '' || password === '' || mailbox === '' || code === ''
    }
  }
}
</script>

<style lang="less" scoped>
.dialog-content {
  border-radius: 4px;
  margin: 24px;
  overflow-y: auto;
  pointer-events: auto;
  z-index: inherit;
  box-shadow: 0 11px 15px -7px rgb(0 0 0 / 20%), 0 24px 38px 3px rgb(0 0 0 / 14%), 0 9px 46px 8px rgb(0 0 0 / 12%);
  transform-origin: center center;
  width: 440px;
}

.card-box {
  background: #fff;
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

.back_btn-box {
  padding: 8px 6px 0;
}

.login_header-box {
  h2 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;

    /deep/ .ant-btn {
      color: #1890ff;
    }
  }

  h3 {
    color: #999;
    margin-bottom: 12px;
  }
}

.flex-conter {
  display: flex;
  justify-content: center;
}

.login-box /deep/ .ant-form-item-label {
  font-size: 16px;
  font-weight: 700;
}
</style>