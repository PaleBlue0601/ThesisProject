import Vue from 'vue'
import Vuex from 'vuex'

import { getUserInfo } from '@/api/api'
import config from '@/config/index'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loginState: false,
    userInfo: '', //用户信息对象,
    userID: undefined,
    noEvents: false,
    indexPageName: 'home'
  },
  getters: {
    loginState: (state, getters) => {
      return state.loginState
    },
    userInfo: (state, getters) => {
      return state.userInfo
    },
    userID: (state, getters) => {
      return state.userID
    },
    noEvents: (state, getters) => {
      return state.noEvents
    },
    indexPageName: (state, getters) => {
      return state.indexPageName
    },
  },
  mutations: {
    loginStateUpdate(state, data) {
      state.loginState = data
    },
    userInfoUpdate(state, data) {
      const { avatarPath } = data
      if (avatarPath != '') {
        data.avatarPath = config.baseImgUrl + avatarPath
      }
      state.userInfo = data
    },
    userIDUpdate(state, data) {
      state.userID = data
    },
    noEventsUpdate(state, data) {
      state.noEvents = data
    },
    indexPageNameUpdate(state, data) {
      state.indexPageName = data
    }
  },
  actions: {
    userInfoUpdate({ commit, state }) {
      const { userID } = state
      if (userID === undefined) return false;
      getUserInfo({ userID }).then(res => {
        const { success, data } = res
        if (success) {
          commit('userInfoUpdate', data)
          commit('loginStateUpdate', true)
        }
      })
    }
  },
  modules: {

  }
})
