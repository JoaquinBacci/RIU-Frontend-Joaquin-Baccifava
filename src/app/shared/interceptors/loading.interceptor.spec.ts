import { TestBed } from '@angular/core/testing';
import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { of, firstValueFrom } from 'rxjs';
import { loadingInterceptor } from './loading.interceptor';
import { LoadingService } from '../services/loading.service';

describe('loadingInterceptor', () => {
  it('llama a show y hide', async () => {
    const mock = { show: jasmine.createSpy('show'), hide: jasmine.createSpy('hide') } as unknown as LoadingService;

    TestBed.configureTestingModule({
      providers: [{ provide: LoadingService, useValue: mock }]
    });

    const req = new HttpRequest('GET', '/');
    const next: HttpHandlerFn = () => of({} as any);

    await firstValueFrom(TestBed.runInInjectionContext(() => loadingInterceptor(req, next)));

    expect((mock as any).show).toHaveBeenCalled();
    expect((mock as any).hide).toHaveBeenCalled();
  });
});
