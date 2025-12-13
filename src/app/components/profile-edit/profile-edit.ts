// src/app/components/profile/profile-edit/profile-edit.ts

import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Asegúrate de que UserProfile esté definido en tu archivo de interfaces
import { UserProfile } from '../../models/interfaces';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-edit.html',
  styleUrl: '../profile/profile.css' // Usamos la misma hoja de estilos del padre
})
export class ProfileEditComponent implements OnInit {

  // Propiedades de entrada (recibidas del componente padre)
  @Input() perfilActual: UserProfile | null = null;
  @Input() guardandoPerfil: boolean = false;
  @Input() mensaje: string = '';

  // Eventos de salida (para comunicarse con el componente padre)
  @Output() saveChanges = new EventEmitter<{ nombres: string, apellidos: string, correo: string, telefono: string }>();
  @Output() cancelEdit = new EventEmitter<void>();

  // Propiedades locales para el two-way binding del formulario
  nombreEdit: string = '';
  apellidoEdit: string = '';
  correoEdit: string = '';
  telefonoEdit: string = '';

  ngOnInit() {
    this.inicializarCampos();
  }

  // Inicializa las variables locales con los datos que llegaron por @Input
  inicializarCampos() {
    if (this.perfilActual) {
      this.nombreEdit = this.perfilActual.nombres;
      this.apellidoEdit = this.perfilActual.apellidos;
      this.correoEdit = this.perfilActual.correo;
      this.telefonoEdit = this.perfilActual.telefono;
    }
  }

  // Llama al evento de salida para que el padre guarde los datos
  onSubmit() {
    // Validaciones básicas (se pueden mejorar)
    if (this.nombreEdit && this.apellidoEdit && this.correoEdit && this.telefonoEdit) {
      this.saveChanges.emit({
        nombres: this.nombreEdit,
        apellidos: this.apellidoEdit,
        correo: this.correoEdit,
        telefono: this.telefonoEdit,
      });
    }
  }

  // Llama al evento de salida para que el padre cancele el modo edición
  onCancel() {
    this.cancelEdit.emit();
  }
}