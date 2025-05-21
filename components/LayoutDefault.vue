<template>
  <div class="min-h-screen bg-gray-50 text-gray-900">
    <header class="p-4 bg-white shadow-md flex justify-between items-center">
      <h1 class="text-xl font-bold">
        <NuxtLink to="/"> FrontOps </NuxtLink>
      </h1>
    </header>
    <main class="p-4">
      <slot />
    </main>
  </div>
</template>
