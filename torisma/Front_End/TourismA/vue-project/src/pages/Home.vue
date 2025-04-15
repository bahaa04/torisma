<template>
 

 <header>

 
    <div class="logo-container">
      <div class="logo">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 16c-3 0-4-3-4-3s1-3 4-3 4 3 4 3-1 3-4 3z"></path>
          <circle cx="12" cy="12" r="1"></circle>
        </svg>
      </div>


      <div class="logo-text">
  <span>T</span>
  <span>o</span>
  <span>u</span>
  <span>r</span>
  <span>i</span>
  <span>s</span>
  <span>m</span>
  <span class="highlighted">A</span>
</div>


    </div>
    
   

    
    <div class="nav-links">
  <a href="#" >Mon expérience</a>
  
    <a href="#"> Pourquoi l'Algérie </a> 
  
</div>

     


    
    
    <div class="header-actions">
      <button class="globe-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
      </button>

      <router-link to="/login" class="login-button">
    Connect
</router-link>
      
    </div>
  </header>
  
  <!-- Search Section -->
  <div class="search-container">
    <div class="search-bar">
      <div class="search-input-container">
        <div class="search-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <input type="text" class="search-input" placeholder="Vous tapez la wilaya où vous voulez aller">
      </div>
      <button class="search-button">Search</button>
    </div>
    
   <!-- Categories -->
   <div class="categories">
      <div class="category">
        <div class="category-icon">
           
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
        <line x1="8" y1="2" x2="8" y2="18"></line>
        <line x1="16" y1="6" x2="16" y2="22"></line>
      </svg>
        </div>
        <span class="category-name active">willaya</span>
      </div>
      <div class="category">
        <div class="category-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </div>

        
        <span class="category-name">Maison</span>
      
      
      </div>
      <div class="category">
        <div class="category-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm10 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2H6ZM4.862 4.276 3.906 6.19a.51.51 0 0 0 .497.731c.91-.073 2.35-.17 3.597-.17 1.247 0 2.688.097 3.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 10.691 4H5.309a.5.5 0 0 0-.447.276Z"/>
                    <path d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679c.033.161.049.325.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.807.807 0 0 0 .381-.404l.792-1.848Z"/>
                </svg>
        </div>
        <span class="category-name">Voiture</span>
      </div> 


    <router-link to="/ajoutez" class="no-underline">
    <button class="button" type="button">
    <span class="button__text">Ajoutez</span>
    <span class="button__icon"><svg class="svg" fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><line x1="12" x2="12" y1="5" y2="19"></line><line x1="5" x2="19" y1="12" y2="12"></line></svg></span>
  </button>
</router-link>

    </div>
  </div>
  
  <!-- Main Content -->
  <div class="main-content">
    <div class="content-header">
      <h1 class="content-title">Explorez les wilayas d'Algérie et faites votre choix</h1>
      <p class="content-subtitle">Partez à la découverte des wilayas d'Algérie et choisissez votre prochaine destination.</p>
    </div>
    
    <!-- Destinations Grid -->
    <div class="destinations-grid">
      <!-- Alger -->
      <div class="destination-card">
        <img src="../assets/alger.jpg" alt="Alger" class="destination-image">
        <div class="destination-overlay"></div>
        <div class="destination-name">alger</div>
        
      </div>


      <div class="destination-card">
        <img src="../assets/bejaia.jpg" alt="Béjaïa" class="destination-image">
        <div class="destination-overlay"></div>
        <div class="destination-name">Béjaïa</div>
        
      </div>
    
      <!-- Constantine -->
      <div class="destination-card">
        <img src="../assets/constantine.jpg" alt="Constantine" class="destination-image">
        <div class="destination-overlay"></div>
        <div class="destination-name">Constantine</div>
        
        </div>
      
      
      <!-- Annaba -->
      <div class="destination-card">
        <img src="../assets/annaba.jpg" alt="Annaba" class="destination-image">
        <div class="destination-overlay"></div>
        <div class="destination-name">Annaba</div>
        
      </div>
      
      
      <!-- Ghardaïa -->
      <div class="destination-card">
        <img src="../assets/ghardaia.jpg" alt="Ghardaïa" class="destination-image">
        <div class="destination-overlay"></div>
        <div class="destination-name">Ghardaïa</div>
        
      </div>
      
      <!-- Sétif -->
      <div class="destination-card">
        <img src="../assets/setif.jpg" alt="Sétif" class="destination-image">
        <div class="destination-overlay"></div>
        <div class="destination-name">Sétif</div>
        
      </div>
      
      <!-- Oran -->
      <div class="destination-card">
        <img src="../assets/oran.jpg" alt="Oran" class="destination-image">
        <div class="destination-overlay"></div>
        <div class="destination-name">Oran</div>
        
      </div>
      
      <!-- Tipaza -->
      <div class="destination-card">
        <img src="../assets/tipaza.jpg" alt="Tipaza" class="destination-image">
        <div class="destination-overlay"></div>
        <div class="destination-name">Tipaza</div>
        
      </div>
      
      <!-- Tassili-Illizi -->
      <div class="destination-card">
        <img src="../assets/tassili.jpg" alt="Tassili-Illizi" class="destination-image">
        <div class="destination-overlay"></div>
        <div class="destination-name">Tassili-Illizi</div>
        
      </div>
      
      <!-- Tamenrasset -->
      <div class="destination-card">
        <img src="../assets/tamenraset.jpg" alt="Tamenrasset" class="destination-image">
        <div class="destination-overlay"></div>
        <div class="destination-name">Tamenrasset</div>
       
      </div>
      
      <!-- Skikda -->
      <div class="destination-card">
        <img src="../assets/skikda.jpg" alt="Skikda" class="destination-image">
        <div class="destination-overlay"></div>
        <div class="destination-name">Skikda</div>
        
      </div>
      
      <!-- Tizi ouzou -->
      <div class="destination-card">
        <img src="../assets/tizi ouzou.jpg" alt="Tizi ouzou" class="destination-image">
        <div class="destination-overlay"></div>
        <div class="destination-name">Tizi ouzou</div>
        <div class="add-button">+</div>
      </div>
      
      <!-- Tlemcen -->
      <div class="destination-card">
        <img src="../assets/tlemcen.jpg" alt="Tlemcen" class="destination-image">
        <div class="destination-overlay"></div>
        <div class="destination-name">Tlemcen</div>
        <div class="add-button">+</div>
      </div>
      
      <!-- Jijel -->
      <div class="destination-card">
        <img src="../assets/jijel.jpg" alt="Jijel" class="destination-image">
        <div class="destination-overlay"></div>
        <div class="destination-name">Jijel</div>
        <div class="add-button">+</div>
      </div>
      
      <!-- Bechar -->
      <div class="destination-card">
        <img src="../assets/bechar.jpg" alt="Bechar" class="destination-image">
        <div class="destination-overlay"></div>
        <div class="destination-name">Bechar</div>
        <div class="add-button">+</div>
      </div>
    </div>
    
    <!-- Help Section -->
    <div class="help-section">
      <p class="help-text">Vous hésitez entre mer, désert ou montagnes ? Si oui, essayez ceci</p>
      <a href="#" class="help-button">Aidez-moi</a>
    </div>
  </div>
  
  <!-- Video Banner -->
  <div class="video-banner">

    <video width="100%" height="100%" class="vid" autoplay loop controls>
  <source src="../assets/alg.mp4" type="video/mp4">
  Your browser does not support the video tag
</video>



    <div class="banner-logo">
      <div class="logo">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 16c-3 0-4-3-4-3s1-3 4-3 4 3 4 3-1 3-4 3z"></path>
          <circle cx="12" cy="12" r="1"></circle>
        </svg>
      </div>
      <span class="logo-text">TourismA</span>
    </div>
  </div>
  
  <!-- Footer -->
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-column">
        <h3>À propos de TourismA</h3>
        <a href="#">À propos de TourismA</a>
        <h3>Nos Services</h3>
        <a href="#">Location de voiture</a>
        <a href="#">Découvrir les beaux paysages</a>
        <a href="#">Location de maisons</a>
      </div>
      
      <div class="footer-column">
        <h3>Contacts</h3>
        <p>TourismA@gmail.com</p>
        <p>+213 5 67 89 09 00</p>
        <p>+213 7 88 22 45 12</p>
        
        <div class="social-icons">
          <a href="#" class="social-icon">
            <svg viewBox="0 0 24 24" width="24px" height="24px" class="d Vb UmNoP" aria-hidden="true"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.093 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.563V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.129 22 16.992 22 12"></path></svg>
          </a>
          <a href="#" class="social-icon instagram">
            <svg viewBox="0 0 24 24" width="24px" height="24px" class="d Vb UmNoP" aria-hidden="true"><path d="M12 3.803c2.67 0 2.986.01 4.04.059.976.044 1.505.207 1.858.344.435.16.828.416 1.151.748.332.323.588.716.748 1.151.137.353.3.882.344 1.857.049 1.055.059 1.37.059 4.041 0 2.67-.01 2.986-.059 4.041-.044.975-.207 1.505-.344 1.857A3.32 3.32 0 0 1 17.9 19.8c-.352.137-.882.3-1.857.344-1.054.048-1.37.058-4.04.058s-2.987-.01-4.041-.058c-.975-.044-1.505-.207-1.857-.344a3.1 3.1 0 0 1-1.151-.748 3.1 3.1 0 0 1-.749-1.151c-.137-.353-.3-.883-.344-1.857-.048-1.055-.058-1.371-.058-4.041s.01-2.987.058-4.041c.045-.975.207-1.505.344-1.857a3.1 3.1 0 0 1 .749-1.151 3.1 3.1 0 0 1 1.15-.749c.353-.137.883-.3 1.858-.344 1.054-.048 1.37-.058 4.04-.058zM12.002 2c-2.716 0-3.057.012-4.124.06-1.066.05-1.793.22-2.428.466A4.9 4.9 0 0 0 3.678 3.68a4.9 4.9 0 0 0-1.153 1.772c-.247.635-.416 1.363-.465 2.427C2.012 8.943 2 9.286 2 12.002c0 2.715.012 3.056.06 4.123.05 1.066.218 1.791.465 2.426a4.9 4.9 0 0 0 1.153 1.772c.5.508 1.105.902 1.772 1.153.635.248 1.363.417 2.428.465s1.407.06 4.123.06 3.056-.01 4.123-.06 1.79-.217 2.426-.465a5.1 5.1 0 0 0 2.925-2.925c.247-.635.416-1.363.465-2.427.048-1.064.06-1.407.06-4.123s-.012-3.057-.06-4.123c-.05-1.067-.218-1.791-.465-2.426a4.9 4.9 0 0 0-1.153-1.771 4.9 4.9 0 0 0-1.772-1.155c-.635-.247-1.363-.416-2.428-.464s-1.406-.06-4.122-.06z"></path><path d="M12 6.866a5.135 5.135 0 1 0 0 10.27 5.135 5.135 0 0 0 0-10.27m0 8.47a3.334 3.334 0 1 1 0-6.669 3.334 3.334 0 0 1 0 6.669m5.338-7.473a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4"></path></svg>
          </a>
          <a href="#" class="social-icon twitter">
            <svg viewBox="0 0 24 24" width="24px" height="24px" class="d Vb UmNoP" aria-hidden="true"><path d="M13.905 10.47 21.35 2h-1.764L13.12 9.353 7.956 2H2l7.809 11.12L2 22h1.764l6.827-7.766L16.044 22H22M4.4 3.302h2.71l12.476 17.46h-2.71"></path></svg>
          </a>
        </div>
        
        <div class="language-selector">
          <span>Algérie</span>
          <button class="globe-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
          </button>
        </div>
      </div>
      
      <div class="footer-column">
        <h3>Avec TourismA</h3>
        <h2>Découvrez l'Algérie autrement</h2>
        
        <div class="footer-logo">
          <div class="logo-container">
            <div class="logo">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16c-3 0-4-3-4-3s1-3 4-3 4 3 4 3-1 3-4 3z"></path>
                <circle cx="12" cy="12" r="1"></circle>
              </svg>
            </div>
            <span class="logo-text">TourismA</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="footer-bottom">
      <div class="footer-links">
        <a href="#">Mentions légales</a>
        <a href="#">Politique de confidentialité</a>
        <a href="#">Conditions générales d'utilisation</a>
      </div>
      <div class="copyright">
        © 2025 Tourisma. Tous droits réservés
      </div>
    </div>
  </footer>



  </template>
  
  <script >
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  

  const router = useRouter()
  function goToLogin() {
    router.push('/login')
  }

 
  </script>
  
  <style scoped>
  

   
   * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      color: black;
    }
    
    
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      border-bottom: 1px solid #e5e5e5;
      background-color: white;
    }
    
    .logo-container {
      display: flex;
      align-items: center;
    }
    
    .logo {
      width: 40px;
      height: 40px;
      background-color: #03d186;
      border-radius: 50%;
      margin-right: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 36px;
      display: flex;
       gap: 2px;
}
    

.logo-text {
  font-weight: bold;      
  font-size: 2rem;      
}

.logo-text .highlighted {
  color: rgb(81, 163, 81);         
}

.logo-text span { 
  color: #000000;
  opacity: 0;
  transform: translateY(10px);
  animation: rise 0.6s ease-out forwards;
}

@keyframes rise {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.logo-text span:nth-child(1) { animation-delay: 0s; }
.logo-text span:nth-child(2) { animation-delay: 0.1s; }
.logo-text span:nth-child(3) { animation-delay: 0.2s; }
.logo-text span:nth-child(4) { animation-delay: 0.3s; }
.logo-text span:nth-child(5) { animation-delay: 0.4s; }
.logo-text span:nth-child(6) { animation-delay: 0.5s; }
.logo-text span:nth-child(7) { animation-delay: 0.6s; }
.logo-text span:nth-child(8) { animation-delay: 0.7s; }
.logo-text span:nth-child(9) { animation-delay: 0.8s; }
 
.nav-links{
  font-size: large;
  
}

.nav-links a {
  padding: 7px;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
  color: #333;
  font-size: 16px;
  margin:4px ;
      
}

.nav-links a:hover {
  color: #03d186;
  background: #deede8;
  border-radius: 30px; /* Super round edges */

}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}



.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #00749b;
  padding: 1rem 2rem;
  color: white;
  position: relative;
}

    .header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .globe-button {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: none;
      background-color: transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .globe-button:hover {
      background-color: #d1d1d1;
    }
    
   .login-button {
      padding: 0.5rem 1rem;
      background-color: rgb(0, 0, 0);
      color: #f3fdf9;
      border: 2px solid white;
      border-radius: 30px;
      text-decoration: none;
      font-weight: bold;
      transition: background-color 0.3s, color 0.3s;
      background-clip: padding-box;
    

    }
    
    .login-button:hover {
      background-color: #494848;
      color: #fdfffe;
    }  
 
    .category-name {
  background: none;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: normal;
  color: #444;
  cursor: pointer;
  transition: 0.3s;
  font-weight: bold;
}

.category-name:hover {
  color: #007acc;
}

.category-name.active {
  font-weight: bold;
  color: #000000; /* or another highlight color */
  border-bottom: 2px solid #000000; 
}
  

  .button {
    --main-focus: #2d8cf0;
    --font-color: #323232;
    --bg-color-sub: #dedede;
    --bg-color: #eee;
    --main-color: #323232;
    position: relative;
    width: 150px;
    height: 40px;
    cursor: pointer;
    display: flex;
    align-items: center;
    border: 2px solid var(--main-color);
    box-shadow: 4px 4px var(--main-color);
    background-color: var(--bg-color);
    border-radius: 10px;
    overflow: hidden;
    text-decoration: none;
  }

  .button, .button__icon, .button__text {
    transition: all 0.3s;
    text-decoration: none; 
    
  }

  .button .button__text {
    transform: translateX(22px);
    color: var(--font-color);
    font-weight: 600;
    text-decoration: none; 
    
  }

  .button .button__icon {
    position: absolute;
    transform: translateX(109px);
    height: 100%;
    width: 39px;
    background-color: var(--bg-color-sub);
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
  }

  .button .svg {
    width: 20px;
    fill: var(--main-color);
    text-decoration: none; 
    
  }

  .button:hover {
    background: var(--bg-color);
  }

  .button:hover .button__text {
    color: transparent;

  }

  .button:hover .button__icon {
    width: 148px;
    transform: translateX(0);
  }

  .button:active {
    transform: translate(3px, 3px);
    box-shadow: 0px 0px var(--main-color);
  }

   
    /* Search */
    .search-container {
      max-width: 800px;
      margin: 24px auto;
      padding: 0 16px;
box-shadow: none;
    }
    
    .search-bar {
      display: flex;
      align-items: center;
      background-color: white;
      border-radius: 50px;
      box-shadow: 0 2px 8px rgba(181, 17, 17, 0.1);
      overflow: hidden;
    }
    
    .search-input-container {
      flex: 1;
      display: flex;
      align-items: center;
      padding: 0 16px;
    }
    
    .search-icon {
      color: #757575;
      margin-right: 8px;
    }
    
    .search-input {
      width: 100%;
      padding: 12px 0;
      border: none;
      outline: none;
      font-size: 16px;
    }
    
    .search-button {
      background-color: #2bcea5;
      color: white;
      border: none;
      border-radius: 50px;
      padding: 8px 24px;
      margin: 4px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
    }
    
    .search-button:hover {
      background-color: #03d186;
    }
    
    /* Categories */
    .categories {
      display: flex;
      justify-content: center;
      gap: 32px;
      margin-top: 24px;
    }
    
    .category {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .category-icon {
      width: 48px;
      height: 48px;
      background-color: #f2f2f2;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 4px;
    }
    
    .category-name {
      font-size: 12px;
      color: #333;
    }
    
    /* Main content styles */
    .main-content {
      max-width: 1200px;
      margin: 24px auto;
      padding: 0 16px;
    }
    
    .content-header {
      margin-bottom: 24px;
    }
    
    .content-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
            display: flex;
            justify-content: center;
            
        }
        
        .content-subtitle {
            color: #888;
            margin-bottom: 30px;
            display: flex;
            justify-content: flex-start;
            display: flex;
            justify-content: center;

        }
        
    
    /* Destinations grid */
    .destinations-grid {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 16px;
    }
    
    @media (min-width: 640px) {
      .destinations-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    @media (min-width: 1024px) {
      .destinations-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }
    
    .destination-card {
      position: relative;
      height: 200px;
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
    }
    
    .destination-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .destination-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 50%;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
      
    }
    
    .destination-name {
      position: absolute;
      bottom: 12px;
      left: 12px;
      color: rgb(255, 255, 255);
      font-size: 20px;
      font-weight: bold;
      
    }
    
    .add-button {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 32px;
      height: 32px;
      background-color: #03d186;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
    }
    .no-underline {
  text-decoration: none;
  color: inherit;
}
    
    /* aidez moi */
    .help-section {
      text-align: center;
      margin: 40px auto;
      max-width: 600px;
    }
    
    .help-text {
      font-size: 18px;
      margin-bottom: 16px;
    }
    
    .help-button {
      background-color: #2bcea5;
      color: white;
      border: none;
      border-radius: 24px;
      padding: 10px 24px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      display: inline-block;
    }
    
    .help-button:hover {
      background-color: #03d186;
    }
    
    /* Video */
    .video-banner {
      position: relative;
      width: 100%;
      height: 400px;
      background-color: #f9e8c7;
      margin-top: 40px;
      overflow: hidden;
    }
    
    .banner-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    
    .banner-logo {
      position: absolute;
      bottom: 20px;
      right: 20px;
      display: flex;
      align-items: center;
    }
    
    .banner-logo .logo {
      width: 30px;
      height: 30px;
    }
    
    .banner-logo .logo-text {
      font-size: 16px;
      color: white;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    }
    
    .vid {
  width: 100%;
  height: 100%;
  object-fit: cover; 
  display: block;
}

    /* Footer */
    .footer {
      background-color: #f2f2f2;
      padding: 40px 20px;
      position: relative;
      
    }
    
    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 30px;
      
    }
    
    @media (min-width: 768px) {
      .footer-container {
        grid-template-columns: repeat(3, 1fr);
      }
    }
    
    .footer-column h3 {
      font-size: 18px;
      margin-bottom: 16px;
      
    }
    
    .footer-column p {
      margin-bottom: 8px;
      font-size: 14px;
    }
    
    .footer-column a {
      display: block;
      color: #333;
      text-decoration: none;
      margin-bottom: 8px;
      font-size: 14px;
    }
    
    .footer-column a:hover {
      text-decoration: underline;
    }
    
    .social-icons {
      display: flex;
      gap: 12px;
      margin-top: 16px;
    }
    
    .social-icon {
      width: 32px;
      height: 32px;
      background-color: #7e9cdc;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
    
    .social-icon.instagram {
      background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
    }
    
    .social-icon.twitter {
      background-color: #d4dbe0;
    }
    
    .language-selector {
      display: flex;
      align-items: center;
      margin-top: 16px;
    }
    
    .language-selector span {
      margin-right: 8px;
    }
    
    .language-selector .globe-button {
      background-color: #e5e5e5;
    }
    
    .footer-logo {
      margin-top: 16px;
    }
    
    .footer-bottom {
      max-width: 1200px;
      margin: 0 auto;
      border-top: 1px solid #ddd;
      padding-top: 20px;
      margin-top: 20px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      font-size: 12px;
      color: #666;
    }
    
    .footer-links {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }
    
    .footer-links a {
      color: #666;
      text-decoration: none;
    }
    
    .footer-links a:hover {
      text-decoration: underline;
    }
    
    
    @media (max-width: 768px) {
      .nav-links {
        display: none;
      }
      
      .footer-bottom {
        flex-direction: column;
        gap: 12px;
      }
    }
 
  </style>