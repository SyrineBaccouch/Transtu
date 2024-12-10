import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationServiceService {

  constructor(private httpClient: HttpClient) { }

  private URL = "http://192.168.28.128:8081/api";

  inscription(creds : any): Observable<any> {
    return this.httpClient.post(`${this.URL}/inscription`,creds);
  }

  login(creds : any): Observable<any> {
    return this.httpClient.post(`${this.URL}/connexion`,creds);
  } 

  recupMdp(creds : any): Observable<any>{
    return this.httpClient.post(`${this.URL}/recupMdp`,creds);
  }
  
  verifierCode(creds : any): Observable<any>{
    return this.httpClient.post(`${this.URL}/verifierCode`,creds);
  }

  modifMdp(creds : any, id : number): Observable<any>{
    return this.httpClient.put(`${this.URL}/modifierMdp/${id}`,creds);
  }

}
