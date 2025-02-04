import { Component } from '@angular/core';
import { ApplianceService } from '../../services/appliance.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-appliance',
  standalone: true,
  imports: [FormsModule, RouterModule,CommonModule],
  templateUrl: './add-appliance.component.html',
  styleUrls: ['./add-appliance.component.css']
})
export class AddApplianceComponent {
  name = '';
  power = 0;
  hours_per_day = 0;
  days_per_month = 0;




  
  constructor(private applianceService: ApplianceService, private router: Router) {}

  addAppliance() {
    const newAppliance = {
      name: this.name,
      power: this.power,
      hours_per_day: this.hours_per_day,
      days_per_month: this.days_per_month
    };

    this.applianceService.addAppliance(newAppliance).subscribe({
      next: () => {
        alert('Eletrodoméstico adicionado com sucesso!');
        this.router.navigate(['/home']);  // Redireciona para a página Home
      },
      error: (err) => alert('Erro ao adicionar o eletrodoméstico: ' + err)
    });
  }
}

