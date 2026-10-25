import { Component, OnInit } from '@angular/core';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';
import { RouterOutlet } from '@angular/router';
import { LayoutService } from '../layout-service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-layout-main',
  imports: [RouterOutlet, Header, Sidebar, ProgressSpinnerModule],
  templateUrl: './layout-main.html',
  styleUrl: './layout-main.css',
})
export class LayoutMain implements OnInit {
  constructor(public layoutService: LayoutService) {}

  ngOnInit(): void {
    this.layoutService.loadLayoutData();
  }
}
