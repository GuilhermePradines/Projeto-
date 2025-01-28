import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';  // Importando o RouterOutlet

@Component({
  selector: 'app-root',
  standalone: true,  // Tornando o componente standalone
  imports: [RouterOutlet],  // Importando o RouterOutlet para o componente standalone
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']  // Corrigido para styleUrls
})


export class AppComponent {
  title = 'frontend';
}
