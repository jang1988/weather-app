<template>
    <div class="favorites-tab">
      <h2>{{ $t('favoriteCities') }}</h2>
      <div v-for="city in favoriteCities" :key="city" class="favorite-city">
        <h3>{{ city }}</h3>
        <button @click="removeFromFavorites(city)">{{ $t('remove') }}</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'FavoritesTab',
    data() {
      return {
        favoriteCities: []
      }
    },
    mounted() {
      this.loadFavorites()
    },
    methods: {
      loadFavorites() {
        const favorites = localStorage.getItem('favoriteCities')
        if (favorites) {
          this.favoriteCities = JSON.parse(favorites)
        }
      },
      removeFromFavorites(city) {
        const index = this.favoriteCities.indexOf(city)
        if (index > -1) {
          this.favoriteCities.splice(index, 1)
          this.saveFavorites()
        }
      },
      saveFavorites() {
        localStorage.setItem('favoriteCities', JSON.stringify(this.favoriteCities))
      }
    }
  }
  </script>
  
  <style scoped>
  .favorites-tab {
    margin-top: 20px;
  }
  .favorite-city {
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
  }
  </style>