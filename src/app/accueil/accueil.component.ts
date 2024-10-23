import { Component, OnInit } from '@angular/core';
import { BusService } from '../services/services/bus.service';  
import { Bus } from '../models/bus';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {

  ligne: string = '';  
  station: string = ''; 
  bus: Bus | null = null; 
  horairesVB: any = null; 
  horairesVS: any = null; 
  horairesSVB: any = null;
  horairesSVS: any = null; 

  constructor(private busService: BusService) {}

  ngOnInit(): void {}

  getBusByLigne(): void {
    this.clearOtherData(); 
    if (this.ligne) {
      this.busService.getBusByLigne(this.ligne).subscribe(
        (data: Bus) => this.bus = data,
        error => this.handleError(error, 'bus')
      );
    } else {
      alert('Entrez un ligne.');
    }
  }

  getHorairesVersBanlieue(): void {
    this.clearOtherData(); 
    if (this.ligne) {
      this.busService.listeHorairesByLigneVersBanlieue(this.ligne).subscribe(
        (data: any) => this.horairesVB = data,
        error => this.handleError(error, 'horaires vers banlieue')
      );
    } else {
      alert('Entrez une ligne.');
    }
  }

  getHorairesVersStation(): void {
    this.clearOtherData(); 
    if (this.ligne) {
      this.busService.listeHorairesByLigneVersStation(this.ligne).subscribe(
        (data: any) => this.horairesVS = data,
        error => this.handleError(error, 'horaires vers station')
      );
    } else {
      alert('Entrez une ligne.');
    }
  }

  getHorairesStationVersBanlieue(): void {
    this.clearOtherData(); 
    if (this.ligne && this.station) {
      this.busService.listeHorairesStationVersBanlieue(this.ligne, this.station).subscribe(
        (data: any) => this.horairesSVB = data,
        error => this.handleError(error, 'horaires from station to banlieue')
      );
    } else {
      alert('Entrez une ligne et une station, les deux');
    }
  }

  getHorairesStationVersStation(): void {
    this.clearOtherData(); // Clear other data
    if (this.ligne && this.station) {
      this.busService.listeHorairesStationVersStation(this.ligne, this.station).subscribe(
        (data: any) => this.horairesSVS = data,
        error => this.handleError(error, 'horaires from station to station')
      );
    } else {
      alert('Entrez une ligne et une station, les deux');
    }
  }

  private clearOtherData(): void {
    this.bus = null;
    this.horairesVB = null;
    this.horairesVS = null;
    this.horairesSVB = null;
    this.horairesSVS = null;
  }

  private handleError(error: any, context: string): void {
    console.error(`Error fetching ${context}:`, error);
    if (error.status === 404) {
      alert(`${context.charAt(0).toUpperCase() + context.slice(1)} not found.`);
    } else if (error.status === 500) {
      alert('Server error. Please try again later.');
    } else {
      alert(`Failed to fetch ${context}. Please check your server connection.`);
    }
  }

  formatJson(data: any): string {
    return JSON.stringify(data, null, 2);  
  }
}
