<script setup>
import { KakaoMap, KakaoMapMarker, KakaoMapPolyline } from "vue3-kakao-maps";
import { useRoute } from "vue-router";
import { onMounted, ref, computed, watch } from "vue";
import draggable from "vuedraggable";
import axios from "axios";
import Swal from "sweetalert2";

import InfoCardSlide from "@/components/common/InfoCardSlide.vue";
import LocationBox from "@/components/map/LocationBox.vue";
import AIModal from "@/components/mypage/Course/AIModal.vue";

const route = useRoute();
const planData = ref([]);
const loading = ref(true);
const routeData = ref(null); // 추가: 경로 데이터를 저장할 변수
const routeInfo = ref(null);
const markerList = ref([]); // 마커 데이터를 저장할 변수
const visibleAIModal = ref(false);
const showAIModal = () => {
  visibleAIModal.value = !visibleAIModal.value;
};
const closeModal = () => {
  visibleAIModal.value = !visibleAIModal.value;
};
const kakaoApiKey = import.meta.env.VITE_VUE_APP_KAKAO_API_REST_KEY;
const props = defineProps({
  courseId: String,
  title: String,
  description: String,
});
// 기본 좌표를 서울 시청으로 설정하되, planData에 값이 있으면 첫 번째 데이터의 좌표를 사용
const defaultCoordinate = computed(() => {
  if (planData.value.length > 0) {
    return {
      lat: planData.value[0].latitude,
      lng: planData.value[0].longitude,
    };
  }
  return {
    lat: 37.566826,
    lng: 126.9786567,
  };
});

const savePlanData = async () => {
  const token = sessionStorage.getItem("accessToken");
  const updateData = {
    courseId: props.courseId,
    title: props.title,
    description: props.description,
    schedules: planData.value.map((spot, index) => ({
      spot: { ...spot },
      orderIndex: index,
    })),
  };
  console.log(updateData);
  try {
    const response = await axios.patch(
      "https://apiyeohaengdam.ttalkak.com/api/course/update",
      updateData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    Swal.fire({
      title: "데이터를 성공적으로 저장했습니다.",
      imageUrl: "/rottie/basicSuccess.gif",
      imageWidth: 150,
      imageHeight: 150,
      imageAlt: "Custom image",
    });
    console.log("Plan data saved successfully:", response.data);
  } catch (error) {
    Swal.fire("저장을 실패했습니다", "다시 로그인 해주세요.", "error");
    console.error("Error saving plan data:", error);
  }
};

const fetchCourseDetails = async () => {
  const courseId = route.params.courseId;
  try {
    const response = await axios.get(
      `https://apiyeohaengdam.ttalkak.com/api/course/${courseId}`
    );
    // planData.value = addCustomAttributes(
    //   response.data.schedules.map((schedule) => schedule.spot)
    // );
    planData.value = response.data.schedules.map((schedule) => schedule.spot);
    await fetchRoute(); // 초기 로드 시 경로 데이터를 가져옴
    console.log(planData.value);
    loading.value = false;
  } catch (error) {
    Swal.fire(
      "계획 정보를 불러오는데 실패했습니다",
      "다시 로그인 해주세요.",
      "error"
    );
    console.error("Error fetching course details:", error);
    loading.value = false;
  }
};

// Kakao Mobility API로 경로 데이터를 요청하는 함수
const fetchRoute = async () => {
  const origin = planData.value[0];
  const destination = planData.value[planData.value.length - 1];
  const waypoints = planData.value.slice(1, -1).map((spot, index) => ({
    name: `name${index}`,
    x: spot.longitude,
    y: spot.latitude,
  }));

  const requestData = {
    origin: {
      x: origin.longitude,
      y: origin.latitude,
    },
    destination: {
      x: destination.longitude,
      y: destination.latitude,
    },
    waypoints: waypoints,
    priority: "RECOMMEND",
    car_fuel: "GASOLINE",
    car_hipass: false,
    alternatives: false,
    road_details: false,
  };

  try {
    const response = await axios.post(
      "https://apis-navi.kakaomobility.com/v1/waypoints/directions",
      requestData,
      {
        headers: {
          Authorization: `KakaoAK ${kakaoApiKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    routeData.value = response.data;
    console.log("받은 데이터:", routeData.value);
    processRouteData();
  } catch (error) {
    Swal.fire(
      "계획 정보를 불러오는데 실패했습니다",
      "다시 로그인 해주세요.",
      "error"
    );
    console.error("Error fetching route data:", error);
  }
};

// 경로 데이터를 처리하여 마커 리스트를 생성하는 함수
const processRouteData = () => {
  if (!routeData.value) return;

  markerList.value = [];
  const vertexes = routeData.value.routes[0].sections.flatMap((section) =>
    section.roads.flatMap((road) => road.vertexes)
  );
  for (let i = 0; i < vertexes.length; i += 2) {
    markerList.value.push({ lat: vertexes[i + 1], lng: vertexes[i] });
  }
  console.log("markerList ", markerList.value);
};

const image = {
  imageSrc: "https://vue3-kakao-maps.netlify.app/images/redMarker.png",
  imageWidth: 48,
  imageHeight: 48,
};

onMounted(async () => {
  await fetchCourseDetails();
});

watch(
  planData,
  async (newVal, oldVal) => {
    console.log("planData updated:", newVal);
    if (newVal !== oldVal) {
      await fetchRoute();

      routeInfo.value = {
        totalDistance: routeData.value.routes[0].summary.distance,
        totalTime: routeData.value.routes[0].summary.duration,
        totalTaxi: routeData.value.routes[0].summary.fare.taxi,
        totalToll: routeData.value.routes[0].summary.fare.toll,
      };

      if (!routeInfo.value.totalToll) {
        routeInfo.value.totalToll = 0;
      }
      if (!routeInfo.value.totalDistance) {
        routeInfo.value.totalDistance = 0;
      }
      if (!routeInfo.value.totalTime) {
        routeInfo.value.totalTime = 0;
      }
      if (!routeInfo.value.totalTaxi) {
        routeInfo.value.totalTaxi = 0;
      }
    }
  },
  { deep: true }
);

const ordermargin = "35px";
</script>

<template>
  <div :class="['map-container']">
    <KakaoMap
      :lat="defaultCoordinate.lat"
      :lng="defaultCoordinate.lng"
      :draggable="true"
      class="flex-4 h-screen"
      style="width: 100%; height: 100%"
    >
      <KakaoMapMarker
        v-for="(item, index) in planData"
        :key="index"
        :lat="item.latitude"
        :lng="item.longitude"
        :clickable="true"
        :order="index + 1"
        :order-bottom-margin="ordermargin"
        :image="image"
      />
      <KakaoMapPolyline :latLngList="markerList" />
    </KakaoMap>
    <div class="flex flex-col">
      <div class="text-center">
        <h1
          class="block text-3xl font-semibold leading-tight tracking-normal antialiased"
        >
          나의 여행 계획
        </h1>
        <h3
          class="block text-xl font-semibold leading-tight tracking-normal antialiased"
        >
          드래그해서 순서를 바꿔서 경로를 저장해보세요!
        </h3>
      </div>
      <div
        class="locations-list flex-1 overflow-auto overflow-y-auto min-w-[500px] max-h-[60vh]"
      >
        <draggable v-model="planData" group="locations" item-key="contentId">
          <template #item="{ element }">
            <LocationBox
              :item="element"
              :loading="loading"
              @click="showModal(element)"
            />
          </template>
        </draggable>
      </div>
      <div class="flex justify-end">
        <button
          class="mr-8 mt-2 mb-5 inline-flex justify-center items-center py-2 px-7 text-base font-medium text-center text-white rounded-lg bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 dark:focus:ring-green-900"
          @click="showAIModal"
        >
          AI 활용하기
        </button>
        <button
          class="mr-8 mt-2 mb-5 inline-flex justify-center items-center py-2 px-7 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
          @click="savePlanData"
        >
          저장하기
        </button>
      </div>
      <!-- summary 를 이용한 정보 -->
      <InfoCardSlide v-if="routeInfo" :routeInfo="routeInfo"></InfoCardSlide>
    </div>
  </div>
  <AIModal
    :visible="visibleAIModal"
    @close="closeModal"
    :planData="planData"
    :routeData="routeData"
  ></AIModal>
</template>

<style scoped>
.map-container {
  display: flex;
  height: 100vh;
}
.locations-list {
  padding: 10px;
  border-left: 2px solid #ccc;
}
</style>
