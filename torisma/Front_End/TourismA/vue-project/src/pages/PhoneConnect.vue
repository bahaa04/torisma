<template>


<main>
    <h1>Se connecter</h1>
    
    <div class="login-card">
      <p>Veuillez entrer vos informations</p>
      
      <div class="form-group">
        <input type="tel" id="phone" placeholder="numéro de téléphone">
      </div>
      
      <div class="form-group">
        <div class="input-wrapper">
          <input type="password" id="password" placeholder="Mot de passe">
          <button type="button" class="toggle-password" onclick="togglePasswordVisibility()">
            <svg class="eye-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <svg class="eye-off-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
              <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
              <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
              <line x1="2" x2="22" y1="2" y2="22"></line>
            </svg>
          </button>
        </div>
      </div>
      
      <div class="form-group">
        <button type="button" class="continue">Continuer</button>
      </div>
      
      <div class="cancel-link">
        <a href="#">Annuler</a>
      </div>
    </div>
  </main>
  
  <footer>
    <div class="footer-links">
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
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

body {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: white;
  position: relative;
}

main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
}

h1 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
  text-align: center;
}

.login-card {
  width: 100%;
  max-width: 28rem;
  background-color: #2ecc71;
  border-radius: 1.5rem;
  padding: 1.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.login-card p {
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group:last-of-type {
  margin-bottom: 0;
}

.input-wrapper {
  position: relative;
}

input {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  outline: none;
  font-size: 1rem;
}

input[type="password"] {
  padding-right: 2.5rem;
}

.toggle-password {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
}

button.continue {
  width: 100%;
  background-color: white;
  color: black;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

button.continue:hover {
  background-color: #f9fafb;
}

.cancel-link {
  text-align: right;
  margin-top: 1rem;
}

.cancel-link a {
  color: white;
  text-decoration: none;
}

.cancel-link a:hover {
  text-decoration: underline;
}

footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  font-size: 0.75rem;
  color: #4b5563;
  position: absolute;
  bottom: 0;
  width: 100%;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 1rem;
  justify-content: center;
}

.footer-links a {
  color: #4b5563;
  text-decoration: none;
}

.footer-links a:hover {
  text-decoration: underline;
}


.eye-icon, .eye-off-icon {
  width: 20px;
  height: 20px;
}

.eye-off-icon {
  display: none;
}

@media (max-height: 700px) {
  footer {
    position: relative;
    margin-top: 2rem;
  }
  
  main {
    padding-bottom: 1rem;
  }
}


</style>


<script>


function togglePasswordVisibility() {
  const passwordInput = document.getElementById('password');
  const eyeIcon = document.querySelector('.eye-icon');
  const eyeOffIcon = document.querySelector('.eye-off-icon');
  
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    eyeIcon.style.display = 'none';
    eyeOffIcon.style.display = 'block';
  } else {
    passwordInput.type = 'password';
    eyeIcon.style.display = 'block';
    eyeOffIcon.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', function() {
 
  const continueButton = document.querySelector('.continue');
  continueButton.addEventListener('click', function() {
  
    console.log('Login attempt');
    
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    
    if (!phone || !password) {
      alert('Veuillez remplir tous les champs');
      return;
    }
    
    console.log('Phone:', phone);
    console.log('Password:', password);
  });
});




</script>