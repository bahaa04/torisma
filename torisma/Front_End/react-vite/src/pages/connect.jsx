import React from 'react' ;
import { Link } from "react-router-dom";
import "../styles/connect.css";
import Footer from "../components/footer";
import NavBar2 from "../components/navbar2";


document.addEventListener('DOMContentLoaded', () => {
   
    const inputs = document.querySelectorAll('.form-control');
    
    inputs.forEach((input, index) => {
       
        setTimeout(() => {
            input.style.opacity = '0';
            input.style.transform = 'translateY(20px)';
            
        
            setTimeout(() => {
                input.style.transition = 'all 0.5s ease';
                input.style.opacity = '1';
                input.style.transform = 'translateY(0)';
            }, 100);
        }, index * 200);
    });
    
    
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(button => {
        button.addEventListener('mouseover', () => {
            button.style.transition = 'all 0.3s ease';
            button.style.transform = 'translateY(-3px)';
            button.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        });
        
        button.addEventListener('mouseout', () => {
            button.style.transition = 'all 0.3s ease';
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = 'none';
        });
    });
    
   
    const form = document.querySelector('.login-form');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const inputs = form.querySelectorAll('.form-control');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#ff6b6b';
                input.style.animation = 'shake 0.5s';
                
                
                setTimeout(() => {
                    input.style.animation = '';
                    setTimeout(() => {
                        input.style.borderColor = '#e1e1e1';
                    }, 2000);
                }, 500);
            }
        });
        
        if (isValid) {
       
            const button = form.querySelector('.signin-btn');
            button.innerHTML = 'Signing in...';
            button.style.backgroundColor = '#25c285';
            
           
            setTimeout(() => {
                button.innerHTML = 'Success!';
                button.style.backgroundColor = '#2ee59d';
                
               
                document.querySelector('.login-container').style.animation = 'success 0.5s ease';
            }, 1500);
        }
    });
});


const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    @keyframes success {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
`;
document.head.appendChild(style);
export default function Connect() {
    return ( 
<>

<div className="container">
       

<NavBar2/>


        <main>
            <div className="left-section">
                <div className="content fade-in">
                    <p className="tagline">Discover the beauty of Algeria and beyond.</p>
                    <p className="description">Find stunning destinations, rent cars and homes with ease, and start your adventure today, all in one place</p>
                    <div className="cta">
                        <button className="join-btn">Join Now!</button>
                    </div>
                    <div className="illustration">
                        <img src="/boy.png" alt="Tourism illustration" className="illustration-img"/>
                    </div>
                </div>
            </div>

            <div className="right-section slide-in">
                <div className="login-container">
                    <h2>Sign in</h2>
                    <form className="login-form">
                        <div className="form-group">
                            <input type="text" placeholder="Enter Email or Phone" className="form-control"/>
                        </div>
                        <div className="form-group">
                            <input type="password" placeholder="Password" className="form-control"/>
                        </div>
                        <div className="forgot-password">
                        <Link to="/recoverpass"> Recover Password </Link>
                        </div>
                        <button type="submit" class="signin-btn">Sign in</button>
                    </form>
                    <div className="social-login">
                        <p>Or Continue with</p>
                        <div className="social-buttons">
                            <button className="social-btn google">
                                <img src="/google.jpg" alt="Google"/>
                            </button>
                            <button className="social-btn apple">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple"/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <Footer/>
    </div>


</>

    );
};