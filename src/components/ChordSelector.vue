<template>
  <select
    name="fundamental"
    id="fundamental"
    v-model="value"
    @change="$emit('note-selected', $event.target.value)"
  >
    <option v-for="(note, index) in options" :key="index" :value="note">{{
      note
    }}</option>
  </select>
</template>

<script>
export default {
  name: "ChordSelector",
  props: {
    options: Array,
    selected_note: String
  },
  data() {
    return {
      value: this.selected_note
    };
  }
};
</script>

<style lang="scss" scoped></style>
