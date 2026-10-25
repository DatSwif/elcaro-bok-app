import { Component } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { Router, RouterModule } from '@angular/router';
import { LayoutService } from '../layout-service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ToolbarModule, AvatarModule, BadgeModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  constructor(
    private router: Router,
    public layoutService: LayoutService
  ) {}

  logout() {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/start']);
  }
}