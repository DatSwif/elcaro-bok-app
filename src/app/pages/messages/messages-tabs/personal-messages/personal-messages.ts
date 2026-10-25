import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';

import {
  MessagesService,
  PersonalMessageDto
} from '../../messages-service';

@Component({
  selector: 'app-personal-messages',
  standalone: true,
  imports: [
    CommonModule,
    ConfirmPopupModule
  ],
  providers: [
    ConfirmationService
  ],
  templateUrl: './personal-messages.html',
  styleUrl: './personal-messages.css',
})
export class PersonalMessages implements OnInit {
  messages = signal<PersonalMessageDto[]>([]);
  ready = signal(false);

  constructor(
    private messagesService: MessagesService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    void this.loadMessages();
  }

  async loadMessages(): Promise<void> {
    try {
      this.ready.set(false);

      const data = await firstValueFrom(
        this.messagesService.getPersonalMessages()
      );

      this.messages.set(data);
      this.ready.set(true);

    } catch (err) {
      console.error('Failed to load personal messages', err);
    }
  }

  confirmDelete(
    event: Event,
    message: PersonalMessageDto | null,
    target: HTMLElement
  ): void {
    event.preventDefault();
    event.stopPropagation();

    if (!message) {
      return;
    }

    this.confirmationService.confirm({
      target,
      accept: () => {
        void this.deleteMessage(message);
      }
    });
  }

  async markAsRead(
    message: PersonalMessageDto | null
  ): Promise<void> {
    if (!message || message.is_read) {
      return;
    }

    try {
      await firstValueFrom(
        this.messagesService.markPersonalMessageAsRead(
          message.id
        )
      );

      this.messages.update(list =>
        list.map(m =>
          m.id === message.id
            ? {
                ...m,
                is_read: true,
                read_at: new Date().toISOString()
              }
            : m
        )
      );

    } catch (err) {
      console.error(err);
    }
  }

  async deleteMessage(
    message: PersonalMessageDto
  ): Promise<void> {
    try {
      await firstValueFrom(
        this.messagesService.deletePersonalMessage(
          message.id
        )
      );

      this.messages.update(list =>
        list.filter(m => m.id !== message.id)
      );

    } catch (err) {
      console.error('Failed to delete personal message', err);
    }
  }
}