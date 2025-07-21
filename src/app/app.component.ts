import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'GerenadorCLaves';

  mayus = true;
  min = true;
  simbolos = true;
  nums = true;
  longitud: number = 16;
  claveGenerada: string = '';
  nivelSeguridad: string = '';

  ngOnInit(): void {
    this.generarClave();
    this.nivelSeguridad = this.evaluarSeguridad(this.claveGenerada);
  }
  generarClave(): void {
    let caracteres = '';
    if (this.mayus) caracteres += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (this.min) caracteres += 'abcdefghijklmnopqrstuvwxyz';
    if (this.nums) caracteres += '0123456789';
    if (this.simbolos) caracteres += '!@#$%^&*()';

    if (caracteres.length === 0) {
      caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    }

    let clave = '';
    for (let i = 0; i < this.longitud; i++) {
      const index = Math.floor(Math.random() * caracteres.length);
      clave += caracteres[index];
    }

    this.claveGenerada = clave;
    this.nivelSeguridad = this.evaluarSeguridad(this.claveGenerada);
  }

  mostrarToast = false;

  copiarClave() {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = this.claveGenerada;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);

      this.mostrarToast = true;
      setTimeout(() => {
        this.mostrarToast = false;
      }, 3000);
    } catch (err) {
      console.error('Error al copiar', err);
    }
  }

  evaluarSeguridad(password: string): string {
    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;

    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (/(.)\1{2,}/.test(password)) score = Math.max(score - 1, 0);

    if (score <= 2) return 'debil';
    if (score <= 4) return 'media';
    if (score <= 5) return 'fuerte';
    return 'muy-fuerte';

  }

}