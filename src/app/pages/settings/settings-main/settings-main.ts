import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { SettingsHeader } from "../settings-header/settings-header";

@Component({
  selector: 'app-settings-main',
  imports: [RouterOutlet, SettingsHeader],
  templateUrl: './settings-main.html',
  styleUrl: './settings-main.css',
})
export class SettingsMain {

}
