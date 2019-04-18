export default {
  namespaced: true,
  state: {
    searchForm: {
      state: '1',
      keywords: '',
      page: 1,
      count: 10
    }
  },
  mutations: {
    setSearchForm(state, payload) {
      const { searchForm } = state
      state.searchForm = {
        ...searchForm,
        ...payload
      }
    }
  },
  getters: {
    getSearchForm(state) {
      return state.searchForm
    }
  }
}