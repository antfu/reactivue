import { acceptHMRUpdate, defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  // a function that returns a fresh state
  state: () => ({
    counter: 1,
  }),
  // optional getters
  getters: {
    doubleCount(state) {
      return state.counter * 2
    },
    doubleCountPlusOne() {
      return Number(this.doubleCount) * 2
    },
  },
  actions: {
    reset() {
      this.counter = 0
    },
  },
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useMainStore, import.meta.hot))
