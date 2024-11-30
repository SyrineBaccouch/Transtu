import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthentificationServiceService } from '../services/services/authentification-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  
  registerForm: FormGroup;

  errorMessage : string = '';
  nomMessage: string = '';
  emailMessage: string = '';
  mdpMessage: string = '';
  mdpMessage2: string ='';


  constructor(private authService : AuthentificationServiceService, private fb: FormBuilder, private route : Router) {
    this.registerForm = this.fb.group({
      nomprenom: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      mdp: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    
    });
  }

  resetMessages(){
    this.emailMessage= '';
    this.errorMessage= '';
    this.mdpMessage= '';
    this.mdpMessage2= '';
    this.nomMessage = '';
    
  }

  onSubmit() {

    const formData = this.registerForm.value;
    this.resetMessages();

    if (this.registerForm.invalid) {
  
      if (this.registerForm.get('nomprenom')?.invalid ) {
        this.nomMessage = 'Verifier votre nom. ';
      }
      
      if (this.registerForm.get('email')?.invalid) {
        this.emailMessage = 'Verifier votre email. ';
      }
  
      if (this.registerForm.get('mdp')?.invalid) {
        this.mdpMessage = 'Votre mot de passe doit etre au minimum 6 characteres. ';
      }

      if (this.registerForm.get('confirmPassword')?.invalid) {
        this.mdpMessage2 = 'Veuillez verifier votre mot de passe';
      }
  
      return; 
    }

  
    if (formData.mdp !== formData.confirmPassword) {
      this.mdpMessage += 'Verifier votre mot de passe'
      return;
    }

    delete formData.confirmPassword;

    this.authService.inscription(formData).subscribe(
      (data: boolean)=>{
        if (data == false){
          this.errorMessage = "Cet email est deja inscri, vous avez deja un compte?";
        }
        if (data == true){
          this.errorMessage = "Compte crée avec succés";
          this.route.navigateByUrl('/login');
        }
      },
      (error)=>{
        this.errorMessage = "Une erreur est servenu veuillez ressayer plus tard."
      }
    )
  }
  
  
}
