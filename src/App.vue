<template>
  <div id="app">
    <WeatherComponent
      :city="city"
      :apiKey="apiKey"
    />
    <TemperatureChart
      :city="city"
      :apiKey="apiKey"
    />
  </div>
</template>

<script>
import WeatherComponent from './components/WeatherComponent.vue';
import TemperatureChart from './components/TemperatureChart.vue';

export default {
  components: {
    WeatherComponent,
    TemperatureChart
  },
  data() {
    return {
      city: 'London',
      apiKey: 'd4ca7b13602aa807403d0ca2c7f303da'
    };
  }
};
</script>
