<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['row-click']);

const handleClick = () => {
  emit('row-click', props.item);
};

function formatDateTime(dateTime) {
  // 날짜 형식 변환 함수
  const [date, time] = dateTime.split('T');
  return `${date} ${time}`;
}
</script>

<template>
  <tr class="hover:bg-gray-100 border-b border-gray-200" @click="handleClick">
    <td class="px-4 py-4 flex items-center text-lg text-red-400 font-semibold">
      {{ item.title }}
    </td>
    <td class="px-4 py-4 text-xl">{{ item.nickname }}</td>
    <td class="px-4 py-4">{{ formatDateTime(item.updatedAt) }}</td>
  </tr>
</template>

<style scoped></style>
