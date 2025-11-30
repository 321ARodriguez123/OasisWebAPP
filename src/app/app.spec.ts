/*import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, hotel-oasis-frontend');
  });
});
*/


import { TestBed } from '@angular/core/testing';
// Importamos la función para configurar el router en el entorno de pruebas
import { provideRouter } from '@angular/router'; 
// Asumimos que tu componente principal se llama AppComponent
import { AppComponent } from './app'; 

// Cambiamos el nombre de la suite de pruebas a AppComponent
describe('AppComponent', () => { 
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Importamos el componente
      imports: [
        AppComponent,
      ],
      // FIX: Usamos provideRouter([]) en 'providers' para simular el router, 
      // lo cual elimina la advertencia de 'RouterTestingModule' y evita el error de la exportación.
      providers: [
        provideRouter([]), 
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    // Creamos el componente AppComponent
    const fixture = TestBed.createComponent(AppComponent); 
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    // Creamos el componente AppComponent
    const fixture = TestBed.createComponent(AppComponent); 
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    // Asegúrate de que el contenido del título sea exacto
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, hotel-oasis-frontend');
  });
});