import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { ApplianceService } from '../../services/appliance.service';
import { Appliance } from '../../services/appliance.service';

@Component({
  selector: 'app-edit-appliance',
  templateUrl: './edit-appliance.component.html',
  styleUrls: ['./edit-appliance.component.css']
})
export class EditApplianceComponent implements OnInit {
  appliance: Appliance = { name: '', power: 0, hours_per_day: 0, days_per_month: 0 };
  applianceId!: number;

  constructor(
    private applianceService: ApplianceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.applianceId = +this.route.snapshot.paramMap.get('id')!;
    this.loadAppliance();
  }

  loadAppliance() {
    const headers = new HttpHeaders();
    this.applianceService.getAppliances(headers).subscribe((appliances) => {
      this.appliance = appliances.find((appl) => appl.id === this.applianceId)!;
    });
  }

  save() {
    this.applianceService.updateAppliance(this.applianceId, this.appliance).subscribe({
      next: () => {
        alert('Eletrodoméstico atualizado com sucesso.');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Erro ao atualizar eletrodoméstico', err);
        alert('Erro ao atualizar o eletrodoméstico.');
      },
    });
  }
}
