<template>
  <svg
    :width="width"
    :height="height"
    viewBox="0 0 24 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect y="0.152832" width="24" height="14" rx="2" fill="black" />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M9.07666 11.0763H14.0615V3.08679H9.07666V11.0763Z"
      fill="#FF5F00"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M9.59011 7.08247C9.58881 5.52365 10.3181 4.05093 11.5677 3.0884C9.31943 1.35459 6.06445 1.73748 4.29745 3.94367C2.53059 6.15 2.92078 9.34412 5.16915 11.0779C7.04675 12.526 9.69006 12.526 11.5677 11.0779C10.3177 10.1153 9.58838 8.6417 9.59011 7.08247Z"
      fill="#EB001B"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M20.0646 12.751V11.6738H19.9407L19.7957 12.4432L19.6507 11.6738H19.526V12.751H19.6158V11.9354L19.7508 12.6355H19.8437L19.9783 11.9354V12.751H20.0646ZM19.2997 12.751V11.8585H19.526V11.6738H18.9874V11.8585H19.2006V12.751H19.2997Z"
      fill="#F79E1B"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M19.9454 7.08226C19.9453 9.88826 17.6271 12.163 14.7677 12.163C13.607 12.1629 12.4802 11.7803 11.5677 11.0763C13.816 9.34236 14.2063 6.14838 12.4393 3.94205C12.1845 3.62394 11.8919 3.33673 11.5677 3.08679C13.8157 1.35255 17.0707 1.73487 18.8381 3.94078C19.5554 4.83613 19.9453 5.94191 19.9454 7.08085V7.08226Z"
      fill="#F79E1B"
    />
  </svg>
</template>

<script setup lang="ts">
defineProps({
  width: {
    type: Number,
    default: 40,
  },
  height: {
    type: Number,
    default: 35,
  },
});
</script>
