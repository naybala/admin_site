<template>
  <svg
    width="400"
    height="400"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Logo of three purple buildings in a circle, softer design"
  >
    <defs></defs>

    <circle cx="50" cy="50" r="50" class="dark-purple" />
    <circle cx="50" cy="50" r="46" fill="white" />

    <defs>
      <clipPath id="circle-clip-soft">
        <circle cx="50" cy="50" r="46" />
      </clipPath>
    </defs>

    <g clip-path="url(#circle-clip-soft)">
      <path class="dark-purple" d="M50 8 L64 16 L64 96 L50 100 Z" />
      <path class="light-purple" d="M36 16 L50 8 L50 100 L36 96 Z" />

      <path class="dark-purple" d="M30 46 L40 52 L40 96 L30 100 Z" />
      <path class="light-purple" d="M20 52 L30 46 L30 100 L20 96 Z" />

      <path class="dark-purple" d="M70 51 L80 57 L80 96 L70 100 Z" />
      <path class="light-purple" d="M60 57 L70 51 L70 100 L60 96 Z" />
    </g>
  </svg>
</template>
<style scoped>
.dark-purple {
  fill: #952b9e;
}
.light-purple {
  fill: #ef53ff;
}
</style>
