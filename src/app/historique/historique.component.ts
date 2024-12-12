import { Component } from '@angular/core';
import { BusService } from '../services/services/bus.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-historique',
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.css']
})
export class HistoriqueComponent {

  private routingControl: any;
  data : any[]= [];
  expandedIndex: number | null = null;
  private map!: L.Map;
  ligne: any;
  station: any;
  lat: any;
  lng: any;

  constructor(private busService : BusService){
    this.busService.getHistorique().subscribe(
      (data : any[])=>{
        this.data = (data);
        console.log(data);
      }
    )
    
  }
  
  initMap(lat:number, lng:number,stationName: string) {
    
    this.map = L.map('map', {
      center: [lat, lng],
      zoom: 16,
      //  dragging: false,
    });
   
    L.marker([lat, lng]).bindPopup(stationName).addTo(this.map).openPopup();
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(this.map);
  
  }
  
  voirStation() {
    this.clearExistingMarkersAndRoute();
    L.marker([this.lat, this.lng]).bindPopup(this.station).addTo(this.map).openPopup();
  }

  toggleRow(index: number): void {
    this.ligne = this.data[index].ligne;
    this.station = this.data[index].station;
    this.expandedIndex = this.expandedIndex === index ? null : index;
    this.busService.getStationCoords(this.data[index].station).subscribe(
      (data)=>{
        this.lat =  data[0]
        this.lng =  data[1]
        setTimeout(() => {
          this.initMap(data[0],data[1],this.data[index].station);
        }, 0);
      }
    )
    
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

  trajetLigne(){
  this.clearExistingMarkersAndRoute()
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
            const routingContainer = document.querySelectorAll('.leaflet-routing-container');
            
            if (routingContainer) {
              routingContainer.forEach((elem) =>{
                elem.setAttribute('style', 'display: none !important')
              })            }
          },
          (error) => {
            console.error("Error fetching coordinates:", error);
          }
        );
  }

}
