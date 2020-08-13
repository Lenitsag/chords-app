<template>
  <b-container fluid="md" id="app">
    <router-view />
  </b-container>
</template>
<script>
export default {
  data() {
    return {
      bg_index: this.randomInteger(1, 7)
    };
  },
  beforeMount() {
    document.body.classList.add("bg-" + this.bg_index);
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
body {
  background: no-repeat center center fixed #000;
  background-size: cover;
  padding: 0 15px;
}
#app {
  font-family: "Monserrat", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 20px auto;
  position: relative;
  max-width: 400px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 4px 4px 25px 0px rgba(0, 0, 0, 0.75);
}

@for $i from 1 through 7 {
  .bg-#{$i} {
    background-image: url(assets/img/bg-#{$i}.jpg);
  }
}
</style>
