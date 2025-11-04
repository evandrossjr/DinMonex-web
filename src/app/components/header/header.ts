import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router'; // 1. Importa RouterLink para a navegação
import { AuthService } from '../../services/auth'; // 2. Importa o AuthService para o logout

@Component({
  selector: 'app-header',
  standalone: true,
  // 3. Adiciona os módulos necessários
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent {

  // 4. Injeta os serviços
  constructor(private authService: AuthService) {}

  /**
   * 5. Adiciona o método de logout.
   */
  logout(): void {
    this.authService.logout();
  }
}