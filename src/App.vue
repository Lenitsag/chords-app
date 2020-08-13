<template>
  <div
    class="main-container"
    v-bind:style="{
      'background-image': 'url(assets/img/bg-' + bg_index + '.jpg)'
    }"
  >
    <b-container fluid="md" id="app">
      <router-view />
    </b-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      bg_index: this.randomInteger(1, 8)
    };
  },
  methods: {
    randomInteger(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  }
};
</script>
<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  outline: none;
  list-style-type: none;
}
.main-container {
  background: no-repeat center center fixed #000;
  background-size: cover;
  width: 100%;
  height: 100vh;
  padding: 20px;
}
#app {
  font-family: "Monserrat", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 10px;
  margin: 0 auto;
  position: relative;
  max-width: 400px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 4px 4px 25px 0px rgba(0, 0, 0, 0.75);
}
</style>
