<script setup></script>

<template>
  <div class="flex items-center justify-center font-bold">
    <div class="text-center space-y-12">
      <div class="text-center text-6xl font-bold">
        여행을
        <div
          class="relative mb-4 inline-grid grid-cols-1 grid-rows-1 gap-12 overflow-hidden"
        >
          <span class="animate-word col-span-full row-span-full text-blue-500"
            >빠르게</span
          >
          <span
            class="animate-word-delay-1 col-span-full row-span-full text-blue-500"
            >현명하게</span
          >
          <span
            class="animate-word-delay-2 col-span-full row-span-full text-blue-500"
            >계획있게</span
          >
          <span
            class="animate-word-delay-3 col-span-full row-span-full text-blue-500"
            >센스있게</span
          >
          <span
            class="animate-word-delay-4 col-span-full row-span-full text-blue-500"
            >정확하게</span
          >
        </div>
        <br />
        세우는 방법
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes word {
  0% {
    transform: translateY(100%);
  }
  15% {
    transform: translateY(-10%);
    animation-timing-function: ease-out;
  }

  20% {
    transform: translateY(0);
  }

  40%,
  100% {
    transform: translateY(-110%);
  }
}

.animate-word {
  animation: word 7s infinite;
}
.animate-word-delay-1 {
  animation: word 7s infinite;
  animation-delay: -1.4s;
}
.animate-word-delay-2 {
  animation: word 7s infinite;
  animation-delay: -2.8s;
}
.animate-word-delay-3 {
  animation: word 7s infinite;
  animation-delay: -4.2s;
}
.animate-word-delay-4 {
  animation: word 7s infinite;
  animation-delay: -5.6s;
}
</style>
