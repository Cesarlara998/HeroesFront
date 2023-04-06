import { defineStore } from 'pinia'
import axios from 'axios'
import type { HeroesList } from '../interfaces/HeroCharacter.interface';


export const useHeroesStore = defineStore('heroes', {
    state: () => {
        return {
            search: "",
            page: 0,
            totalPages: 0,
            heroesList: [] as HeroesList[],
            // for data that is not yet loaded
        }
    },
    actions: {
        async getPage(page: number,action: string, _search?: string) {

            if (action === "search") {
                if (_search) this.search = `&busqueda=${_search}`;
                if (!_search) this.search = ``;
                this.page = 0;
            }
            if (action === "number") {
                this.page = page;
            }

            return axios.get(`${import.meta.env.VITE_BASE_URL}/heroes?page=${this.page+1}${this.search}`).then(res => {
                this.totalPages = res.data.totalPages;

                const lista = this.heroesList.find(e => e.page === res.data.page)
                if (lista) return;
                this.heroesList.push({
                    page: res.data.page,
                    data: res.data.data
                });
                return true;
            })
                .catch(err => {
                    return false;
                })

        },
        async getHerobyId(id:number) {
            return axios.get(`${import.meta.env.VITE_BASE_URL}/heroes?id=${id}`).then(res => res)
        }
    },
    getters: {
        getListHeroPage: (state) => {


            const data = state.heroesList.find(e => e.page === state.page +1)            
            if (!data) return [];
            
            return data.data
        }
    }
})

