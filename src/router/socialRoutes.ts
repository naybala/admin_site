import NewListView from "@/views/news/NewListView.vue";
import NewFormView from "@/views/news/NewFormView.vue";
import VideoListView from "@/views/videos/VideoListView.vue";
import VideoFormView from "@/views/videos/VideoFormView.vue";
import SocialCategoryListView from "@views/socialCategories/SocialCategoryListView.vue";
import SocialCategoryFormView from "@views/socialCategories/SocialCategoryFormView.vue";
import ArtistListView from "@views/artists/ArtistListView.vue";
import ArtistFormView from "@views/artists/ArtistFormView.vue";
import SocialAudioListView from "@views/socialAudios/SocialAudioListView.vue";
import SocialAudioFormView from "@views/socialAudios/SocialAudioFormView.vue";
import LiveStreamingListView from "@/views/liveStreamings/LiveStreamingListView.vue";
import LiveStreamingFormView from "@/views/liveStreamings/LiveStreamingFormView.vue";

const featureOne = "news";
const featureTwo = "videos";
const featureThree = "socialAudios";
const featureFour = "socialCategories";
const featureFive = "artists";

export const socialRoutes = [
  {
    path: "/social",
    name: "social",
    meta: {
      requiresAuth: true,
      sidebar: true,
      label: "sidebar.social",
      icon: "pi pi-megaphone",
    },

    children: [
      {
        path: "news",
        name: "news",
        component: NewListView,
        meta: {
          requiresAuth: true,
          permission: `${featureOne}.index`,
          sidebar: false,
          label: "sidebar.news",
          icon: "pi pi-microchip",
        },
      },
      {
        path: "videos",
        name: "videos",
        component: VideoListView,
        meta: {
          requiresAuth: true,
          permission: `${featureTwo}.index`,
          sidebar: false,
          label: "sidebar.videos",
          icon: "pi pi-sitemap",
        },
      },
      {
        path: "social-audios",
        name: "socialAudios",
        component: SocialAudioListView,
        meta: {
          requiresAuth: true,
          permission: `${featureThree}.index`,
          sidebar: false,
          label: "sidebar.socialAudios",
          icon: "pi pi-prime",
        },
      },
      {
        path: "social-categories",
        name: "socialCategories",
        component: SocialCategoryListView,
        meta: {
          requiresAuth: true,
          permission: `${featureFour}.index`,
          sidebar: false,
          label: "sidebar.socialCategories",
          icon: "pi pi-prime",
        },
      },
      {
        path: "artists",
        name: "artists",
        component: ArtistListView,
        meta: {
          requiresAuth: true,
          permission: `${featureFive}.index`,
          sidebar: false,
          label: "sidebar.artists",
          icon: "pi pi-prime",
        },
      },
      {
        path: "live-streamings",
        name: "liveStreamings",
        component: LiveStreamingListView,
        meta: {
          requiresAuth: true,
          permission: "liveStreamings.index",
          sidebar: false,
          label: "sidebar.liveStreamings",
          icon: "pi pi-prime",
        },
      },
    ],
  },
  //News
  {
    path: "/social/news/new",
    name: "news-new",
    component: NewFormView,
    meta: {
      requiresAuth: true,
      permission: `${featureOne}.store`,
    },
  },
  {
    path: "/social/news/edit/:id",
    name: "news-edit",
    component: NewFormView,
    props: true,
    meta: {
      requiresAuth: true,
      permission: `${featureOne}.edit`,
    },
  },
  {
    path: "/social/news/view/:id",
    name: "news-view",
    component: NewFormView,
    props: true,
    meta: {
      requiresAuth: true,
      permission: `${featureOne}.show`,
    },
  },

  //Videos
  {
    path: "/social/videos/new",
    name: "video-new",
    component: VideoFormView,
    meta: {
      requiresAuth: true,
      permission: `${featureTwo}.store`,
    },
  },
  {
    path: "/social/videos/edit/:id",
    name: "video-edit",
    component: VideoFormView,
    props: true,
    meta: {
      requiresAuth: true,
      permission: `${featureTwo}.edit`,
    },
  },
  {
    path: "/social/videos/view/:id",
    name: "video-view",
    component: VideoFormView,
    props: true,
    meta: {
      requiresAuth: true,
      permission: `${featureTwo}.show`,
    },
  },

  //Audios
  {
    path: "/social/social-audios/new",
    name: "socialAudio-new",
    component: SocialAudioFormView,
    meta: {
      requiresAuth: true,
      permission: `${featureThree}.store`,
    },
  },
  {
    path: "/social/social-audios/edit/:id",
    name: "socialAudio-edit",
    component: SocialAudioFormView,
    props: true,
    meta: {
      requiresAuth: true,
      permission: `${featureThree}.edit`,
    },
  },
  {
    path: "/social/social-audios/view/:id",
    name: "socialAudio-view",
    component: SocialAudioFormView,
    props: true,
    meta: {
      requiresAuth: true,
      permission: `${featureThree}.show`,
    },
  },

  //Artists
  {
    path: "/social/artists/new",
    name: "artist-new",
    component: ArtistFormView,
    meta: {
      requiresAuth: true,
      permission: `${featureFive}.store`,
    },
  },
  {
    path: "/social/artists/edit/:id",
    name: "artist-edit",
    component: ArtistFormView,
    props: true,
    meta: {
      requiresAuth: true,
      permission: `${featureFive}.edit`,
    },
  },
  {
    path: "/social/artists/view/:id",
    name: "artist-view",
    component: ArtistFormView,
    props: true,
    meta: {
      requiresAuth: true,
      permission: `${featureFive}.show`,
    },
  },

  //Social Categories
  {
    path: "/social/social-categories/new",
    name: "socialCategory-new",
    component: SocialCategoryFormView,
    meta: {
      requiresAuth: true,
      permission: `${featureFour}.store`,
    },
  },
  {
    path: "/social/social-categories/edit/:id",
    name: "socialCategory-edit",
    component: SocialCategoryFormView,
    props: true,
    meta: {
      requiresAuth: true,
      permission: `${featureFour}.edit`,
    },
  },
  {
    path: "/social/social-categories/view/:id",
    name: "socialCategory-view",
    component: SocialCategoryFormView,
    props: true,
    meta: {
      requiresAuth: true,
      permission: `${featureFour}.show`,
    },
  },
  //Live Streamings
  {
    path: "/social/live-streamings/new",
    name: "liveStreaming-new",
    component: LiveStreamingFormView,
    props: true,
    meta: {
      requiresAuth: true,
      permission: "liveStreamings.store",
    },
  },
  {
    path: "/social/live-streamings/edit/:id",
    name: "liveStreaming-edit",
    component: LiveStreamingFormView,
    props: true,
    meta: {
      requiresAuth: true,
      permission: "liveStreamings.edit",
    },
  },
  {
    path: "/social/live-streamings/view/:id",
    name: "liveStreaming-view",
    component: LiveStreamingFormView,
    props: true,
    meta: {
      requiresAuth: true,
      permission: "liveStreamings.show",
    },
  },
];
