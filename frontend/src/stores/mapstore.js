import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";

export const useDestinationStore = defineStore("destination", () => {
  const destinations = ref([
    { id: 1, name: "서울", image: "seoul.jpg" },
    { id: 2, name: "인천", image: "incheon.jpg" },
    { id: 3, name: "대전", image: "daejeon.jpg" },
    { id: 4, name: "대구", image: "daegu.jpg" },
    { id: 5, name: "광주", image: "gwangju.jpg" },
    { id: 6, name: "부산", image: "busan.jpg" },
    { id: 7, name: "울산", image: "ulsan.jpg" },
    { id: 8, name: "세종특별자치시", image: "sejong.jpg" },
    { id: 31, name: "경기도", image: "gyeonggido.jpg" },
    { id: 32, name: "강원도", image: "gangwondo.jpg" },
    { id: 33, name: "충청북도", image: "chungcheongbukdo.jpg" },
    { id: 34, name: "충청남도", image: "chungcheongnamdo.jpg" },
    { id: 35, name: "경상북도", image: "gyeongsangbukdo.jpg" },
    { id: 36, name: "경상남도", image: "gyeongsangnamdo.jpg" },
    { id: 37, name: "전라북도", image: "jeollabukdo.jpg" },
    { id: 38, name: "전라남도", image: "jeollanamdo.jpg" },
    { id: 39, name: "제주도", image: "jejuisland.jpg" },
  ]);

  const guguns = ref([]);

  async function fetchGuguns(sidoCode, sidoName) {
    const response = await axios.get(
      `http://localhost/api/trip/listgugun?sidoCode=${sidoCode}&sidoName=${sidoName}`
    );
    guguns.value = response.data.map((gugun) => ({
      code: gugun.gugunCode,
      name: gugun.gugunName,
    }));
  }
  return { destinations, guguns, fetchGuguns };
});
