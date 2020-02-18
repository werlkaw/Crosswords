# Crosswords

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.0.1.

## Before cloning repository

You will need nodejs and npm installed. After having both those installed, install the angular cli:

`npm install -g @angular/cli`

Then, clone the repository. Once the cloning is complete, go to the cloned directory and run `npm install`. That should download all the packages in the package.json file.

## Missing firebase environment files

Due to the sensitive nature of the environment file, it has been added to the .gitignore file.
You must add an environments folder under src and add an environment.ts file with the following format:

`
export const environment = {
  production: false,
  firebase: {
    apiKey: "{YourApiKey}",
    authDomain: "{YourAuthDomain}",
    databaseURL: "{YourDBDomain}",
    projectId: "{YourProjectId}",
    storageBucket: "{YourStorageBucket}",
    messagingSenderId: "{YourMessagingSenderId}",
    appId: "{YourAppId}"
  }
};
`
Instructions on how to set up a firebase server can be found [here](https://medium.com/factory-mind/angular-firebase-typescript-step-by-step-tutorial-2ef887fc7d71).

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
