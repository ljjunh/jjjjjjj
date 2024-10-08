import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';

import {
  userConfirm,
  findByEmail,
  tokenRegeneration,
  logout,
} from '@/api/user';
import { httpStatusCode } from '@/util/http-status';

export const useMemberStore = defineStore(
  'memberStore',
  () => {
    const router = useRouter();
    const isLogin = ref(false);
    const isLoginError = ref(false);
    const userInfo = ref(null);
    const isValidToken = ref(false);
    const isAdmin = ref(false);

    const userLogin = async (loginUser) => {
      console.log('로그인 시도 : ', loginUser);
      await userConfirm(
        loginUser,
        (response) => {
          if (response.status === httpStatusCode.OK) {
            console.log('로그인 성공!!!!');
            let { data } = response;
            let accessToken = data['accessToken'];
            let refreshToken = data['refreshToken'];
            isLogin.value = true;
            isLoginError.value = false;
            isValidToken.value = true;
            sessionStorage.setItem('accessToken', accessToken);
            sessionStorage.setItem('refreshToken', refreshToken);
          }
        },
        (error) => {
          console.log('로그인 실패!!!!');
          isLogin.value = false;
          isLoginError.value = true;
          isValidToken.value = false;
          console.error(error);
        }
      );
    };

    const getUserInfo = async (token) => {
      let decodeToken = jwtDecode(token);
      console.log(decodeToken);
      await findByEmail(
        // email
        decodeToken.sub,
        (response) => {
          if (response.status === httpStatusCode.OK) {
            userInfo.value = response.data;
            console.log('isAdmin:', response.data.roleType);
            if (response.data.roleType === 'ADMIN') {
              console.log('관리자입니다');
              isAdmin.value = true;
            }
            console.log('유저 정보 : ', response.data);
            console.log(userInfo.value);
          } else {
            console.log('유저 정보 없음!!!!');
          }
        },
        async (error) => {
          console.error(
            'g[토큰 만료되어 사용 불가능.] : ',
            error.response.status,
            error.response.statusText
          );
          isValidToken.value = false;

          await tokenRegenerate();
        }
      );
    };

    const tokenRegenerate = async () => {
      await tokenRegeneration(
        JSON.stringify(userInfo.value),
        (response) => {
          if (response.status === httpStatusCode.OK) {
            let accessToken = response.data['accessToken'];
            sessionStorage.setItem('accessToken', accessToken);
            isValidToken.value = true;
          }
        },
        async (error) => {
          console.log(error);
          isLogin.value = false;
          userInfo.value = null;
          isValidToken.value = false;
          isAdmin.value = false;
          sessionStorage.removeItem('accessToken');
          sessionStorage.removeItem('refreshToken');
          // 히스토리를 날리고 Landing 페이지로 이동
          router.replace({ name: 'Landing' }).then(() => {
            window.location.href = router.resolve({ name: 'Landing' }).href;
          });
        }
      );
    };

    // TODO : 로그아웃 함수 api 요청 추가 필요
    const userLogout = async () => {
      isLogin.value = false;
      userInfo.value = null;
      isValidToken.value = false;
      isAdmin.value = false;
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      // 히스토리를 날리고 Landing 페이지로 이동
      router.replace({ name: 'Landing' }).then(() => {
        window.location.href = router.resolve({ name: 'Landing' }).href;
      });
    };
    return {
      isLogin,
      isLoginError,
      userInfo,
      isAdmin,
      isValidToken,
      userLogin,
      getUserInfo,
      tokenRegenerate,
      userLogout,
    };
  },
  {
    persist: {
      storage: sessionStorage, // 세션 스토리지에 상태 저장
    },
  }
);
