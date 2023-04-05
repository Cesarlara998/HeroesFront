import { defineStore } from 'pinia'
import axios from 'axios'
import { ref } from 'vue';
import type { Character, TeamsList } from '../interfaces/HeroCharacter.interface';




export const useTeamStore = defineStore('teams', {
    state: () => {
        return {
            TeamsDB: null,
            Teams: [] as TeamsList[]
            // for data that is not yet loaded
        }
    },
    actions: {
        async AddTeam(teams: { name: string, description: string }) {
            if (this.getTeams.find(e => e.name === teams.name)) {
                return { status: false, message: 'Ya existe el equipo' };
            }
            return axios.post(`${import.meta.env.VITE_BASE_URL}/teams`, teams)
                .then(res => {
                    if (res.data.status) {


                        const transaction = this.TeamsDB.transaction(['teams'], 'readwrite');
                        const store = transaction.objectStore('teams');                    // this.Teams.push(res.data.team)
                        res.data.team.characters = [];
                        store.put(res.data.team)
                        this.Teams.push(res.data.team)
                        return { status: true, message: 'Team guardado correctamente' };
                        // let request = indexedDB.open('teams', 1);

                    }
                })
                .catch(err => {

                    return { status: false, message: 'Ocurrio un error' };

                })
        },

        async SyncTeams(teams: { name: string, description: string, characters: Character[] }[]) {
            if (teams.length !== 0) return this.Teams.push(...teams);


            return axios.get(`${import.meta.env.VITE_BASE_URL}/teams`)
                .then(res => {
                    const transaction = this.TeamsDB.transaction(['teams'], 'readwrite');
                    const store = transaction.objectStore('teams');
                    // this.Teams.push(res.data.team)
                    res.data.forEach(element => {

                        store.put(element)
                    });
                    this.Teams.push(...res.data)


                    return { status: true, message: 'Teams cargados correctamente' };
                    // let request = indexedDB.open('teams', 1);


                })
                .catch(err => {

                    return { status: false, message: 'Ocurrio un error' };
                })

        },

        async AddCharacterToTeam(character: Character, Team: TeamsList): Promise<{ status: boolean, message: string }> {
            const teamStorage = this.Teams.find(e => e.name === Team.name)
            if (!teamStorage) return { status: false, message: 'Equipo no existente' };
            if (teamStorage.characters.find(e => e.name === character.name)) return { status: false, message: 'Heroe ya en el equipo' };
            const axiosSave = await axios.put(`${import.meta.env.VITE_BASE_URL}/teams`, { character: character, team: Team._id })
                .then(res => {
                    if (res.data.status) return { status: true, message: 'Guardado correctamente' };
                    return { status: false, message: 'Guardado correctamente' };
                })
                .catch(err => {

                    return { status: false, message: 'Ocurrio un error' };
                })
            if (axiosSave.status) {

                const transaction = this.TeamsDB.transaction(['teams'], 'readwrite');
                const store = transaction.objectStore('teams');
                teamStorage.characters.push(character)
                const registro = await store.get(Team._id);
                registro.onsuccess = () => {
                    const elemento = registro.result;
                    elemento.characters.push(character);
                    const updateRequest = store.put(JSON.parse(JSON.stringify(elemento)));
                }
                return { status: true, message: 'Heroe agregado al equipo' }
            }
            return { status: false, message: 'No se logro agregar al heroe' }
        },

        async DeleteTeam(Team: TeamsList): Promise<{ status: boolean, message: string }> {

            if (!Team._id) return { status: false, message: 'Ocurrio un error' };
            const teamStorage = this.Teams.find(e => e.name === Team.name)
            if (!teamStorage) return { status: false, message: 'Equipo no existente' };

            const axiosPetition = await axios.delete(`${import.meta.env.VITE_BASE_URL}/teams?team=${Team._id}`, )
                .then(res => {
                    if (res.data.status) return { status: true, message: 'Guardado correctamente' };
                    return { status: false, message: 'Ocurrio un error' };
                })
                .catch(err => {

                    return { status: false, message: 'Ocurrio un error' };
                })

            if (axiosPetition.status) {
                const indice = this.Teams.findIndex(e => e.name === Team.name);
                if (indice < 0) {
                    return { status: false, message: 'Ocurrio un error al borrar localmente' };
                }
                this.Teams.splice(indice, 1);
                const transaction = this.TeamsDB.transaction(['teams'], 'readwrite');
                const store = transaction.objectStore('teams');
                const registro = await store.delete(Team._id);
                return { status: true, message: 'Equipo eliminado correctamente' };
            }
            return { status: false, message: 'Ocurrio un error' };
        },
        async UpdateTeam(Team: TeamsList): Promise<{ status: boolean, message: string }> {

            if (!Team._id) return { status: false, message: 'Ocurrio un error' };
            const teamStorage = this.Teams.find(e => e._id === Team._id)
            if (!teamStorage) return { status: false, message: 'Equipo no existente' };

            const axiosPetition = await axios.patch(`${import.meta.env.VITE_BASE_URL}/teams?part=team`,Team )
                .then(res => {
                    if (res.data.status) return { status: true, message: 'Modificado correctamente' };
                    return { status: false, message: 'Ocurrio un error' };
                })
                .catch(err => {

                    return { status: false, message: 'Ocurrio un error' };
                })

            if (axiosPetition.status) {
                const indice = this.Teams.findIndex(e => e._id === Team._id);
                if (indice < 0) {
                    return { status: false, message: 'Ocurrio un error al actualizar localmente' };
                }
                this.Teams.splice(indice, 1,Team);
                
                const transaction = this.TeamsDB.transaction(['teams'], 'readwrite');
                const store = transaction.objectStore('teams');
                
                const registro = await store.get(Team._id);
                registro.onsuccess = () => {
                    const elemento = registro.result;
                    elemento.name = Team.name;
                    elemento.description = Team.description;
                    store.put(JSON.parse(JSON.stringify(elemento)));
                }

                return { status: true, message: 'Equipo Actualizado correctamente' };
            }
            return { status: false, message: 'Ocurrio un error' };
        },
        async DeleteMember(idTeam:string,member:Character): Promise<{ status: boolean, message: string }> {
            const teamStorage = this.Teams.find(e => e._id === idTeam);
            if (!teamStorage) return { status: false, message: 'Equipo no existente' };
            const Member = teamStorage.characters.find(e =>e.id === member.id);
            if (!Member) return { status: false, message: 'Miembro no existente' };
            
            const axiosPetition =  await axios.patch(`${import.meta.env.VITE_BASE_URL}/teams?part=member`,{team:idTeam,member:member} )
            .then(res => {
                if (res.data.status) return { status: true, message: 'Modificado correctamente' };
                return { status: false, message: 'Ocurrio un error' };
            })
            .catch(err => {

                return { status: false, message: 'Ocurrio un error' };
            })
            if (axiosPetition.status) {

                const transaction = this.TeamsDB.transaction(['teams'], 'readwrite');
                const store = transaction.objectStore('teams');
                const indiceMember = teamStorage.characters.findIndex(e =>e.id === member.id);
                // teamStorage.characters.splice(indiceMember,1);
                teamStorage.characters.splice(indiceMember,1);
                // teamStorage.characters =  JSON.parse(JSON.stringify(teamStorage.characters))
                const registro = await store.get(idTeam);
                registro.onsuccess = () => {
                    const elemento = registro.result as TeamsList;
                    const indiceDB = elemento.characters.findIndex((e: Character) =>e.id === member.id);
                    console.log(indiceDB,elemento.characters,elemento.characters[indiceDB]);
                    const newitems = elemento.characters.splice(indiceDB,1);
                    elemento.characters = newitems;
                    console.log(elemento);
                    
                    store.put(JSON.parse(JSON.stringify(elemento)));
                }
                return { status: true, message: 'Heroe agregado al equipo' }
            }
            return {status:false,message: "Ocurrio un error"}
        }
    },
    getters: {
        getTeams: (state) => state.Teams,
    }
})

