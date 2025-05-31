import React, { useState, useRef, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/signup.css';
import NavBar1 from '../components/navbar1';
import Footer from '../components/footer';

export default function SignUp() {
  const navigate = useNavigate();

  // Add authentication check
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      navigate('/');
      return;
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    gender: '',
    password: '',
    identification_type: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    if (!validateEmail(formData.email)) {
      setError('Format d\'email invalide');
      setIsSubmitting(false);
      return;
    }

    if (formData.password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      setIsSubmitting(false);
      return;
    }

    const payload = new FormData();
    
    // Add all form fields to FormData
    Object.keys(formData).forEach(key => {
      payload.append(key, formData[key]);
    });
    
    // Add the file if selected
    if (selectedFile) {
      payload.append('identification_image', selectedFile);
    }

    try {
      // Log what's being sent for debugging
      console.log('Submitting form data:', Object.fromEntries(payload.entries()));
      
      const response = await fetch('http://127.0.0.1:8000/api/users/auth/register/', {
        method: 'POST',
        body: payload,
        // Don't set Content-Type header when using FormData
        // Let the browser set it properly with boundary for multipart/form-data
      });

      // For debugging - log the raw response
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      // Parse the response if it's JSON
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error('Error parsing response as JSON:', e);
        result = { detail: 'Server response was not valid JSON' };
      }

      if (!response.ok) {
        // More detailed error handling
        if (result && typeof result === 'object') {
          // Handle field-specific errors from DRF
          const errorMessages = [];
          
          // Check if errors are nested in an 'errors' object (as seen in your response)
          const errorsObject = result.errors || result;
          
          Object.entries(errorsObject).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              errorMessages.push(`${field}: ${messages.join(', ')}`);
            } else if (typeof messages === 'string') {
              errorMessages.push(`${field}: ${messages}`);
            }
          });
          
          if (errorMessages.length > 0) {
            throw new Error(errorMessages.join('\n'));
          }
        }
        throw new Error(result.detail || 'Registration failed. Please check your input.');
      }

      // Show success message temporarily
      setSuccess('Inscription réussie! Redirection en cours...');
      
      // Reset form after successful submission
      setFormData({
        email: '',
        username: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        gender: '',
        password: '',
        identification_type: ''
      });
      setSelectedFile(null);
      setConfirmPassword('');
      
      // Redirect to verification page after successful registration
      setTimeout(() => {
        // Pass the email as state to the verification page
        navigate('/verification', { 
          state: { 
            email: result.email || formData.email,
            username: result.username || formData.username
          } 
        });
      }, 2000); // 2 seconds delay
    } catch (err) {
      setError(err.message);
      console.error('Registration error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="container">
        <NavBar1 />
        <hr style={{ border: "none", height: "0.5px", backgroundColor: "#e0e0e0" }} />

        <div className="form-container">
          <div className="form-wrapper">
            <h1 className="form-title">Créer votre compte</h1>
            <p className="form-subtitle">
              Définissez un mot de passe sécurisé pour garantir la protection de votre compte TouristmA
            </p>

            {error && (
              <div className="error-message" style={{ color: 'red', marginBottom: '15px' }}>
                {error.split('\n').map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            )}
            
            {success && (
              <div className="success-message" style={{ 
                color: 'green', 
                backgroundColor: '#f0fff0', 
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid green',
                marginBottom: '15px',
                textAlign: 'center',
                fontWeight: '500'
              }}>
                {success}
              </div>
            )}

            <form className="registration-form" onSubmit={handleSubmit}>
              <input 
                type="email" 
                name="email" 
                placeholder="Email" 
                className="form-input" 
                value={formData.email}
                onChange={handleChange} 
                required 
              />
              
              <input 
                type="text" 
                name="username" 
                placeholder="Username" 
                className="form-input" 
                value={formData.username}
                onChange={handleChange} 
                required 
              />
              
              <input 
                type="text" 
                name="last_name" 
                placeholder="Nom" 
                className="form-input" 
                value={formData.last_name}
                onChange={handleChange} 
                required 
              />
              
              <input 
                type="text" 
                name="first_name" 
                placeholder="Prénom" 
                className="form-input" 
                value={formData.first_name}
                onChange={handleChange} 
                required 
              />
              
              <input 
                type="tel" 
                name="phone_number" 
                placeholder="Numéro de téléphone" 
                className="form-input" 
                value={formData.phone_number}
                onChange={handleChange} 
                required 
              />

              <div className="gender-select-container">
                <select 
                  name="gender" 
                  className="form-input gender-select" 
                  value={formData.gender} 
                  onChange={handleChange} 
                  required
                >
                  <option value="" disabled>Genre</option>
                  <option value="male">Homme</option>
                  <option value="female">Femme</option>
                </select>
              </div>

              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Mot de passe"
                  className="password-input"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="toggle-visibility-button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="eye-icon"
                  >
                    {showPassword ? (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </>
                    ) : (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </>
                    )}
                  </svg>
                </button>
              </div>

              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirmer le mot de passe"
                  className="password-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-visibility-button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="eye-icon"
                  >
                    {showConfirmPassword ? (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </>
                    ) : (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </>
                    )}
                  </svg>
                </button>
              </div>

              <div className="gender-select-container">
                <select 
                  name="identification_type" 
                  className="form-input gender-select" 
                  value={formData.identification_type} 
                  onChange={handleChange} 
                  required
                >
                  <option value="" disabled>Type de la carte d'identité</option>
                  <option value="national_id">Carte Nationale d'Identité</option>
                  <option value="passport">Passeport</option>
                </select>
              </div>

              <input
                type="file"
                name="identification_image"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />

              <div className="upload-container" onClick={handleFileClick} style={{ cursor: 'pointer' }}>
                <div className="upload-icon-wrapper">
                  <Upload className="upload-icon" />
                </div>
                <span className="upload-text">
                  {selectedFile ? selectedFile.name : 'Télécharger votre pièce d\'identité'}
                </span>
              </div>

              <button 
                type="submit" 
                className="submit-button" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Traitement en cours...' : 'Continuer'}
              </button>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}