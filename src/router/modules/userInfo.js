export default {
  // 存入的数据
  state: {
    wxContext: { a: 1},  // 登录获取的信息
  },
  // 数据的派生状态, 和计算属性相似
  getters: {
    getAppid: (state, geeters) => {
      return state.wxContext.appid
    },
    getAppidIncrease: (state, getters) => {
      return getters.getAppid + 1
    },

  },

}