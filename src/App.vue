<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { NButton } from 'naive-ui'
import { onMounted } from 'vue'
import { useTeamStore } from './stores/teams.store'
import type {Character} from './interfaces/HeroCharacter.interface';
import Toast from 'primevue/toast';

const teamStore = useTeamStore()

onMounted(() => {
  const request = indexedDB.open('herosDB', 1)

  request.onupgradeneeded = function (event) {
    const db = event.target.result
    if (!db.objectStoreNames.contains('teams')) {
      db.createObjectStore('teams', { keyPath: '_id' })
    }

    if (!db.objectStoreNames.contains('favorites')) {
      db.createObjectStore('favorites', { keyPath: '_id' })
    }
  }

  request.onsuccess = function (event) {
    teamStore.TeamsDB = event.target.result
    const transaction = teamStore.TeamsDB.transaction(['teams'], 'readonly')
    const store = transaction.objectStore('teams')
    const teamStoreDB = store.getAll()
    teamStoreDB.onsuccess = function (event) {
    const teams = event.target.result
    teamStore.SyncTeams(teams);

    }
  }
})
</script>

<template>
    <Toast />
  <RouterView />
</template>

<style scoped></style>
