import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

function CartSidebar({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Fondo oscuro - Solo se encarga del fade */}
          <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />

          {/* Sidebar - Se encarga del movimiento lateral */}
          <motion.div 
            className="sidebar"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <header>
              <h2>Carrito</h2>
              <button onClick={onClose}>
                <X size={24} />
              </button>
            </header>
            
            <div className="cart-content">
               {/* Contenido aquí */}
               <p>Tu carrito está vacío</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default CartSidebar;