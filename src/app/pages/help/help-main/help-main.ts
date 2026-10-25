import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { HelpHeader } from '../help-header/help-header';

@Component({
  selector: 'app-help-main',
  imports: [RouterOutlet, HelpHeader],
  templateUrl: './help-main.html',
  styleUrl: './help-main.css',
})
export class HelpMain {

}
