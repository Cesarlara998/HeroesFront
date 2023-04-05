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
import InputText from 'primevue/inputtext'
import Dialog from 'primevue/dialog'
import Editor from 'primevue/editor'
import Panel from 'primevue/panel'
import Menubar from 'primevue/menubar'
import Button from 'primevue/button'
import { ref, reactive, toRefs, onMounted, watchEffect,inject,computed  } from 'vue'
import { useTeamStore } from '../stores/teams.store'
import Toolbar from 'primevue/toolbar'
import SplitButton from 'primevue/splitButton'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { useToast } from 'primevue/usetoast'
import { useRoute } from 'vue-router'
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
    icon: 'pi pi-fw pi-star'
  }
])
</script>
