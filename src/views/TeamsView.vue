<template>
  <main class="h-screen">
    <Dialog v-model:visible="visible" modal header="Creacion de  Equipo" :style="{ width: '80vw' }">
      <form v-on:submit="save">
        <div class="flex flex-column gap-2">
          <label for="name">Nombre</label>
          <InputText id="name" v-model="state.name" aria-describedby="name" />
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
            v-model="state.description"
            editorStyle="height: 320px"
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
          <Button label="Crear equipo" severity="success" rounded type="submit" />
        </div>
      </form>
    </Dialog>
    <div class="card relative z-2">
      <Menubar :model="items">
        <template #end>
          <Button icon="pi pi-plus" class="mr-2" @click="visible = true" />
        </template>
      </Menubar>
    </div>
    <div class="p-2">
      <listteamsComponent/>
    </div>
  </main>
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Dialog from 'primevue/dialog'
import Editor from 'primevue/editor'
import listteamsComponent from '../components/Heroes/listteams.component.vue'
import Menubar from 'primevue/menubar'
import Button from 'primevue/button'
import { ref, reactive } from 'vue'
import { useTeamStore } from '../stores/teams.store'
import Toolbar from 'primevue/toolbar'
import SplitButton from 'primevue/splitButton'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { useToast } from "primevue/usetoast";

const toast = useToast();
const teamStore = useTeamStore()

let errors: any[] = []
const state = reactive({
  name: '',
  description: ''
})
const visible = ref(false)
const items = ref([
  {
    label: 'Heroes',
    icon: 'pi pi-fw pi-user',
    class: 'text-red-500',
    to: 'heroes'
  },
  {
    label: 'Equipos',
    icon: 'pi pi-fw pi-heart',
    to: 'teams'
  },

  {
    label: 'Favoritos',
    icon: 'pi pi-fw pi-star'
  }
])

const rules = {
  name: { required }, // Matches state.firstName
  description: { required } // Matches state.lastName
}
const v$ = useVuelidate(rules, state)

const save = async (e: Event) => {
  e.preventDefault()
  v$.value.$touch()
  if (v$.value.$invalid) {
    errors = v$.value.$errors
    return
  }
   const res = await teamStore.AddTeam(state)
   if (res?.status === true) {
    
    return visible.value = false;
  }
  toast.add({ severity: 'error', summary: 'error', detail: res?.message, life: 3000 });
}
</script>
