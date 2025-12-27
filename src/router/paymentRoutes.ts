import Index from "@/views/payments/Index.vue";
import PaymentCancel from "@/views/payments/PaymentCancel.vue";
import PaymentSuccess from "@/views/payments/PaymentSuccess.vue";

import UserUpgrade from "@/views/userProfiles/UserUpgrade.vue";
import UserUpgradePayments from "@/views/userUpgradePayments/Index.vue";
import UserPaymentCancel from "@/views/userUpgradePayments/PaymentCancel.vue";
import UserPaymentSuccess from "@/views/userUpgradePayments/PaymentSuccess.vue";

import PropertyBoostPayments from "@/views/propertyBoostPayments/Index.vue";
import PropertyPaymentCancel from "@/views/propertyBoostPayments/PaymentCancel.vue";
import PropertyPaymentSuccess from "@/views/propertyBoostPayments/PaymentSuccess.vue";

export const paymentRoutes = [
  {
    path: "/payments/prepare-hash-data/:encrypted",
    component: Index,
    props: true,
    meta: {
      requiresAuth: true,
      sidebar: false,
    },
  },
  {
    path: "/payments/success/map-price/:successEncryptData",
    component: PaymentSuccess,
    props: true,
    meta: {
      sidebar: false,
    },
  },
  {
    path: "/payments/success/user-upgrade/:successEncryptData",
    component: UserPaymentSuccess,
    props: true,
    meta: {
      sidebar: false,
    },
  },
  {
    path: "/payments/success/property-boost/:successEncryptData",
    component: PropertyPaymentSuccess,
    props: true,
    meta: {
      sidebar: false,
    },
  },
  {
    path: "/payments/cancel/:id",
    component: PaymentCancel,
    meta: {
      sidebar: false,
    },
  },
  //User Upgrade
  {
    path: "/payments/user-upgrade/:encrypted",
    component: UserUpgrade,
    meta: {
      sidebar: false,
    },
  },

  {
    path: "/payments/user-upgraded/:encrypted",
    component: Index,
    meta: {
      sidebar: false,
    },
  },
  {
    path: "/payments/user-upgrade/prepare-hash-data/:encrypted",
    component: UserUpgradePayments,
    props: true,
    meta: {
      requiresAuth: true,
      sidebar: false,
    },
  },
  {
    path: "/payments/user-upgrade/cancel/:id",
    component: UserPaymentCancel,
    meta: {
      sidebar: false,
    },
  },
  //Boost Property
  {
    path: "/payments/boost-property/:encrypted",
    component: PropertyBoostPayments,
    props: true,
    meta: {
      requiresAuth: true,
      sidebar: false,
    },
  },
  {
    path: "/payments/boost-orders/cancel/:id",
    component: PropertyPaymentCancel,
    meta: {
      sidebar: false,
    },
  },
];
