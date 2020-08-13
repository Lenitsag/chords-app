<template>
  <div class="home">
    <transition name="slide-fade">
      <ChordSelector
        v-if="selected_note"
        :options="fundamentals"
        :selected_note="selected_note"
        v-model="selected_note"
        @note-selected="fetchChord"
      />
    </transition>
    <div class="home-container">
      <transition name="slide-fade">
        <div class="main-position" v-if="main_chord">
          <div class="chord-name">
            {{ main_chord.chord + " " + main_chord.modf }}
          </div>
          <Chord :Chord="main_chord" />
        </div>
      </transition>
      <transition name="slide-fade">
        <div v-if="chords">
          <p>Other positions for this chord :</p>
          <ul class="other-positions">
            <li v-for="(chordItem, index) in chords" :key="index">
              <Chord :Chord="chordItem" />
            </li>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Chord from "@/components/Chord.vue";
import ChordSelector from "@/components/ChordSelector.vue";

// import Fretboard from "@/assets/js/fretboard-1.3.0.js";

export default {
  name: "Home",
  components: {
    Chord,
    ChordSelector
  },
  data() {
    return {
      url_base: "http://vps-e960ed9b.vps.ovh.net/chords-api",
      chords: null,
      main_chord: null,
      fundamentals: ["A", "B", "C", "D", "E", "F", "G"],
      selected_note: null
    };
  },
  async created() {
    await this.fetchChord("A");
  },
  methods: {
    async fetchChord(note) {
      this.chords = null;
      this.main_chord = null;
      const resp = await axios.get(
        `${this.url_base}/?request=chords&chord=${note}`
      );
      this.chords = resp.data.chords.slice(1, 5);
      this.main_chord = resp.data.chords[0];
      this.selected_note = note;
    }
  }
};
</script>

<style lang="scss" scoped>
.chord-name {
  font-size: 2em;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
