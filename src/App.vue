<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/questionnaire">Questionnaire</router-link>
    </div>
    <div id="status" :class="status ? 'statusVisible' : 'statusHidden'">{{status}}</div>
    <router-view class="content" :class="status ? 'contentWithStatus' : 'contentWithOutStatus'" @updateStatus="updateStatus"/>
    <div id="shim"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      status: ''
    }
  },
  methods: {
    updateStatus: function (status) {
      this.status = status
    }
  }
}
</script>

<style>
body {
  height: 100%;
  margin: 0;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-image: linear-gradient(-120deg, #8bc9ab 0%, #fff 100%);
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav {
  color: #fff;
  height: 3rem;
  background-color: #285657;
  text-align: center;
  position: fixed;
  width: 100%;
  left: 0rem;
  right: 0rem;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

#nav a {
  color: #fff;
  font-weight: bold;
  padding: 0 .5rem;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.statusVisible {
  display: flex;
}

.statusHidden {
  display: none;
}

#status {
  height: 2rem;
  background-color: #8bc8c9;
  font-weight: bold;
  width: 100%;
  position: fixed;
  top: 3rem;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.contentWithStatus {
  margin-top: 6rem;
}

.contentWithOutStatus {
  margin-top: 5rem;
}

.content {
  border: 1px solid black;
  max-width: 1024px;
  margin-left: auto;
  margin-right: auto;
}

#shim {
  z-index: 50;
  opacity: .75;
  filter: alpha(opacity=75);
  -ms-filter: "alpha(opacity=75)";
  -khtml-opacity: .75;
  -moz-opacity: .75;
  background: #B8B8B8;
  position: absolute;
  left: 0px;
  top: 0px;
  height: 100%;
  width: 100%;
  display: none;
}

</style>
