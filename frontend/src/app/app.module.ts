import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';

@NgModule({
  declarations: [
    AppComponent
    // Outros componentes
  ],
  imports: [
    BrowserModule,
    HttpClient
    // Outros módulos
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
