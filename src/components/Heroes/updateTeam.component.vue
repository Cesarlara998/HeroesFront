<template>
  <main>
    <Dialog v-model:visible="deleteMember" modal header="Eliminacion de miembro de equipo"  :style="{ width: '50vw' }">
      <div style="text-align: center;">
        <p class="text-bold">¿Esta seguro de querer borrar a <strong>{{ MemberToDelete.name }}</strong> del equipo <strong>{{ Selected.name }}</strong></p>
        <Button label="Eliminar equipo" severity="warning" rounded type="submit" @click="DeleteMember()"/>
      </div>

    </Dialog>
    <form v-on:submit="save">
      <div class="flex flex-column gap-2">
        <label for="name">Nombre</label>
        <InputText id="name" v-model="Selected.name" aria-describedby="name" />
        <small
          v-for="error in v$.name.$errors"
          :key="error.$uid"
          id="name-help"
          class="text-red-600 font-bold mb-2"
          >{{ error.$message }}</small
        >
      </div>
      <div class="flex flex-column gap-2">
        <label for="name">Descripcion</label>
        <Editor
          v-model="Selected.description"
          editorStyle="height: 120px"
          aria-describedby="editor-error"
        >
          <template v-slot:toolbar>
            <span class="ql-formats">
              <button v-tooltip.bottom="'Bold'" class="ql-bold"></button>
              <button v-tooltip.bottom="'Italic'" class="ql-italic"></button>
              <button v-tooltip.bottom="'Underline'" class="ql-underline"></button>
            </span>
          </template>
        </Editor>
        <small
          v-for="error in v$.description.$errors"
          :key="error.$uid"
          id="name-help"
          class="text-red-600 font-bold mb-2"
          >{{ error.$message }}</small
        >
        <div class="text-center mt-4 mb-4">
          <Button
            label="Crear equipo"
            severity="success"
            rounded
            type="submit"
            style="width: 80%"
            class="disabled"
            :disabled="disableButton"
          />
        </div>
      </div>
    </form>
    <DataTable
      v-if="Characters.length !== 0"
      :value="Characters"
      tableStyle="min-width: 50rem"
    >
      <Column field="Nombre" header="Nombre">
        <template #body="slotProps">
          <label>
          {{ slotProps.data.name }}
          </label>
        </template>
      </Column>
      <Column field="descripcion" header="Descripcion">
        <template #body="slotProps">
          <label>
          {{ slotProps.data.description }}
          </label>
        </template>
      </Column>
      <Column field="acciones" header="Acciones">
        <template #body="slotProps">
          <Button
            icon="pi pi-times text-red-500"
            severity="secondary"
            text
            rounded
            aria-label="Bookmark"
            @click="openDialogMember(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>
  </main>
</template>
<script setup lang="ts">
import Dialog from 'primevue/dialog'
import { useRoute, useRouter } from 'vue-router'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { ref, onMounted, reactive, toRefs } from 'vue'
import { useTeamStore } from '../../stores/teams.store'
import type { Character } from '../../interfaces/HeroCharacter.interface'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Editor from 'primevue/editor'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

let Selected = reactive({ _id: '', name: '', description: '',characters:[]});
let Characters: Character[] = []
const rules = {
  name: { required }, // Matches state.firstName
  description: { required } // Matches state.lastName
}
let deleteMember = ref(false);
const router = useRouter()
let disableButton = false
const route = useRoute()
const v$ = useVuelidate(rules, toRefs(Selected))
let errors: any[] = []
const TeamsStore = useTeamStore()
let MemberToDelete: Character;
onMounted(() => {
  const id = route.params.param
  const search = TeamsStore.getTeams.find((e) => e._id === id)
  if (!search) {
    toast.add({ severity: 'error', summary: 'error', detail: 'equipo no encontrado', life: 3000 })
    router.push('/teams')
    return
  }
  Selected._id = search._id;
  Selected.name = search.name;
  Selected.description = search.description;
  Characters = search.characters;
})
const save = async (e: Event) => {
  disableButton = true
  e.preventDefault()
  v$.value.$touch()
  if (v$.value.$invalid) {
    errors = v$.value.$errors
    return
  }
  const uppdate = await TeamsStore.UpdateTeam(Selected)
  if (!uppdate.status) {
    toast.add({ severity: 'error', summary: 'error', detail: uppdate.message, life: 3000 })
    disableButton = false
    return
  }
  toast.add({ severity: 'success', summary: 'success', detail: uppdate.message, life: 3000 })
  router.push('/teams')
  return
}

const openDialogMember = async (Member:Character) => {
  MemberToDelete = Member;
  deleteMember.value = true;
}
const DeleteMember = async () => {
  
  TeamsStore.DeleteMember(Selected._id,MemberToDelete);
  const indice = await Characters.findIndex(e => e.id === MemberToDelete.id);
  Characters.slice(indice,1)

}
</script>
