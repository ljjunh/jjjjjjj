<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  board: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['click']); // click 이벤트 정의

const handleClick = () => {
  emit('click', props.board); // 클릭 시 부모 컴포넌트로 이벤트 전달
};

function formatDateTime(dateTime) {
  // 날짜 형식 변환 함수
  const [date, time] = dateTime.split('T');
  return `${date} ${time}`;
}

function formatImgSrc(imgSrc) {
  if (!imgSrc || imgSrc.length === 0) {
    return 'https://source.unsplash.com/800x450/?nature'; // 기본 이미지 URL
  }
  // 객체의 storedName 속성을 사용하여 전체 URL 구성
  return imgSrc[0].storedName;
}
</script>

<template>
  <article
    class="bg-white p-3 mb-6 shadow transition duration-300 group transform hover:-translate-y-2 hover:shadow-2xl rounded-2xl cursor-pointer border"
    @click="handleClick"
  >
    <div class="relative mb-4 rounded-2xl">
      <div
        class="min-h-[30vh] max-h-[30vh] rounded-2xl w-full bg-contain bg-no-repeat bg-center object-cover transition-transform duration-300 transform group-hover:scale-105"
        :style="{ backgroundImage: `url(${formatImgSrc(board.imageUrls)})` }"
        :alt="board.title"
      />
      <div
        class="absolute bottom-3 left-3 inline-flex items-center rounded-lg bg-white p-2 shadow-md"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="h-5 w-5 text-red-700"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
        <span class="ml-1 text-sm text-slate-400"
          >조회수 : {{ board.hit }}</span
        >
      </div>

      <a
        class="flex justify-center items-center bg-red-700 bg-opacity-80 z-10 absolute top-0 left-0 w-full h-full text-white rounded-2xl opacity-0 transition-all duration-300 transform group-hover:scale-105 text-xl group-hover:opacity-100"
        target="_self"
        rel="noopener noreferrer"
      >
        Read article
        <svg
          class="ml-2 w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 5l7 7-7 7M5 5l7 7-7 7"
          ></path>
        </svg>
      </a>
    </div>
    <div class="flex">
      <div class="pr-3">
        <img
          class="h-12 w-12 rounded-full object-cover max-w-none"
          :src="
            board.profileImage ||
            'https://source.unsplash.com/800x450/?Beautifulgirl'
          "
          :alt="board.title"
        />
      </div>
      <div class="w-full">
        <div class="flex justify-between w-full">
          <span class="text-lg font-semibold items-start">{{
            board.title
          }}</span>
          <span class="text-sm text-gray-500 items-end mt-1">
            posted by
            <span class="font-semibold text-gray-800">
              {{ board.nickname }}
            </span></span
          >
        </div>
        <div class="text-sm flex items-center justify-end text-gray-500">
          {{ formatDateTime(board.updatedAt) }}
          <svg
            class="ml-1 w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped></style>
