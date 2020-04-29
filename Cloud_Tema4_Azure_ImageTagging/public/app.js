var app = new Vue({
    el: '#app',
    data() {
      return { images: [] }
    },
    mounted() {
      axios
        .get('/api/images')
        .then(response => { this.images = response.data })
    }
  })