import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bus } from '../../models/bus';  

@Injectable({
  providedIn: 'root'
})
export class BusService {

  private URL = "http://localhost:8081/api";

  constructor(private httpClient: HttpClient) { }


  getAllBuses(): Observable<Bus[]> {
    return this.httpClient.get<Bus[]>(`${this.URL}/getAll`);
  }

  getBusByLigne(ligne: string): Observable<Bus> {
    return this.httpClient.get<Bus>(`${this.URL}/getBusByLigne/${ligne}`);
  }

  listeHorairesByLigneVersBanlieue(ligne: string): Observable<any> {
    return this.httpClient.get<any>(`${this.URL}/lhvb/${ligne}`);
  }

  listeHorairesByLigneVersStation(ligne: string): Observable<any> {
    return this.httpClient.get<any>(`${this.URL}/lhvs/${ligne}`);
  }

  listeHorairesStationVersBanlieue(ligne: string, station: string): Observable<any> {
    return this.httpClient.get<any>(`${this.URL}/lhsvb/${ligne}/${station}`);
  }

  listeHorairesStationVersStation(ligne: string, station: string): Observable<any> {
    return this.httpClient.get<any>(`${this.URL}/lhsvs/${ligne}/${station}`);
  }

  getStationToStationTimesVS(st1: string, st2: string): Observable<any> {
    const s1 = encodeURIComponent(st1);
    const s2 = encodeURIComponent(st2);
    return this.httpClient.get<any>(`${this.URL}/stationVersStation_VS/${s1}/${s2}`);
  }

  getStationToStationTimesVB(st1: string, st2: string): Observable<any> {
    const s1 = encodeURIComponent(st1);
    const s2 = encodeURIComponent(st2);
    return this.httpClient.get<any>(`${this.URL}/stationVersStation_VB/${s1}/${s2}`);
  }
  
  getAllLignesNames(){
    return this.httpClient.get<any>(`${this.URL}/getLignes`);
  }
  
  getStationsByLigne(ligne : string){
    return this.httpClient.get<any>(`${this.URL}/getStationOf/${ligne}`);
  }
  
  getAllStations(){
    return this.httpClient.get<any>(`${this.URL}/getAllStations`);
  }
}