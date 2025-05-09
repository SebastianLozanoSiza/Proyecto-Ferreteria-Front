import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NuevoUsuarioComponent } from './nuevo-usuario/nuevo-usuario.component';

const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'nuevoUsuario', component: NuevoUsuarioComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
