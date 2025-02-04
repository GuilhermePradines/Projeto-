import { Component, OnInit } from '@angular/core';
import { ApplianceService } from '../../services/appliance.service';
import { Router } from '@angular/router'; // Importe o Router
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  appliances: any[] = [];
  electricityRate: number = 0.85;
  totalConsumption: number = 0; // Variável para o consumo total
  totalCost: number = 0; // Variável para o custo total

  constructor(
    private applianceService: ApplianceService,
    private router: Router // Injete o Router
  ) {}

  ngOnInit() {
    this.loadAppliances();
  }

  loadAppliances() {
    const token = localStorage.getItem('token');
    console.log('Token obtido:', token);

    if (!token) {
      console.error('Token não encontrado!');
      alert('Você precisa estar logado para visualizar os eletrodomésticos.');
      return;
    }

    // Cria os cabeçalhos com o token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Carrega os eletrodomésticos passando os cabeçalhos
    this.applianceService.getAppliances(headers).subscribe({
      next: (data) => {
        this.appliances = data;
        this.calculateTotal();
      },
      error: (err) => {
        console.error('Erro ao carregar eletrodomésticos', err);
        alert('Você não tem permissão para visualizar esta página.');
      },
    });
  }

  calculateTotal() {
    let totalEnergy = 0;
    let totalCost = 0;

    this.appliances.forEach(appliance => {
      // Calcula o consumo mensal em kWh de cada aparelho
      const consumption = appliance.power * appliance.hours_per_day * appliance.days_per_month / 1000;
      totalEnergy += consumption;

      // Calcula o custo mensal de cada aparelho
      totalCost += consumption * this.electricityRate;
    });

    this.totalConsumption = totalEnergy;
    this.totalCost = totalCost;
  }

  // Função para fazer logout
  logout() {
    localStorage.removeItem('token'); // Remove o token do localStorage
    this.router.navigate(['/login']); // Redireciona para a página de login
  }
}
