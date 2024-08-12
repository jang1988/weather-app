<template>
    <div>
      <canvas id="temperatureChart"></canvas>
    </div>
  </template>
  
  <script>
  import { Chart, registerables } from 'chart.js';
  import axios from 'axios';
  
  Chart.register(...registerables);
  
  export default {
    props: {
      city: String,
      apiKey: String
    },
    async mounted() {
      if (this.city && this.apiKey) {
        await this.fetchWeatherData();
      }
    },
    methods: {
      async fetchWeatherData() {
        try {
          const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
            params: {
              q: this.city,
              appid: this.apiKey,
              units: 'metric',
              cnt: 8 // кількість 3-годинних інтервалів на день
            }
          });
  
          const temperatures = response.data.list.map(item => item.main.temp);
          const labels = response.data.list.map(item => new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  
          this.renderChart(labels, temperatures);
        } catch (e) {
          console.error('Failed to fetch weather data', e);
        }
      },
      renderChart(labels, temperatures) {
        new Chart(document.getElementById('temperatureChart').getContext('2d'), {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: 'Temperature (°C)',
              data: temperatures,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Time'
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Temperature (°C)'
                },
                beginAtZero: true
              }
            }
          }
        });
      }
    }
  };
  </script>
  
  <style scoped>
  /* Optional: Style the canvas element if needed */
  canvas {
    max-width: 100%;
    height: auto;
  }
  </style>
  