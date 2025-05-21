import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ProductosComponent } from './productos/productos.component';
import { EmpleadosComponent } from './empleados/empleados.component';
import { DepartamentosComponent } from './departamentos/departamentos.component';
import { authGuard } from '../custom/auth.guard';
import { BienvenidaComponent } from './bienvenida/bienvenida.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: PagesComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: BienvenidaComponent, data: { titulo: 'Bienvenida' } },
      { path: 'productos', component: ProductosComponent, data: { titulo: 'Productos' } },
      { path: 'clientes', component: ClientesComponent, data: { titulo: 'Clientes' } },
      { path: 'empleados', component: EmpleadosComponent, data: { titulo: 'Empleados' } },
      { path: 'departamentos', component: DepartamentosComponent, data: { titulo: 'Departamentos' } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
