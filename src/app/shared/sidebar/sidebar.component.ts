import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  public menuItems: any[] = [{
    titulo: 'Dashboard',
    icono: 'nav-icon fas fa-tachometer-alt',
    submenu: [
      { titulo: 'Clientes', icon: 'far fa-circle', routerLink: '/dashboard/clientes' },
      { titulo: 'Empleados', icon: 'far fa-circle', routerLink: '/dashboard/empleados' },
      { titulo: 'Departamentos', icon: 'far fa-circle', routerLink: '/dashboard/departamentos' }
    ]
  }];

  logout() {
    location.href = 'login';
  }
}
