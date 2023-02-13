import axios from "axios";

class HttpRequest {
  constructor(baseUrl) {
    this.baseUrl = baseUrl
    this.queue = {}
  }

  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        Authorization: '',
      }
    }
    return config
  }

  destroy(url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      //spin.hide()
    }
  }

  interceptors(instance, url) {
    //请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      // if (!Object.keys(this.queue).length) {
      //   Spin.show() // 不建议开启，因为界面不友好
      // }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })

    //响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      const { data } = res
      if (typeof data === 'object') {
        //对data进行处理
      }
      return data
    }, error => {
      this.destroy(url)
      let errorInfo = error.response
      if (!errorInfo && errorInfo != undefined) {
        const { request: { statusText, status }, config } = error
        errorInfo = {
          statusText,
          status,
          request: { responseURL: config.url }
        }
        console.log(errorInfo);
      }
      return Promise.reject(error)
    })
  }

  request(options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}

export default HttpRequest