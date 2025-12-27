<template>
  <div
    class="flex flex-col md:flex-row md:h-screen p-0 md:p-2 lg:p-14 main-bg transition-all duration-1000 ease-in-out"
  >
    <!-- Privacy Policy Modal -->
    <PrivacyModal
      v-model:show="showPrivacyModal"
      @close="handleModalClose"
      @accept="handlePrivacyAccept"
    />
    <!-- Left Side - Image -->
    <div
      :class="[
        'flex items-center justify-center bg-gray-300 rounded-none lg:rounded-s-lg transition-all duration-1000 ease-in-out overflow-hidden',
        isLoginSuccessful ? 'w-full' : 'w-full md:w-1/2',
      ]"
    >
      <div>
        <img
          :src="qrCode"
          alt="Login Illustration"
          class="w-44 h-44 md:w-80 md:h-80 mx-auto rounded-lg transition-all duration-700 ease-in-out mt-5 md:mt-0"
        />
        <p class="text-center mt-10 md:text-md lg:text-xl text-black">
          YOUR DIGITAL REAL ESTATE PLATFORM
        </p>
        <p class="text-center mb-10 text-black">
          Download the app to get started
        </p>
        <a href="https://app.bayonapp.com/" target="_blank">
          <img
            :src="appStorePlayStoreLogo"
            alt="Login Illustration"
            class="w-60 h-10 md:w-auto md:h-10 mx-auto rounded-lg transition-all duration-700 ease-in-out mb-3 md:mb-0"
          />
        </a>
        <br />
      </div>
    </div>

    <!-- Right Side - Login Form -->
    <div
      v-if="!isLoginSuccessful"
      class="w-full md:w-1/2 flex items-center justify-center bg-gray-100 rounded-none lg:rounded-e-lg transition-opacity duration-700 ease-in-out"
    >
      <div class="w-full max-w-xl p-10">
        <img :src="LoginLogo" alt="" class="w-40 h-40 mx-auto" />
        <h1 class="text-2xl font-bold text-center text-brand-secondary mb-6">
          Welcome to BAYON APP
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

        <!-- Privacy Policy Link -->
        <div class="mt-4 text-center">
          <button
            @click="showPrivacyModal = true"
            class="text-sm text-brand-primary hover:underline"
          >
            Privacy Policy
          </button>
        </div>

        <div class="mt-6 md:mt-16">
          <p class="text-xs dark:text-black">
            {{ stringOne }}
          </p>
          <p class="text-xs dark:text-black">{{ stringTwo }}</p>
        </div>
        <p v-if="error" class="text-red-500 text-sm mt-4 text-center">
          {{ error }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

// Import the modal component
import PrivacyModal from "@/components/Login/PrivacyModal.vue";

import useAuthData from "@composables/auth";
import { useAppToast } from "@composables/common/useAppToast";
import LoginLogo from "../../assets/web_app.svg";
import qrCode from "../../assets/images/qr-code.png";
import appStorePlayStoreLogo from "../../assets/images/appstore-playstorelogo.png";

const username = ref("");
const password = ref("");
const stringOne = ref<string>(
  "* To use our platform you should register for your new account from the mobile app."
);
const stringTwo = ref<string>("* Scan QR Code to download the app.");

const isLoginSuccessful = ref(true);
const showPrivacyModal = ref(false);
const autoCountryCode: any = inject("autoCountryCode");

//  Language dictionary by country calling code
const languageMap: Record<string, { one: string; two: string }> = {
  "+855": {
    one: "* ដើម្បីប្រើប្រាស់វេទិការបស់យើង អ្នកគួរតែចុះឈ្មោះសម្រាប់គណនីថ្មីរបស់អ្នកពីកម្មវិធីទូរស័ព្ទ។.",
    two: "* ស្កេនលេខកូដ QR ដើម្បីទាញយកកម្មវិធី។.",
  }, // Cambodia
  "+95": {
    one: "* ကျွန်ုပ်တို့၏ပလက်ဖောင်းကိုအသုံးပြုရန် မိုဘိုင်းအက်ပ်မှ သင့်အကောင့်အသစ်အတွက် မှတ်ပုံတင်သင့်သည်။",
    two: "* အက်ပ်ကို ဒေါင်းလုဒ်လုပ်ရန် QR ကုဒ်ကို စကင်ဖတ်ပါ။",
  }, // Myanmar
  "+66": {
    one: "* เพื่อใช้งานแพลตฟอร์มของเรา คุณควรลงทะเบียนบัญชีใหม่ของคุณจากแอปมือถือ.",
    two: "* สแกน QR Code เพื่อดาวน์โหลดแอป.",
  }, // Thailand
  "+84": {
    one: "* Để sử dụng nền tảngของ chúng tôi, bạn nên đăng ký tài khoản mới từ ứng dụng di động.",
    two: "* Quét mã QR để tải ứng dụng.",
  }, // Vietnam
  "+62": {
    one: "* Untuk menggunakan platform kami, Anda harus mendaftar akun baru melalui aplikasi seluler.",
    two: "* Pindai Kode QR untuk mengunduh aplikasi.",
  }, // Indonesia
  "+63": {
    one: "* Upang magamit ang aming platform, dapat kang magrehistro para sa iyong bagong account mula sa mobile app.",
    two: "* I-scan ang QR Code upang i-download ang app.",
  }, // Philippines
  "+81": {
    one: "* プラットフォームを利用するには、モバイルアプリから新しいアカウントを登録する必要があります。",
    two: "* アプリをダウンロードするにはQRコードをスキャンしてください。",
  }, // Japan
  "+82": {
    one: "* 플랫폼을 사용하려면 모바일 앱에서 새 계정을 등록해야 합니다.",
    two: "* 앱을 다운로드하려면 QR 코드를 스캔하세요。",
  }, // South Korea
  "+86": {
    one: "* 要使用我们的平台，您应该通过手机应用注册新账户。",
    two: "* 扫描二维码下载应用程序。",
  }, // China
  "+91": {
    one: "* हमारे प्लेटफ़ॉर्म का उपयोग करने के लिए आपको मोबाइल ऐप से नया खाता पंजीकृत करना चाहिए।",
    two: "* ऐप डाउनलोड करने के लिए QR कोड स्कैन करें।",
  }, // India
  "+92": {
    one: "* ہمارے پلیٹ فارم کو استعمال کرنے کے لیے آپ کو موبائل ایپ سے اپنا نیا اکاؤنٹ رجسٹر کرنا چاہیے۔",
    two: "* ایپ ڈاؤن لوڈ کرنے کے لیے QR کوڈ اسکین کریں।",
  }, // Pakistan
  "+94": {
    one: "* අපගේ වේදිකාව භාවිතා කිරීමට, ඔබට ඔබේ නව ගිණුම ජංගම යෙදුමෙන් ලියාපදිංචි කළ යුතුය.",
    two: "* යෙදුම බාගත කිරීමට QR කේතය ස්කෑන් කරන්න.",
  }, // Sri Lanka
  "+60": {
    one: "* Untuk menggunakan platform kami, anda perlu mendaftar akaun baru melalui aplikasi mudah alih.",
    two: "* Imbas Kod QR untuk memuat turun aplikasi.",
  }, // Malaysia
};

// Function to update text dynamically
const updateLanguage = (code: string) => {
  const lang = languageMap[code];
  if (lang) {
    stringOne.value = lang.one;
    stringTwo.value = lang.two;
  } else {
    // fallback to English
    stringOne.value =
      "* To use our platform you should register for your new account from the mobile app.";
    stringTwo.value = "* Scan QR Code to download the app.";
  }
};

// Watch the injected reactive value
watch(
  () => autoCountryCode?.value,
  (newVal) => {
    if (newVal) updateLanguage(newVal);
  },
  { immediate: true } // ensures it runs on component mount too
);

const router = useRouter();
const route = useRoute();

const showPassword = ref(false);

function toggleShowPassword() {
  showPassword.value = !showPassword.value;
}
function handleModalClose() {
  console.log("Privacy policy modal closed");
}

function handlePrivacyAccept() {
  console.log("Privacy policy accepted");
  // You can add any logic here that should run when user accepts the privacy policy
  // For example: track acceptance, enable features, etc.
}
const { showSuccess, showError } = useAppToast();
const { success, loading, error, fetchAuthData } = useAuthData();

onMounted(() => {
  if (autoCountryCode?.value) updateLanguage(autoCountryCode.value);
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
  background-image: url("../../assets/images/main-bg.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
}
</style>
