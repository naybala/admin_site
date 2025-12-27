<template>
  <div
    class="flex flex-col md:flex-row min-h-screen p-0 md:p-2 lg:p-14 main-bg transition-all duration-1000 ease-in-out"
  >
    <!-- Privacy Policy Modal -->
    <PrivacyModal
      v-model:show="showPrivacyModal"
      @close="handleModalClose"
      @accept="handlePrivacyAccept"
    />

    <!-- OTP Modal -->
    <Otp
      v-model:show="showOtpModal"
      @verify="handleOtpVerify"
      @close="handleOtpClose"
    />

    <!-- Left Side - Image -->
    <div
      :class="[
        'flex flex-col items-center justify-center bg-gray-300 rounded-none lg:rounded-s-lg transition-all duration-1000 ease-in-out overflow-hidden p-4',
        isLoginSuccessful ? 'w-full' : 'w-full md:w-1/2',
      ]"
    >
      <div class="max-w-md w-full text-center">
        <img
          :src="qrCode"
          alt="Login Illustration"
          class="w-44 h-44 md:w-64 md:h-64 lg:w-80 lg:h-80 mx-auto rounded-lg transition-all duration-700 ease-in-out mt-5 md:mt-0 object-contain"
        />
        <p
          class="text-center mt-6 md:text-md lg:text-xl text-black break-words"
        >
          YOUR DIGITAL REAL ESTATE PLATFORM
        </p>
        <p class="text-center mb-6 text-black break-words">
          Download the app to get started
        </p>
        <a href="https://app.bayonapp.com/" target="_blank">
          <img
            :src="appStorePlayStoreLogo"
            alt="App Store and Play Store Logos"
            class="w-60 h-auto max-w-full mx-auto rounded-lg transition-all duration-700 ease-in-out mb-3 md:mb-0"
          />
        </a>
      </div>
    </div>

    <!-- Right Side - Login Form -->
    <div
      v-if="!isLoginSuccessful && isHydrated"
      class="w-full md:w-1/2 flex items-center justify-center bg-gray-100 rounded-none lg:rounded-e-lg transition-opacity duration-700 ease-in-out p-4"
    >
      <div class="w-full max-w-lg p-6 sm:p-10">
        <img
          :src="LoginLogo"
          alt="Bayon App Logo"
          class="w-32 h-32 mx-auto mb-6 object-contain"
        />
        <h1
          class="text-2xl font-bold text-center text-brand-secondary mb-6 break-words"
        >
          Welcome to BAYON APP
        </h1>
        <div
          class="flex flex-col sm:flex-row justify-center items-center gap-3 mb-4"
        >
          <div class="w-full sm:w-auto flex-grow">
            <!-- Country -->
            <SelectItem
              id="phoneNumberPrefixRequired"
              v-model="countryCode"
              label="Country Code"
              :options="countries"
              placeholder="KHR"
              optionLabel="countryCode"
              optionValue="code"
              :showFlag="true"
            />
          </div>

          <div class="w-full sm:w-auto flex-grow">
            <NameField
              id="phoneNumber"
              v-model="username"
              label="Phone Number"
            />
          </div>
        </div>

        <div class="flex justify-center gap-3 px-0 sm:px-4 mb-4">
          <button
            @click="handleLogin"
            :disabled="username == ''"
            class="w-full bg-brand-primary text-white py-2 rounded-md hover:bg-brand-primary-dark transition-colors duration-200 disabled:opacity-50"
          >
            <span>Login</span>
          </button>
        </div>

        <div class="flex justify-center items-center mb-4">
          <GoogleSignInButton
            @success="handleLoginSuccess"
            @error="handleLoginError"
          />
        </div>

        <!-- Privacy Policy Link -->
        <div class="mt-4 text-center">
          <button
            @click="showPrivacyModal = true"
            class="text-sm text-brand-primary hover:underline"
          >
            Privacy Policy
          </button>
        </div>

        <div class="mt-6 md:mt-12 text-center px-2">
          <p class="text-xs dark:text-black break-words">
            {{ stringOne }}
          </p>
          <p class="text-xs dark:text-black mt-2 break-words">
            {{ stringTwo }}
          </p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="!isHydrated"
      class="w-full flex items-center justify-center bg-gray-100 rounded-none lg:rounded-e-lg p-4"
    >
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto"
        ></div>
        <p class="text-lg mt-4">Loading...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

// Import the modal component
import PrivacyModal from "@/components/Login/PrivacyModal.vue";
import { useAppToast } from "@composables/common/useAppToast";
import LoginLogo from "../../assets/web_app.svg";
import qrCode from "../../assets/images/qr-code.png";
import appStorePlayStoreLogo from "../../assets/images/appstore-playstorelogo.png";
import Otp from "./Otp.vue";
import SelectItem from "@/components/common/SelectItem.vue";
import useOtp from "@composables/auth/useOtp";
import NameField from "@/components/common/NameField.vue";
import { GoogleSignInButton } from "vue3-google-signin";
import { jwtDecode } from "jwt-decode";
import useEmail from "@composables/auth/useEmail";
import { useAuthStore } from "@stores/auth";

type GoogleUser = {
  email: string;
  name: string;
  picture: string;
  sub: string; // Google user ID
};

const username = ref("");
const stringOne = ref<string>(
  "* To use our platform you should register for your new account from the mobile app."
);
const stringTwo = ref<string>("* Scan QR Code to download the app.");
const showOtpModal = ref(false);
const otpVerified = ref(false);
const countryCode = ref<string>("+855");
const countries: any = inject("countryList");

const isLoginSuccessful = ref(true);
const showPrivacyModal = ref(false);
const autoCountryCode: any = inject("autoCountryCode");
const isHydrated = ref(false);

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

// Language dictionary by country calling code
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
    one: "* Để sử dụng nền tảng của chúng tôi, bạn nên đăng ký tài khoản mới từ ứng dụng di động.",
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
    one: "* 플랫폼을 사용하려면 모바일 앱에서 새 계정을 등록해야 합니다。",
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
    two: "* ایپ ڈاؤن لوڈ کرنے کے لیے QR کوڈ اسکین کریں۔",
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
  { immediate: true }
);

function handleModalClose() {
  console.log("Privacy policy modal closed");
}

function handlePrivacyAccept() {
  console.log("Privacy policy accepted");
}

const { showSuccess, showError } = useAppToast();
const { smsCode, otpRequest, login } = useOtp();
const { emailLogin } = useEmail();

onMounted(async () => {
  try {
    // Wait for Pinia to hydrate from localStorage
    await authStore.ensureHydrated();

    // Check if user is already authenticated
    if (authStore.token) {
      await router.push("/dashboard");
      return;
    }

    // If not authenticated, show login form
    if (autoCountryCode?.value) updateLanguage(autoCountryCode.value);

    setTimeout(() => {
      isLoginSuccessful.value = false;
      isHydrated.value = true;
    }, 600);
  } catch (error) {
    console.error("Hydration error:", error);
    // Fallback: show login form even if hydration fails
    isHydrated.value = true;
    isLoginSuccessful.value = false;
  }
});

const handleLogin = async () => {
  const requestData = {
    phoneNumberPrefix: countryCode.value,
    phoneNumber: username.value,
  };
  showOtpModal.value = true;
  await otpRequest(requestData);
};

const handleOtpVerify = async (otpCode: any) => {
  const requestLoginData = {
    phoneNumberPrefix: countryCode.value,
    phoneNumber: username.value,
  };

  if (otpCode != smsCode.value) {
    showError("Wrong OTP", "Please check carefully OTP code.");
    return false;
  }

  await login(requestLoginData);

  otpVerified.value = true;
  showOtpModal.value = false;
  showSuccess("OTP Verified!", "You're being logged in...", 900);

  isLoginSuccessful.value = true;
  setTimeout(() => {
    const redirectTo = (route.query.redirect as string) || "/dashboard";
    router.push(redirectTo);
  }, 900);
};

// handle success event
const handleLoginSuccess = async (response: any) => {
  const { credential } = response;
  if (credential) {
    const decoded = jwtDecode<GoogleUser>(credential);
    const response: any = await emailLogin({ email: decoded.email });
    if (response) {
      showSuccess("Email Verified!", "You're being logged in...", 900);
      isLoginSuccessful.value = true;
      setTimeout(() => {
        const redirectTo = (route.query.redirect as string) || "/dashboard";
        router.push(redirectTo);
      }, 900);
    } else {
      showError(
        "Email Not found",
        "Please register on BAYON mobile app first."
      );
    }
  } else {
    console.warn("No credential received");
  }
};

// handle an error event
const handleLoginError = () => {
  console.error("Login failed");
};

const handleOtpClose = () => {
  showOtpModal.value = false;
  showError("OTP Required", "Please verify OTP to proceed.");
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
