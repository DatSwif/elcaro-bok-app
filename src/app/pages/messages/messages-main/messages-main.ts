import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { MessagesHeader } from '../messages-header/messages-header';

@Component({
  selector: 'app-messages-main',
  imports: [RouterOutlet, MessagesHeader],
  templateUrl: './messages-main.html',
  styleUrl: './messages-main.css',
})
export class MessagesMain {

}
