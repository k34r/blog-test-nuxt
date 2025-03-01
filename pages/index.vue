<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePostStore } from '@/stores/postStore'

const postStore = usePostStore()
const router = useRouter()

// Поле поиска и сортировки
const searchQuery = ref('')
const sortOrder = ref<'asc' | 'desc'>('desc')

// Загрузка постов при монтировании компонента
onMounted(async () => {
  await postStore.fetchPosts()
  window.addEventListener('scroll', handleScroll)
})

// При размонтировании отписываемся от события скроллинга и удаляем обработчик
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// Фильтрация постов по заголовку
const filteredPosts = computed(() => {
  return postStore.posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// Функции для перехода на страницы
const goToPostPage = (id: string) => {
  router.push(`/post/${id}`)
}

const goToEditPage = (id: string) => {
  router.push(`/post/edit${id}`)
}

// Функция изменения порядка сортировки
const changeSortOrder = () => {
  postStore.changeSortOrder(sortOrder.value)
}

// Функция удаления поста
const deletePost = async (id: string) => {
  if (confirm('Вы уверены, что хотите удалить этот пост?')) {
    await postStore.deletePost(id)
  }
}

// Форматирование даты
const formatDate = (date: string | { seconds: number }) => {
  let dateObj: Date

  if (typeof date === 'string') {
    // Если дата строка (например, ISO-формат), используем её напрямую
    dateObj = new Date(date)
  } else if (date && date.seconds) {
    // Если дата объект с полем seconds, преобразуем в дату
    dateObj = new Date(date.seconds * 1000)
  } else {
    // Если данных нет или формат некорректный
    return 'Неизвестная дата'
  }

  return dateObj.toLocaleString() // Преобразуем в строку в локальном формате
}

// Обработка скроллинга для автоподгрузки
const handleScroll = () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
    !postStore.isLoading &&
    postStore.hasMore
  ) {
    postStore.loadMorePosts()
  }
}
</script>

<template>
  <div class="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
    <input v-model="searchQuery" type="text" placeholder="Поиск по заголовку"
      class="w-full md:w-1/3 p-2 border rounded-md" />

    <!-- Поле сортировки по дате -->
    <select v-model="sortOrder" @change="changeSortOrder" class="w-full md:w-1/3 p-2 border rounded-md">
      <option value="desc">Сначала новые</option>
      <option value="asc">Сначала старые</option>
    </select>
  </div>

  <!-- Список постов -->
  <div v-for="post in filteredPosts" :key="post.id" @click="goToPostPage(post.id)"
    class="post-card p-4 mb-4 border rounded-lg shadow-md  cursor-pointer">
    <h2 class="text-xl font-semibold">
      {{ post.title }}
    </h2>
    <small class="text-gray-500">{{ formatDate(post.createdAt) }}</small>

    <!-- Кнопки "Редактировать" и "Удалить" -->
    <div class="mt-4 flex gap-4">
      <button @click.stop="goToEditPage(post.id)"
        class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
        Редактировать
      </button>
      <button @click.stop="deletePost(post.id)" class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
        Удалить
      </button>
    </div>
  </div>

  <!-- Спиннер загрузки -->
  <div v-if="postStore.isLoading" class="text-center text-gray-500 py-4">Загрузка...</div>

  <!-- Сообщение о том, что больше постов нет -->
  <div v-if="!postStore.hasMore" class="text-center mt-4 text-gray-500">
    Больше постов нет
  </div>
</template>

<style scoped></style>
