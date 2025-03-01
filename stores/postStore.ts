import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'
import {
  collection,
  query,
  orderBy,
  getDocs,
  limit,
  Timestamp,
  Firestore,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  startAfter,
  getDoc
} from 'firebase/firestore'

interface Post {
  id: string
  title: string
  description: string
  createdAt: Timestamp
}

export const usePostStore = defineStore('postStore', () => {
  // Состояние (reactive)
  const posts = ref<Post[]>([])
  const lastVisible = ref<any>(null)
  const hasMore = ref(true)
  const isLoading = ref(false)
  const sortOrder = ref<'asc' | 'desc'>('desc')
  const searchQuery = ref('')

  const fetchPosts = async () => {
    isLoading.value = true
    try {
      const { $db } = useNuxtApp() // Получаем Firestore
      const db = $db as Firestore

      const q = query(
        collection(db, 'posts'),
        orderBy('createdAt', sortOrder.value),
        limit(10)
      )
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        posts.value = querySnapshot.docs
          .map(doc => {
            const data = doc.data()
            return {
              id: doc.id,
              title: data.title,
              description: data.description,
              createdAt: data.createdAt instanceof Timestamp
                ? data.createdAt
                : Timestamp.fromDate(new Date(data.createdAt))
            }
          })
          .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())

        lastVisible.value = querySnapshot.docs[querySnapshot.docs.length - 1]
      }
      hasMore.value = querySnapshot.size > 0

    } catch (error) {
      console.error('Ошибка при загрузке постов:', error)
    } finally {
      isLoading.value = false
    }
  }

  // Функция для получения поста по ID
  const fetchPostById = async (id: string) => {
    // Ищем пост по строковому id, так как Firebase использует строковые ID
    const post = posts.value.find(post => post.id === id)

    return post ? post : null
  }

  //  Функция создания поста
  const createPost = async (post: { title: string; description: string; createdAt: string }) => {
    try {
      const { $db } = useNuxtApp()
      const db = $db as Firestore

      const newPostRef = doc(collection(db, 'posts'))
      const newPost = {
        ...post,
        createdAt: Timestamp.fromDate(new Date(post.createdAt))
      }

      await setDoc(newPostRef, newPost)
      posts.value.unshift({ id: newPostRef.id, ...newPost })
    } catch (error) {
      console.error('Ошибка при создании поста:', error)
    }
  }

  //  Функция подгрузки дополнительных постов
  const loadMorePosts = async () => {
    if (!lastVisible.value || isLoading.value || !hasMore.value) return

    isLoading.value = true
    try {
      const { $db } = useNuxtApp()
      const db = $db as Firestore

      const q = query(
        collection(db, 'posts'),
        orderBy('createdAt', sortOrder.value),
        startAfter(lastVisible.value),
        limit(10)
      )
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        const newPosts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          description: doc.data().description,
          createdAt: doc.data().createdAt instanceof Timestamp
            ? doc.data().createdAt
            : Timestamp.fromDate(new Date(doc.data().createdAt))
        }))

        posts.value.push(...newPosts)
        lastVisible.value = querySnapshot.docs[querySnapshot.docs.length - 1]
      }

      hasMore.value = querySnapshot.size > 0
    } catch (error) {
      console.error('Ошибка при загрузке дополнительных постов:', error)
    } finally {
      isLoading.value = false
    }
  }

  //  Функция удаления поста
  const deletePost = async (id: string) => {
    try {
      const { $db } = useNuxtApp()
      const db = $db as Firestore

      await deleteDoc(doc(db, 'posts', id))
      posts.value = posts.value.filter((post) => post.id !== id)
    } catch (error) {
      console.error('Ошибка при удалении поста:', error)
    }
  }

  //  Функция изменения порядка сортировки
  const changeSortOrder = (order: 'asc' | 'desc') => {
    sortOrder.value = order
    posts.value.sort((a, b) =>
      order === 'asc'
        ? a.createdAt.toMillis() - b.createdAt.toMillis()
        : b.createdAt.toMillis() - a.createdAt.toMillis()
    )
  }

  //  Функция обновления строки поиска
  const setSearchQuery = (query: string) => {
    searchQuery.value = query
  }

  //  Функция редактирования поста
  const editPost = async (id: string, updatedData: { title: string; description: string }) => {
    try {
      const { $db } = useNuxtApp()
      const db = $db as Firestore

      await updateDoc(doc(db, 'posts', id), updatedData)
      const postIndex = posts.value.findIndex((post) => post.id === id)

      if (postIndex !== -1) {
        posts.value[postIndex] = { ...posts.value[postIndex], ...updatedData }
      }
    } catch (error) {
      console.error('Ошибка при редактировании поста:', error)
    }
  }

  const filteredPosts = computed(() =>
    posts.value.filter((post) =>
      post.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  )

  const getPosts = computed(() => posts.value)


  return {
    posts,
    lastVisible,
    hasMore,
    isLoading,
    sortOrder,
    searchQuery,
    fetchPosts,
    fetchPostById,
    createPost,
    loadMorePosts,
    deletePost,
    changeSortOrder,
    setSearchQuery,
    editPost,
    filteredPosts,
    getPosts
  }
})

