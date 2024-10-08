<script setup>
import { defineProps, onMounted, ref, watch } from "vue";
import OpenAI from "openai";
import Swal from "sweetalert2";

/** 모달 창 관련 */
const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  planData: {
    type: Object,
    required: true,
  },
  routeData: {
    type: Object,
  },
});
console.log("ai modal :", props.planData);
console.log("ai modal :", props.routeData);
const emit = defineEmits(["close"]);
const closeModal = () => {
  emit("close");
};

// watch를 사용하여 props.routeData가 변경될 때 findRoadInfo 호출
watch(
  () => props.routeData,
  (newVal, oldVal) => {
    if (newVal) {
      guides.value = findRoadInfo();
    }
  },
  { immediate: true }
);
const guides = ref(null);
const prompt = ref(null);
const gptResponse = ref(null); // GPT 응답 결과를 저장할 변수
const loading = ref(false); // 로딩 상태를 관리할 변수
const findRoadInfo = () => {
  if (
    !props.routeData ||
    !props.routeData.routes ||
    !props.routeData.routes[0] ||
    !props.routeData.routes[0].sections ||
    !props.routeData.routes[0].sections[0].guides
  ) {
    console.error("routeData 또는 guides가 정의되지 않았습니다.");
    loading.value = false; // 로딩 종료
    return;
  }

  // props.routeData에서 guides 배열 추출
  const guidesData = props.routeData.routes[0].sections[0].guides;

  // guides 배열에 이름과 guidance를 함께 저장하여 반환
  return guidesData.map((guide) => ({
    name: guide.name,
    guidance: guide.guidance,
  }));
};

// chatGPT description
const ApiKey = import.meta.env.VITE_VUE_APP_OPEN_API_KEY;
const getGPTResponse = async () => {
  try {
    loading.value = true;
    const openai = new OpenAI({
      apiKey: ApiKey,
      dangerouslyAllowBrowser: true,
    });
    const guidesData = findRoadInfo();
    // guidesData가 비어있는 경우 종료
    if (guidesData.length === 0) {
      Swal.fire(
        "카카오에서 도로 정보를 받을 수 없습니다!",
        "도로로 갈 수 있는 곳만 AI가 계산할 수 있습니다.",
        "error"
      );
      console.error("guides 데이터가 비어 있습니다.");
      return;
    }
    let promptString = "";
    guidesData.forEach((guide) => {
      promptString += `${guide.name}, ${guide.guidance}; `;
    });
    // 문자열 끝에 질문 추가
    promptString += `내가 준 데이터를 기반으로
      자동차를 타고 길을 간다고 했을때
      친구에게 길을 알려주듯이 하나하나 차근차근 알려줘.
      예를 들면
      1: 어디어디에서 어디어디로 가
      2: 어디어디에서 좌회전을 해서 가
      이런식으로 단계적으로 알려줘
    `;

    // prompt 변수에 문자열 할당
    prompt.value = promptString;
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt.value,
        },
      ],
      model: "gpt-4-turbo",
    });
    gptResponse.value = response.choices[0].message.content; // 응답 결과 저장
    console.log("chatGPT 전체 응답", response);
    console.log("chatGPT 결과: ", response.choices[0].message.content);
  } catch (error) {
    console.log("error : ", error);
    console.log("chatGPT: 🚨 에러가 발생했습니다.");
    Swal.fire("chatGPT Key ERROR!", "네트워크 또는 키를 확인해주세요", "error");
  } finally {
    loading.value = false; // 로딩 종료
  }
};
const getGPTResponse2 = async () => {
  try {
    loading.value = true;
    const openai = new OpenAI({
      apiKey: ApiKey,
      dangerouslyAllowBrowser: true,
    });
    const guidesData = findRoadInfo();
    // guidesData가 비어있는 경우 종료
    if (guidesData.length === 0) {
      Swal.fire(
        "카카오에서 정보를 받을 수 없습니다!",
        "AI가 정보를 검색할 수 없습니다.",
        "error"
      );
      console.error("guides 데이터가 비어 있습니다.");
      return;
    }
    const [firstTitle, ...otherTitles] = props.planData.map(
      (item) => item.title
    );
    const titles = `${firstTitle} 여기서부터 출발해서 ${otherTitles.join(
      ", "
    )}`;
    let promptString = "";
    promptString += `당신이 여행 가이드 역할을 해줬으면 좋겠어요.
    나는 당신에게 내 위치를 알려줄것이고 당신은 내 위치 근처에 방문 할 장소를 제안할것입니다.
    어떤 경우에는 내가 방문할 장소의 유형도 알려줄 것입니다.
    당신은 제 첫 번째 위치와 가까운 유사한 유형의 장소를 제안할것입니다.
    내 첫 번째 제안 요청은 "나는 한국의 ${firstTitle}에 있고 관광지들만 방문하고 싶습니다."입니다."`;
    // 문자열 끝에 질문 추가
    /*
    promptString += `내가 왕방산을 출발해서 현등산, 현탄강 관광지를 방문하려고할때 최적경로를 알려줘라는 말에 대한 응답 예시를 알려줄게

    "최적의 경로는 다음과 같습니다:

    왕방산 (Wangbangsan)
    현등산 (운악산) (Hyeondeungsan / Unaksan)
    한탄강 관광지 (Hantangang Tourist Site)
    이 순서로 이동하면 경로가 최적화됩니다.

    왕방산에서 출발하여 **현등산 (운악산)**으로 이동한 후, 한탄강 관광지로 이동하면 됩니다.
    이 순서대로 여행지를 방문하면 이동 거리를 최소화하면서 편리하게 여행할 수 있습니다.

    현재 말씀하신 순서대로 방문한다면 2시간 40분정도 걸리지만,
    제가 말씀드린 대로 방문하신다면 2시간만큼의 시간이 걸리기 때문에
    얼마만큼의 시간을 단축시킬 수 있으니 추천드립니다!"

    어떤 경로로 이동해야 시간을 단축할 수 있는지, 시간이 얼마나 걸리는지에 대해서 제대로 계산해주는게 중요해

    위와 같이 응답해주면돼

    2시간 40분 등 내가 시간에 대해서 말한 부분은 너가 정보들을 검색해서 계산 한 후 말해줘

    내가 ${titles} 이 장소들을 방문하려고 하는데, 최적 경로에 대해서 계산하고 알려줘`;
*/
    // prompt 변수에 문자열 할당
    prompt.value = promptString;
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt.value,
        },
      ],
      model: "gpt-4-turbo",
    });
    gptResponse.value = response.choices[0].message.content; // 응답 결과 저장
    console.log("chatGPT 전체 응답", response);
    console.log("chatGPT 결과: ", response.choices[0].message.content);
  } catch (error) {
    console.log("error : ", error);
    console.log("chatGPT: 🚨 에러가 발생했습니다.");
    Swal.fire("chatGPT Key ERROR!", "네트워크 또는 키를 확인해주세요", "error");
  } finally {
    loading.value = false; // 로딩 종료
  }
};
</script>

<template>
  <div
    v-if="visible"
    class="fixed z-50 left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50 py-10"
    @click.self="closeModal"
  >
    <div
      class="max-h-full w-full max-w-xl overflow-y-auto sm:rounded-2xl bg-white"
    >
      <div class="w-full">
        <div class="m-8 my-20 max-w-[400px] mx-auto">
          <div class="mb-8">
            <h1 class="mb-4 text-3xl font-extrabold">
              AI 를 활용해서 어떻게 이동하면 좋을지 확인해보세요 !
            </h1>
            <!-- 로딩 중일 때 표시할 부분 -->
            <div v-if="loading" class="bg-white">
              <div class="flex justify-center items-center">
                <img
                  class="h-16 w-16"
                  src="https://icons8.com/preloaders/preloaders/1488/Iphone-spinner-2.gif"
                  alt="로딩 중"
                />
              </div>
            </div>
            <!-- GPT 응답 결과를 출력할 부분 -->
            <div
              v-else-if="gptResponse"
              class="mt-4 p-4 bg-gray-100 rounded-lg"
            >
              <h2 class="text-xl font-bold mb-2">GPT 응답 결과</h2>
              <p class="text-gray-700 whitespace-pre-line">{{ gptResponse }}</p>
            </div>
          </div>
          <div class="space-y-4">
            <button
              class="p-3 bg-black rounded-full text-white w-full font-semibold"
              @click="getGPTResponse"
            >
              AI 를 활용한 길찾기
            </button>
            <button
              class="p-3 bg-black rounded-full text-white w-full font-semibold"
              @click="getGPTResponse2"
            >
              AI 를 활용한 다른 여행지 추천
            </button>
            <button
              class="p-3 bg-white border rounded-full w-full font-semibold"
              @click="closeModal"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
