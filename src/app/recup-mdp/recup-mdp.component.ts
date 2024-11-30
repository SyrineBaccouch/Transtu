import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthentificationServiceService } from '../services/services/authentification-service.service';

@Component({
  selector: 'app-recup-mdp',
  templateUrl: './recup-mdp.component.html',
  styleUrls: ['./recup-mdp.component.css']
})
export class RecupMdpComponent {

  mdp: any;

  envoyee: boolean = false;
  message: string = '';
  id: any;
  confirme: boolean = false;
  modifie: boolean = false;

  constructor(private authService : AuthentificationServiceService ,private fb: FormBuilder){}
  isVisible = false; 
  
  email: string = '';
  code  : string = '';


  open() {
    this.isVisible = true;
  }

  close() {
    this.isVisible = false;
  }

  submit() {
    if ( this.envoyee == false){
      const email = this.email
    
    this.authService.recupMdp({"email":email}).subscribe(
      (data)=>{
        this.message = "Code envoye"
        this.envoyee= true;
      },
      (error)=>{
        console.log(error);
      }
    )
  }else{
    console.log({[this.email]: this.code})
    this.authService.verifierCode({[this.email]: this.code}).subscribe(
      (data)=>{
        console.log(data)
        this.message = "Veuillez saisir votre nouveau mdp"
        this.envoyee= false;
        this.confirme = true;
        this.id = data;
      },
      (error)=>{
        console.log(21121133313331331331312);
        console.log(error);
      }
    )
  }
  }

  modifierMdp() {
    
    this.authService.modifMdp(this.mdp,this.id).subscribe(
      (data)=>{
        console.log(data);
        this.message = "Votre mdp est modifier avec succés, Vous pouvez fermer cette fenetre";
        this.modifie=true;
      },
      (error)=>{
        console.error(error)
      }
    )
  }

}
