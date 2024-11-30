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
  errorMessage: any;
  isError: any;
  emailMessage: string ='';
  mdpMessage: string ='';
  isErrorEmail: any;
  isErrorMdp: any;


  constructor( private authService : AuthentificationServiceService, private fb: FormBuilder , private route : Router){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      mdp: ['', [Validators.required, Validators.minLength(6)]],
    });
  }



  onSubmit(){
    this.resetMessages();
    if (this.isFormPopulated()){
      this.showErrorMessages();
    }else{
      this.login();
    } 
  }

  login(){
    const req = (this.loginForm.value);
      this.authService.login(req).subscribe(
        (data : any) =>{
          localStorage.setItem("voyageur",data);
          this.route.navigateByUrl('/accueil'); 
          this.isError = false;
        },
        (error)=>{
          this.errorMessage = 'User not found. Please check your email or password.';
          this.isError = true;
        }
      )
  }

  isFormPopulated(): boolean {
    const email = this.loginForm.get('email')?.value?.trim();
    const mdp = this.loginForm.get('mdp')?.value?.trim();
    return !email || !mdp;
  }

  showErrorMessages(){
    if (this.loginForm.get('email')?.invalid ) {
      this.emailMessage = 'Verifier votre email. ';
      this.isErrorEmail = true;
    }
    if (this.loginForm.get('mdp')?.invalid ) {
      
      this.mdpMessage = 'Verifier votre mot de passe. ';
      this.isErrorMdp = true;
    }
    if (this.loginForm.get('email') == null && this.loginForm.get('mdp') ){
      this.isError = true;
      this.errorMessage = 'Veuillez saisir vos données';
    }
  }

  resetMessages(){
    this.errorMessage = '';
    this.emailMessage = '';
    this.mdpMessage = '';

    this.isError = false;
    this.isErrorEmail = false;
    this.isErrorMdp = false;
  }

}