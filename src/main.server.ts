import { bootstrapApplication, type BootstrapContext } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { appConfigServer } from './app/app.config.server';

export const bootstrap = (context: BootstrapContext) =>
  bootstrapApplication(AppComponent, { ...appConfig, ...appConfigServer }, context);

export default bootstrap;
