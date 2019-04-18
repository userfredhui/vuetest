<template>
  <div id="app">
    <Common v-if="!isNotLayout"></Common>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import Common from './layout/Common.vue';
export default {
  name: 'app',
  components: {
    Common
  },
  data() {
    return {
      isNotLayout: true
    }
  },
  watch: {
    '$route': function(newValue, old) {
      this.isNotLayout = newValue.meta.noLayout || false
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
* {
  margin: 0;
  padding: 0;
}
ul {
  list-style: none;
}
</style>
