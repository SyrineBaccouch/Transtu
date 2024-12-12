import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusService } from '../services/services/bus.service';
import { ActivatedRoute, Router } from '@angular/router';

interface StationSchedule {
  TempsArriveeADestination: string;
  NomBus: string;
  TempsArrivee: string;
}

@Component({
  selector: 'app-bus-form',
  templateUrl: './bus-form.component.html',
  styleUrls: ['./bus-form.component.css']
})

export class BusFormComponent {


  busForm: FormGroup;
  tousLesLignes: string[] = [];
  
  stationsDeLaLigneSelectionnee: any[] = [];
  
  horaires: any = ["Sélectionner un horaire"];
  

  constructor(private route : Router,private fb: FormBuilder, private busService : BusService) {
    this.busForm = this.fb.group({
      ligne: ['', Validators.required],
      station: ['', Validators.required],
      horaire: ['', Validators.required],
      direction: ['', Validators.required]
    });
  }

  ngOnInit(){
    this.busService.getAllLignesNames().subscribe(
      (data : string[]) =>{
        this.tousLesLignes = data;
        console.log(this.tousLesLignes);
      },
      (error) =>{
        alert("error")
      })
  }


  onLigneChange(event : Event): void {
    const ligne = (this.busForm.get("ligne")?.value)
    this.busService.getStationsByLigne(ligne).subscribe(
      (data : StationSchedule[])=> {
        this.stationsDeLaLigneSelectionnee = data;
        this.stationsDeLaLigneSelectionnee = this.stationsDeLaLigneSelectionnee.sort((a, b) => a.nom.localeCompare(b.nom));
      }
    );
  }


  onPick(event: Event): void{
    
    const ligne = (this.busForm.get("ligne")?.value)
    const station = (this.busForm.get("station")?.value)
    const direction = (this.busForm.get("direction")?.value)
    if (direction == "tempsvs"){
      this.busService.listeHorairesStationVersBanlieue(ligne,station).subscribe(
        (data : any[])=>{
          data.push("tous les horaires")
          this.horaires = data;
          console.log(data);
        },
        (error)=>{
          alert("error")
        }
      )
    }
    if ( direction == "tempsvb"){
      this.busService.listeHorairesStationVersStation(ligne,station).subscribe(
        (data)=>{
          data.push("tous les horaires")
          this.horaires = data;
        },
        (error)=>{
          alert("error")
        }
      )
    }
  }


  onSubmit() {
    if (this.busForm.valid) {
      this.enregistrerPreference();
      this.route.navigateByUrl("/preferences")
    }
  }


  onStationChange($event: Event) {
    this.busForm.get("direction")?.setValue(null); // Use `null` if resetting selection
    this.busForm.get("horaire")?.setValue(null);
    this.horaires = ["Sélectionner un horaire"];
  }



  enregistrerPreference() {
    const ligne = (this.busForm.get("ligne")?.value)
    const station = (this.busForm.get("station")?.value)
    const direction = (this.busForm.get("direction")?.value)
    let horaire = (this.busForm.get("horaire")?.value)
    const c = confirm("Voulez vous vraiement ajouter la station "+ station + " du bus "+ ligne + " a vos preferences? Vous recevrez des emails 10minutes avant chaque arrivé du bus")
    if (c){
      const voyId = localStorage.getItem("voyageur");

      if (horaire == "tous les horaires"){
          horaire = "00:00:00";
      }

      const pref = {
        "busFavoris": ligne,
        "stationFavorite":station,
        "direction": direction,
        "horaire": horaire
      }

    console.log(pref);
    if ( voyId){
      this.busService.enregistrerPreference(voyId as unknown as number ,pref).subscribe(
        (data : boolean)=>{
            if (data){
              alert("Cbon")
              //this.errorMessage = "preferences mise a jour!"
            }else{
              alert("azeazeaz")
            }
        },
        (error)=>{
          console.log(error);
        }
    );
    }
  }
  }
}

