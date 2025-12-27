<!-- This page is used for map price package , user upgrade and property boost
payment success -->

<template>
  <div class="min-h-60 flex items-center justify-center">
    <div class="container">
      <div class="icon-wrapper">
        <svg class="success-animation" viewBox="0 0 100 100">
          <circle class="circle" cx="50" cy="50" r="45" />
          <path class="checkmark" d="M30 52 l14 14 l26 -26" />
        </svg>
      </div>

      <h1 class="title">Payment Successful</h1>
      <p class="details">Thank you for Shopping With Us</p>
      <p>Now your property is Boosted</p>
      <br />
      <Button
        label="Go to My Properties"
        class=""
        @click="goHome"
        style="
          background-color: #4caf50;
          color: white;
          border-radius: 1rem;
          padding: 10px 20px;
        "
      />
    </div>
  </div>
</template>

<script setup>
import { useBoostProperty } from "@/composables/boostPayment/useBoostProperty";
import Button from "primevue/button";
import { onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const encryptedData = route.params.successEncryptData;
const data = JSON.parse(atob(encryptedData));
const { fetchExtraCalling } = useBoostProperty();

const goHome = () => {
  router.push("/my-info/my-listings");
};

onMounted(async () => {
  console.log("called extra api");
  await fetchExtraCalling(data.transactionId, data.paymentOption);
});
</script>

<style scoped>
/* Card container for the content */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 24px rgba(0, 0, 0, 0.05);
  padding: 60px 80px;
  max-width: 600px;
  width: 90%;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
}

/* Card background decoration */
.container::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle,
    rgba(76, 175, 80, 0.03) 0%,
    transparent 70%
  );
  z-index: -1;
}

/* ----- Animation for elements fading in ----- */
.logo,
.icon-wrapper,
.title,
.details,
.message {
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 0.6s ease-out forwards;
}

/* Stagger the animation delays for a nice sequence */
.logo {
  animation-delay: 0.2s;
}
.icon-wrapper {
  animation-delay: 0.4s;
}
.title {
  animation-delay: 1.4s;
}
.details {
  animation-delay: 1.6s;
}
.message {
  animation-delay: 1.8s;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.logo {
  width: 320px;
  height: auto;
  margin-bottom: 40px;
}

/* ----- Wrapper for the icon to contain the pulse effect ----- */
.icon-wrapper {
  position: relative;
  width: 160px;
  height: 160px;
  margin: 20px 0;
}

/* ----- Radiating pulse effect ----- */
.icon-wrapper::before,
.icon-wrapper::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #4caf50;
  border-radius: 50%;
  opacity: 0;
  z-index: -1;
  animation: pulse 2.5s infinite ease-out;
  animation-delay: 1.5s; /* Start after the checkmark animation */
}

.icon-wrapper::after {
  animation-delay: 1.9s; /* Stagger the second pulse */
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 0.3;
  }
  100% {
    transform: scale(1.6);
    opacity: 0;
  }
}

/* SVG icon styles */
.success-animation {
  width: 160px;
  height: 160px;
  cursor: pointer;
  filter: drop-shadow(0 4px 8px rgba(76, 175, 80, 0.2));
}

.success-animation .circle {
  stroke-dasharray: 283;
  stroke-dashoffset: 283;
  stroke: #4caf50;
  stroke-width: 5;
  fill: none;
  animation: draw-circle 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
  animation-delay: inherit;
}

.success-animation .checkmark {
  stroke-dasharray: 60;
  stroke-dashoffset: 60;
  stroke: #4caf50;
  stroke-width: 6;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
  animation: draw-checkmark 0.4s ease-out 0.6s forwards;
  animation-delay: inherit;
}

@keyframes draw-circle {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes draw-checkmark {
  to {
    stroke-dashoffset: 0;
  }
}

/* ----- Enhanced text styles ----- */
.title {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 35px 0 15px 0;
  letter-spacing: -0.5px;
  line-height: 1.2;
}

.details {
  font-size: 1.3rem;
  color: #7f8c8d;
  margin-bottom: 35px;
  font-weight: 400;
  line-height: 1.4;
}

.message {
  color: #34495e;
  font-size: 1.4rem;
  font-weight: 600;
  background: linear-gradient(135deg, #4caf50, #45a049);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .container {
    padding: 40px 30px;
    margin: 20px;
  }

  .logo {
    width: 250px;
  }

  .icon-wrapper {
    width: 120px;
    height: 120px;
  }

  .success-animation {
    width: 120px;
    height: 120px;
  }

  .title {
    font-size: 2.2rem;
  }

  .details {
    font-size: 1.1rem;
  }

  .message {
    font-size: 1.2rem;
  }
}
</style>
