<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { NButton } from 'naive-ui'
import { onMounted } from 'vue'
import { useTeamStore } from './stores/teams.store'
import type { Character } from './interfaces/HeroCharacter.interface'
import Toast from 'primevue/toast'
import { useFavoritesStore } from './stores/favorites.store'

interface IDBUpgradeEvent extends IDBVersionChangeEvent {
  target: IDBOpenDBRequest & { result: IDBDatabase }
}

const favoritesStore = useFavoritesStore()

const teamStore = useTeamStore()

onMounted(() => {
  const request = indexedDB.open('herosDB', 1)

  request.onupgradeneeded = function (event) {
    const db = (event.target as IDBOpenDBRequest).result
    if (!db.objectStoreNames.contains('teams')) {
      db.createObjectStore('teams', { keyPath: '_id' })
    }

    if (!db.objectStoreNames.contains('favorites')) {
      db.createObjectStore('favorites', { keyPath: 'id' })
    }
  }

  request.onsuccess = function (event) {
    teamStore.TeamsDB = (event.target as IDBOpenDBRequest).result
    const teamtransaction = teamStore.TeamsDB.transaction(['teams'], 'readonly')
    const teamstore = teamtransaction.objectStore('teams')
    const teamStoreDB = teamstore.getAll()
    teamStoreDB.onsuccess = function (event) {
      if (event.target instanceof IDBRequest) {
        const teams = (event.target as IDBRequest).result
        teamStore.SyncTeams(teams)
      }
      // const teams = event.target.result
      // teamStore.SyncTeams(teams);
    }

    favoritesStore.FavoritesDB = (event.target as IDBOpenDBRequest).result
    const favoritestransaction = favoritesStore.FavoritesDB.transaction(['favorites'], 'readonly')
    const favStore = favoritestransaction.objectStore('favorites')

    const GetFavorites = favStore.getAll()
    GetFavorites.onsuccess = function (event) {
      if (event.target instanceof IDBRequest) {
        const favorites = event.target.result
        favoritesStore.syncFavorites(favorites)
      }
    }
  }
})
</script>

<template>
  <Toast />
  <RouterView />
</template>

<style scoped></style>
