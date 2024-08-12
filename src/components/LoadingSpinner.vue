<template>
  <div class="weather-block">
    <input
      v-model="city"
      @input="searchCity"
      :placeholder="$t('enterCity')"
    />
    <ul v-if="suggestions.length > 0" class="suggestions">
      <li
        v-for="suggestion in suggestions"
        :key="suggestion"
        @click="selectCity(suggestion)"
      >
        {{ suggestion }}
      </li>
    </ul>
    <button @click="getWeather">{{ $t('getWeather') }}</button>
    <loading-spinner v-if="loading"></loading-spinner>
    <div v-else-if="weatherData" class="weather-info">
      <h2>{{ weatherData.name || city }}</h2>
      <p>{{ $t("temperature") }}: {{ weatherData.main.temp }}°C</p>
      <p>
        {{ $t("description") }}:
        {{ weatherData.weather[0].description }}
      </p>
      <canvas ref="temperatureChart"></canvas>
      <button @click="toggleForecastType">
        {{
          forecastType === "daily"
            ? $t("showWeekly")
            : $t("showDaily")
        }}
      </button>
      <button @click="toggleFavorite">
        {{
          isFavorite
            ? $t("removeFromFavorites")
            : $t("addToFavorites")
        }}
      </button>
    </div>
    <button @click="$emit('remove')">{{ $t("removeBlock") }}</button>
  </div>
</template>

<script>
import axios from "axios";
import Chart from "chart.js/auto";
import LoadingSpinner from "./LoadingSpinner.vue";

export default {
  name: "WeatherBlock",
  components: {
    LoadingSpinner,
  },
  data() {
    return {
      city: "",
      suggestions: [],
      weatherData: null,
      forecastData: null,
      isFavorite: false,
      chart: null,
      loading: false,
      forecastType: "daily",
    };
  },
  mounted() {
    this.getUserLocation();
  },
  methods: {
    async searchCity() {
      if (this.city.length < 3) return;
      try {
        const response = await axios({
          url: "http://geodb-free-service.wirefreethought.com/v1/geo/cities",
          params: {
            namePrefix: this.city,
            limit: 5,
            offset: 0,
            languageCode: this.$i18n.locale,
          },
        });
        this.suggestions = response.data.data.map(
          (city) => `${city.name}, ${city.country}`
        );
      } catch (error) {
        console.error("Error fetching city list", error);
      }
    },
    selectCity(city) {
      this.city = city;
      this.suggestions = [];
    },
    async getWeather() {
      this.loading = true;
      try {
        const endpoint =
          this.forecastType === "daily" ? "weather" : "forecast";
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/${endpoint}`,
          {
            params: {
              q: this.city,
              appid: "d4ca7b13602aa807403d0ca2c7f303da",
              units: "metric",
              lang: this.$i18n.locale,
            },
          }
        );

        if (this.forecastType === "daily") {
          this.weatherData = response.data;
          this.forecastData = null;
        } else {
          this.forecastData = response.data.list;
          this.weatherData = this.aggregateWeeklyData(this.forecastData);
        }

        this.$nextTick(() => {
          this.createChart();
        });
      } catch (error) {
        console.error("Error fetching weather data", error);
      } finally {
        this.loading = false;
      }
    },

    aggregateWeeklyData(list) {
      const tempMap = {};

      list.forEach((item) => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!tempMap[date]) {
          tempMap[date] = {
            tempSum: 0,
            count: 0,
          };
        }
        tempMap[date].tempSum += item.main.temp;
        tempMap[date].count += 1;
      });

      return Object.keys(tempMap).map((date) => ({
        date,
        temp: (tempMap[date].tempSum / tempMap[date].count).toFixed(2),
      }));
    },

    createChart() {
      if (!this.$refs.temperatureChart) {
        return;
      }

      if (this.chart) {
        this.chart.destroy();
      }

      const ctx = this.$refs.temperatureChart.getContext("2d");
      let labels = [];
      let data = [];

      if (this.forecastType === "daily" && this.forecastData) {
        labels = this.forecastData.map((item) =>
          new Date(item.dt * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
        data = this.forecastData.map((item) => item.main.temp);
      } else if (this.forecastType === "weekly" && this.weatherData) {
        labels = this.weatherData.map((item) => item.date);
        data = this.weatherData.map((item) => item.temp);
      }

      this.chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: this.$t("temperature"),
              data: data,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
          ],
        },
      });
    },
    toggleFavorite() {
      this.isFavorite = !this.isFavorite;
      let favorites =
        JSON.parse(localStorage.getItem("favoriteCities")) || [];
      if (this.isFavorite) {
        if (favorites.length >= 5) {
          alert(this.$t("maxFavoritesReached"));
          this.isFavorite = false;
          return;
        }
        favorites.push(this.city);
      } else {
        favorites = favorites.filter((city) => city !== this.city);
      }
      localStorage.setItem("favoriteCities", JSON.stringify(favorites));
    },
    toggleForecastType() {
      this.forecastType =
        this.forecastType === "daily" ? "weekly" : "daily";
      this.getWeather();
    },
    async getUserLocation() {
      try {
        const response = await axios.get("http://ip-api.com/json");
        this.city = response.data.city;
        this.getWeather();
      } catch (error) {
        console.error("Error getting user location", error);
      }
    },
  },
};
</script>

<style scoped>
.weather-block {
  border: 1px solid #ccc;
  padding: 20px;
  margin-bottom: 20px;
}
.suggestions {
  list-style-type: none;
  padding: 0;
  margin: 0;
  border: 1px solid #ccc;
}
.suggestions li {
  padding: 5px;
  cursor: pointer;
}
.suggestions li:hover {
  background-color: #f0f0f0;
}
.weather-info {
  margin-top: 20px;
}
</style>
