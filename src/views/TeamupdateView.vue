<template>
  <main class="h-screen">
    <div class="card relative z-2">
      <Menubar :model="items"> </Menubar>
    </div>
    <div class="p-2">
      <Panel v-if="teamStore.getTeams.length === 0" header="Modificar equipo" class="h-full"> </Panel>
      <Panel v-if="teamStore.getTeams.length !== 0" header="Modificar equipo" class="h-full">
        <UpdateTeamComponent></UpdateTeamComponent>
      </Panel>
    </div>
  </main>
</template>

<script setup lang="ts">

import Panel from 'primevue/panel'
import Menubar from 'primevue/menubar'
import { ref } from 'vue'
import { useTeamStore } from '../stores/teams.store'

import UpdateTeamComponent from '../components/Heroes/updateTeam.component.vue'
const teamStore = useTeamStore()

let loading = true
const items = ref([
  {
    label: 'Heroes',
    icon: 'pi pi-fw pi-user',
    class: 'text-red-500',
    to: '/heroes'
  },
  {
    label: 'Equipos',
    icon: 'pi pi-fw pi-heart',
    to: '/teams'
  },

  {
    label: 'Favoritos',
    icon: 'pi pi-fw pi-star',
    to: "/favorites"
  }
])
</script>
