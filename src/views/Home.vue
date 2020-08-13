<template>
  <div class="home">
    <h1>Here are some cool chords for you, buddy !</h1>
    <transition name="slide-fade">
      <ChordSelector
        v-if="selected_note"
        :options="fundamentals"
        :selected_note="selected_note"
        v-model="selected_note"
        @note-selected="setNote"
      />
    </transition>
    <transition name="slide-fade">
      <ChordSelector
        v-if="selected_modf"
        :options="modf"
        :selected_note="selected_modf"
        v-model="selected_modf"
        @note-selected="setModf"
      />
    </transition>
    <div class="home-container">
      <transition name="slide-fade">
        <div class="main-position" v-if="main_chord">
          Main position for
          <div class="chord-name">
            {{ main_chord.chord + " " + main_chord.modf }}
          </div>
          <Chord :Chord="main_chord" />
        </div>
      </transition>
      <transition name="slide-fade">
        <div v-if="chords">
          <p>Other positions</p>
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
      modf: [
        "minor",
        "major",
        "aug",
        "dim",
        "sus",
        "add9",
        "m6",
        "m7",
        "m9",
        "maj7",
        "maj9",
        "mmaj7",
        "-5",
        "11",
        "13",
        "5",
        "6",
        "6add9",
        "7",
        "7-5",
        "7maj5",
        "7sus4",
        "9"
      ],
      selected_note: null,
      selected_modf: null
    };
  },
  async created() {
    this.selected_note = "A";
    this.selected_modf = "minor";
    await this.fetchChord();
  },
  methods: {
    async setNote(note) {
      this.selected_note = note;
      await this.fetchChord();
    },
    async setModf(modf) {
      this.selected_modf = modf;
      await this.fetchChord();
    },
    async fetchChord() {
      this.chords = null;
      this.main_chord = null;
      const resp = await axios.get(
        `${this.url_base}/?request=chords&chord=${this.selected_note}&modf=${this.selected_modf}`
      );
      this.chords = resp.data.chords.slice(1, 5);
      this.main_chord = resp.data.chords[0];
    }
  }
};
</script>

<style lang="scss" scoped>
h1 {
  font-size: 1.2em;
  text-transform: uppercase;
  font-family: Helvetica, sans-serif;
  font-weight: 200;
  padding: 8px 0;
  border-bottom: 1px solid #ccc;
}
.main-position {
  margin-top: 15px;
}
.chord-name {
  font-size: 2em;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
