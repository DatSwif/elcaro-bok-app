import { CommonModule } from '@angular/common';
import {
  Component,
  HostListener,
  OnInit,
  signal,
  computed
} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';

import {
  MessagesService,
  GlobalMessageDto
} from '../../messages-service';

@Component({
  selector: 'app-global-messages',
  standalone: true,
  imports: [
    CommonModule,
    DrawerModule,
    ConfirmPopupModule
  ],
  providers: [
    ConfirmationService
  ],
  templateUrl: './global-messages.html',
  styleUrl: './global-messages.css',
})
export class GlobalMessages implements OnInit {

  messages = signal<GlobalMessageDto[]>([]);
  selectedMessageId = signal<number | null>(null);

  isMobile = signal(false);
  ready = signal(false);

  constructor(
    private messagesService: MessagesService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.checkScreenSize();

    this.route.queryParamMap.subscribe(params => {
      const id = Number(params.get('id'));

      if (!Number.isNaN(id) && id > 0) {
        this.selectedMessageId.set(id);
      }
    });

    void this.loadMessages();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isMobile.set(window.innerWidth <= 700);
  }

  async loadMessages(): Promise<void> {
    try {
      this.ready.set(false);

      const data = await firstValueFrom(
        this.messagesService.getGlobalMessages()
      );

      this.messages.set(data);

      const selectedId = this.selectedMessageId();

      if (selectedId !== null) {
        const selectedMessage =
          data.find(m => m.id === selectedId) ?? null;

        if (selectedMessage && !selectedMessage.is_read) {
          await this.markAsRead(selectedMessage);
        }
      }

      this.ready.set(true);

    } catch (err) {
      console.error('Failed to load global messages', err);
    }
  }

  isDrawerOpen = computed(() =>
    this.isMobile() &&
    this.selectedMessageId() !== null
  );

  selectedMessage = computed(() =>
    this.messages().find(
      m => m.id === this.selectedMessageId()
    ) ?? null
  );

  selectMessage(message: GlobalMessageDto): void {
    this.selectedMessageId.set(message.id);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { id: message.id },
      queryParamsHandling: 'merge'
    });

    if (!message.is_read) {
      void this.markAsRead(message);
    }
  }

  onMessageCardKeydown(
    event: KeyboardEvent,
    message: GlobalMessageDto
  ): void {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    this.selectMessage(message);
  }

  confirmDelete(
    event: Event,
    message: GlobalMessageDto | null,
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
    message: GlobalMessageDto | null
  ): Promise<void> {

    if (!message || message.is_read) {
      return;
    }

    try {
      await firstValueFrom(
        this.messagesService.markGlobalMessageAsRead(
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
    message: GlobalMessageDto
  ): Promise<void> {

    try {
      await firstValueFrom(
        this.messagesService.deleteGlobalMessage(
          message.id
        )
      );

      this.messages.update(list => {

        const updated =
          list.filter(m => m.id !== message.id);

        if (this.selectedMessageId() === message.id) {

          if (!updated.length) {
            this.selectedMessageId.set(null);
          } else {

            const index =
              list.findIndex(m => m.id === message.id);

            const next =
              updated[index]
              ?? updated[index - 1]
              ?? updated[0];

            this.selectedMessageId.set(next.id);
          }
        }

        return updated;
      });

    } catch (err) {
      console.error(
        'Failed to delete global message',
        err
      );
    }
  }

  getPreview(
    text: string,
    limit = 60
  ): string {

    return text.length > limit
      ? text.slice(0, limit) + '…'
      : text;
  }
}