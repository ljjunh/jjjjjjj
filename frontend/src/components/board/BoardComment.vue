<!-- BoardComment.vue -->
<script setup>
import { defineProps } from "vue";

const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="text-sm mb-2 flex flex-start items-center">
    <p class="font-bold ml-2">
      <a>{{ comment.nickname }}:</a>
      <span class="text-gray-700 font-medium ml-1">{{ comment.content }}</span>
    </p>
  </div>
</template>

<style scoped></style>
