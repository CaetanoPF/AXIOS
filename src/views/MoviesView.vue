<script setup>
import { ref, onMounted } from 'vue';

const API_KEY = 'd341436234a2bb8f0adc73114e093ab2';
const BASE_URL = 'https://api.themoviedb.org/3';

const movies = ref([]);
const genres = ref([]);
const selectedGenre = ref(null);
const searchQuery = ref('');
const selectedMovie = ref(null);
const currentPage = ref(1);
const totalPages = ref(1);
const loading = ref(false);

const fetchGenres = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=pt-BR`
    );
    const data = await response.json();
    genres.value = data.genres;
  } catch (error) {
    console.error('Erro ao buscar gêneros:', error);
  }
};

const fetchMovies = async (genreId = '', page = 1) => {
  loading.value = true;
  try {
    const url = genreId
      ? `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=pt-BR&page=${page}`
      : `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR&page=${page}`;

    const response = await fetch(url);
    const data = await response.json();
    movies.value = data.results;
    totalPages.value = data.total_pages;
    currentPage.value = page;
    selectedGenre.value = genreId;
  } catch (error) {
    console.error('Erro ao buscar filmes:', error);
  } finally {
    loading.value = false;
  }
};

const searchMovies = async () => {
  if (!searchQuery.value) {
    fetchMovies('', 1);
    return;
  }

  loading.value = true;
  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${searchQuery.value}&language=pt-BR&page=${currentPage.value}`
    );
    const data = await response.json();
    movies.value = data.results;
    totalPages.value = data.total_pages;
  } catch (error) {
    console.error('Erro na busca:', error);
  } finally {
    loading.value = false;
  }
};

const showMovieDetails = async (movie) => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movie.id}?api_key=${API_KEY}&language=pt-BR&append_to_response=credits,videos`
    );
    const detailedMovie = await response.json();
    selectedMovie.value = detailedMovie;
  } catch (error) {
    console.error('Erro ao buscar detalhes do filme:', error);
  }
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('pt-BR');
};

const changePage = (page) => {
  if (selectedGenre.value) {
    fetchMovies(selectedGenre.value, page);
  } else if (searchQuery.value) {
    currentPage.value = page;
    searchMovies();
  } else {
    fetchMovies('', page);
  }
};

onMounted(() => {
  fetchGenres();
  fetchMovies();
});
</script>

<template>
  <div class="movies">
    <div class="filters">
      <div class="search-container">
        <input type="text" v-model="searchQuery" @keyup.enter="searchMovies" placeholder="Buscar filmes...">
        <button @click="searchMovies">Buscar</button>
      </div>

      <div class="genres">
        <button @click="fetchMovies('', 1)" :class="{ active: !selectedGenre }">
          Todos
        </button>
        <button v-for="genre in genres" :key="genre.id" @click="fetchMovies(genre.id, 1)"
          :class="{ active: selectedGenre === genre.id }">
          {{ genre.name }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <div class="loader"></div>
    </div>

    <div v-else class="movies-grid">
      <div v-for="movie in movies" :key="movie.id" class="movie-card" @click="showMovieDetails(movie)">
        <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" :alt="movie.title"
          @error="$event.target.src = '/placeholder-poster.jpg'">
        <div class="movie-info">
          <h3>{{ movie.title }}</h3>
          <div class="movie-meta">
            <span class="rating">★ {{ movie.vote_average.toFixed(1) }}</span>
            <span class="year">{{ movie.release_date?.split('-')[0] }}</span>
          </div>
        </div>
      </div>
    </div>


    <div class="pagination" v-if="totalPages > 1">
      <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
        Anterior
      </button>
      <span>Página {{ currentPage }} de {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">
        Próxima
      </button>
    </div>


    <div v-if="selectedMovie" class="modal" @click="selectedMovie = null">
      <div class="modal-content" @click.stop>
        <button class="close-button" @click="selectedMovie = null">&times;</button>

        <div class="modal-header">
          <img :src="`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`" :alt="selectedMovie.title">
          <div class="modal-info">
            <h2>{{ selectedMovie.title }}</h2>
            <p class="tagline">{{ selectedMovie.tagline }}</p>

            <div class="meta-info">
              <span class="rating">★ {{ selectedMovie.vote_average.toFixed(1) }}</span>
              <span>{{ formatDate(selectedMovie.release_date) }}</span>
              <span>{{ selectedMovie.runtime }} min</span>
            </div>

            <div class="genres-tags">
              <span v-for="genre in selectedMovie.genres" :key="genre.id">
                {{ genre.name }}
              </span>
            </div>

            <p class="overview">{{ selectedMovie.overview }}</p>

            <div class="cast" v-if="selectedMovie.credits?.cast?.length">
              <h3>Elenco Principal</h3>
              <div class="cast-list">
                <div v-for="actor in selectedMovie.credits.cast.slice(0, 5)" :key="actor.id">
                  {{ actor.name }} como {{ actor.character }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="trailer-section" v-if="selectedMovie.videos?.results?.length">
          <h3>Trailer</h3>
          <iframe :src="`https://www.youtube.com/embed/${selectedMovie.videos.results[0].key}`" frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.movies {
  padding: 2rem;
}

.filters {
  margin-bottom: 2rem;
}

.search-container {
  margin-bottom: 1rem;
  display: flex;
  gap: 0.5rem;
}

.search-container input {
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.genres {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.genres button {
  padding: 0.5rem 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.genres button.active {
  background-color: #e50914;
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.movie-card {
  position: relative;
  cursor: pointer;
  transition: transform 0.2s;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  overflow: hidden;
}

.movie-card:hover {
  transform: scale(1.05);
}

.movie-card img {
  width: 100%;
  aspect-ratio: 2/3;
  object-fit: cover;
}

.movie-info {
  padding: 1rem;
}

.movie-meta {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
}

.rating {
  color: #ffd700;
}

.year {
  color: #999;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  margin-top: 2rem;
}

.pagination button {
  padding: 0.5rem 1rem;
  background-color: #e50914;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #666;
  cursor: not-allowed;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.loader {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-radius: 50%;
  border-top: 5px solid #e50914;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background-color: #141414;
  border-radius: 8px;
  max-width: 1000px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  padding: 2rem;
}

.close-button {
  position: absolute;
  right: 1rem;
  top: 1rem;
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
}

.modal-header {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

.modal-header img {
  width: 300px;
  border-radius: 8px;
}

.modal-info {
  flex: 1;
}

.tagline {
  color: #999;
  font-style: italic;
  margin: 1rem 0;
}

.meta-info {
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
}

.genres-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.genres-tags span {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.overview {
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.cast {
  margin-bottom: 1.5rem;
}

.cast-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 0.5rem;
}

.trailer-section {
  margin-top: 2rem;
}

.trailer-section iframe {
  width: 100%;
  aspect-ratio: 16/9;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .modal-header {
    flex-direction: column;
  }

  .modal-header img {
    width: 100%;
  }

  .genres {
    justify-content: center;
  }
}
</style>