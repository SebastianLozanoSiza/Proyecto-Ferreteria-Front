import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CrearClienteComponent } from 'src/app/pages/clientes/editar-cliente/editar-cliente.component';
import { AccesoService } from 'src/app/services/acceso.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { PermisosService } from 'src/app/services/permisos.service';
import { TerceroService } from 'src/app/services/tercero.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  private router = inject(Router);
  private permisosService = inject(PermisosService);
  private terceroService = inject(TerceroService);
  private accesoService = inject(AccesoService);

  private usuario: string = this.accesoService.getUSerToken();

  public dialog = inject(MatDialog);

  public menuItems: any[] = [];

  private modulosIconos: { [key: string]: string } = {
    'Clientes': 'fas fa-users',
    'Empleados': 'fas fa-user-tie',
    'Departamentos': 'fas fa-map-marked-alt',
    'Productos': 'fas fa-box-open',
    'Ferreterias': 'fas fa-tools',
  };

  ngOnInit(): void {
    this.permisosService.listarModulos().subscribe({
      next: (resp) => {
        if (!resp.respuesta.error) {
          this.menuItems = resp.modulos
            .filter(m => m.leer && this.modulosIconos[m.nombreModulo])
            .map(m => ({
              titulo: m.nombreModulo,
              icono: this.modulosIconos[m.nombreModulo] || 'fas fa-folder',
              routerLink: '/dashboard/' + m.nombreModulo.toLowerCase()
            }));
        }
      }
    });
  }

  openEditarUsuario() {
    this.terceroService.buscarTerceroPorNombreDeUsuario(this.usuario).subscribe({
      next: (resp) => {
        if (resp.terceros && resp.terceros.length > 0) {
          this.dialog.open(CrearClienteComponent, {
            maxHeight: "80vh",
            data: resp.terceros[0]
          });
        }
      }
    });
  }

  bienvenida() {
    this.router.navigate(['/dashboard'])

  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['login']);
  }
}
