<template>
  <div>
    <input
      v-model="query"
      @input="fetchCities"
      placeholder="Enter city"
    />
    <ul v-if="cities.length">
      <li v-for="city in cities" :key="city.id" @click="selectCity(city.name)">
        {{ city.name }}
      </li>
    </ul>
    <div v-if="weather" class="weather-card">
      <h1>{{ weather.name }}</h1>
      <p class="weather-description">{{ weather.weather[0].description }}</p>
      <div class="weather-details">
        <p><strong>Temperature:</strong> {{ weather.main.temp }}°C</p>
        <p><strong>Humidity:</strong> {{ weather.main.humidity }}%</p>
        <p><strong>Wind Speed:</strong> {{ weather.wind.speed }} m/s</p>
      </div>
      <img :src="`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`" alt="weather icon" class="weather-icon" />
    </div>
    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    city: String,
    apiKey: String
  },
  data() {
    return {
      query: '',
      cities: [],
      weather: null,
      error: null
    };
  },
  async mounted() {
    if (this.city && this.apiKey) {
      await this.fetchWeatherData();
    }
  },
  methods: {
    async fetchCities() {
      if (this.query.length < 3) {
        this.cities = [];
        return;
      }
      try {
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/find`, {
          params: {
            q: this.query,
            appid: this.apiKey,
            type: 'like',
            cnt: 10
          }
        });
        this.cities = response.data.list;
      } catch (e) {
        this.error = 'Failed to fetch city data';
      }
    },
    async selectCity(cityName) {
      this.query = cityName;
      this.cities = [];
      this.error = null;
      await this.fetchWeatherData();
    },
    async fetchWeatherData() {
      if (!this.city || !this.apiKey) return;
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
          params: {
            q: this.city,
            appid: this.apiKey,
            units: 'metric'
          }
        });
        this.weather = response.data;
      } catch (e) {
        this.error = 'Failed to fetch weather data';
      }
    }
  }
};
</script>

<style scoped>
.weather-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  background-color: #f9f9f9;
  max-width: 300px;
  margin: 16px auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.weather-description {
  font-size: 1.2em;
  margin: 8px 0;
}

.weather-details {
  font-size: 1em;
  margin: 8px 0;
}

.weather-icon {
  width: 100px;
  height: 100px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  cursor: pointer;
  padding: 5px;
}

li:hover {
  background-color: #f0f0f0;
}

.error {
  color: red;
  text-align: center;
  margin-top: 16px;
}
</style>
