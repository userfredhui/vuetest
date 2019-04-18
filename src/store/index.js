import Vue from 'vue';
import Vuex from 'vuex';
import modules from './modules';
import request from '@/utils/request';
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      nickname: '',
      email: ''
    }
  },
  mutations: {
    setUserInfo(state, payload) {
      state.user = payload
    }
  },
  actions: {
    async fetchUserInfo({commit}) {
      const res = await request.get('/current-user')
      if (res && res.code === '0') {
        commit('setUserInfo', res.data)
      }
    }
  },
  getters: {
    getUserInfo(state) {
      return state.user
    }
  },
  modules
})