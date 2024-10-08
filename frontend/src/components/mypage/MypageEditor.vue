<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useMemberStore } from "@/stores/member";
import MyPageSide from "@/components/common/MyPageSide.vue";
import Swal from "sweetalert2";

const memberStore = useMemberStore();
const { getUserInfo } = memberStore;
const router = useRouter();
const token = sessionStorage.getItem("accessToken");
const nickname = ref("닉네임");
const email = ref("email@example.com");
const password = ref("");
const passwordConfirmation = ref("");
const isNicknameAvailable = ref(false);
const hasCheckedNickname = ref(false);
const isNicknameEditable = ref(false);
const isNicknameConfirmed = ref(false);
const isDisabled = ref(true);
const isEditing = ref(false);
const nicknameDisabled = ref(true);
const profileImage = ref("/mnt/data/image.png"); // 기본 이미지 경로

const fileInput = ref(null);

const toggleEdit = () => {
  isDisabled.value = !isDisabled.value;
  isEditing.value = !isEditing.value;
  nicknameDisabled.value = !nicknameDisabled.value;
};

/** 닉네임 중복 체크 */
const nicknameCheck = async () => {
  if (!nickname.value) {
    Swal.fire(
      "닉네임을 입력해주세요!",
      "닉네임은 필수로 입력하셔야 합니다.",
      "error"
    );

    return;
  }

  try {
    const response = await axios.get(
      `https://apiyeohaengdam.ttalkak.com/api/users/check_nickname/${nickname.value}`
    );
    if (response.data.available) {
      const confirmUse = confirm(
        "사용 가능한 닉네임입니다. 이 닉네임을 사용하시겠습니까?"
      );
      if (confirmUse) {
        isNicknameAvailable.value = true;
        isNicknameConfirmed.value = true;
        hasCheckedNickname.value = true;
        // 닉네임 필드 비활성화
        isNicknameEditable.value = true;
      }
    } else {
      Swal.fire(
        "이미 사용중인 닉네임입니다.",
        "다른 닉네임을 사용해주세요.",
        "error"
      );
      isNicknameAvailable.value = false;
    }
  } catch (error) {
    console.error("닉네임 중복체크 오류:", error);
    Swal.fire(
      "중복체크 중 오류가 발생했습니다",
      "서버와의 연결을 확인해 주세요",
      "error"
    );
  }
};

/** 프로필 이미지 업로드 */
const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (file) {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await axios.post(
        "https://apiyeohaengdam.ttalkak.com/api/users/updateProfile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      profileImage.value = URL.createObjectURL(file);
      Swal.fire({
        title: "프로필 이미지가 성공적으로 업로드 되었습니다.",
        imageUrl: "/rottie/basicUpdate.gif",
        imageWidth: 150,
        imageHeight: 150,
        imageAlt: "Custom image",
      });
    } catch (error) {
      Swal.fire(
        "업로드를 실패했습니다!",
        "프로필 이미지 업로드 중 문제가 발생했습니다.",
        "error"
      );
      console.error("프로필 이미지 업로드 오류:", error);
    }
  }
};

const handleUpdate = async () => {
  const user = {
    nickname: nickname.value,
    email: email.value,
    password: password.value,
  };

  try {
    const response = await axios.put(
      "https://apiyeohaengdam.ttalkak.com/api/users/update_nickname",
      user,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      Swal.fire({
        title: "정보가 성공적으로 업데이트되었습니다.",
        imageUrl: "/rottie/basicUpdate.gif",
        imageWidth: 150,
        imageHeight: 150,
        imageAlt: "Custom image",
      });
      router.replace("/");
    }
  } catch (error) {
    console.error("업데이트 에러:", error);
    Swal.fire(
      "업데이트 실패",
      "정보 업데이트 중 문제가 발생했습니다.",
      "error"
    );
  }
  toggleEdit();
};

const goEditPwd = () => {
  router.push({ name: "EditPwd" });
};

onMounted(async () => {
  if (token) {
    await getUserInfo(token);
    nickname.value = memberStore.userInfo.nickname;
    email.value = memberStore.userInfo.email;
    password.value = memberStore.userInfo.password;
    passwordConfirmation.value = memberStore.userInfo.password;
    profileImage.value =
      memberStore.userInfo.profileImage || profileImage.value;
  }
});
</script>

<template>
  <div
    class="grid min-h-screen w-full overflow-hidden lg:grid-cols-[280px_1fr]"
  >
    <MyPageSide />
    <div class="w-full px-40 h-full bg-white flex items-center justify-center">
      <div class="w-full px-12">
        <h1 class="text-center text-3xl font-bold tracking-wide text-gray-800">
          My Page
        </h1>
        <div class="flex flex-col items-center my-4">
          <img
            :src="
              memberStore.userInfo.profileImage ||
              'https://source.unsplash.com/800x450/?Beautifulgirl'
            "
            alt="Profile Image"
            class="h-24 w-24 rounded-full object-cover cursor-pointer"
            @click="fileInput.click()"
          />
          <input
            type="file"
            ref="fileInput"
            class="hidden"
            @change="handleFileChange"
          />
        </div>
        <form class="my-8 text-sm" @submit.prevent>
          <div class="flex flex-col my-4">
            <label for="nickname" class="text-gray-700">Nick Name</label>
            <div class="flex items-center mt-2">
              <input
                type="text"
                name="nickname"
                id="nickname"
                class="flex-grow p-2 border border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300 rounded text-sm text-gray-900"
                placeholder="Enter your nickname"
                v-model="nickname"
                :disabled="nicknameDisabled || isNicknameEditable"
              />
              <button
                class="ml-2 bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2 text-gray-100 hover:shadow-xl transition duration-150 uppercase"
                @click="nicknameCheck"
              >
                중복 검사
              </button>
            </div>
          </div>

          <div class="flex flex-col my-4">
            <label for="email" class="text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              id="email"
              class="bg-gray-200 mt-2 p-2 border border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300 rounded text-sm text-gray-900"
              placeholder="Enter your email"
              v-model="email"
              disabled
            />
          </div>
          <div class="flex items-center">
            <input
              type="checkbox"
              name="remember_me"
              id="remember_me"
              class="mr-2 focus:ring-0 rounded"
            />
            <label for="remember_me" class="text-gray-700"
              >I accept the
              <a
                href="#"
                class="text-blue-600 hover:text-blue-700 hover:underline"
                >terms</a
              >
              and
              <a
                href="#"
                class="text-blue-600 hover:text-blue-700 hover:underline"
                >privacy policy</a
              ></label
            >
          </div>
          <button
            class="bg-gray-300 hover:bg-gray-200 rounded-lg px-8 py-2 mt-5 text-blue-600 hover:shadow-xl transition duration-150 uppercase w-full"
            @click="goEditPwd"
          >
            비밀번호 변경하기
          </button>
          <div class="my-4 flex items-center justify-end space-x-4">
            <button
              v-if="!isEditing"
              class="bg-blue-600 hover:bg-blue-700 rounded-lg px-8 py-2 text-gray-100 hover:shadow-xl transition duration-150 uppercase w-full"
              @click="toggleEdit"
            >
              수정
            </button>
            <button
              v-else
              class="bg-blue-600 hover:bg-blue-700 rounded-lg px-8 py-2 text-gray-100 hover:shadow-xl transition duration-150 uppercase w-full"
              @click="handleUpdate"
            >
              수정 완료
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
