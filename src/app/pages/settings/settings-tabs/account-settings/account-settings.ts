import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import {
  SettingsService,
  ClientProfile,
  UpdateClientProfileRequest
} from '../../settings-service';

import { InputTextModule } from 'primeng/inputtext';
import { PhoneInput } from '../../../../shared/phone-input/phone-input';
import { ErrorService } from '../../../../shared/error-service';

type ContactItem = {
  id: number;
  value: string;
};

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    PhoneInput
  ],
  templateUrl: './account-settings.html',
  styleUrl: './account-settings.css',
})
export class AccountSettings implements OnInit {
  private readonly settingsService = inject(SettingsService);
  private readonly errorService = inject(ErrorService);

  readonly profile = signal<ClientProfile | null>(null);
  readonly isEditing = signal(false);
  readonly ready = signal(false);

  readonly nameRegex: RegExp =
    /^(?=.*[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžæÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð])[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžæÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'\-]+$/u;

  readonly orgRegex: RegExp =
    /^(?=.*[a-zA-Z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžæÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð])[a-zA-Z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžæÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'&!\-]+$/u;

  readonly emailRegex: RegExp =
    /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

  readonly phoneRegex: RegExp = /^\+\d{9,15}$/;

  private nextId = 1;

  form = {
    firstName: '',
    lastName: '',
    organizationName: '',
    languageCode: '',
    emails: [] as ContactItem[],
    phones: [] as ContactItem[]
  };

  readonly MIN_CONTACTS = 1;
  readonly MAX_CONTACTS = 3;

  async ngOnInit() {
    await this.loadProfile();
  }

  private createItem(value = ''): ContactItem {
    return {
      id: this.nextId++,
      value
    };
  }

  private copyProfileToForm(profile: ClientProfile | null) {
    this.form.firstName = profile?.firstName ?? '';
    this.form.lastName = profile?.lastName ?? '';
    this.form.organizationName = profile?.organizationName ?? '';
    this.form.languageCode = profile?.languageCode ?? '';

    this.form.emails = (profile?.emails ?? []).map(email =>
      this.createItem(email)
    );

    this.form.phones = (profile?.phones ?? []).map(phone =>
      this.createItem(phone)
    );

    if (this.form.emails.length === 0) {
      this.form.emails.push(this.createItem(''));
    }

    if (this.form.phones.length === 0) {
      this.form.phones.push(this.createItem(''));
    }
  }

  async loadProfile() {
    try {
      this.ready.set(false);

      const profile = await firstValueFrom(
        this.settingsService.getProfile()
      );

      this.profile.set(profile);
      this.copyProfileToForm(profile);

      this.ready.set(true);
    } catch (err) {
      console.error('Failed to load profile', err);
    }
  }

  startEdit() {
    this.copyProfileToForm(this.profile());
    this.isEditing.set(true);
  }

  async save() {
    const payload: UpdateClientProfileRequest = {
      firstName: this.form.firstName,
      lastName: this.form.lastName,
      organizationName: this.form.organizationName,
      languageCode: this.form.languageCode,
      emails: this.form.emails
        .map(email => email.value.trim())
        .filter(Boolean),
      phones: this.form.phones
        .map(phone => phone.value.trim())
        .filter(Boolean)
    };

    try {
      await firstValueFrom(
        this.settingsService.updateProfile(payload)
      );

      this.errorService.showError(
        $localize`:@@success.saved.title:Sukces`,
        $localize`:@@success.saved:Zmiany zostały zapisane.`,
        'success'
      );

      await this.loadProfile();
      this.isEditing.set(false);
    } catch (err) {
      console.error('Failed to update profile', err);
    }
  }

  toggleEdit(): void {
    if (this.isEditing()) {
      if (!this.isFormValid()) {
        return;
      }

      this.save();
      return;
    }

    this.startEdit();
  }

  private isValidText(value: string | null | undefined, regex: RegExp): boolean {
    const trimmed = value?.trim();
    return !!trimmed && regex.test(trimmed);
  }

  isPhoneValid(phone: string | null | undefined): boolean {
    return this.isValidText(phone, this.phoneRegex);
  }

  isEmailValid(email: string | null | undefined): boolean {
    return this.isValidText(email, this.emailRegex);
  }

  private hasDuplicatePhones(): boolean {
    const normalizedPhones = this.form.phones
      .map(phone => phone.value.trim())
      .filter(Boolean);

    return new Set(normalizedPhones).size !== normalizedPhones.length;
  }

  private hasDuplicateEmails(): boolean {
    const normalizedEmails = this.form.emails
      .map(email => email.value.trim().toLowerCase())
      .filter(Boolean);

    return new Set(normalizedEmails).size !== normalizedEmails.length;
  }

  isFormValid(): boolean {
    const allPhonesFilled =
      this.form.phones.length > 0 &&
      this.form.phones.every(phone => !!phone.value.trim());

    const allEmailsFilled =
      this.form.emails.length > 0 &&
      this.form.emails.every(email => !!email.value.trim());

    const allPhonesValid =
      this.form.phones.every(phone => this.isPhoneValid(phone.value));

    const allEmailsValid =
      this.form.emails.every(email => this.isEmailValid(email.value));

    const noDuplicatePhones = !this.hasDuplicatePhones();
    const noDuplicateEmails = !this.hasDuplicateEmails();

    return (
      this.isValidText(this.form.firstName, this.nameRegex) &&
      this.isValidText(this.form.lastName, this.nameRegex) &&
      this.isValidText(this.form.organizationName, this.orgRegex) &&
      allPhonesFilled &&
      allEmailsFilled &&
      allPhonesValid &&
      allEmailsValid &&
      noDuplicatePhones &&
      noDuplicateEmails
    );
  }

  isFieldInvalid(value: string | null | undefined, regex: RegExp): boolean {
    const trimmed = value?.trim() ?? '';
    return !trimmed || !regex.test(trimmed);
  }

  isDuplicatePhone(phone: string, id: number): boolean {
    const normalized = phone.trim();

    return this.form.phones.some(p =>
      p.id !== id && p.value.trim() === normalized
    );
  }

  isDuplicateEmail(email: string, id: number): boolean {
    const normalized = email.trim().toLowerCase();

    return this.form.emails.some(e =>
      e.id !== id && e.value.trim().toLowerCase() === normalized
    );
  }

  isPhoneFieldInvalid(phone: string | null | undefined): boolean {
    if (!phone?.trim()) return true;
    return !this.isPhoneValid(phone);
  }

  isEmailFieldInvalid(email: string | null | undefined): boolean {
    if (!email?.trim()) return true;
    return !this.isEmailValid(email);
  }

  addPhone(): void {
    if (this.form.phones.length < this.MAX_CONTACTS) {
      this.form.phones.push(this.createItem(''));
    }
  }

  removePhone(id: number): void {
    if (this.form.phones.length > this.MIN_CONTACTS) {
      this.form.phones = this.form.phones.filter(
        phone => phone.id !== id
      );
    }
  }

  addEmail(): void {
    if (this.form.emails.length < this.MAX_CONTACTS) {
      this.form.emails.push(this.createItem(''));
    }
  }

  removeEmail(id: number): void {
    if (this.form.emails.length > this.MIN_CONTACTS) {
      this.form.emails = this.form.emails.filter(
        email => email.id !== id
      );
    }
  }

  canRemovePhone(): boolean {
    return this.form.phones.length > this.MIN_CONTACTS;
  }

  canRemoveEmail(): boolean {
    return this.form.emails.length > this.MIN_CONTACTS;
  }
}