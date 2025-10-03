<template>
  <div class="blogContainer bg-light">
    <!-- Header -->
    <div class="navBar">
      <div class="titleContainer">
        <h1 class="title m-0 p-0">&lt;WRONG BUT WORKED&gt;</h1>
        <p class="subtitle m-0 p-0">That’s Not How It’s Done, but It Worked for Me.</p>
      </div>
      <nav class="navbar navbar-expand-lg bg-body-tertiary m-0 p-0">
        <div class="container-fluid">
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div class="navbar-nav ms-auto">
              <a class="nav-link" href="" @click.prevent="activate('Posts')">Posts</a>
              <a class="nav-link" href="" @click.prevent="activate('About')">About Me</a>
              <a class="nav-link" href="" @click.prevent="activate('Contact')">Contact</a>
              <span class="portfolioLink">
                <router-link
                  class="nav-link"
                  to="/"
                  :class="{ active: $route.path === '/' }"
                  style="color: #f20c7b"
                >
                  Go to my Portfolio
                </router-link>
              </span>
            </div>
          </div>
        </div>
      </nav>
    </div>

    <!-- Content -->
    <div class="blogContent">
      <HomeBlog v-if="activeView === 'HomeBlog'" />
      <PostListBlog v-if="activeView === 'PostListBlog'" />
      <ProjectsBlog v-else-if="activeView === 'ProjectsBlog'" />
      <AboutBlog v-else-if="activeView === 'AboutBlog'" />
      <ContactBlog v-else-if="activeView === 'ContactBlog'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import HomeBlog from '@/components/BlogScreens/HomeBlog.vue'
import PostListBlog from '@/components/BlogScreens/PostListBlog.vue'
import ProjectsBlog from '@/components/BlogScreens/ProjectsBlog.vue'
import AboutBlog from '@/components/BlogScreens/AboutBlog.vue'
import ContactBlog from '@/components/BlogScreens/ContactBlog.vue'

const activeView = ref<string>('PostListBlog')
function activate(option: 'Posts' | 'Projects' | 'About' | 'Contact') {
  switch (option) {
    case 'Posts':
      activeView.value = 'PostListBlog'
      break
    case 'Projects':
      activeView.value = 'ProjectsBlog'
      break
    case 'About':
      activeView.value = 'AboutBlog'
      break
    case 'Contact':
      activeView.value = 'ContactBlog'
      break
    default:
      activeView.value = 'PostListBlog'
  }
}
</script>

<style scoped lang="scss">
@use '@/styles/colors' as *;
.blogContainer {
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}
.navBar {
  position: sticky;
  top: 0%;
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid rgb(20, 16, 16);
  color: rgb(100, 100, 100);
  padding: 1rem;
  z-index: 1040;
}
.title {
  width: fit-content;
  font-weight: 800;
}
.subtitle {
  width: 100%;
  text-align: center;
  position: relative;
  top: -0.5rem;
  font-weight: 600;
}
.navbar-nav {
  margin-top: 0.5rem;
}
.nav-link {
  padding: 0.25rem;
}
.portfolioLink {
  background-color: rgb(165, 236, 227);
  background-color: rgb(58, 55, 55);
  border-radius: 0.7rem;
  color: $brilliantBlue;
  text-shadow: 0rem 0rem 0.2rem rgb(56, 141, 56);
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
.blogContent {
  flex: 1;
  min-height: 0;
  overflow: auto;
}
@media (max-width: 576px) {
  .blogContainer {
    display: flex !important;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
  }
  .navBar {
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
  }
  .titleContainer {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
    padding-right: 3rem;
  }
  .title {
    font-size: 1.4rem;
    margin: 0;
  }
  .subtitle {
    font-size: 0.8rem;
    margin: 0;
    top: 0;
  }
  .navBar .navbar {
    position: static;
    background: transparent;
    box-shadow: none;
  }
  .navBar .navbar-toggler {
    position: absolute;
    top: 0.5rem;
    right: 1rem;
    z-index: 1050;
    margin: 0;
    border: none;
  }
  .navBar .navbar-collapse,
  .navBar .collapsing {
    position: absolute;
    top: 100%;
    right: 0;
    width: 44%;
    // background: #f8f9fa;
    background: #f8f9faa6;
    border-left: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    padding: 1rem;
    z-index: 1040;
  }
  .navBar .collapsing {
    height: auto !important;
    transition: none !important;
    overflow: visible !important;
  }
  .navBar .navbar-collapse {
    transform-origin: top right;
    transition:
      transform 200ms ease,
      opacity 200ms ease;
  }
  .navBar .navbar-collapse:not(.show) {
    transform: scaleY(0);
    opacity: 0;
    pointer-events: none;
  }
  .navBar .navbar-collapse.show {
    transform: scaleY(1);
    opacity: 1;
  }
  .navBar .navbar-collapse .navbar-nav {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  .navBar .navbar-collapse .nav-link {
    padding: 0.5rem 0;
  }
}
</style>
