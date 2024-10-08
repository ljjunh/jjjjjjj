<script setup>
import TripCard from "./TripCard.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useDestinationStore } from "@/stores/mapstore.js";
import ListBoxCities from "./listbox/ListBoxCities.vue";
import ListBoxGuguns from "./listbox/ListBoxGuguns.vue";
import ListBoxContents from "./listbox/ListBoxContents.vue";
import Swal from "sweetalert2";

import axios from "axios";

const { destinations } = useDestinationStore();

const guguns = ref([]);
const router = useRouter();

const selectedSido = ref(null);
const selectedGugun = ref(null);
const selectedContent = ref(null);
const listBoxCitiesRef = ref(null);

const isSidoUpdated = ref(false);
const isGugunUpdated = ref(false);
const isContentUpdated = ref(false);

const handleGugunSelected = (gugun) => {
  selectedGugun.value = gugun;
  console.log("Selected Gugun:", selectedGugun.value);
  isGugunUpdated.value = true;
  setTimeout(() => {
    isGugunUpdated.value = false;
  }, 500); // 0.5초 후에 원래 상태로 복구
};

const handleContentSelected = (content) => {
  selectedContent.value = content;
  console.log("Selected Content:", selectedContent.value);
  isContentUpdated.value = true;
  setTimeout(() => {
    isContentUpdated.value = false;
  }, 500);
};

const handleSidoSelection = async (sido) => {
  const response = await axios.get(
    `https://apiyeohaengdam.ttalkak.com/api/spot/listGugun?sidoCode=${sido.id}&sidoName=${sido.name}`
  );
  guguns.value = response.data.map((item) => ({
    id: item.gugunCode,
    name: item.gugunName,
  }));
  console.log(guguns.value);
  selectedSido.value = sido;
  console.log("Selected Sido:", selectedSido.value);
  isSidoUpdated.value = true;
  setTimeout(() => {
    isSidoUpdated.value = false;
  }, 500);
};

const handleSearch = () => {
  console.log(
    "Sido:",
    selectedSido.value,
    "Gugun:",
    selectedGugun.value,
    "Content:",
    selectedContent.value
  );
  if (selectedSido.value && selectedGugun.value && selectedContent.value) {
    router.push({
      name: "Map",
      query: {
        sidoCode: selectedSido.value.id,
        gugunCode: selectedGugun.value.id,
        contentCode: selectedContent.value.id,
      },
    });
  } else {
    Swal.fire("모든 옵션을 선택해야합니다!", "도시를 선택해주세요", "error");
  }
};

const handleTripCardSelect = async (destination) => {
  if (listBoxCitiesRef.value) {
    listBoxCitiesRef.value.setSelected(destination);
    await handleSidoSelection(destination);
  }
};
</script>

<template>
  <div id="section-wrap">
    <section class="my-12">
      <h2 class="text-5xl font-bold text-center mb-6">
        어디로 여행을 떠나시나요?!!!!!!!
      </h2>
      <p class="text-center text-lg mb-4">
        떠나고 싶은 곳과 어떤 여행을 떠나고 싶은지 골라주세요
      </p>
      <div class="flex justify-center items-center space-x-2 mb-12">
        <ListBoxCities
          ref="listBoxCitiesRef"
          @update:selected="handleSidoSelection"
          :class="{ 'text-red-500': isSidoUpdated }"
        />
        <ListBoxGuguns
          :guguns="guguns"
          @update:selected="handleGugunSelected"
          :class="{ 'text-red-500': isGugunUpdated }"
        />
        <ListBoxContents
          @update:selected="handleContentSelected"
          :class="{ 'text-red-500': isContentUpdated }"
        />
        <button
          @click="handleSearch"
          class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-blue-600 hover:text-white hover:border-transparent transition ease-in duration-200 h-10 px-4 py-2 pt-2"
        >
          검색
        </button>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <TripCard
          v-for="destination in destinations"
          :key="destination.id"
          :id="destination.id"
          :name="destination.name"
          :image="destination.image"
          @select="handleTripCardSelect"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
#section-wrap {
  margin-left: 5vw;
  margin-right: 5vw;
}

.highlight {
  animation: highlight-animation 0.5s ease-in-out;
}

@keyframes highlight-animation {
  0% {
    color: red;
  }
  100% {
    color: inherit;
  }
}
</style>
