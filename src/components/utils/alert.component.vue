<template>
    <InlineMessage class="absolute z-5 bottom-0 left-0" severity="success">hola</InlineMessage>
  </template>
  
  <script setup lang="ts">
  import InlineMessage from 'primevue/inlinemessage';

    props: ['message'];
  </script>
  