import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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

  loading: boolean = false;

  constructor(private toastrService: ToastrService) {

  }

  public formLogin: FormGroup = this.formBuild.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  })

  get Usuario() {
    return this.formLogin.get('username')
  }
  get Clave() {
    return this.formLogin.get('password')
  }

  iniciarSesion() {
    if (this.formLogin.valid) {
      this.loading = true;

      const login: Login = {
        username: this.formLogin.value.username,
        password: this.formLogin.value.password
      }

      this.accesoService.login(login).subscribe({
        next: (value) => {
          if (!value.respuesta.error) {
            localStorage.setItem("token", value.token);
            localStorage.setItem("nombreUsuario", value.nombreUsuario);
            this.router.navigate(['/dashboard'])
          } else {
            (value.respuesta.descripcion);
          }
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          if (err.status === 401 && err.error && err.error.respuesta) {
            this.toastrService.error(err.error.respuesta.descripcion);
          }
        }
      })
    } else {
      this.formLogin.markAllAsTouched();
      this.toastrService.warning('Por favor, complete todos los campos requeridos.');
    }

  }

  nuevoUsuario() {
    if (!this.loading) {
      this.router.navigate(['nuevoUsuario']);
    }
  }


}
