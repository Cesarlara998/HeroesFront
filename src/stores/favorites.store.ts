import { defineStore } from 'pinia'
import axios from 'axios'
import type { Character } from '../interfaces/HeroCharacter.interface'

export const useFavoritesStore = defineStore('favorites', {
    state: () => {
        return {
            FavoritesDB: undefined as IDBDatabase | undefined,
            Favorites: [] as Character[]
        }
    },
    actions: {
        async addFavorite(character: Character) {
            if (this.Favorites.find(e => e.id === character.id)) return { status: false, message: 'Heroe ya se encuentra en favoritos' };

            const axiosSave = await axios.post(`${import.meta.env.VITE_BASE_URL}/favorites`, { character: character.id })
                .then(res => {
                    if (res.data.status) return { status: true, message: 'Guardado correctamente' };
                    return { status: false, message: 'Guardado correctamente' };
                })
                .catch(err => {

                    return { status: false, message: 'Ocurrio un error' };
                })
            if (axiosSave.status) {
                const transaction = this.FavoritesDB?.transaction(['favorites'], 'readwrite');
                if (transaction) {

                const store = transaction.objectStore('favorites');
                store.put(JSON.parse(JSON.stringify(character)));
                this.Favorites.push(JSON.parse(JSON.stringify(character)));
                return { status: true, message: 'Heroe agregado a favoritos' };
                }
            }
        },
        syncFavorites(characters: Character[]) {
            if (characters.length !== 0) return this.Favorites = characters;
            axios.get(`${import.meta.env.VITE_BASE_URL}/favorites`)
                .then(res => {
                    const transaction = this.FavoritesDB?.transaction(['favorites'], 'readwrite');
                    if (transaction) {

                    const store = transaction.objectStore('favorites');
                    // this.Teams.push(res.data.team)
                    // store.put(...res.data)
                    res.data.forEach((element: any) => {
                        store.put(element)
                    });
                    this.Favorites.push(...res.data)
                    return { status: true, message: 'Teams cargados correctamente' };
                    // let request = indexedDB.open('teams', 1);
                }

                })
                .catch(err => {
                })
        },
        async deleteFavorite(characterId: number) {
            if (!this.Favorites.find(e => e.id === characterId)) return { status: false, message: "Heroe no existente" };
            const axiosPetition = await axios.delete(`${import.meta.env.VITE_BASE_URL}/favorites?id=${characterId}`)
                .then(res => {
                    if (res.data.status) return { status: true, message: 'Personaje eliminado de favoritos correctamente' };
                    return { status: false, message: 'Ocurrio un error' };
                })
                .catch(err => {
                    return { status: false, message: 'Ocurrio un error' };
                })
            if (axiosPetition.status) {
                const transaction = this.FavoritesDB?.transaction(['favorites'], 'readwrite');
                if (transaction) {

                const store = transaction.objectStore('favorites');
                const indice = this.Favorites.findIndex(e => e.id === characterId);
                this.Favorites.splice(indice, 1);
                store.delete(characterId);
                return { status: true, message: 'Personaje eliminado de favoritos correctamente' }
                }
            }
        }
    },
    getters: {

        getFavoritesId: (state) => state.Favorites.map((character: Character) => character.id),
        getFavorites: (state) => state.Favorites
    }
})