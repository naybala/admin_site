<template>
  <div class="flex justify-between mb-2 md:mb-5">
    <InputText
      v-model="searchTerm"
      placeholder="Search..."
      class="p-inputtext-sm w-full md:w-1/3 p-3 shadow-md"
    />

    <Button
      :disabled="!selectedUser"
      label="Confirm"
      icon="pi pi-check"
      class="border border-gray-300 px-5 py-0 shadow-md bg-green-400"
      @click="addUser"
    />
  </div>

  <div v-if="loading" class="mt-3 text-gray-500">Searching...</div>

  <ul v-if="items.length" class="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
    <div
      v-for="user in items"
      :key="user.id"
      :class="
        selectedUser?.id === user.id
          ? 'bg-gray-300 dark:bg-gray-400 border border-r-[50px] border-green-400'
          : ''
      "
      class="p-3 border rounded shadow hover:bg-gray-400 hover:-translate-y-0.5 duration-300 ease-in-out cursor-pointer"
      @click="selectUser(user)"
    >
      <div class="flex gap-3">
        <Image
          border-r-[50px]
          :src="user.profileUrl"
          alt="Image"
          width="120"
          preview
          @click.stop
        />

        <div class="text-sm leading-tight">
          <p class="mb-1"><strong>ID:</strong> {{ user.id }}</p>
          <p class="mb-1"><strong>Name:</strong> {{ user.fullName }}</p>
          <p class="mb-1"><strong>Email:</strong> {{ user.email }}</p>
          <p class="mb-1"><strong>Phone:</strong> {{ user.phoneNumber }}</p>
        </div>
      </div>
    </div>
  </ul>

  <div v-else-if="searchTerm" class="mt-3 text-gray-500">No users found</div>
</template>

<script setup lang="ts">
import InputText from "primevue/inputtext";
import { ref } from "vue";
import { useAddMyMemberForm } from "@/composables/userProfiles/useAddMyMemberForm";
import Button from "primevue/button";
import { useRouter } from "vue-router";
import { Image } from "primevue";

const { items, searchTerm, loading, fetchUserAddMember, success } =
  useAddMyMemberForm();

const selectedUser = ref<any>(null);
const router = useRouter();

function selectUser(user: any) {
  selectedUser.value = user;
}

const addUser = async () => {
  await fetchUserAddMember(selectedUser.value.id);
  if (success.value) {
    router.push({ name: "my-association-members" });
  }
};
</script>
