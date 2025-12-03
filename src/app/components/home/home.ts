/*import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}*/


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html'
})
export class Home {
  
  // Lista de Habitaciones para mostrar en las tarjetas
  habitaciones = [
    {
      titulo: 'Doble Estándar',
      desc: 'Espaciosa habitación con dos camas individuales o una cama doble. Ideal para parejas.',
      precio: 75,
      img: 'https://placehold.co/600x400/4A148C/ffffff?text=Doble+Estandar'
    },
    {
      titulo: 'Suite Ejecutiva',
      desc: 'Lujosa suite con cama king-size y sala de estar. Perfecta para viajes de negocios.',
      precio: 150,
      img: 'https://placehold.co/600x400/2C0B3E/ffffff?text=Suite+Ejecutiva'
    },
    {
      titulo: 'Habitación Familiar',
      desc: 'Amplia habitación diseñada para familias, con cama doble y dos individuales.',
      precio: 120,
      img: 'https://placehold.co/600x400/1A0050/ffffff?text=Familiar'
    },
    {
      titulo: 'Doble Superior',
      desc: 'Con mejores amenidades, cafetera Nespresso y minibar incluido.',
      precio: 100,
      img: 'https://placehold.co/600x400/5A2A83/ffffff?text=Doble+Superior'
    },
    {
      titulo: 'Familiar Plus',
      desc: 'Espacio adicional para familias numerosas con opciones de cama flexible.',
      precio: 130,
      img: 'https://placehold.co/600x400/3C0B6E/ffffff?text=Familiar+Plus'
    },
    {
      titulo: 'Suite Presidencial',
      desc: 'Lujo total: varias habitaciones, sala de estar y jacuzzi privado.',
      precio: 500,
      img: 'https://placehold.co/600x400/2A1A6A/ffffff?text=Presidencial'
    }
  ];

  // Lista de Servicios con sus iconos SVG
  servicios = [
    {
      titulo: 'Restaurante',
      desc: 'Experiencia culinaria excepcional con platos locales e internacionales.',
      icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z'
    },
    {
      titulo: 'Spa y Masajes',
      desc: 'Déjate consentir con masajes y tratamientos relajantes.',
      icon: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z'
    },
    {
      titulo: 'Parking',
      desc: 'Disfruta de la comodidad de nuestro estacionamiento seguro.',
      icon: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5v-1.875a3.375 3.375 0 003.375-3.375h1.5a1.125 1.125 0 011.125 1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375m17.25 4.5v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5c0-.621.504-1.125 1.125-1.125h1.125'
    },
    {
      titulo: 'Piscina',
      desc: 'Relájate en nuestra piscina interior climatizada.',
      icon: 'M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    {
      titulo: 'Wifi Rápido',
      desc: 'Mantente conectado en todo momento con alta velocidad.',
      icon: 'M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z'
    }
  ];
}