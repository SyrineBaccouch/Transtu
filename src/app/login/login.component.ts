import { Component } from '@angular/core';
import { AuthentificationServiceService } from '../services/services/authentification-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;


  test : Boolean = true;


  constructor( private authService : AuthentificationServiceService, private fb: FormBuilder , private route : Router){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      mdp: ['', [Validators.required, Validators.minLength(60)]],
    });
  }


  login(){
    if(this.test == true){

      const req = (this.loginForm.value);
      console.log(req)
      this.authService.login(req).subscribe(
        (data : any) =>{
          console.log(data);
          localStorage.setItem("voyageur",data);
          this.route.navigateByUrl('/accueil'); 
        },
        (error)=>{
          console.log(error);
        }
      )
    }
    
  }


}
