# ElcaroBokApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.3.

Before running the project, please ensure that Angular CLI is installed on your system. Installation requires Node.js.

- You can download Node.js here:
https://nodejs.org/en/download
- Learn more about installing Angular CLI:
https://angular.dev/installation

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Build and run

To build the project with localizations and run it:

```bash
ng build --localize; node prod-server.js 
```

Once the server is running, open your browser and navigate to `http://localhost:3000`.

## Test User

Test user's phone number is `+48 123 456 789` and login code is `5555`.

## Running the mock API server

Use the following command to run the mock API server using Prism (no additional installations needed):

```bash
npx @stoplight/prism-cli mock mocks/api.json
```

When the mock server is offline, the app is unable to receive data with GET http requests and shows an error instead.
