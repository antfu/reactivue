import { createStore } from 'pinia'

export const useMainStore = createStore({
  // name of the store
  // it is used in devtools and allows restoring state
  id: 'main',
  // a function that returns a fresh state
  state: () => ({
    counter: 0,
    name: 'Eduardo',
  }),
  // optional getters
  getters: {
    doubleCount: (state, getters) => state.counter * 2,
    // use getters in other getters
    doubleCountPlusOne: (state, { doubleCount }) => doubleCount.value * 2,
  },
  // optional actions
  actions: {
    reset() {
      // `this` is the store instance
      this.state.counter = 0
    },
  },
})
