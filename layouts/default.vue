<template>

    <header class="py-4 bg-gray-800 text-white mb-2">
        <ul class="flex gap-4 w-5/6 mx-auto">
            <li>
                <NuxtLink to="/">Главная</NuxtLink>
            </li>
            <li>
                <NuxtLink to="/post/create">Создать сообщение</NuxtLink>
            </li>
        </ul>
    </header>

    <div class="w-5/6 mx-auto">
        <slot />
    </div>

</template>


<style scoped>
.router-link-exact-active {
    border-bottom: 1px solid #fff;
}
</style>