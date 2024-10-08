<script setup>
import WordAnimation from "@/components/Landing/WordAnimation.vue";
import VideoSection from "@/components/Landing/VideoSection.vue";
import { ref } from "vue";
const targetSection = ref(null);

const scrollToSection = () => {
  targetSection.value.scrollIntoView({ behavior: "smooth" });
};
</script>

<template>
  <!-- Page Main -->
  <main class="flex flex-col items-center justify-center">
    <!-- Hero -->
    <section
      class="flex flex-wrap items-center px-4 w-full 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg sm:max-w-screen-sm md:max-w-screen-md min-h-screen"
    >
      <!-- Column-1 -->
      <div class="px-3 w-full lg:w-3/5">
        <VideoSection></VideoSection>
      </div>

      <!-- Column-2 -->
      <div class="px-3 mb-12 w-full lg:mb-0 lg:w-2/5">
        <WordAnimation></WordAnimation>
        <div class="mt-12 text-center flex justify-center">
          <router-link
            :to="{ name: 'Main' }"
            class="py-4 px-4 mr-10 text-xl font-semibold tracking-wide text-white bg-blue-500 rounded cursor-pointer"
          >
            여행담 사용해보기
          </router-link>

          <button
            class="py-4 px-4 text-xl font-semibold bg-black text-white rounded border border-solid cursor-pointer"
            @click="scrollToSection"
          >
            사용 방법 알아보기
          </button>
        </div>
      </div>
    </section>

    <!-- Parallax Background -->
    <section
      class="bg-gray-400 bg-blend-multiply flex-col w-full h-[600px] bg-cover bg-fixed bg-center flex justify-center items-center bg-[url('/landingimg.jpg')]"
    >
      <h1 class="text-white text-6xl font-semibold mt-20 mb-10">
        어디로 여행을 떠나시나요?
      </h1>

      <span class="text-center font-bold my-20 text-white/90">
        <a
          href="https://egoistdeveloper.github.io/twcss-to-sass-playground/"
          target="_blank"
          class="text-white/90 hover:text-white text-lg"
        >
          여행 계획을 세워보고
        </a>

        <hr class="my-4" />

        <a
          href="https://unsplash.com/photos/8Pm_A-OHJGg"
          target="_blank"
          class="text-white/90 hover:text-white text-lg"
        >
          여러 사람들과 여행 계획을 공유하고
        </a>

        <hr class="my-4" />

        <p>
          <a
            href="https://github.com/EgoistDeveloper/my-tailwind-components/blob/main/src/templates/parallax-landing-page.html"
            target="_blank"
            class="text-white/90 hover:text-white text-lg"
          >
            여행 AI를 활용해 보세요
          </a>
        </p>
      </span>
    </section>

    <!-- Content -->
    <section class="p-20 space-y-8">
      <h1 ref="targetSection" class="text-4xl text-center my-20">
        여행담 사용 방법
      </h1>
      <div class="py-12 relative overflow-hidden bg-white">
        <div class="grid grid-cols-2 max-w-screen-lg mx-auto">
          <div class="w-full flex flex-col items-end pr-16">
            <h2
              class="text-[#64618C] font-bold text-2xl max-w-xs text-right mb-12 mt-10"
            >
              1. 여행 계획을 세워요
            </h2>
            <div class="h-full mt-auto overflow-hidden relative">
              <img
                class="h-full w-full object-contain"
                alt=""
              />
            </div>
          </div>

          <div
            class="py-20 bg-slate-100 relative before:absolute before:h-full before:w-screen before:bg-sky-950 before:top-0 before:left-0"
          >
            <div class="relative z-20 pl-12">
              <h2 class="text-[#f7d0b6] font-black text-5xl leading-snug mb-10">
                여행 계획을 <br />세워보세요
              </h2>
              <p class="text-white text-sm">
                여행담이 당신의 여행 계획을 도와드려요
              </p>
              <button
                class="mt-8 text-white uppercase py-3 text-sm px-10 border border-white hover:bg-white hover:bg-opacity-10"
              >
                Talk with Service
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="py-4 relative overflow-hidden bg-white">
        <div class="grid grid-cols-2 max-w-screen-lg mx-auto">
          <div
            class="py-20 bg-slate-100 relative before:absolute before:h-full before:w-screen before:bg-[#f7d0b6] before:top-0 before:right-0"
          >
            <div class="relative z-20 pl-12">
              <h2 class="text-sky-950 font-black text-5xl leading-snug mb-10">
                여행계획을 <br />공유해보아요
              </h2>
              <p class="text-sky-950 text-sm">
                여행담이 당신의 여행 계획 공유를 도와드려요
              </p>
              <button
                class="mt-8 text-sky-950 uppercase py-3 text-sm px-10 border border-sky-950 hover:bg-white hover:bg-opacity-10"
              >
                Talk with Service
              </button>
            </div>
          </div>
          <div class="w-full flex flex-col pl-16">
            <h2
              class="text-[#64618C] font-bold text-2xl max-w-xs text-left mb-12 mt-10"
            >
              2. 여행 계획을 공유해요
            </h2>
            <div class="h-full mt-auto overflow-hidden relative">
              <img
                class="h-full w-full object-contain"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>

      <div class="py-12 relative overflow-hidden bg-white">
        <div class="grid grid-cols-2 max-w-screen-lg mx-auto">
          <div class="w-full flex flex-col items-end pr-16">
            <h2
              class="text-[#64618C] font-bold text-2xl max-w-xs text-right mb-12 mt-10"
            >
              3. AI를 활용해요
            </h2>
            <div class="h-full mt-auto overflow-hidden relative">
              <img
                class="h-full w-full object-contain"
                alt=""
              />
            </div>
          </div>

          <div
            class="py-20 bg-slate-100 relative before:absolute before:h-full before:w-screen before:bg-sky-950 before:top-0 before:left-0"
          >
            <div class="relative z-20 pl-12">
              <h2 class="text-[#f7d0b6] font-black text-5xl leading-snug mb-10">
                AI를 활용해서 <br />길을 찾고, <br />추천도 받아보세요
              </h2>
              <p class="text-white text-sm">
                여행담과 AI가 당신의 여행계획을 도와드려요
              </p>
              <button
                class="mt-8 text-white uppercase py-3 text-sm px-10 border border-white hover:bg-white hover:bg-opacity-10"
              >
                Talk with Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped></style>
