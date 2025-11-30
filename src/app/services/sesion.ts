// src/app/services/sesion.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Sesion { // <--- CLASE CORREGIDA A 'Sesion'
  
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();
  
  private loggedInUserId: number | null = null; 
  
  constructor() { }

  loginSimulado(userId: number) {
    this.loggedInUserId = userId;
    this.isLoggedInSubject.next(true); 
  }

  logout() {
    this.loggedInUserId = null;
    this.isLoggedInSubject.next(false); 
  }
  
  getUserId(): number | null {
    return this.loggedInUserId;
  }
}