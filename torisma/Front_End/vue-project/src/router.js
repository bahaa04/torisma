import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import Login from './pages/Login.vue'
import EmailConnect from './pages/EmailConnect.vue'
import PhoneConnect from './pages/PhoneConnect.vue'
import signup from './pages/signup.vue'
import ajoutez from './pages/ajoutez.vue'


const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/email', component: EmailConnect },
  { path: '/phone', component: PhoneConnect },
  { path: '/signup', component: signup },
  { path: '/ajoutez', component: ajoutez },
  

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router