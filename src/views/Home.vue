<script setup>
import { ref, onMounted } from 'vue'

const API_KEY = 'd341436234a2bb8f0adc73114e093ab2'
const BASE_URL = 'https://api.themoviedb.org/3'

const trendingMovies = ref([])
const trendingSeries = ref([])
const featuredContent = ref(null)
const showModal = ref(false)
const movieDetails = ref(null)

const fetchTrending = async () => {
  try {
    const moviesResponse = await fetch(
      `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=pt-BR`,
    )
    const moviesData = await moviesResponse.json()
    trendingMovies.value = moviesData.results.slice(0, 10)

    const seriesResponse = await fetch(
      `${BASE_URL}/trending/tv/week?api_key=${API_KEY}&language=pt-BR`,
    )
    const seriesData = await seriesResponse.json()
    trendingSeries.value = seriesData.results.slice(0, 10)

    featuredContent.value = moviesData.results[0]
  } catch (error) {
    console.error('Erro ao buscar conteúdo:', error)
  }
}

const fetchMovieDetails = async (movieId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=pt-BR`
    )
    const data = await response.json()
    movieDetails.value = data
    showModal.value = true
  } catch (error) {
    console.error('Erro ao buscar detalhes do filme:', error)
  }
}

const closeModal = () => {
  showModal.value = false
  movieDetails.value = null
}

const handleFeaturedClick = () => {
  if (featuredContent.value) {
    fetchMovieDetails(featuredContent.value.id)
  }
}

onMounted(() => {
  fetchTrending()
})
</script>

<template>
  <div class="home">
    <section v-if="featuredContent" class="hero">
      <div class="featured-content">
        <div class="featured-info">
          <h2>{{ featuredContent.title }}</h2>
          <p>{{ featuredContent.overview }}</p>
          <button class="featured-button" @click="handleFeaturedClick">Ver Mais</button>
        </div>
        <div
          class="featured-backdrop"
          :style="{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${featuredContent.backdrop_path})`,
          }"
        ></div>
      </div>
    </section>

    
    <div v-if="showModal" class="modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.9); z-index: 1000; display: flex; align-items: center; justify-content: center;">
      <div style="background: #141414; padding: 20px; border-radius: 8px; max-width: 800px; max-height: 90vh; overflow-y: auto; position: relative; margin: 20px;">
        <button @click="closeModal" style="position: absolute; right: 10px; top: 10px; background: none; border: none; color: white; font-size: 24px; cursor: pointer;">&times;</button>
        
        <div v-if="movieDetails" style="color: white;">
          <h2 style="margin-bottom: 15px;">{{ movieDetails.title }}</h2>
          <div style="display: flex; gap: 20px; margin-bottom: 20px;">
            <img 
              :src="`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`" 
              :alt="movieDetails.title"
              style="width: 200px; border-radius: 8px;"
            />
            <div>
              <p style="margin-bottom: 10px;"><strong>Avaliação:</strong> ★ {{ movieDetails.vote_average.toFixed(1) }}</p>
              <p style="margin-bottom: 10px;"><strong>Lançamento:</strong> {{ new Date(movieDetails.release_date).toLocaleDateString('pt-BR') }}</p>
              <p style="margin-bottom: 10px;"><strong>Duração:</strong> {{ movieDetails.runtime }} minutos</p>
              <p style="margin-bottom: 10px;"><strong>Gêneros:</strong> {{ movieDetails.genres.map(g => g.name).join(', ') }}</p>
              <p><strong>Sinopse:</strong><br>{{ movieDetails.overview }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <section class="content-section">
      <h2>Filmes em Alta</h2>
      <div class="content-grid">
        <div v-for="movie in trendingMovies" :key="movie.id" class="content-card">
          <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" :alt="movie.title" />
          <div class="content-info">
            <h3>{{ movie.title }}</h3>
            <span class="rating">★ {{ movie.vote_average.toFixed(1) }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="content-section">
      <h2>Séries em Alta</h2>
      <div class="content-grid">
        <div v-for="series in trendingSeries" :key="series.id" class="content-card">
          <img :src="`https://image.tmdb.org/t/p/w500${series.poster_path}`" :alt="series.name" />
          <div class="content-info">
            <h3>{{ series.name }}</h3>
            <span class="rating">★ {{ series.vote_average.toFixed(1) }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero {
  height: 80vh;
  position: relative;
  overflow: hidden;
}

.featured-content {
  position: relative;
  height: 100%;
}

.featured-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 4rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
  z-index: 2;
}

.featured-info h2 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.featured-info p {
  max-width: 600px;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.featured-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  filter: brightness(0.5);
}

.featured-button {
  padding: 0.8rem 2rem;
  font-size: 1.1rem;
  background-color: #e50914;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.featured-button:hover {
  background-color: #f40612;
}

.content-section {
  padding: 2rem;
}

.content-section h2 {
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
}

.content-card {
  position: relative;
  cursor: pointer;
  transition: transform 0.2s;
}

.content-card:hover {
  transform: scale(1.05);
}

.content-card img {
  width: 100%;
  border-radius: 8px;
}

.content-info {
  padding: 0.5rem;
}

.content-info h3 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.rating {
  color: #ffd700;
}

@media (max-width: 768px) {
  .featured-info {
    padding: 2rem;
  }

  .featured-info h2 {
    font-size: 2rem;
  }
}
</style>