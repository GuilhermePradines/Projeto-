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
  electricityRate: number = 0.91;
  totalConsumption: number = 0;
  totalCost: number = 0;

  constructor(
    private applianceService: ApplianceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadAppliances();
  }

  loadAppliances() {
    const token = localStorage.getItem('token');
    

    if (!token) {
      console.error('Token não encontrado!');
      alert('Você precisa estar logado para visualizar os eletrodomésticos.');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
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

    this.appliances.forEach((appliance) => {
      const consumption =
        (appliance.power * appliance.hours_per_day * appliance.days_per_month) /
        1000;
      totalEnergy += consumption;
      totalCost += consumption * this.electricityRate;
    });

    this.totalConsumption = totalEnergy;
    this.totalCost = totalCost;
  }

  // Função para excluir um eletrodoméstico
  deleteAppliance(id: number) {
    if (confirm('Tem certeza de que deseja excluir este eletrodoméstico?')) {
      this.applianceService.deleteAppliance(id).subscribe({
        next: () => {
          alert('Eletrodoméstico excluído com sucesso.');
          this.loadAppliances(); // Recarrega a lista após exclusão
        },
        error: (err) => {
          console.error('Erro ao excluir eletrodoméstico', err);
          alert('Erro ao excluir o eletrodoméstico.');
        },
      });
    }
  }

  // Função para editar um eletrodoméstico
  editAppliance(id: number) {
    this.router.navigate(['/edit-appliance', id]); // Redireciona para a página de edição
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
