import React from 'react';
import { 
  MapPin, Phone, Mail, Facebook, Instagram, Twitter, Linkedin, KeyRound 
} from 'lucide-react';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        <div className="footer-col info">
          <div className="footer-brand">
            <KeyRound size={24} className="icon-accent" />
            <span>SerralleriaSolidaria</span>
          </div>
          <p className="description">
            Especialistes en serralleria i seguretat amb més de 25 anys d'experiència al servei dels nostres clients.
          </p>
          <div className="social-icons">
            <a href="#" className="social-btn"><Facebook size={18} /></a>
            <a href="#" className="social-btn"><Instagram size={18} /></a>
            <a href="#" className="social-btn"><Twitter size={18} /></a>
            <a href="#" className="social-btn"><Linkedin size={18} /></a>
          </div>
        </div>

        <div className="footer-col">
          <h3>Productes</h3>
          <ul>
            <li><a href="#">Panys de Porta</a></li>
            <li><a href="#">Panys Electrònics</a></li>
            <li><a href="#">Claus i Duplicats</a></li>
            <li><a href="#">Caixes Fortes</a></li>
            <li><a href="#">Ferramentes</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Empresa</h3>
          <ul>
            <li><a href="#">Sobre Nosaltres</a></li>
            <li><a href="#">Contacte</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Treballa amb Nosaltres</a></li>
            <li><a href="#">Premsa</a></li>
          </ul>
        </div>

        <div className="footer-col contact">
          <h3>Contacte</h3>
          <div className="contact-item">
            <MapPin size={20} className="icon-accent" />
            <span>Carrer Principal, 123<br/>08001 Barcelona</span>
          </div>
          <div className="contact-item">
            <Phone size={20} className="icon-accent" />
            <span>+34 931 234 567</span>
          </div>
          <div className="contact-item">
            <Mail size={20} className="icon-accent" />
            <span>info@serralleriapro.cat</span>
          </div>
        </div>

      </div>

      {/* BARRA INFERIOR */}
      <div className="footer-bottom">
        <div className="bottom-container">
          <p>&copy; 2024 SerralleriaPro. Tots els drets reservats.</p>
          <div className="legal-links">
            <a href="#">Política de Privacitat</a>
            <a href="#">Termes i Condicions</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;