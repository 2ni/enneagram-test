<template>
  <div id="questionnaire">
    <!-- {{answers}} {{numberOfQuestions}} -->
    <ul v-bind:class="{hidden: showResults}">
      <li v-for="q in questions" :key="q.question | hash">
        <div class="question" v-bind:class="{error: hasError.indexOf($options.filters.hash(q.question)) > -1}">{{q.question}}</div>
        <div class="answerBlock">
          <div>
            <input v-on:change="questionAnswered" type="radio" :name="q.question | hash" value="yes" :id="1 + q.question | hash" :data-type="q.type">
            <label :for="1 + q.question | hash" class="medium green button">Ja</label>
            <check-icon class="isSelected green" />
          </div>
          <div>
            <input class="answer_no" v-on:change="questionAnswered" type="radio" :name="q.question | hash" value="no" :id="q.question | hash" :data-type="q.type">
            <label :for="q.question | hash" class="medium red button">Nein</label>
            <check-icon class="isSelected red" />
          </div>
        </div>
      </li>
    </ul>
    <div id="showresults" v-bind:class="{hidden: showResults}">
      <button class="large green button" v-on:click="getStructure">Zeige mir mein Enneagramm Typ</button>
      <div class="error" v-if="hasError.length > 0">Bitte beantworte jede Frage mit ja oder nein</div>
    </div>
    <div id="results" :class="showResults ? 'resultsVisible' : 'resultsHidden'">
      <div class="graph">
        <div class="bars">
          <div style="height: 100%; width: 0; border: 0; margin: 0;" class="graph-element bar" />
          <div
            class="graph-element bar"
            v-for="(amount, type) in answers"
            v-bind:class="{winner: isMaxPercent(type)}"
            v-bind:key="type"
            v-bind:style="{height:100*amount/numberOfQuestions[type] + '%', width:100/Object.keys(answers).length-2 + '%'}"
          />
        </div>
        <div class="labels">
          <div style="height: 100%; width: 0; border: 0; margin: 0;" class="graph-element label" />
          <div
            class="graph-element label"
            v-for="(amount, type) in answers"
            v-bind:class="{winner: isMaxPercent(type)}"
            v-bind:key="type"
            v-bind:style="{width:100/Object.keys(answers).length-2 + '%'}">
            Typ {{type}} | {{answerInPercent(type)}}%
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QUESTIONS from '../questions.json'

export default {
  title: 'Enneagramm Test',
  data () {
    return {
      questions: shuffle(QUESTIONS),
      numberOfQuestions: {},
      openQuestions: [],
      answers: {},
      hasError: [],
      showResults: false
    }
  },
  created () {
    if (this.$route.query.q) {
      this.questions = this.questions.slice(0, this.$route.query.q)
    }
    this.numberOfQuestions.total = this.questions.length
    this.questions.forEach(question => {
      this.$set(this.answers, question.type, 0)
      this.$set(this.numberOfQuestions, parseInt(question.type), (this.numberOfQuestions[question.type] + 1) || 1)
      this.openQuestions.push(this.$options.filters.hash(question.question))
    })
    this.$emit('updateStatus', this.status)
  },
  destroyed () {
    this.$emit('updateStatus', '')
  },
  computed: {
    status: function () {
      return 'Fragen: ' + (this.numberOfQuestions.total - this.openQuestions.length) + '/' + this.numberOfQuestions.total
    }
  },
  methods: {
    answerInPercent: function (type) {
      return parseInt(100 * this.answers[type] / this.numberOfQuestions[type])
    },
    isMaxPercent: function (type) {
      const curPercent = this.answerInPercent(type)
      let maxPercent = 0
      for (const t in this.answers) {
        maxPercent = Math.max(this.answerInPercent(t), maxPercent)
      }
      return maxPercent !== 0 && curPercent === maxPercent
    },
    questionAnswered: function (e) {
      const type = e.target.getAttribute('data-type')
      let diff = e.target.value === 'yes' ? 1 : -1
      // available in the array -> 1st time response
      const index = this.openQuestions.indexOf(parseInt(e.target.name))
      if (index !== -1) {
        this.openQuestions.splice(index, 1) // remove id of question
        diff = Math.max(0, diff)
      }

      this.answers[type] += diff
      this.$emit('updateStatus', this.status)
    },
    getStructure: function (e) {
      // not every question was answered
      if (this.openQuestions.length > 0) {
        this.hasError = this.openQuestions
        return
      }

      this.showResults = true
    }
  }
}

function shuffle (array) {
  let currentIndex = array.length
  let temporaryValue
  let randomIndex

  // While there remain elements to shuffle...
  while (currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}
</script>

<style scoped>
#results {
  margin-top: 1em;
  transition: visibility 0s, opacity 0.5s linear;
}

.resultsHidden {
  visibility: hidden;
  opacity: 0;
}

.resultsVsible {
  visibility: visible;
  opacity: 1;
}

.hidden {
  display: none;
}

.graph {
  height: 20rem;
  border: 1px solid #aeaeae;
  background-color: #fff;
  padding: 1rem 0 1.5rem .3rem;
}

.graph .bars {
  height: 100%;
}

.graph-element {
    margin-right: .3rem;
    display: inline-block;
    background-color: #8bc8c9;
}

.graph-element.bar.winner {
  border: 2px solid #357374;
}

.graph-element.label.winner {
  font-weight: bold;
}

.graph-element.bar {
  border: 2px solid transparent;
}

.graph-element.label {
  font-size: .8rem;
  background-color: transparent;
  border: 2px solid transparent;
}

#questionnaire {
  text-align: center;
}

#questionnaire ul {
  list-style-type: none;
  padding: 0;
}

@media only screen and (min-width: 641px) {
  #questionnaire li {
    display: flex;
  }
}

#questionnaire li {
  text-align: left;
  padding: 10px 0;
  align-items: center;
}

#questionnaire li:nth-child(even) {
  background-color: #dff0e8;
}

#questionnaire li:nth-child(odd) {
  background-color: #fff;
}

#questionnaire .question {
  margin-right: 1rem;
  margin-left: 1rem;
  width: 100%;
}

#questionnaire .answerBlock {
  white-space: nowrap;
  margin-left: 1rem;
}

#questionnaire .answerBlock div {
  display: inline;
  position: relative;
  margin-right: 1rem;
}

#questionnaire input {
  position: absolute;
  display: none;
}

#questionnaire label {
  width: 50px;
  text-align: center;
}

#questionnaire ul input[type="radio"] {
  opacity: 0;
}

#questionnaire .answerBlock .isSelected {
  position: absolute;
  left: 4px;
  top: 0px;
  visibility: hidden;
}

#questionnaire .answerBlock .isSelected.green {
  color: #4d6f5f;
}

#questionnaire .answerBlock .isSelected.red {
  color: #6f4d55;
}

#questionnaire .answerBlock .isSelected > .material-design-icon__svg {
  width: 1em;
  height: 1em;
  vertical-align: middle;
}

#questionnaire .answerBlock :checked ~ .isSelected {
  visibility: visible;
}

div.error {
  color: red;
  font-weight: bold;
}

.button {
  display: inline-block;
  zoom: 1;
  padding: 6px 20px;
  margin: 0;
  cursor: pointer;
  border: 1px solid #bbb;
  overflow: visible;
  font: bold 13px arial, helvetica, sans-serif;
  text-decoration: none;
  white-space: nowrap;
  color: #555;

  background-color: #ddd;
  background-image: -webkit-gradient(linear, left top, left bottom, from(rgba(255,255,255,1)), to(rgba(255,255,255,0)));
  background-image: -webkit-linear-gradient(top, rgba(255,255,255,1), rgba(255,255,255,0));
  background-image: -moz-linear-gradient(top, rgba(255,255,255,1), rgba(255,255,255,0));
  background-image: -ms-linear-gradient(top, rgba(255,255,255,1), rgba(255,255,255,0));
  background-image: -o-linear-gradient(top, rgba(255,255,255,1), rgba(255,255,255,0));

  -webkit-transition: background-color .2s ease-out;
  -moz-transition: background-color .2s ease-out;
  -ms-transition: background-color .2s ease-out;
  -o-transition: background-color .2s ease-out;
  transition: background-color .2s ease-out;
  background-clip: padding-box; /* Fix bleeding */
  -moz-border-radius: 3px;
  -webkit-border-radius: 3px;
  border-radius: 3px;
  -moz-box-shadow: 0 1px 0 rgba(0, 0, 0, .3), 0 2px 2px -1px rgba(0, 0, 0, .5), 0 1px 0 rgba(255, 255, 255, .3) inset;
  -webkit-box-shadow: 0 1px 0 rgba(0, 0, 0, .3), 0 2px 2px -1px rgba(0, 0, 0, .5), 0 1px 0 rgba(255, 255, 255, .3) inset;
  box-shadow: 0 1px 0 rgba(0, 0, 0, .3), 0 2px 2px -1px rgba(0, 0, 0, .5), 0 1px 0 rgba(255, 255, 255, .3) inset;
  text-shadow: 0 1px 0 rgba(255,255,255, .9);

  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.button:hover {
  background-color: #eee;
  color: #555;
}

.button:active {
  background: #e9e9e9;
  position: relative;
  top: 1px;
  text-shadow: none;
  -moz-box-shadow: 0 1px 1px rgba(0, 0, 0, .3) inset;
  -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, .3) inset;
  box-shadow: 0 1px 1px rgba(0, 0, 0, .3) inset;
}

.button[disabled], .button[disabled]:hover, .button[disabled]:active {
  border-color: #eaeaea;
  background: #fafafa;
  cursor: default;
  position: static;
  color: #999;
  /* Usually, !important should be avoided but here it's really needed :) */
  -moz-box-shadow: none !important;
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
  text-shadow: none !important;
}

.button.small {
  padding: 4px 12px;
}

.button.large {
  padding: 12px 30px;
  text-transform: uppercase;
}

.button.large:active {
  top: 2px;
}

.button.green, .button.red, .button.blue {
  color: #fff;
  text-shadow: 0 1px 0 rgba(0,0,0,.2);

  background-image: -webkit-gradient(linear, left top, left bottom, from(rgba(255,255,255,.3)), to(rgba(255,255,255,0)));
  background-image: -webkit-linear-gradient(top, rgba(255,255,255,.3), rgba(255,255,255,0));
  background-image: -moz-linear-gradient(top, rgba(255,255,255,.3), rgba(255,255,255,0));
  background-image: -ms-linear-gradient(top, rgba(255,255,255,.3), rgba(255,255,255,0));
  background-image: -o-linear-gradient(top, rgba(255,255,255,.3), rgba(255,255,255,0));
}

.button.green {
  background-color: #8bc9ab;
  border-color: #8bc9ab;
}

.button.green:hover {
  background-color: #a2d3bb;
}

.button.green:active {
  background: #8bc9ab;
}

.button.red {
  background-color: #c98b9a;
  border-color: #c98b9a;
}

.button.red:hover {
  background-color: #d3a2ae;
}

.button.red:active {
  background: #c43c35;
}

.green[disabled], .green[disabled]:hover, .green[disabled]:active {
  border-color: #8bc9ab;
  background: #8bc9ab;
  color: #D2FFD2;
}

.red[disabled], .red[disabled]:hover, .red[disabled]:active {
  border-color: #C43C35;
  background: #C43C35;
  color: #FFD3D3;
}

.blue[disabled], .blue[disabled]:hover, .blue[disabled]:active {
  border-color: #269CE9;
  background: #269CE9;
  color: #93D5FF;
}
</style>
