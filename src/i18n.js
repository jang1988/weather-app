import { createI18n } from 'vue-i18n'

const messages = {
  uk: {
    weatherApp: 'Додаток погоди',
    enterCity: 'Введіть місто',
    getWeather: 'Отримати погоду',
    temperature: 'Температура',
    description: 'Опис',
    addToFavorites: 'Додати до обраного',
    removeFromFavorites: 'Видалити з обраного',
    removeBlock: 'Видалити блок',
    confirmRemove: 'Ви впевнені, що хочете видалити цей блок?',
    lightMode: 'Світлий режим',
    darkMode: 'Темний режим',
    showWeekly: 'Показати тижневий прогноз',
    showDaily: 'Показати денний прогноз',
    favoriteCities: 'Обрані міста',
    remove: 'Видалити',
    maxFavoritesReached: 'Досягнуто максимальну кількість обраних міст (5). Видаліть одне місто, щоб додати нове.'
  },
  en: {
    weatherApp: 'Weather App',
    enterCity: 'Enter city',
    getWeather: 'Get weather',
    temperature: 'Temperature',
    description: 'Description',
    addToFavorites: 'Add to favorites',
    removeFromFavorites: 'Remove from favorites',
    removeBlock: 'Remove block',
    confirmRemove: 'Are you sure you want to remove this block?',
    lightMode: 'Light mode',
    darkMode: 'Dark mode',
    showWeekly: 'Show weekly forecast',
    showDaily: 'Show daily forecast',
    favoriteCities: 'Favorite Cities',
    remove: 'Remove',
    maxFavoritesReached: 'Maximum number of favorite cities (5) reached. Remove one to add a new one.'
  }
}

const i18n = createI18n({
  locale: 'uk', // default language
  fallbackLocale: 'en', // fallback language
  messages,
})

export default i18n