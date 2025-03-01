<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePostStore } from '@/stores/postStore'
import { Timestamp } from 'firebase/firestore'

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
const newTitle = ref('')
const newDescription = ref('')
const titleError = ref<string | null>(null)
const descriptionError = ref<string | null>(null)

// Загружаем пост при монтировании страницы
onMounted(async () => {
  loading.value = true

  const postId = route.params.post_id as string // id всегда строка
  post.value = await postStore.fetchPostById(postId) // Загружаем пост по id

  if (post.value) {
    newTitle.value = post.value.title
    newDescription.value = post.value.description
  }

  loading.value = false
})

// Функция возврата назад
const goBack = () => {
  return router.push('/')
}

// Валидация для заголовка
const validateTitle = () => {
  if (newTitle.value.length > 12) {
    titleError.value = 'Название не должно превышать 12 символов'
  } else {
    titleError.value = null
  }
}

// Валидация для описания
const validateDescription = () => {
  if (newDescription.value.length > 50) {
    descriptionError.value = 'Описание не должно превышать 50 символов'
  } else {
    descriptionError.value = null
  }
}

// Функция сохранения изменений
const saveChanges = async () => {
  // Сначала валидируем заголовок и описание
  validateTitle()
  validateDescription()

  // Если есть ошибка валидации, не сохраняем
  if (titleError.value || descriptionError.value) {
    return
  }

  // Если пост есть, сохраняем изменения
  if (post.value) {
    // Обновляем данные поста, добавляем текущую дату
    const updatedPost = {
      title: newTitle.value.trim(),
      description: newDescription.value.trim(),
      createdAt: Timestamp.fromDate(new Date()) // Обновляем дату на текущее время
    }

    await postStore.editPost(post.value.id, updatedPost)
    router.push('/') // Перенаправление на главную страницу
  }
}
</script>

<template>
  <div class="container mx-auto p-4">
    <button @click="goBack" class="bg-gray-500 text-white px-4 py-2 rounded-md mb-4 hover:bg-gray-600">
      Назад
    </button>

    <div v-if="loading" class="text-center text-gray-500">Загрузка...</div>

    <div v-else-if="post" class="p-4 border rounded-lg shadow-md">
      <h1 class="text-2xl font-bold mb-2">Редактировать пост</h1>
      
      <input v-model="newTitle" @input="validateTitle" class="text-2xl font-bold mb-2 border p-2 w-full" />
      <textarea v-model="newDescription" @input="validateDescription" class="text-gray-600 border p-2 w-full"></textarea>

      <div class="flex gap-4 mt-4">
        <button @click="saveChanges" class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
          Сохранить
        </button>
        <button @click="goBack" class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
          Отмена
        </button>
      </div>
    </div>

    <div v-else class="text-center text-red-500">Пост не найден</div>
  </div>
</template>






<style scoped>
.container {
  max-width: 800px;
}
</style>


