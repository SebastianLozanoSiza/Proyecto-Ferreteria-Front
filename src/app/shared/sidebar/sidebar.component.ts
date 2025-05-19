import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  private router = inject(Router);

  public menuItems: any[] = [
    { titulo: 'Clientes', icono: 'fas fa-users', routerLink: '/dashboard/clientes' },
    { titulo: 'Empleados', icono: 'fas fa-user-tie', routerLink: '/dashboard/empleados' },
    { titulo: 'Departamentos', icono: 'fas fa-map-marked-alt', routerLink: '/dashboard/departamentos' },
    { titulo: 'Productos', icono: 'fas fa-box-open', routerLink: '/dashboard/productos' }
  ];

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['login']);
  }
}
