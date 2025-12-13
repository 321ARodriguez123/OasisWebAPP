/*import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('hotel-oasis-frontend');
}
*/

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
//import { Navbar } from './components/navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  //imports: [RouterOutlet, Navbar],
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class AppComponent {
  title = 'hotel-oasis';
}