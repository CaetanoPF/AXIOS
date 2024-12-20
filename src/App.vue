<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const isMenuOpen = ref(false);
const router = useRouter();

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const navigateTo = (route) => {
  router.push(route);
  isMenuOpen.value = false;
};
</script>

<template>
  <div class="app">
    <header>
      <div class="header-content">
        <RouterLink class="cine-logo" to="/"> <img src="../src/assets/imagens/cinekeeflogo.png" alt=""> </RouterLink>

        <nav>
          <div class="nav-links">
            <RouterLink to="/" active-class="active">Home</RouterLink>
            <RouterLink to="/movies" active-class="active">Filmes</RouterLink>
            <RouterLink to="/series" active-class="active">Séries</RouterLink>
          </div>
          <button class="menu-button" @click="toggleMenu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </nav>
      </div>
    </header>

    <div class="mobile-menu" :class="{ 'open': isMenuOpen }">
      <div class="mobile-nav-links">
        <a @click="navigateTo('/')" :class="{ active: $route.path === '/' }">Home</a>
        <a @click="navigateTo('/movies')" :class="{ active: $route.path === '/movies' }">Filmes</a>
        <a @click="navigateTo('/series')" :class="{ active: $route.path === '/series' }">Séries</a>
      </div>
    </div>

    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.cine-logo img {
  width: 5rem;
  height: 3.5rem;
}

.app {
  font-family: Arial, sans-serif;
  background-color: #141414;
  min-height: 100vh;
  color: white;
}

header {
  background-color: rgba(0, 0, 0, 0.9);
  padding: 1rem 2rem;
  position: fixed;
  width: 100%;
  z-index: 100;
  backdrop-filter: blur(10px);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}

h1 {
  color: #e50914;
  font-size: 2rem;
  cursor: pointer;
}

nav {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-size: 1.1rem;
  transition: color 0.3s;
}

.nav-links a:hover,
.nav-links a.active {
  color: #e50914;
}

.menu-button {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  padding: 5px;
  cursor: pointer;
}

.menu-button span {
  display: block;
  width: 25px;
  height: 3px;
  background-color: white;
  transition: 0.3s;
}

.mobile-menu {
  display: none;
  position: fixed;
  top: 70px;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.95);
  transform: translateY(-100%);
  transition: transform 0.3s ease;
  z-index: 90;
}

.mobile-menu.open {
  transform: translateY(0);
}

.mobile-nav-links {
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.mobile-nav-links a {
  color: white;
  text-decoration: none;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
}

.mobile-nav-links a:hover,
.mobile-nav-links a.active {
  color: #e50914;
}

main {
  padding-top: 70px;
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }

  .menu-button {
    display: flex;
  }

  .mobile-menu {
    display: block;
  }
}
</style>