<template>
<div class="body">
<h1 class="dialog-title">Vous voulez ajouter</h1>
    
    <div class="dialog-container">
        <button class="option-button" onclick="selectOption('logement')">Un logement</button>
        <button class="option-button" onclick="selectOption('voiture')">Une Voiture</button>
        <a href="#" class="cancel-link" onclick="cancel(); return false;">Annuler</a>
    </div>
    
    <div class="footer">
        <span>Mentions légales</span>
        <span>Politique de confidentialité</span>
        <span>Conditions générales d'utilisation</span>
        <span>© 2025 Tourisma. Tous droits réservés</span>
    </div>

</div>
</template>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Arial, sans-serif;


}

.body {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    justify-content: center;
    align-items: center;
    background-color: white;
    position: relative;
}

.dialog-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
    text-align: center;
}

.dialog-container {
    width: 500px;
    height: 300px;
    max-width: 500px;
    background-color:#34d399;
    border-radius: 24px;
    padding: 30px;
    box-shadow: 0 19px 60px rgba(0, 0, 0, 0.1);
    margin-top: 20px;
    font-size: 18px;
}

.option-button {
   
    display: block;
    width: 100%;
    padding: 13px;
    margin-bottom: 20px;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    text-align: center;
    cursor: pointer;
    color: #333;
    transition: background-color 0.2s;
}

.option-button:hover {
    background-color: #faefef;
}

.cancel-link {
    display: block;
    text-align: right;
    color: white;
    text-decoration: none;
    margin-top: 10px;
    font-size: 16px;
}

.cancel-link:hover {
    text-decoration: underline;
}

.footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #f0f0f0;
    padding: 4px;
    text-align: center;
    font-size: 12px;
    color: #666;
}

.footer span {
    margin-right: 16px;
}

.footer span:last-child {
    margin-right: 0;
}
</style>



<script>
function selectOption(option) {
    console.log(`Option selected: ${option}`);
    alert(`Vous avez choisi d'ajouter: ${option === 'logement' ? 'Un logement' : 'Une voiture'}`);
}

function cancel() {
    console.log("Operation cancelled");
    alert("Opération annulée");
}
</script>