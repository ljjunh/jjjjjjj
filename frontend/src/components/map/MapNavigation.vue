<script setup>
import { defineEmits, defineProps, ref, watch } from 'vue';
import draggable from 'vuedraggable';
import LocationBox from '@/components/map/LocationBox.vue';

const emit = defineEmits(['toggle', 'update:planData', 'save-plan']);
const props = defineProps({
  planData: Array,
  loading: Boolean,
  showModal: Function,
});

// 로컬 상태로 복사
const localPlanData = ref([...props.planData]);

// planData 변화 감지 및 부모 컴포넌트에 업데이트 전달
watch(localPlanData, (newVal) => {
  emit('update:planData', newVal);
});

const savePlan = () => {
  console.log('savePlan 버튼 클릭 !');
  emit('save-plan');
};
</script>

<template>
  <div class="flex">
    <input
      type="checkbox"
      id="drawer-toggle"
      class="relative sr-only peer"
      @change="emit('toggle')"
    />
    <label
      for="drawer-toggle"
      class="absolute top-1/2 right-0 inline-block p-3 transition-all duration-500 bg-indigo-500 rounded-lg peer-checked:rotate-180 peer-checked:right-560px"
    >
      <div class="w-6 h-1 mb-3 -rotate-45 bg-white rounded-lg"></div>
      <div class="w-6 h-1 rotate-45 bg-white rounded-lg"></div>
    </label>
    <!-- side bar content-->
    <div
      class="fixed min-w-[500px] top-0 right-0 z-20 h-full transition-all duration-500 transform translate-x-full bg-white shadow-lg peer-checked:translate-x-0"
    >
      <div class="px-6 py-4">
        <h2 class="text-lg font-semibold">나만의 여행 계획 세우기</h2>
        <p class="text-gray-500">마음에 드는 여행지를 드래그로 넣어보세요</p>
        <div class="locations-list flex-1 min-w-[500px]">
          <draggable
            v-model="localPlanData"
            group="locations"
            class="overflow-scroll max-h-96"
            :style="{ height: `50%` }"
          >
            <template #item="{ element, index }">
              <LocationBox
                :item="element"
                :loading="loading"
                @click="showModal(element)"
              />
            </template>
          </draggable>
        </div>
      </div>
      <div class="flex justify-end">
        <button
          class="mr-5 bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2 text-gray-100 hover:shadow-xl transition duration-150 uppercase"
          @click="savePlan"
        >
          여행 계획 저장하기
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.locations-list {
  padding: 10px;
  border-left: 2px solid #ccc;
}
</style>
