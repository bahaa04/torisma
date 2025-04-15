<template>
  
  <main>
   
   
   
   <div class="container">
      <h1>Se connecter</h1>

      
      
      <div class="card">
        <div class="form-group">
          <input v-model="email" placeholder="Veuillez entrer votre Email">
        </div>


        <div class="card2">
        <div class="form-group2">
          <input v-model="password" placeholder="Veuillez entrer votre mot de pass">
        </div>  
        <button class="btn" @click="handleLogin">Continuer</button>
        


      


        
        
        
        <div class="text-center">
          <span class="text-sm">Vous n'avez pas de compte? </span>
          
          <router-link to="/signup" class="text-sm">
      Connexion
  </router-link>
          
        </div>
        </div>
        
        <div class="divider">
          <div class="divider-line"></div>
          <span class="divider-text">OU</span>
          <div class="divider-line"></div>
        </div>
        
        <router-link to="/email" class="btn btn-outline google-button">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
      <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
      <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
    </g>
  </svg>
  Continuer avec Google
</router-link>
        
<router-link to="/phone" class="btn btn-outline phone-button">
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
  Continuer avec un numéro de téléphone
</router-link>
      </div>
    </div>
  </main>
  
  <footer>
    <a href="#">Mentions légales</a>
    <a href="#">Politique de confidentialité</a>
    <a href="#">Conditions générales d'utilisation</a>
    <span>© 2025 Tourisma. Tous droits réservés</span>
  </footer>


  </template>
  
  <script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()

function handleLogin() {
 
  if (email.value === 'admin@example.com' && password.value === 'password') {
    alert('Login successful!')
  } else {
    router.push('/error') // navigate to error page
  }
}
</script>
  
  <style scoped>
  
  * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    
    body {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background-color: white;
    }
    
    main {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }
    
    .container {
  
    width: 100%;
    max-width: 400px;
    }
    
    h1 {
      text-align: center;
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
      font-weight: bold;
    }
    
    .card {
      background-color: #34d399;
      border-radius: 1.5rem;
      padding: 1.5rem;
     
    }
    
    .form-group {
      margin-bottom: 1rem;
    }



    .form-group2 {
      margin-bottom: 1rem;
    }


    
    input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: none;
      border-radius: 0.75rem;
      font-size: 0.875rem;
      height: 3rem;
    }
    
    input:focus {
      outline: none;
    }
    
    .btn {
      width: 100%;
      height: 3rem;
      border-radius: 0.75rem;
      border: 1px solid #10b981;
      background-color: #10b981;
      color: black;
      font-weight: 500;
      cursor: pointer;
      font-size: 0.875rem;
      transition: background-color 0.2s;
    }
    
    .btn:hover {
      background-color: #059669;
    }
    
    .text-center {
      text-align: center;
      margin: 1rem 0;
    }
    
    .text-sm {
      font-size: 0.875rem;
    }
    
    a {
      color: inherit;
      text-decoration: none;
      font-weight: 500;
    }
    
    .divider {
      display: flex;
      align-items: center;
      margin: 1rem 0;
    }
    
    .divider-line {
      flex: 1;
      height: 1px;
      background-color: rgba(16, 185, 129, 0.5);
    }
    
    .divider-text {
      margin: 0 0.5rem;
      font-size: 0.875rem;
    }
    
    .btn-outline {
      background-color: white;
      color: black;
      border: 1px solid #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    
    .btn-outline:hover {
      background-color: #f9fafb;
    }
    
    footer {
      padding: 1rem;
      text-align: center;
      font-size: 0.75rem;
      color: #4b5563;
    }
    
    footer a {
      margin: 0 0.5rem;
    }
    
    footer a:hover {
      text-decoration: underline;
    }




  </style>