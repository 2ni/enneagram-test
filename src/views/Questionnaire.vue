<template>
  <div id="questionnaire">
    <!-- {{answers}} {{numberOfQuestions}} -->
    <ul v-bind:class="{hidden: showResults}">
      <li v-for="q in questions" :key="q.question | hash">
        <div class="question" v-bind:class="{error: hasError.indexOf($options.filters.hash(q.question)) > -1}">{{q.type}} {{q.question}}</div>
        <div class="answerBlock">
          <div>
            <input :checked="getStoredAnswer(q) === 1" v-on:change="questionAnswered" type="radio" :name="q.question | hash" value="yes" :id="getID(q.question, 'y')" :data-type="q.type">
            <label :for="getID(q.question, 'y')" class="medium green button">Ja</label>
            <check-icon class="isSelected green" />
          </div>
          <div>
            <input :checked="getStoredAnswer(q) === -1" class="answer_no" v-on:change="questionAnswered" type="radio" :name="q.question | hash" value="no" :id="getID(q.question, 'n')" :data-type="q.type">
            <label :for="getID(q.question, 'n')" class="medium red button">Nein</label>
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
      <button class="large green button" v-on:click="clearAll">Neu starten</button>
    </div>
  </div>
</template>

<script>
import QUESTIONS from '../questions.json'

export default {
  title: 'Enneagramm Fragebogen',
  data () {
    return {
      questions: shuffle(QUESTIONS),
      numberOfQuestions: {},
      storedQuestions: [],
      storedAnswers: {},
      openQuestions: [],
      answers: {},
      hasError: [],
      showResults: false
    }
  },
  created () {
    try {
      this.storedQuestions = JSON.parse(localStorage.getItem('storedQuestions')) || []
      this.storedAnswers = JSON.parse(localStorage.getItem('storedAnswers')) || {}
    } catch (e) {
    }

    // set order according to saved questions
    const mapOrder = (array, order) => {
      array.sort((a, b) => {
        const A = this.getID(a.question)
        const B = this.getID(b.question)
        return order.indexOf(A) > order.indexOf(B) ? -1 : 1
      })
    }

    // if not all questions are saved, the known questions are saved at the end
    const order = [...this.storedQuestions]
    order.reverse()
    mapOrder(this.questions, order)

    this.init()
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
    init: function () {
      if (this.$route.query.q) {
        this.questions = this.questions.slice(0, this.$route.query.q)
      }

      this.numberOfQuestions.total = this.questions.length
      this.questions.forEach(question => {
        const id = this.getID(question.question)
        const answer = this.storedAnswers[id] || 0

        this.$set(this.answers, parseInt(question.type), (this.answers[question.type] + answer) || Math.max(0, answer))
        this.$set(this.numberOfQuestions, parseInt(question.type), (this.numberOfQuestions[question.type] + 1) || 1)

        // saved answers can be 1=ja, -1=nein, 0=unanswered
        if (!Math.abs(answer)) {
          this.openQuestions.push(this.$options.filters.hash(question.question))
        }
      })
      this.$emit('updateStatus', this.status)
    },
    getStoredAnswer: function (question) {
      return this.storedAnswers[this.getID(question.question)] || 0
    },
    getID: function (question, type = '') {
      return (type ? type + '-' : '') + this.$options.filters.hash(question)
    },
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

      // store questions and its order on 1st answer
      const newQuestions = []
      this.questions.forEach(question => {
        const id = this.getID(question.question)
        newQuestions.push(id)
        // this.$set(this.storedQuestions, id, 0)
      })
      this.storedQuestions = newQuestions

      // save new anwser
      const idQuestion = e.target.id.substr(2)
      this.storedAnswers[idQuestion] = diff
      try {
        localStorage.setItem('storedQuestions', JSON.stringify(this.storedQuestions))
        localStorage.setItem('storedAnswers', JSON.stringify(this.storedAnswers))
      } catch (e) {
      }

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
    },
    clearAll: function (e) {
      localStorage.clear()
      this.storedAnswers = {}
      this.storedQuestions = []
      this.init()
      this.showResults = false
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

#results button {
  margin-top: 1rem;
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

</style>
