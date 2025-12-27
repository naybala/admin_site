<template>
  <div
    class="flex flex-col md:flex-row md:h-screen p-0 md:p-2 lg:p-14 main-bg transition-all duration-1000 ease-in-out"
  >
    <!-- Left Side - Image -->
    <div
      :class="[
        'relative flex items-center justify-center bg-gray-300 overflow-hidden transition-all duration-1000 ease-in-out diagonal-left',
        isLoginSuccessful ? 'w-full' : 'w-full md:w-[55%]',
      ]"
    >
      <div class="relative z-10">
        <img
          :src="hotelManagementLogo"
          alt="Login Illustration"
          class="w-44 h-44 md:w-full md:h-full mx-auto rounded-lg transition-all duration-700 ease-in-out mt-5 md:mt-0"
        />
      </div>
    </div>

    <!-- Right Side - Login Form -->
    <div
      v-if="!isLoginSuccessful"
      class="w-full md:w-[45%] flex items-center justify-center bg-gray-100 transition-opacity duration-700 ease-in-out"
    >
      <div class="w-full max-w-xl p-10">
        <img :src="logo" alt="" class="w-40 h-40 mx-auto" />
        <h1
          class="text-2xl font-bold text-center text-brand-secondary mb-6 mt-2"
        >
          Welcome to Admin Dashboard
        </h1>
        <label for="" class="text-sm text-balance text-gray-400 ms-1"
          >User Email Or Phone Number</label
        >
        <input
          v-model="username"
          type="text"
          placeholder="Username"
          required
          class="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
        />
        <label for="" class="text-sm text-balance text-gray-400 ms-1"
          >Password</label
        >
        <div class="relative">
          <input
            @keyup.enter="handleLogin"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Password"
            required
            class="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />

          <button
            type="button"
            @click="toggleShowPassword"
            class="absolute right-2 top-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
            aria-label="Toggle password visibility"
          >
            {{ showPassword ? "hide" : "show" }}
          </button>
        </div>

        <button
          @click="handleLogin"
          :disabled="loading"
          class="w-full bg-brand-primary text-white py-2 rounded-md hover:bg-brand-primary-dark transition-colors duration-200 disabled:opacity-50"
        >
          <span v-if="!loading">Login</span>
          <span v-else>Logging in...</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import useAuthData from "@composables/auth";
import { useAppToast } from "@composables/common/useAppToast";
import logo from "../../assets/images/lm_hostel.png";
import hotelManagementLogo from "../../assets/images/hotel_management.png";

const username = ref("");
const password = ref("");

const isLoginSuccessful = ref(true);

const router = useRouter();
const route = useRoute();

const showPassword = ref(false);

function toggleShowPassword() {
  showPassword.value = !showPassword.value;
}

const { showSuccess, showError } = useAppToast();
const { success, loading, error, fetchAuthData } = useAuthData();

onMounted(() => {
  //  Trigger reverse animation on component mount
  setTimeout(() => {
    isLoginSuccessful.value = false;
  }, 600); // delay slightly to trigger CSS transition
});

const handleLogin = async () => {
  if (!username.value || !password.value) {
    error.value = "Please enter both email and password.";
    return;
  }

  try {
    loading.value = true;

    const credentials = {
      username: username.value,
      password: password.value,
    };

    const response = await fetchAuthData(credentials);

    if (success.value && response?.data?.token && response?.data?.user) {
      showSuccess(`Welcome From BAYON APP!`, "Login successful.", 900);

      //  Trigger expand animation
      isLoginSuccessful.value = true;
      // Wait for animation to finish before redirect
      setTimeout(() => {
        const redirectTo = (route.query.redirect as string) || "/dashboard";
        router.push(redirectTo);
      }, 900);
    } else {
      error.value = "Login failed. Please try again.";
      showError("Login failed", error.value);
    }
  } catch (err) {
    error.value = "An unexpected error occurred. Please try again.";
    showError("Error", error.value);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.main-bg {
  background-image: white;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
}

.diagonal-left {
  clip-path: ellipse(90% 90% at 10% 20%);
}

/* Mobile: disable diagonal */
@media (max-width: 768px) {
  .diagonal-left {
    clip-path: none;
  }
}

.diagonal-left::after {
  content: "";
  position: absolute;
  top: 0;
  right: -1px;
  width: 10px;
  height: 100%;
  background: linear-gradient(to right, rgba(192, 176, 176, 0), transparent);
}
</style>
