<script setup>
import NavComponent from '../components/NavComponent.vue'
</script>

<template>
  <NavComponent />
  <div class="container">
    <form @submit.prevent="handleSubmit">
      <div class="text-center mb-4">
        <img src="../assets/logo.svg" alt="Logo" class="img-fluid" style="max-width: 200px" />
      </div>
      <h1>Registrarse</h1>
      <div class="d-flex flex-column gap-2"></div>
    </form>
  </div>
</template>
