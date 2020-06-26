<template>
  <div id="home">
    <h1>Das Enneagramm - die Lehre von Persönlichkeiten</h1>
    <Enneagram width="15rem" />
    <p>
    Das Enneagramm ist eine Typenlehre zur Beschreibung verschiedener Persönlichkeitsstrukturen. Hier kannst Du anonym einen <router-link class="link" :to="{name: 'Questionnaire'}">Fragebogen</router-link> ausfüllen, der Dir Hinweise zu Deiner Struktur gibt.
    </p>
    <p>
    Wichtig zu wissen, ist, dass der Fragebogen nur mögliche Tendenzen aufzeigt. Das Enneagramm ist ein viel zu komplexes System um mittels eines 5-minütigen Tests ein plausibles Resultat abzugeben. Nichts desto trotz kann das Resultat Dir wichtige Hinweise mitgeben, in welche Richtung Du beginnen kannst zu schauen.
    </p>
    <p>
    Du solltest die ~100 Fragen zügig beantworten und nicht mehr als 10 Minuten benötigen (max 5sec pro Frage).
    </p>
    <p>
    In diesem Sinne viel Spass beim Ausfüllen!
    </p>
    <div>
      <router-link :to="{name: 'Questionnaire'}" class="large green button">zum Fragebogen</router-link>
    </div>
    <h4>Weitere Ressourcen zum Enneagramm</h4>
    <ul>
      <li><a class="link" href='https://biancamerz.ch'>Professionelles Enneagramm Coaching</a></li>
      <li><a class="link" href='http://enneagramm-forum.ch/'>Enneagramm Forum Schweiz</a></li>
      <li><a class="link" href='https://enneagramgermany.de/'>Enneagramm Germany</a></li>
    </ul>
    <!---
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    -->
  </div>
</template>

<script>
import Enneagram from '@/enneagramm_circle.vue'
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  title: 'Enneagramm',
  name: 'Home',
  components: {
    Enneagram
    // HelloWorld
  }
}
</script>

<style scoped>
#home {
  text-align: center;
}

#home ul {
  list-style-type: none;
  padding: 0;
}
</style>
