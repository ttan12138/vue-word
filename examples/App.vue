<template>
  <div style="width: 800px;height:800px;position: relative;">
    <WordEditor  ref="WordEditor" :tooltip="true"  :footer="true" />
  </div>
  
</template>

<script>
export default {
  name: 'App',
  components: {
  },
  mounted(){
    this.$refs.WordEditor.parseReport(``)
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
