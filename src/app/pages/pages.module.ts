import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';
import { ClientesComponent } from './clientes/clientes.component';
import { EmpleadosComponent } from './empleados/empleados.component';
import { ProductosComponent } from './productos/productos.component';
import { DepartamentosComponent } from './departamentos/departamentos.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CrearProductosComponent } from './productos/crear-productos/crear-productos.component';
import { BienvenidaComponent } from './bienvenida/bienvenida.component';
import { CrearClienteComponent } from './clientes/editar-cliente/editar-cliente.component';
import { CrearDepartamentoComponent } from './departamentos/crear-departamento/crear-departamento.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


@NgModule({
  declarations: [
    PagesComponent,
    ClientesComponent,
    EmpleadosComponent,
    ProductosComponent,
    DepartamentosComponent,
    CrearProductosComponent,
    BienvenidaComponent,
    CrearClienteComponent,
    CrearDepartamentoComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatAutocompleteModule
  ]
})
export class PagesModule { }
