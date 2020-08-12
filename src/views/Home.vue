<template>
  <div class="home">
    <select
      name="fundamental"
      id="fundamental"
      v-model="selected_note"
      @change="fetchChord(selected_note)"
    >
      <option
        v-for="(note, index) in fundamentals"
        :key="index"
        :value="note"
        >{{ note }}</option
      >
    </select>
    <div class="home-container" v-if="chords">
      <div class="main-position">
        <div class="chord-name">
          {{ main_chord.chord + " " + main_chord.modf }}
        </div>
        <div class="chord-position">
          <span v-for="string in strings" :key="string">
            {{ main_chord[string] }}
          </span>
        </div>
      </div>
      <!-- <svg id="svg" xmlns="http://www.w3.org/2000/svg">
        <g id="resources">
          <radialGradient
            id="fingering-dot-gradient"
            cx="60%"
            cy="40%"
            r="50%"
            fx="50%"
            fy="50%"
          >
            <stop
              offset="0%"
              style="stop-color:rgb(255,0,0); stop-opacity:1"
            ></stop>
            <stop
              offset="100%"
              style="stop-color:rgb(80,0,0);stop-opacity:1"
            ></stop>
          </radialGradient>
          <linearGradient
            id="fretboard-gradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" style="stop-color:#2b2b2b"></stop>
            <stop offset="10%" style="stop-color:#191919"></stop>
            <stop offset="50%" style="stop-color:black"></stop>
            <stop offset="90%" style="stop-color:#191919"></stop>
            <stop offset="100%" style="stop-color:#2b2b2b"></stop>
          </linearGradient>
          <linearGradient id="head-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#3d3d3d"></stop>
            <stop offset="10%" style="stop-color:#191919"></stop>
            <stop offset="50%" style="stop-color:black"></stop>
            <stop offset="90%" style="stop-color:#191919"></stop>
            <stop offset="100%" style="stop-color:#3d3d3d"></stop>
          </linearGradient>
          <pattern
            id="pearl-inlay"
            patternUnits="userSpaceOnUse"
            width="100"
            height="100"
          >
            <image
              xlink:href="/images/pearl-inlay.jpg"
              x="0"
              y="0"
              width="100"
              height="100"
            ></image>
          </pattern>
        </g>
        <g id="fretboard-layer"></g>
        <g id="fingering-layer"></g>
      </svg> -->
      <p>Other positions for this chord :</p>
      <ul class="other-positions">
        <li v-for="(chordItem, index) in chords" :key="index">
          <div class="chord-position">
            <span
              v-for="string in strings"
              :key="string"
              :class="`string-${string}`"
            >
              {{ chordItem[string] }}
            </span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";

// import Fretboard from "@/assets/js/fretboard-1.3.0.js";

export default {
  name: "Home",
  components: {},
  data() {
    return {
      url_base: "http://vps-e960ed9b.vps.ovh.net/chords/index.php",
      chords: null,
      main_chord: null,
      strings: ["e", "a", "d", "g", "b", "e2"],
      fundamentals: ["A", "B", "C", "D", "E", "F", "G"],
      selected_note: "A"
    };
  },
  async created() {
    await this.fetchChord(this.selected_note);
    // Fretboard.Neck.Draw(document.getElementById("svg"));
  },
  methods: {
    async fetchChord(chord) {
      const resp = await axios.get(
        `${this.url_base}/?request=chords&chord=${chord}`
      );
      this.chords = resp.data.chords.slice(1, 5);
      this.main_chord = resp.data.chords[0];
    }
  }
};
</script>

<style lang="scss" scoped>
.chord-name {
  font-size: 2em;
}
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
