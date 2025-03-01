<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePostStore } from '@/stores/postStore'
import type { Timestamp } from 'firebase/firestore'

const route = useRoute()
const router = useRouter()
const postStore = usePostStore()

// Определяем структуру поста
interface Post {
  id: string
  title: string
  description: string
  createdAt: Timestamp
}

// Реактивные переменные
const post = ref<Post | null>(null)
const loading = ref(true)

//  Загружаем пост при монтировании страницы
onMounted(async () => {
  loading.value = true

  const postId = route.params.post_id as string //  id всегда строка
  console.log(postId)
  post.value = await postStore.fetchPostById(postId) // Загружаем пост по id

  loading.value = false
})

//  Функция возврата назад
const goBack = () => {
  return router.push('/')
}
</script>

<template>
  <div class="container mx-auto p-4">
    <button @click="goBack" class="bg-gray-500 text-white px-4 py-2 rounded-md mb-4 hover:bg-gray-600">
      Назад
    </button>

    <div v-if="loading" class="text-center text-gray-500">Загрузка...</div>

    <div v-else-if="post" class="p-4 border rounded-lg shadow-md">
      <h1 class="text-2xl font-bold mb-2">{{ post.title }}</h1>
      <p class="text-gray-600">{{ post.description }}</p>
    </div>

    <div v-else class="text-center text-red-500">Пост не найден</div>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
}
</style>


