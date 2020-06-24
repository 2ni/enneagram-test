<template>
  <div id="app">
    <div id="nav">
      <router-link to="/" exact>Home</router-link> |
      <router-link to="/test">Test</router-link>
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

a {
  color: #fff;
  display: inline-block;
  transition: .3s;
  font-weight:bold;
  text-decoration:none;
}

a:hover {
  -webkit-transform: scale(1.2);
  transform: scale(1.2);
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

.button.green, .button.red {
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

</style>
