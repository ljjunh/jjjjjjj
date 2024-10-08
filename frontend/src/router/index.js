import { createRouter, createWebHistory } from "vue-router";
import LandingPage from "@/components/LandingPage.vue";
import MainPage from "@/components/MainPage.vue";
import MapView from "@/views/MapView.vue";
import LoginView from "@/views/LoginView.vue";
import MyPageView from "@/views/MyPageView.vue";
import SignupView from "@/views/SignupView.vue";
import FindPwdView from "@/views/FindPwdView.vue";
import LandingPage2 from "@/components/LandingPage2.vue";
import EditPwdView from "@/views/EditPwdView.vue";
import BoardList from "@/components/board/BoardList.vue";
import NoticeView from "@/views/NoticeView.vue";
import LandingView from "@/views/LandingView.vue";
import BoardEditor from "@/components/board/BoardEditor.vue";
import NoticeEditor from "@/components/notice/NoticeEditor.vue";
import MypageEditor from "@/components/mypage/MypageEditor.vue";
import MyArticles from "@/components/mypage/MyArticles.vue";
import MyCourse from "@/components/mypage/MyCourse.vue";
import EmailVerification from "@/components/common/EmailVerification.vue";
import CourseDetail from "@/components/mypage/Course/CourseDetail.vue";
import OauthView from "@/views/OauthSuccessView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    { path: "/", name: "Landing", component: LandingView },
    { path: "/main", name: "Main", component: MainPage },
    { path: "/map", name: "Map", component: MapView },
    { path: "/login", name: "Login", component: LoginView },
    { path: "/mypage", name: "MyPage", component: MyPageView },
    { path: "/signup", name: "Signup", component: SignupView },
    { path: "/findPwd", name: "FindPwd", component: FindPwdView },
    { path: "/landing2", name: "Landing2", component: LandingPage2 },
    { path: "/editPwd", name: "EditPwd", component: EditPwdView },
    { path: "/board/list", name: "List", component: BoardList },
    { path: "/notice", name: "Notice", component: NoticeView },
    { path: "/landing3", name: "Landing3", component: LandingPage },
    { path: "/board/write", name: "BoardEditor", component: BoardEditor },
    { path: "/mypage/edit", name: "MypageEditor", component: MypageEditor },
    { path: "/mypage/articles", name: "MyArticles", component: MyArticles },
    { path: "/mypage/course", name: "MyCourse", component: MyCourse },
    {
      path: "/auth/oauth-response/:accessToken/:expiresIn",
      name: "Oauth",
      component: OauthView,
    },
    {
      path: "/course/:courseId",
      name: "CourseDetail",
      component: CourseDetail,
      props: (route) => ({
        courseId: route.params.courseId,
        title: route.query.title,
        description: route.query.description,
      }),
    },
    {
      path: "/emailverify",
      name: "EmailVerification",
      component: EmailVerification,
    },
    { path: "/landing3", name: "Landing3", component: LandingView },
    { path: "/board/write", name: "BoardEditor", component: BoardEditor },
    {
      path: "/board/edit/:articleId",
      name: "BoardEdit",
      component: BoardEditor,
      props: true,
    },
    { path: "/notice/write", name: "NoticeEditor", component: NoticeEditor },
    {
      path: "/notice/edit/:noticeId",
      name: "NoticeEdit",
      component: NoticeEditor,
      props: true,
    },
  ],
});

export default router;
