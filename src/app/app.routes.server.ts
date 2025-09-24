import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'heroes', renderMode: RenderMode.Client },
  { path: 'heroes/new', renderMode: RenderMode.Prerender },
  { path: 'heroes/:id', renderMode: RenderMode.Server },
  { path: '**', renderMode: RenderMode.Server },
];
