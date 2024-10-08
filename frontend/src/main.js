import './assets/main.css';
import './assets/fonts.css'; // 폰트 파일
import './assets/global.css'; // 전역 스타일

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useKakao } from 'vue3-kakao-maps/@utils';
import Vue3Lottie from 'vue3-lottie';

const app = createApp(App);
const pinia = createPinia();
const kakaoApiKey = import.meta.env.VITE_VUE_APP_KAKAO_API_KEY;

pinia.use(piniaPluginPersistedstate);
useKakao(kakaoApiKey); // API 키를 useKakao 함수에 전달
app.use(pinia);
app.use(router);
app.use(Vue3Lottie, { name: 'LottieAnimation' });
app.mount('#app');
