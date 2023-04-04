<template>
  <main class="h-screen">
    <div class="card relative z-2">
      <Menubar :model="items">
        <template #end>
          <InputText placeholder="Search" type="text" v-model="search" />
          <Button icon="pi pi-search" severity="success" text rounded aria-label="Buscar heroe"  @click="searchCharacters"/>
        </template>
      </Menubar>
    </div>
    <div class="p-2">
      <listheroes/>
    </div>
  </main>
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Dialog from 'primevue/dialog'
import Menubar from 'primevue/menubar'

import listheroes from '../components/Heroes/listheroes.component.vue'
import Button from 'primevue/button'

import { ref } from 'vue'
import { useHeroesStore } from '../stores/heroes.store'
const HeroesStore = useHeroesStore()
const listref = ref(null);

const visible = ref(false)
const search = ref('')
const items = ref([
  {
    label: 'Heroes',
    icon: 'pi pi-fw pi-user',
    class: "text-red-500",
    to: "heroes"
  },
  {
    label: 'Equipos',
    icon: 'pi pi-fw pi-heart',
    to: "teams"
  },

  {
    label: 'Favoritos',
    icon: 'pi pi-fw pi-star'
  }
])
const searchCharacters = () => {
  HeroesStore.$reset()
  if (search.value.length === 0) return HeroesStore.getPage(1,"search")
  return HeroesStore.getPage(1,"search",search.value)
  

  
}

</script>
