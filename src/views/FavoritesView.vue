<template>
  <Dialog v-model:visible="visible" modal :header="dataHero.name" :style="{ width: '80vw' }">
    <img
                class="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round"
                :src="`${dataHero.thumbnail.path}.${dataHero.thumbnail.extension}`"
                :alt="dataHero.name"
              />
              <p class="text-center font-bold">Descripcion</p>
              <p class="text-center">{{ dataHero.description || "SIN DESCRIPCION" }}</p>

              <p class="text-center font-bold">Eventos</p>
              <div class="flex flex-wrap justify-content-center">
                <span v-for="events in dataHero.events.items" class="m-2 gap-2">
                      <i class="pi pi-tag"></i>
                      <span class="font-semibold">{{ events.name }}</span>
                    </span>
              </div>
              

</Dialog>
    <main class="h-screen">
    <div class="card relative z-2">
      <Menubar :model="items">
        <template #end>
          <InputText placeholder="Filtrar" type="text" v-model="search"/>
          <!-- <Button icon="pi pi-search" severity="success" text rounded aria-label="Buscar heroe" /> -->
        </template>
      </Menubar>
    </div>
    <div class="p-2">
      <Panel header="Favoritos" class="h-full">
        <DataTable :value="filterFavorite()" tableStyle="min-width: 50rem">
          <Column field="name" header="nombres"></Column>
          <Column field="description" header="description"></Column>
          <Column field="Actions" header="Acciones">
          <template #body="slotProps">
            <div class="flex">
              <Button
              icon="pi pi-eye edit"
              severity="secondary"
              text
              rounded
              aria-label="Bookmark"
              @click="showHero(slotProps.data)"
            />
            <Button
              icon="pi pi-times"
              severity="secondary"
              text
              rounded
              aria-label="Bookmark"
              @click="deleteFavorite(slotProps.data)"
            />
            </div>
          </template>
        </Column>
        </DataTable>
      </Panel>
    </div>
  </main>
</template>
<script lang="ts" setup>
import { ref, reactive, toRefs, onMounted, watchEffect,inject,computed  } from 'vue'
import Panel from 'primevue/panel'
import Menubar from 'primevue/menubar'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dialog from 'primevue/dialog';
import { useFavoritesStore } from '../stores/favorites.store';
import { useHeroesStore } from '../stores/heroes.store';

import type { Character } from '../interfaces/HeroCharacter.interface'
import { useToast } from "primevue/usetoast";
const heroStore = useHeroesStore();
const favoriteStore = useFavoritesStore()
const toast = useToast();
let dataHero: Character = {name:'onload',description:'onload',id:0,modified:new Date(),resourceUri:'onload',thumbnail:{extension:'onload',path:'onload'},events:{items:[]}}
const search = ref('')
const visible = ref(false);
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
const filterFavorite = () => {
  if ( search.value === "" ) return favoriteStore.getFavorites;
  return favoriteStore.getFavorites.filter(e => e.name.toLowerCase().includes(search.value.toLowerCase()))
}
const deleteFavorite = async  (Hero:Character) => {
  const eliminacion  = await favoriteStore.deleteFavorite(Hero.id)
  if (eliminacion?.status) toast.add({ severity: 'success', summary: 'Exito', detail: eliminacion?.message, life: 3000 });
  if (!eliminacion?.status) toast.add({ severity: 'error', summary: 'Error', detail: eliminacion?.message, life: 3000 });
}
const showHero = async  (Hero:Character) => {
  dataHero = Hero;
  await heroStore.getHerobyId(Hero.id)
  .then((res) => {
    dataHero = res.data
    visible.value = true
  })
  .catch(err => {
    toast.add({ severity: 'error', summary: 'Error', detail: err.response.data, life: 3000 });
  })
}
</script>