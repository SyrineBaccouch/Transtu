import { Component, OnInit } from '@angular/core';
import { BusService } from '../services/services/bus.service';  
import { Bus } from '../models/bus';
import * as L from 'leaflet';

import 'leaflet-routing-machine';

//import './Control.Coordinates';




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
  //private routingControl: L.Routing.Control | null = null;
  private routingControl: any;
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

  private map!: L.Map;
  stationsDeLaLigneSelectionnee: any[] = [];
  errorMessage2: string = "";
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
        this.tousLesStations = this.tousLesStations.sort((a, b) => a.nom.localeCompare(b.nom));
        console.log(this.tousLesStations);
      }
    )
    setTimeout(() => {
      this.initMap();
    }, 0);
    

  }

  ngAfterViewChecked() {
    // Invalidate map size after each change in the view
    if (this.map) {
      this.map.invalidateSize();
    }
  }

  initMap() {
    this.map = L.map('map').setView([36.766997, 10.248758], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    
/*
    var st1 = L.icon({
      iconUrl: '../../assets/station.png',
      iconSize:     [29.25, 32], // size of the icon
      iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
      popupAnchor:  [-3, -76]
  });
  L.marker([36.695764,10.388917], {icon: st1}).addTo(this.map);
  /*
  this.routingControl = (L as any).Routing.control({
    waypoints: [
      L.latLng(36.798811, 10.189407),
      L.latLng(36.767216, 10.269066)
    ],
    routeWhileDragging: true,
    addWaypoints: true,
    createMarker: () => null, // Disable markers
    lineOptions: {
      styles: [{ color: '#BA256B', opacity: 1, weight: 10 }]
    }
  }).addTo(this.map);
*/
  // Manually hide the itinerary panel if it still appears
  
    



  //this.map.on('click',this.onMapClick);

}

  onMapClick(e: any){
    alert(e.latlng);
    
  }

  

  Change($event: Event) : void {
    console.log(this.station2);
  }
   
  

  
  filteredStations(): any[] {
   // console.log(this.tousLesStations.filter(station => station.nom !== this.station1));
    return this.tousLesStations.filter(station => station.nom !== this.station1);
  }


  getBusByLigne(): void {
    //console.log(this.station)
    this.clearOtherData(); 
    if (this.ligne) {
      this.busService.getBusByLigne(this.ligne).subscribe(
        (data: Bus) => this.bus = data,
        error => this.handleError(error, 'bus')
      );
    } else {
      this.errorMessage2 = "Entrez une ligne.";
    }
    this.busService.getAllStationsCoordsOfLigne(this.ligne).subscribe(
      (data: any[]) => {
        
        const waypoints: L.LatLng[] = [];
        for (let i = 0; i < data.length; i += 2) {
          const stationName = data[i];
          const coords = data[i + 1];
          if (Array.isArray(coords) && coords.length === 2) {
            const latLng = L.latLng(coords[0], coords[1]);
            waypoints.push(latLng);
            L.marker(latLng)
              .addTo(this.map)
              .bindPopup(stationName)
              .openPopup();
          }
        }
        
        this.routingControl = (L as any).Routing.control({
          waypoints: waypoints,
          routeWhileDragging: true,
          addWaypoints: true,
          createMarker: () => null, 
          lineOptions: {
            styles: [{ color: '#b600ff', opacity: 1, weight: 10 }]
          }
        }).addTo(this.map);
        const routingContainer = document.querySelector('.leaflet-routing-container');
        if (routingContainer) {
          routingContainer.setAttribute('style', 'display: none !important');
        }
      },
      (error) => {
        console.error("Error fetching coordinates:", error);
      }
    );
  }

  getHorairesVersBanlieue(): void {
    this.clearOtherData(); 
    if (this.ligne) {
      this.busService.listeHorairesByLigneVersBanlieue(this.ligne).subscribe(
        (data: any) => this.horairesVB = data,
        error => this.handleError(error, 'horaires vers banlieue')
      );
    } else {
      this.errorMessage2 = 'Entrez une ligne.';
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
      this.errorMessage2 = 'Entrez une ligne.';
    }
  }

  getHorairesStationVersBanlieue(): void {
    this.clearOtherData(); 
    if (this.ligne && this.station) {
      //alert(this.ligne +" "+ this.station)
      this.busService.listeHorairesStationVersBanlieue(this.ligne, this.station).subscribe(
        (data: any) => this.horairesSVB = data,
        error => this.handleError(error, 'horaires de station au banlieue')
      );
    } else {
      this.errorMessage2 = ('Entrez une ligne et une station, les deux');
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
      this.errorMessage2 = ('Entrez une ligne et une station, les deux');
    }
  }

  getStationToStationTimesVS(): void {
    this.clearOtherData();
    if (this.station1 && this.station2) {
      this.busService.getStationToStationTimesVS(this.station1, this.station2).subscribe(
        (data: any) => {
          //console.log(data);  
          this.stationSchedule = data;
          //console.log(this.stationSchedule)
          this.stationVersStationMapped(this.stationSchedule.Nom_Bus);
          
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
          //console.log(data);  
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
    this.errorMessage2 = "";
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
    this.clearExistingMarkersAndRoute();
    this.busService.getStationsByLigne(this.ligne).subscribe(
      (data : StationSchedule[])=> {
        this.stationsDeLaLigneSelectionnee = data;
        this.stationsDeLaLigneSelectionnee = this.stationsDeLaLigneSelectionnee.sort((a, b) => a.nom.localeCompare(b.nom));

    // Log the sorted array
    console.log(this.stationsDeLaLigneSelectionnee);
      }
    );
    this.busService.getAllStationsCoordsOfLigne(this.ligne).subscribe(
      (data: any[]) => {
        
        const waypoints: L.LatLng[] = [];
        for (let i = 0; i < data.length; i += 2) {
          const stationName = data[i];
          const coords = data[i + 1];
          if (Array.isArray(coords) && coords.length === 2) {
            const latLng = L.latLng(coords[0], coords[1]);
            waypoints.push(latLng);
            L.marker(latLng)
              .addTo(this.map)
              .bindPopup(stationName)
              .openPopup();
          }
        }
        
        this.routingControl = (L as any).Routing.control({
          waypoints: waypoints,
          routeWhileDragging: true,
          addWaypoints: true,
          createMarker: () => null, 
          lineOptions: {
            styles: [{ color: '#b600ff', opacity: 1, weight: 10 }]
          }
        }).addTo(this.map);
        const routingContainer = document.querySelector('.leaflet-routing-container');
        if (routingContainer) {
          routingContainer.setAttribute('style', 'display: none !important');
        }
      },
      (error) => {
        console.error("Error fetching coordinates:", error);
      }
    );
  }


  stationVersStationMapped(ligne : string): void {
    this.clearExistingMarkersAndRoute();

    this.busService.getAllStationsCoordsOfLigne(ligne).subscribe(
      (data: any[]) => {
        const allWaypoints: L.LatLng[] = [];
        const markers: L.Marker[] = [];
  
        const stationsToKeep = [this.station1, this.station2];

        for (let i = 0; i < data.length; i += 2) {
          const stationName = data[i];
          const coords = data[i + 1];
  
          // Ensure coordinates are in the correct format (an array of [latitude, longitude])
          if (Array.isArray(coords) && coords.length === 2) {
            const latLng = L.latLng(coords[0], coords[1]);
  
            // If the station is in the stationsToKeep array, add it to the waypoints and markers
            if (stationsToKeep.includes(stationName)) {
              allWaypoints.push(latLng);
  
              // Create a marker for the station
              const marker = L.marker(latLng)
                .addTo(this.map)
                .bindPopup(stationName); // Display station name on click
              markers.push(marker);
            }
          } else {
            console.warn(`Invalid coordinates for ${stationName}:`, coords);
          }
        }
        
        // Initialize the routing control with the visible waypoints
        this.routingControl = (L as any).Routing.control({
          waypoints: allWaypoints,
          routeWhileDragging: true,
          addWaypoints: true,
          createMarker: () => null, // Disable default routing markers (optional)
          lineOptions: {
            styles: [{ color: '#BA256B', opacity: 1, weight: 10 }] // Styling the route line
          }
        }).addTo(this.map);
      },
      (error) => {
        console.error("Error fetching coordinates:", error);
      }
    );
  }




  clearExistingMarkersAndRoute(): void {
    // Remove all existing markers (if any)
    this.map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) {
        this.map.removeLayer(layer);
      }
    });
  
    // Clear the existing waypoints (if routing control exists)
    if (this.routingControl) {
      this.routingControl.setWaypoints([]);
    }
  }



}
