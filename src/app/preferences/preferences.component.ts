import { Component } from '@angular/core';
import { BusService } from '../services/services/bus.service';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent {
  aa: any[]= [];

  noUser: boolean = true;

  constructor(private busservice : BusService){}

  ngOnInit(){

    if (localStorage.getItem("voyageur")!=null){
      this.noUser= false;
      this.userPreferences();
    }
    

  }


  userPreferences(){
    const a = localStorage.getItem("voyageur");
    this.busservice.getPreferences(a).subscribe(
      (data: any)=>{
        this.aa = data.map((favorite: { horaire: string; }) => ({
          ...favorite,
          horaire: favorite.horaire === "00:00:00" ? "Tous les horaires" : favorite.horaire
        }));
        this.aa = data.map((favorite: { direction: string; }) => ({
          ...favorite,
          direction: favorite.direction === "tempsvs" ? "Vers Station" :
                     favorite.direction === "tempsvb" ? "Vers Banlieue" :
                     favorite.direction
        }));
        
        console.log(data);
      },
      (error)=>{
        console.log(error);
      }
    )
  }


  supprimerPreference(id : any){
    const c = confirm("Voulez vous vraiment supprimer?")
    if (c){
      this.busservice.supprimerPreference(id).subscribe(
        (data : any)=>{
          
          this.userPreferences();
        },
        (error)=>{
          alert("Une erreur est servenu");
        }
      )
    }
  }



}
