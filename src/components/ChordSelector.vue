<template>
  <div>
    <b-form-select
      id="input-3"
      class="selector"
      v-model="value"
      :options="options"
      @change="$emit('note-selected', value)"
    ></b-form-select>
    <!-- <select
      name="fundamental"
      id="fundamental"
      v-model="value"
      @change="$emit('note-selected', $event.target.value)"
    >
      <option v-for="(note, index) in options" :key="index" :value="note">{{
        note
      }}</option>
    </select> -->
  </div>
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

<style lang="scss" scoped>
.selector {
  margin: 10px 0;
  outline: none;
  box-shadow: none;
  border-color: 1px solid #ced4da;
}
</style>
