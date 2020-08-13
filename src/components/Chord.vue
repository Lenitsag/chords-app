<template>
  <div class="chord-position">
    <span v-for="string in strings" :key="string">
      {{ Chord[string] }}
    </span>
  </div>
</template>

<script>
export default {
  name: "Chord",
  props: {
    Chord: Object
  },
  data() {
    return {
      strings: ["e", "a", "d", "g", "b", "e2"]
    };
  }
};
</script>

<style lang="scss" scoped>
.chord-position {
  border: solid 1px #ccc;
  max-width: 180px;
  margin: 15px auto;
  display: flex;
  text-align: center;
  flex-wrap: wrap;
  span {
    flex: 1;
    background-color: #eee;
    padding: 5px;
    &:not(:last-child) {
      border-right: 1px solid #ccc;
    }
  }
}
</style>
