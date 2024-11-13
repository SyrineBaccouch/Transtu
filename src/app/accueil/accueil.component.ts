import { Component, OnInit } from '@angular/core';
import { BusService } from '../services/services/bus.service';  
import { Bus } from '../models/bus';

interface StationSchedule {
  TempsArriveeADestination: string;
  NomBus: string;
  TempsArrivee: string;
}

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {


  ligne: string = '';  
  station: string = ''; 
  station1: string = '';  
  station2: string = '';  
  bus: Bus | null = null; 
  horairesVB: any = null; 
  horairesVS: any = null; 
  horairesSVB: any = null;
  horairesSVS: any = null; 
  stationSchedule : any ;  

  tousLesStations : any [] = [];
  tousLesStations2 : any[] = [] ;
  tousLesLignes : string [] = [];
  errorMessage: string = "";

  constructor(private busService: BusService) {}

  ngOnInit(): void {
    
    this.busService.getAllLignesNames().subscribe(
      (data : string[]) =>{
        this.tousLesLignes = data;
        //console.log(this.tousLesLignes);
      }
    )

    this.busService.getAllStations().subscribe(
      ( data : StationSchedule[] ) =>{
        this.tousLesStations = data;
        console.log(this.tousLesStations);
      }
    )

  }

  Change($event: Event) : void {
    console.log(this.station2);
  }
   
  

  
  filteredStations(): any[] {
    console.log(this.tousLesStations.filter(station => station.nom !== this.station1));
    return this.tousLesStations.filter(station => station.nom !== this.station1);
  }


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
        error => this.handleError(error, 'horaires de station au banlieue')
      );
    } else {
      alert('Entrez une ligne et une station, les deux');
    }
  }

  getHorairesStationVersStation(): void {
    this.clearOtherData(); 
    if (this.ligne && this.station) {
      this.busService.listeHorairesStationVersStation(this.ligne, this.station).subscribe(
        (data: any) => this.horairesSVS = data,
        error => this.handleError(error, 'horaires de station à une station')
      );
    } else {
      alert('Entrez une ligne et une station, les deux');
    }
  }

  getStationToStationTimesVS(): void {
    this.clearOtherData();
    if (this.station1 && this.station2) {
      this.busService.getStationToStationTimesVS(this.station1, this.station2).subscribe(
        (data: any) => {
          console.log(data);  
          this.stationSchedule = data;
          console.log(this.stationSchedule)
        },
        error => this.handleError(error, 'station à station (Vers Station)')
      );
    } else {
      this.errorMessage = "Veuillez choisir 2 stations"
    }
  }

  getStationToStationTimesVB(): void {
    this.clearOtherData();
    if (this.station1 && this.station2) {
      this.busService.getStationToStationTimesVB(this.station1, this.station2).subscribe(
        (data: StationSchedule) => {
          console.log(data);  
          this.stationSchedule = data;
        },
        error => this.handleError(error, 'station à station (Vers Banlieue)')
      );
    } else {
      this.errorMessage = "Veuillez choisir 2 stations"
    }
  }

  private clearOtherData(): void {
    this.errorMessage = "";
    this.bus = null;
    this.horairesVB = null;
    this.horairesVS = null;
    this.horairesSVB = null;
    this.horairesSVS = null;
    this.stationSchedule != null
  }

  private handleError(error: any, context: string): void {
    console.error(`Error fetching ${context}:`, error);
    if (error.status === 404) {
      alert(`${context.charAt(0).toUpperCase() + context.slice(1)} `);
    } else if (error.status === 500) {
      this.errorMessage = "il n'y a pas de trajet direct pour ses deux station :("
    } else {
      alert(`Fail ${context}`);
    }
  }

  formatJson(data: any): string {
    return JSON.stringify(data, null, 2);  
  }

  onLigneChange(event: Event): void {
    this.busService.getStationsByLigne(this.ligne).subscribe(
      (data : StationSchedule[])=> {
        this.stationSchedule = data;
        console.log(this.stationSchedule);
      }
    )
  }
}
