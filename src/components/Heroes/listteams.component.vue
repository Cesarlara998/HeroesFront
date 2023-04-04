<template>
  <Panel header="Lista de equipos" class="h-full">
    <Dialog v-model:visible="deleteDialog" modal header="Eliminacion de Equipo"  :style="{ width: '50vw' }">
      <div style="text-align: center;">
        <p class="text-bold">¿Esta seguro de querer borrar al equipo?</p>
        <Button label="Eliminar equipo" severity="warning" rounded type="submit" @click="CloseDialog('delete')"/>
      </div>

    </Dialog>
    <Dialog v-model:visible="updateDialog" modal header="Creacion de  Equipo" :style="{ width: '80vw' }">
    </Dialog>
    <DataTable :value="TeamsStore.getTeams" tableStyle="min-width: 50rem">
      <Column field="name" header="nombres"></Column>
      <Column field="description" header="Descripcion">
        <template #body="slotProps">
          <label v-html="slotProps.data.description"></label>
        </template>
      </Column>
      <Column field="characters" header="Miembros">
        <template #body="slotProps">
          <label class="text-red-600 font-bold mb-2" v-if="slotProps.data.characters.length === 0"
            >NO POSEE HEROES VINCULADOS</label
          >
          <div
            v-if="slotProps.data.characters.length !== 0"
            v-for="character in slotProps.data.characters"
            :key="character.id"
          >
            <label>{{ character.name }}</label>
          </div>
        </template></Column
      >
      <Column field="Actions" header="Acciones">
        <template #body="slotProps">
          <Button
            icon="pi pi-pencil edit text-yellow-500"
            severity="secondary"
            text
            rounded
            aria-label="Bookmark"
            @click="OpenDialog('updateDialog',slotProps.data)"
          />
          <Button
            icon="pi pi-times text-red-500"
            severity="secondary"
            text
            rounded
            aria-label="Bookmark"
            @click="OpenDialog('deleteDialog',slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>
  </Panel>
</template>

<script setup lang="ts">
// use typescript
import Panel from 'primevue/panel'
import ScrollPanel from 'primevue/scrollpanel'

import DataView from 'primevue/dataview'
import { ref, onMounted } from 'vue'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ColumnGroup from 'primevue/columngroup'
import Dialog from 'primevue/dialog'

import Row from 'primevue/row'
import Paginator from 'primevue/paginator'
import { useTeamStore } from '../../stores/teams.store'
import type { TeamsList } from '../../interfaces/HeroCharacter.interface'
import { useToast } from "primevue/usetoast";
const searchstring = ''
const page = ref(0)
let Selected:TeamsList;
const TeamsStore = useTeamStore()
const deleteDialog = ref(false)
const updateDialog = ref(false)

const toast = useToast();
const OpenDialog = (action:string,Team: TeamsList) => {
  Selected = Team;
  if (action === 'updateDialog') updateDialog.value = true
  if (action === 'deleteDialog') deleteDialog.value = true
}

const CloseDialog = async (action:string) => {
  if (action === 'delete') {
    const resp = await TeamsStore.DeleteTeam(Selected);
    if (!resp.status) toast.add({ severity: 'success', summary: 'success', detail: resp.message, life: 3000 });
  }
  updateDialog.value = false
  deleteDialog.value = false
}
</script>
