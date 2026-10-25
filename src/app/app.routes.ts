import { Routes } from '@angular/router';

import { LayoutMain } from './layout/layout-main/layout-main';

import { DashboardMain } from './pages/dashboard/dashboard-main/dashboard-main';

import { ServicesMain } from './pages/services/services-main/services-main';

import { HelpMain } from './pages/help/help-main/help-main';
import { ContactHelp } from './pages/help/help-tabs/contact-help/contact-help';
import { FaqHelp } from './pages/help/help-tabs/faq-help/faq-help';
import { FaqDetailsPage } from './pages/help/help-tabs/faq-help/faq-details-page/faq-details-page';

import { MessagesMain } from './pages/messages/messages-main/messages-main';
import { GlobalMessages } from './pages/messages/messages-tabs/global-messages/global-messages';
import { PersonalMessages } from './pages/messages/messages-tabs/personal-messages/personal-messages';

import { SettingsMain } from './pages/settings/settings-main/settings-main';
import { LangNotifSettings } from './pages/settings/settings-tabs/lang-notif-settings/lang-notif-settings';
import { AccountSettings } from './pages/settings/settings-tabs/account-settings/account-settings';
import { TermsOfService } from './pages/settings/settings-tabs/terms-of-service/terms-of-service';
import { PrivacyPolicy } from './pages/settings/settings-tabs/privacy-policy/privacy-policy';
import { HardwareSettings } from './pages/settings/settings-tabs/hardware-settings/hardware-settings';
import { MarketingConsents } from './pages/settings/settings-tabs/marketing-consents/marketing-consents';

// import { Test } from './test/test';

import { Start } from './auth/start/start';
import { AuthMain } from './auth/auth-main/auth-main';
import { LoginForm } from './auth/login-form/login-form';
import { RegisterForm } from './auth/register-form/register-form';
import { LimitReached } from './auth/limit-reached/limit-reached';
import { RegisterSuccess } from './auth/register-success/register-success';
import { AuthCode } from './auth/auth-code/auth-code';
import { authGuard } from './auth/auth-guard';
import { BillingMain } from './pages/billing/billing-main/billing-main';
import { OffersMain } from './pages/offers/offers-main/offers-main';
import { OfferVariants } from './pages/offers/offer-variants/offer-variants';
import { BillingInvoices } from './pages/billing/billing-invoices/billing-invoices';
import { BillingReturns } from './pages/billing/billing-returns/billing-returns';
import { BillingPayments } from './pages/billing/billing-payments/billing-payments';

export const routes: Routes = [
//   { 
//     path: 'test', 
//     component: Test,
//   },
  {
    path: 'start',
    component: Start
  },
  {
    path: 'auth',
    component: AuthMain,
    children: [
      {
        path: 'login',
        component: LoginForm
      },
      {
        path: 'register',
        component: RegisterForm
      },
      {
        path: 'auth-code',
        component: AuthCode
      },
      {
        path: 'limit-reached',
        component: LimitReached
      },
      {
        path: 'register-success',
        component: RegisterSuccess,
        canActivate: [authGuard],
      }
    ]
  },
  {
    path: '',
    component: LayoutMain,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardMain
      },
      {
        path: 'billing',
        component: BillingMain,
        children: [
          {
            path: 'paid',
            component: BillingInvoices,
            data: { statuses: [ 'paid', 'pending' ] }
          },
          {
            path: 'returns',
            component: BillingReturns,
          },
          {
            path: 'unpaid',
            component: BillingInvoices,
            data: { statuses: [ 'unpaid', 'overdue' ] }
          },
          {
            path: 'payments',
            component: BillingPayments,
          },
        ]
      },
      {
        path: 'services',
        component: ServicesMain
      },
      {
        path: 'offers',
        children: [
          { path: '', component: OffersMain },
          { path: 'details/:id', component: OfferVariants}
        ]
      },
      {
        path: 'help',
        children: [
          {
            path: '', 
            component: HelpMain,
            children: [
              {
                path: '',
                redirectTo: 'contact',
                pathMatch: 'full',
              },
              {
                path: 'contact',
                component: ContactHelp
              },
              {
                path: 'faq',
                component: FaqHelp
              }
            ]
          },
          {
            path: 'faq/:id',
            component: FaqDetailsPage
          }
        ]
      },
      {
        path: 'messages',
        component: MessagesMain,
        children: [
          {
            path: '',
            redirectTo: 'global',
            pathMatch: 'full',
          },
          {
            path: 'global',
            component: GlobalMessages
          },
          {
            path: 'personal',
            component: PersonalMessages
          }
        ]
      },
      {
        path: 'settings',
        component: SettingsMain,
        children: [
          {
            path: '',
            redirectTo: 'account',
            pathMatch: 'full',
          },
          {
            path: 'account',
            component: AccountSettings
          },
          {
            path: 'lang-notif',
            component: LangNotifSettings
          },
          {
            path: 'terms-of-service',
            component: TermsOfService
          },
          {
            path: 'privacy-policy',
            component: PrivacyPolicy
          },
          {
            path: 'hardware',
            component: HardwareSettings
          },
          {
            path: 'marketing-consents',
            component: MarketingConsents
          }
        ]
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];