import { ApplicationConfig } from '@angular/core';
import { provideServerRouting } from '@angular/ssr';
import { serverRoutes } from './app.routes.server';

export const appConfigServer: ApplicationConfig = {
  providers: [provideServerRouting(serverRoutes)],
};
