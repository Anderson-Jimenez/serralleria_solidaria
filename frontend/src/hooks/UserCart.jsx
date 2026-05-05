// useCart.js
// ─────────────────────────────────────────────────────────────────
// Este archivo es un "hook" de React.
// Un hook es simplemente una función que empieza por "use" y puede
// guardar estado. Lo importamos en cualquier componente que necesite
// el carrito.
// ─────────────────────────────────────────────────────────────────

import { useState } from 'react';

// Esta función lee el carrito guardado en localStorage.
// localStorage es como una "memoria del navegador" que no se borra
// al recargar la página.
function cargarCarritoGuardado() {
  try {
    const guardado = localStorage.getItem('carrito'); // busca la clave "carrito"
    return guardado ? JSON.parse(guardado) : [];       // si existe, lo convierte de texto a array
  } catch {
    return []; // si hay algún error raro, devuelve un array vacío
  }
}

// ─────────────────────────────────────────────────────────────────
// El hook principal
// ─────────────────────────────────────────────────────────────────
export function useCart() {
  // useState inicializa el carrito con lo que haya guardado en localStorage
  const [items, setItems] = useState(cargarCarritoGuardado);

  // Esta función guarda el carrito en localStorage cada vez que cambia
  function guardar(nuevosItems) {
    setItems(nuevosItems);
    localStorage.setItem('carrito', JSON.stringify(nuevosItems)); // convierte el array a texto y lo guarda
  }

  // ── Añadir producto ──────────────────────────────────────────
  // Recibe un objeto "producto" con: id, name, sale_price, discount, stock...
  function añadir(producto) {
    // Miramos si el producto ya está en el carrito
    const yaEsta = items.find(item => item.id === producto.id);

    if (yaEsta) {
      // Si ya está, solo aumentamos la cantidad en 1
      const actualizado = items.map(item =>
        item.id === producto.id
          ? { ...item, cantidad: item.cantidad + 1 } // ...item copia todas las propiedades, solo cambiamos "cantidad"
          : item
      );
      guardar(actualizado);
    } else {
      // Si no está, lo añadimos con cantidad 1
      guardar([...items, { ...producto, cantidad: 1 }]); // ...items copia el array, y añadimos el nuevo producto
    }
  }

  // ── Quitar producto ──────────────────────────────────────────
  function quitar(productoId) {
    guardar(items.filter(item => item.id !== productoId)); // filter devuelve un array sin ese producto
  }

  // ── Vaciar todo el carrito ───────────────────────────────────
  function vaciar() {
    guardar([]);
  }

  // ── Total de unidades (para el badge del icono del carrito) ──
  // reduce recorre el array y va sumando las cantidades
  const totalUnidades = items.reduce((total, item) => total + item.cantidad, 0);

  // ── Precio total ─────────────────────────────────────────────
  const precioTotal = items.reduce((total, item) => {
    const precio = item.sale_price - (item.sale_price / 100) * (item.discount ?? 0);
    return total + precio * item.cantidad;
  }, 0);

  // Devolvemos todo lo que necesiten los componentes
  return {
    items,           // array con los productos del carrito
    añadir,          // función para añadir
    quitar,          // función para quitar
    vaciar,          // función para vaciar
    totalUnidades,   // número total de unidades (ej: 3)
    precioTotal,     // precio total como número
  };
}