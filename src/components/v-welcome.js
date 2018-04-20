export default {
  data() {
    return {
      welcome: true,
      dialog: true,
    }
  },
  methods: {
    openTutorial() {
      document.getElementById("welcome").style.display = "none";
      document.getElementById("tutorial1").style.display = "block";
    }
  }
}
