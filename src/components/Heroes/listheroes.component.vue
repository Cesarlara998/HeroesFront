<template>
  <Dialog v-model:visible="visible" modal header="Agregar Heroe a team" :style="{ width: '50vw' }">
    <p>
      Esta a punto de agregar a <label class="font-bold">{{ selectedMember.name }}</label> a un equipo.
    </p>
    <p>¿A que equipo desea agregarlo?</p>
<div class="flex flex-column">
  <Dropdown v-model="selectedTeam" :options="TeamsStore.getTeams" filter optionLabel="name" placeholder="Seleccione un equipo" class="w-full ">
      <template #value="slotProps">
          <div v-if="slotProps.value" class="flex align-items-center">
              <div>{{ slotProps.value.name }}</div>
          </div>
          <span v-else>
              {{ slotProps.placeholder }}
          </span>
      </template>
      <template #option="slotProps">
          <div class="flex align-items-center">
              <div>{{ slotProps.option.name }}</div>
          </div>
      </template>
  </Dropdown>
  <Button class="w-full my-2" label="Success" severity="success" rounded @click="addToTeam" />
</div>

</Dialog>

  <Panel header="Lista de heroes" class="h-full">
    <ScrollPanel style="width: 100%" class="custombar1">
      <DataView data-key="id" :value="HeroesStore.getListHeroPage">
        <template #list="hero">
          <div class="col-12">
            <div class="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
              <img
                class="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round"
                :src="`${hero.data.thumbnail.path}.${hero.data.thumbnail.extension}`"
                :alt="hero.data.name"
              />
              <div
                class="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4"
              >
                <div class="flex flex-column align-items-center sm:align-items-start gap-3">
                  <div class="text-2xl font-bold text-900">{{ hero.data.name }}</div>
                  <div v-if="hero.data.description" class="text-base font-bold text-900">
                    {{ hero.data.description }}
                  </div>
                  <div class="w-50">
                    <span v-for="events in hero.data.events.items" class="m-2 gap-2">
                      <i class="pi pi-tag"></i>
                      <span class="font-semibold">{{ events.name }}</span>
                    </span>
                    <!-- <Tag :value="slotProps.data.inventoryStatus" :severity="getSeverity(slotProps.data)"></Tag> -->
                  </div>
                </div>
              </div>
              <div
                class="text-center align-items-center sm:align-items-end gap-3 sm:gap-2"
              >
                <Button icon="pi pi-heart" class="m-1 bg-blue-900" color="secondary" @click="SearchToTeam(hero)" rounded></Button>
                <Button icon="pi pi-star" :class="isFavorite(hero.data.id,'class')"   color="primary" rounded @click="addFavorite(hero)"></Button>
              </div>
            </div>
          </div>
        </template>
      </DataView>
    </ScrollPanel>

    <Paginator
      :template="{
        '640px': 'PrevPageLink CurrentPageReport NextPageLink PageLinks',
        '960px': 'FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink',
        '1300px': 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink',
        default: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink'
      }"
      @update:first="updatePage"
      v-model:first="HeroesStore.page"
      :rows="1"
      :totalRecords="HeroesStore.totalPages"
      v-if="HeroesStore.getListHeroPage?.length !== 0"
    ></Paginator>
  </Panel>
</template>

<script setup lang="ts">
// use typescript
import Dropdown from 'primevue/dropdown';

import Panel from 'primevue/panel'
import ScrollPanel from 'primevue/scrollpanel'

import DataView from 'primevue/dataview'
import { ref, onMounted } from 'vue'
import { useHeroesStore } from '../../stores/heroes.store'
import Button from 'primevue/button'
import AlertComponent from '../utils/alert.component.vue'
import Paginator from 'primevue/paginator'
import { useToast } from "primevue/usetoast";
import { useTeamStore } from '../../stores/teams.store'
import Dialog from 'primevue/dialog';
import type { Character } from '../../interfaces/HeroCharacter.interface'
import { useFavoritesStore } from '../../stores/favorites.store';
let selectedMember:Character;
const searchstring = ''
const toast = useToast();
const page = ref(0)
const HeroesStore = useHeroesStore()
const TeamsStore = useTeamStore()
const visible = ref(false);
const selectedTeam = ref();
const favoritesStore = useFavoritesStore();



onMounted(async () => {

  await HeroesStore.getPage(HeroesStore.page,"number")
})

const isFavorite = (id:number,action:string) => {
  if (favoritesStore.getFavoritesId.find(e => e === id)) {
    if (action === "class") return "m-1 bg-blue-500";
  }
  if (action === "class") return "m-1 bg-blue-900"
}
const addFavorite = async (event:any) => {
  await favoritesStore.addFavorite(event.data);
}

const SearchToTeam = async (event:any) => {
  if (TeamsStore.getTeams.length === 0) return toast.add({ severity: 'error', summary: 'error', detail: 'No existen equipos', life: 3000 });
  visible.value = true;
  selectedMember = event.data; 
}
const addToTeam = async (event:any) => {
  if (!selectedTeam.value) {
    return toast.add({ severity: 'error', summary: 'error', detail: 'Equipo no seleccionado', life: 3000 });
  }
  const addMember = await TeamsStore.AddCharacterToTeam(selectedMember,selectedTeam.value)
  
  if (!addMember.status) toast.add({ severity: 'error', summary: 'error', detail: addMember.message, life: 3000 });
  if (addMember.status) toast.add({ severity: 'success', summary: 'success', detail: addMember.message, life: 3000 });
  visible.value = false
}

const updatePage = async (event: any) => {
  
  await HeroesStore.getPage(event,"number")
}


</script>
