<script setup>
import { RouterView } from "vue-router";
import TopNav from "./components/common/TopNav.vue";
import FooterPage from "./components/common/FooterPage.vue";
</script>

<template>
  <div>
    <TopNav></TopNav>
    <router-view></router-view>
    <FooterPage></FooterPage>
  </div>
</template>

<style scoped></style>
