import SocialAudioListView from "@views/socialAudios/SocialAudioListView.vue";
import SocialAudioFormView from "@views/socialAudios/SocialAudioFormView.vue";

export const socialAudioRoutes = [
  {
    path: "/social-audios",
    name: "socialAudios",
    component: SocialAudioListView,
    meta: {
      requiresAuth: true,
      permission: "socialAudios.index",
      sidebar: true,
      label: "sidebar.socialAudios",
      icon: "pi pi-prime",
    },
  },
  {
    path: "/social-audios/new",
    name: "socialAudio-new",
    component: SocialAudioFormView,
    meta: {
      requiresAuth: true,
      permission: "socialAudios.store",
    },
  },
  {
    path: "/social-audios/edit/:id",
    name: "socialAudio-edit",
    component: SocialAudioFormView,
    props: true,
    meta: {
      requiresAuth: true,
      permission: "socialAudios.edit",
    },
  },
  {
    path: "/social-audios/view/:id",
    name: "socialAudio-view",
    component: SocialAudioFormView,
    props: true,
    meta: {
      requiresAuth: true,
      permission: "socialAudios.show",
    },
  },
];
