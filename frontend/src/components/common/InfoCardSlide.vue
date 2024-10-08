<template>
  <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css" />
  <div class="flex justify-center w-full h-1/3 overflow-auto">
    <div aria-label="card" class="p-5 rounded-3xl bg-gray-50 w-full">
      <div aria-label="header" class="flex items-center space-x-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-8 h-8 shrink-0"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11"></path>
        </svg>
        <div class="space-y-0.5 flex-1">
          <h3
            class="font-medium text-lg tracking-tight text-gray-900 leading-tight"
          >
            여행 계획 정보
          </h3>
          <p class="text-sm font-normal text-gray-400 leading-none">
            세운 계획을 바탕으로
          </p>
          <p class="text-sm font-normal text-gray-400 leading-none">
            간단한 정보를 계산해드려요 !
          </p>
        </div>
        <a
          class="inline-flex items-center shrink-0 justify-center w-8 h-8 rounded-full text-white bg-gray-900 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M17 7l-10 10"></path>
            <path d="M8 7l9 0l0 9"></path>
          </svg>
        </a>
      </div>
      <div aria-label="content" class="mt-2 grid gap-2.5">
        <a>
          <div
            class="flex items-center space-x-4 p-3.5 rounded-full bg-gray-100"
          >
            <span
              class="flex items-center justify-center w-10 h-10 shrink-0 rounded-full bg-white text-gray-900"
            >
              <img src="/icons/roadIcon.png" class="p-2" />
            </span>
            <div class="flex flex-col flex-1">
              <h3 class="text-sm font-medium">예상 총 이동경로</h3>
              <div class="divide-x divide-gray-200 mt-auto">
                <span
                  class="inline-block px-3 text-xs leading-none text-gray-400 font-normal first:pl-0"
                  >{{ props.routeInfo.totalDistance }} m</span
                >
                <span
                  class="inline-block px-3 text-xs leading-none text-gray-400 font-normal first:pl-0"
                  >{{ props.routeInfo.totalDistance / 1000 }} km</span
                >
              </div>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 shrink-0"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M9 6l6 6l-6 6"></path>
            </svg>
          </div>
        </a>
        <a>
          <div
            class="flex items-center space-x-4 p-3.5 rounded-full bg-gray-100"
          >
            <span
              class="flex items-center justify-center w-10 h-10 shrink-0 rounded-full bg-white text-gray-900"
            >
              <img src="/icons/clockIcon.png" class="p-2" />
            </span>
            <div class="flex flex-col flex-1">
              <h3 class="text-sm font-medium">총 예상 소요시간</h3>
              <div class="divide-x divide-gray-200 mt-auto">
                <span
                  class="inline-block px-3 text-xs leading-none text-gray-400 font-normal first:pl-0"
                  >{{ props.routeInfo.totalTime }} 초</span
                >
                <span
                  class="inline-block px-3 text-xs leading-none text-gray-400 font-normal first:pl-0"
                  >약
                  {{ Math.round(props.routeInfo.totalTime / 60) }}
                  분</span
                >
              </div>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 shrink-0"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M9 6l6 6l-6 6"></path>
            </svg>
          </div>
        </a>
        <a>
          <div
            class="flex items-center space-x-4 p-3.5 rounded-full bg-gray-100"
          >
            <span
              class="flex items-center justify-center w-10 h-10 shrink-0 rounded-full bg-white text-gray-900"
            >
              <img src="/icons/taxiIcon.png" class="p-2" />
            </span>
            <div class="flex flex-col flex-1">
              <h3 class="text-sm font-medium">예상 택시 요금</h3>
              <div class="divide-x divide-gray-200 mt-auto">
                <span
                  class="inline-block px-3 text-xs leading-none text-gray-400 font-normal first:pl-0"
                  >{{ props.routeInfo.totalTaxi }} 원</span
                >
              </div>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 shrink-0"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M9 6l6 6l-6 6"></path>
            </svg>
          </div>
        </a>
        <a>
          <div
            class="flex items-center space-x-4 p-3.5 rounded-full bg-gray-100"
          >
            <span
              class="flex items-center justify-center w-10 h-10 shrink-0 rounded-full bg-white text-gray-900"
            >
              <img src="/icons/coinIcon.png" class="p-2" />
            </span>
            <div class="flex flex-col flex-1">
              <h3 class="text-sm font-medium">예상 톨게이트 요금</h3>
              <div class="divide-x divide-gray-200 mt-auto">
                <span
                  class="inline-block px-3 text-xs leading-none text-gray-400 font-normal first:pl-0"
                  >{{ props.routeInfo.totalToll }} 원</span
                >
              </div>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 shrink-0"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M9 6l6 6l-6 6"></path>
            </svg>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  routeInfo: Object,
});

console.log('info : ', props);
</script>

<style></style>
