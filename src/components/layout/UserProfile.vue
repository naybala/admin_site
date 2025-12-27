<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  userData: {
    type: Object,
    default: () => ({}),
  },
  class: {
    type: String,
    default: "w-10 h-10 mx-auto rounded-full",
  },
  isShowInfo: {
    type: Boolean,
    default: true,
  },
});

const delayedImageUrl = ref("");

// Watch for URL changes and apply 1-second delay
watch(
  () => props.userData?.url,
  (newUrl) => {
    if (newUrl) {
      setTimeout(() => {
        delayedImageUrl.value = newUrl;
      }, 500);
    } else {
      delayedImageUrl.value = "";
    }
  },
  { immediate: true }
);

const goToMyProfile = () => {
  router.push({ name: "my-profile" });
};

const goToPackage = () => {
  router.push({ name: "my-packages" });
};
const imageSrc = computed(() => {
  if (!delayedImageUrl.value)
    return "https://proptechapp.sgp1.cdn.digitaloceanspaces.com/default/association_default.png";

  const url = new URL(delayedImageUrl.value);
  url.searchParams.set("t", Date.now().toString());
  return url.toString();
});
</script>

<template>
  <div>
    <img
      @click="goToMyProfile"
      :key="delayedImageUrl"
      :src="imageSrc"
      alt="User Profile"
      :class="class"
      class="cursor-pointer hover:scale-75 duration-300"
    />
    <span v-if="isShowInfo">
      <!-- Other user info updates immediately -->
      <p class="text-sm my-1">{{ userData?.username }}, Dashboard</p>
      <p class="text-xs">
        Your profile type is
        <span class="text-green-500">{{
          userData?.userTypeName == "Developer"
            ? "Super Admin"
            : userData?.userTypeName
        }}</span>
      </p>
      <br />
      <p class="text-xs">
        <span v-if="userData?.userType !== 'Member'"> </span>

        <span v-else>
          <span class="text-green-500 cursor-pointer" @click="goToPackage"
            >Upgrade</span
          >
          Your Account
        </span>
      </p>
    </span>
  </div>
</template>
