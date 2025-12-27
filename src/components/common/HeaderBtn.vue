<style scoped>
.label-check {
  display: none;
}

.hamburger-label {
  width: 50px;
  height: 3px;
  display: block;
  cursor: pointer;
}

.hamburger-label div {
  width: 50px;
  height: 3px;
  position: absolute;
}

.line1 {
  transition: all 0.3s;
}

.line2 {
  margin: 9px 0 0 0;
  transition: 0.3s;
}

.line3 {
  margin: 18px 0 0 0;
  transition: 0.3s;
}

#label-check:checked + .hamburger-label .line1 {
  transform: rotate(24deg) scaleX(0.55) translate(27px, -5px);
  border-radius: 50px 50px 50px 0;
}

#label-check:checked + .hamburger-label .line3 {
  transform: rotate(-24deg) scaleX(0.55) translate(27px, 5px);
  border-radius: 0 50px 50px 50px;
}

#label-check:checked + .hamburger-label .line2 {
  border-top-right-radius: 50px;
  border-bottom-right-radius: 50px;
  width: 45px;
}
</style>
<script setup lang="ts">
const emit = defineEmits(["toggle-sidebar"]);
</script>
<template>
  <div class="" @click="emit('toggle-sidebar')">
    <input class="label-check items-center" id="label-check" type="checkbox" />
    <label for="label-check" class="hamburger-label">
      <div class="line1 bg-gray-950 dark:bg-white"></div>
      <div class="line2 bg-gray-950 dark:bg-white"></div>
      <div class="line3 bg-gray-950 dark:bg-white"></div>
      <label></label
    ></label>
  </div>
</template>
