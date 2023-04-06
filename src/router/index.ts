import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TeamsView from '../views/TeamsView.vue'
import Teamupdate from '../views/TeamupdateView.vue'
import FavoritesView from '../views/FavoritesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      // component: HomeView,
      redirect: to => {
        // the function receives the target route as the argument
        // we return a redirect path/location here.
        return { path: '/heroes' }
      },
    },
    {
      path: '/heroes',
      name: 'heroes',
      component: HomeView,

    },
    
    {
      path: '/teams',
      name: 'teams',
      children: [
        {
          path: '',
          name: 'teamIndex',
          component: TeamsView,
        },
        {
          name: 'specificTeam',
          path: '/teams/:param',
          component: Teamupdate,
        },
      ]
    },
    {
      path: "/favorites",
      
      children: [
        {
          path :'',
          name: "favorites",
          component: FavoritesView
        }
      ]
    }
  ]
})

export default router
