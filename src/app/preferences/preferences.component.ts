import { Component } from '@angular/core';
import { BusService } from '../services/services/bus.service';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent {
  aa: any[]= [];

  constructor(private busservice : BusService){}

  ngOnInit(){

    this.userPreferences();
    

  }


  userPreferences(){
    const a = localStorage.getItem("voyageur");
    this.busservice.getPreferences(a).subscribe(
      (data: any)=>{
        this.aa = data;
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
