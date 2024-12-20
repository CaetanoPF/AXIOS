import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Movies from '../views/MoviesView.vue'
import Series from '../views/SeriesView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/movies',
    name: 'Movies',
    component: Movies
  },
  {
    path: '/series',
    name: 'Series',
    component: Series
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router