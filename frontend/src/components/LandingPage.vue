<script setup>
// ToDo : 삭제필요
</script>

<template>
  <section
    class="bg-center bg-cover bg-no-repeat bg-[url('/landingimg.jpg')] bg-gray-700 bg-blend-multiply"
  >
    <div class="px-4 mx-auto max-w-screen-xl text-center py-24 lg:py-56">
      <h1
        class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl"
      >
        어디로 여행을 떠나시나요?
      </h1>
      <p
        class="mb-8 text-lg font-normal text-gray-300 lg:text-xl sm:px-16 lg:px-48"
      >
        Here at Flowbite we focus on markets where technology, innovation, and
        capital can unlock long-term value and drive economic growth.
      </p>
      <div
        class="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4"
      >
        <router-link
          :to="{ name: 'Main' }"
          class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
        >
          Get started
          <svg
            aria-hidden="true"
            class="ml-2 -mr-1 w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </router-link>
        <router-link
          :to="{ name: 'List' }"
          class="inline-flex justify-center hover:text-gray-900 items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg border border-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-400"
        >
          Board
        </router-link>
      </div>
      <!-- 소셜 미디어 아이콘 -->
      <div class="flex justify-center space-x-10 mt-20">
        <!-- 인스타그램 -->
        <a href="https://instagram.com" class="text-white hover:text-gray-300">
          <svg width="50" height="50" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zM12 7a5 5 0 100 10 5 5 0 000-10zm5.25-.75a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5zM12 10a2 2 0 110 4 2 2 0 010-4z"
            />
          </svg>
        </a>
        <!-- 페이스북 -->
        <a href="https://facebook.com" class="text-white hover:text-gray-300">
          <svg width="50" height="50" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M12 2.04c-5.5 0-10 4.48-10 10.02 0 5 3.66 9.14 8.44 9.88v-7h-2.54V12h2.54V9.42c0-2.5 1.5-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.8l-.45 2.94h-2.35v7.88C18.34 21.16 22 16.98 22 12.06c0-5.54-4.5-10.02-10-10.02z"
            />
          </svg>
        </a>
        <!-- 트위터 -->
        <a href="https://twitter.com" class="text-white hover:text-gray-300">
          <svg width="50" height="50" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"
            />
          </svg>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
