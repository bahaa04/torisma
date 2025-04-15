<template>


<main>
    <div class="container">
      <div class="form-wrapper">
        <h1>Créer votre compte</h1>
        <p class="description">
          Définissez un mot de passe sécurisé pour garantir la protection de votre compte Tourisma
        </p>
        
        <form>
          <input type="email" placeholder="Email" required>
          <input type="text" placeholder="Username" required>
          <input type="text" placeholder="Nom" required>
          <input type="text" placeholder="Prénom" required>
          <input type="tel" placeholder="Numéro de téléphone" required>
          <input type="text" placeholder="Gender" required>
          <input type="text" placeholder="Adresse" required>
          
          <div class="password-field">
    <input
      :type="showPassword ? 'text' : 'password'"
      id="password"
      placeholder="Mot de passe"
      required
    />
    <button type="button" @click="togglePassword" class="password-toggle">
      <svg
        v-if="!showPassword"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path
          d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
        ></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
      </svg>
    </button>
  </div>
          
          <button type="submit" class="continue-btn">Continuer</button>
          
          <div class="cancel-link">
            <button type="button">Annuler</button>
          </div>
        </form>
      </div>
    </div>
  </main>
  
  <footer>
    <div class="footer-content">
      <a href="#">Mentions légales</a>
      <a href="#">Politique de confidentialité</a>
      <a href="#">Conditions générales d'utilisation</a>
      <span>© 2025 Tourisma. Tous droits réservés</span>
    </div>
  </footer>



</template>



<style>


* {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: Arial, sans-serif;
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
      max-width: 420px;
      padding: 2rem;
      border-radius: 0.5rem;
      background-color:  #34d399; 
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }

    .form-wrapper {
      background-color: #34d399;
      padding: 1.5rem;
      border-radius: 0.5rem;
     
    }

    h1 {
      font-size: 1.5rem;
      font-weight: bold;
      text-align: center;
      margin-bottom: 1rem;
    }

    .description {
      font-size: 0.875rem;
      text-align: center;
      margin-bottom: 1rem;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    input {
      width: 100%;
      padding: 0.5rem 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 1rem;
    }

    .password-field {
      position: relative;
    }

    .password-toggle {
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      color: #9ca3af; 
    }

    .continue-btn {
      width: 100%;
      background-color: #10b981; 
      color: black;
      padding: 0.5rem;
      border: none;
      border-radius: 0.375rem;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.2s;
      margin-top: 0.5rem;
    }

    .continue-btn:hover {
      background-color: #059669; 
    }

    .cancel-link {
      text-align: right;
      margin-top: 0.5rem;
    }

    .cancel-link button {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 0.875rem;
    }

    .cancel-link button:hover {
      text-decoration: underline;
    }

    footer {
      background-color: white;
      padding: 1rem;
      border-top: 1px solid #e5e7eb; 
      font-size: 0.75rem;
      color: #4b5563; 
    }

    .footer-content {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    footer a {
      color: #4b5563; 
      text-decoration: none;
    }

    footer a:hover {
      text-decoration: underline;
    }

    @media (max-width: 640px) {
      .container {
        padding: 1rem;
      }
      
      .form-wrapper {
        padding: 1rem;
      }
      
      .footer-content {
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
      }
    }



</style>


<script setup>
import { ref } from 'vue'

const showPassword = ref(false)

function togglePassword() {
  showPassword.value = !showPassword.value
}
</script>