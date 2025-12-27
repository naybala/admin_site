<style scoped>
/* //Loading Pattern One */
.loading-one {
  width: 105px;
  aspect-ratio: 1;
  position: relative;
  height: 84px;
}

.loading-one:before,
.loading-one:after {
  content: "";
  position: absolute;
  border-radius: 50px;
  box-shadow: 0 0 0 3px inset rgb(75 85 99);
  animation: sc 2.5s infinite;
}

.loading-one:after {
  animation-delay: -1.25s;
  border-radius: 0;
}

@keyframes sc {
  0% {
    inset: 0 75px 75px 0;
  }

  12.5% {
    inset: 0 75px 0 0;
  }

  25% {
    inset: 75px 75px 0 0;
  }

  37.5% {
    inset: 75px 0 0 0;
  }

  50% {
    inset: 75px 0 0 75px;
  }

  62.5% {
    inset: 0 0 0 75px;
  }

  75% {
    inset: 0 0 75px 75px;
  }

  87.5% {
    inset: 0 0 75px 0;
  }

  100% {
    inset: 0 75px 75px 0;
  }
}

/* //Loading Pattern Two */
.loading-two {
  display: inline-block;
  font-size: 48px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
  position: relative;
}

.loading-two::before {
  content: "";
  position: absolute;
  left: 97px;
  bottom: 19px;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: 5px solid;
  border-bottom-color: #ef53ff;
  box-sizing: border-box;
  animation: rotation 0.6s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* //Loading Pattern Three */
.loading-three {
  display: inline-block;
  text-align: center;
  line-height: 86px;
  text-align: center;
  position: relative;
  padding: 0 48px;
  font-size: 48px;
  font-family: Arial, Helvetica, sans-serif;
}

.loading-three:before,
.loading-three:after {
  content: "";
  display: block;
  width: 15px;
  height: 15px;
  background: currentColor;
  position: absolute;
  animation: load 0.7s infinite alternate ease-in-out;
  top: 0;
}

.loading-three:after {
  top: auto;
  bottom: 0;
}

@keyframes load {
  0% {
    left: 0;
    height: 43px;
    width: 15px;
    transform: translateX(0);
  }

  50% {
    height: 10px;
    width: 40px;
  }

  100% {
    left: 100%;
    height: 43px;
    width: 15px;
    transform: translateX(-100%);
  }
}

/* //Loading Pattern Four */
.loading-four-text-wrapper {
  height: fit-content;
  min-width: 3rem;
  width: fit-content;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 0.25ch;
  position: relative;
  z-index: 0;
}

.loading-four-invertbox {
  position: absolute;
  height: 100%;
  aspect-ratio: 1/1;
  left: 0;
  top: 0;
  border-radius: 20%;
  backdrop-filter: invert(100%);
  animation: move 2s ease-in-out infinite;
}

@keyframes move {
  50% {
    left: calc(100% - 3rem);
  }
}
</style>

<script setup lang="ts">
const pattern: string = import.meta.env.VITE_LOADING_ANIMATION;
</script>
<template>
  <!-- Loading One -->
  <div
    v-if="pattern === 'Pattern_One'"
    role="status"
    class="grid h-80 place-items-center"
  >
    <div role="status">
      <div class="loading-one">
        <p class="text-center p-7 text-sm">BAYON</p>
      </div>
    </div>
  </div>

  <!-- Loading Two -->
  <div
    v-else-if="pattern === 'Pattern_Two'"
    role="status"
    class="grid h-80 place-items-center"
  >
    <div role="status">
      <span class="loading-two">BAY &nbsp; N APP</span>
    </div>
  </div>

  <!-- Loading Three -->
  <div
    v-else-if="pattern === 'Pattern_Three'"
    role="status"
    class="grid h-80 place-items-center align-middle"
  >
    <div role="status">
      <div class="loading-three">BAYON APP</div>
    </div>
  </div>

  <!-- Loading Four -->
  <div
    v-else-if="pattern === 'Pattern_Four'"
    role="status"
    class="grid h-80 place-items-center align-middle"
  >
    <div class="loading-four-text-wrapper">
      <p class="text">BAYON APP</p>
      <div class="loading-four-invertbox"></div>
    </div>
  </div>
</template>
