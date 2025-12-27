<template>
  <svg
    width="50"
    height="50"
    viewBox="0 0 400 400"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- Define gradient -->
    <defs>
      <linearGradient id="purplePinkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color: #6b2c7e; stop-opacity: 1" />
        <stop offset="100%" style="stop-color: #e851e8; stop-opacity: 1" />
      </linearGradient>
    </defs>

    <!-- Outer circle ring -->
    <circle
      cx="200"
      cy="200"
      r="180"
      fill="none"
      stroke="url(#purplePinkGradient)"
      stroke-width="20"
    />

    <!-- Left outer bar - dark -->
    <rect x="62" y="205" width="53" height="185" fill="#6B2C7E" />

    <!-- Left outer bar - light with white border and rounded corners -->
    <rect
      x="115"
      y="205"
      width="60"
      height="185"
      fill="#E851E8"
      stroke="white"
      stroke-width="4"
      rx="8"
      ry="8"
    />

    <!-- Center tall bar - dark -->
    <rect x="162" y="0" width="38" height="390" fill="#6B2C7E" />

    <!-- Center tall bar - light with white border and rounded corners -->
    <rect
      x="200"
      y="0"
      width="85"
      height="390"
      fill="#E851E8"
      stroke="white"
      stroke-width="4"
      rx="8"
      ry="8"
    />

    <!-- Right outer bar - dark -->
    <rect x="260" y="205" width="53" height="185" fill="#6B2C7E" />

    <!-- Right outer bar - light with white border and rounded corners -->
    <rect
      x="313"
      y="205"
      width="42"
      height="185"
      fill="#E851E8"
      stroke="white"
      stroke-width="4"
      rx="8"
      ry="8"
    />
  </svg>
</template>
<style scoped>
.dark-purple {
  fill: #6a2c70;
}
.light-purple {
  fill: #e67ffb;
}
</style>
<script setup lang="ts"></script>
