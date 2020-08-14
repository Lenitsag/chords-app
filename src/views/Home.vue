<template>
  <div class="home">
    <div class="home-container">
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
      <transition name="slide-fade">
        <div v-if="chords">
          <h2>Main position</h2>
          <div id="position-main"></div>
          <h2>Other positions</h2>
          <ul class="other-positions">
            <li
              v-for="(chordItem, index) in chords"
              :key="index"
              :id="`position${index}`"
            ></li>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { Fretboard } from "@moonwave99/fretboard.js";
import ChordSelector from "@/components/ChordSelector.vue";

export default {
  name: "Home",
  components: {
    ChordSelector
  },
  data() {
    return {
      url_base: "http://vps-e960ed9b.vps.ovh.net/chords-api",
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
      selected_modf: null,
      chords: null,
      oldChords: null
    };
  },
  async mounted() {
    this.selected_note = "A";
    this.selected_modf = "minor";
    await this.fetchChord();
    this.setFretboard(this.main_chord, "#position-main");

    for (let i = 0; i < this.chords.length; i++) {
      this.setFretboard(this.chords[i], "#position" + i);
    }
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
      const resp = await axios.get(
        `${this.url_base}/?request=chords&chord=${this.selected_note}&modf=${this.selected_modf}`
      );
      this.main_chord = resp.data.chords[0];
      this.chords = resp.data.chords.slice(1, 4);
    },
    setFretboard(chord, element) {
      const notes = [chord.e, chord.a, chord.d, chord.g, chord.b, chord.e2];
      const fretboard = new Fretboard({
        el: element,
        width: 300,
        height: 150,
        bottomPadding: 0,
        scaleFrets: true,
        stringWidth: 2,
        fretWidth: 2,
        fretCount: 6,
        crop: true,
        dotSize: 20,
        dotStrokeWidth: 2,
        fretNumbersMargin: 30,
        showFretNumbers: true
      });
      fretboard.renderChord(notes.join(""));
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
.home {
  padding: 15px;
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
