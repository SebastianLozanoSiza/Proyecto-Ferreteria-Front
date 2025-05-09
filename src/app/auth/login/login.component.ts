import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/app/interfaces/login';
import { AccesoService } from 'src/app/services/acceso.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  private router = inject(Router);
  private formBuild = inject(FormBuilder);
  private accesoService = inject(AccesoService);

  constructor() {

  }

  public formLogin: FormGroup = this.formBuild.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  })

  iniciarSesion() {
    if (this.formLogin.invalid) return;

    const login: Login = {
      username: this.formLogin.value.username,
      password: this.formLogin.value.password
    }

    this.accesoService.login(login).subscribe({
      next: (value) => {
        if (!value.respuesta.error) {
          localStorage.setItem("token", value.token);
          this.router.navigate(['/dashboard'])
        }else{
          alert(value.respuesta.descripcion);
        }
      },
      error: (err) => {
        if (err.status === 401) {
          alert(err.error.descripcion);
        }
      }
    })
  }

  nuevoUsuario(){
    this.router.navigate(['nuevoUsuario']);
  }


}
