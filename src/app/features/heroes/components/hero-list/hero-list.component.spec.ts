import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { HeroListComponent } from './hero-list.component';
import { HeroService } from '../../services/hero.service';

class MockHeroService {
  list$ = () => of([{ id: '1', name: 'Superman' }]);
  delete = jasmine.createSpy('delete');
}

describe('HeroListComponent', () => {
  let component: HeroListComponent;
  let fixture: ComponentFixture<HeroListComponent>;

  function makeParamMap(init: any) {
    return { get: (k: string) => (k in init ? (init[k] as string) : null) };
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        RouterTestingModule
      ],
      declarations: [HeroListComponent],
      providers: [
        { provide: HeroService, useClass: MockHeroService },
        {
          provide: ActivatedRoute, useValue: {
            snapshot: { queryParamMap: makeParamMap({ q: 'man', size: '10', page: '1' }) },
            queryParamMap: of(makeParamMap({ q: 'man', size: '10', page: '1' })),
            queryParams: of({ q: 'man', size: '10', page: '1' })
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroListComponent);
    component = fixture.componentInstance;

    const paginatorMock = { pageIndex: 1, pageSize: 10, firstPage: jasmine.createSpy('firstPage') } as any;
    (component as any).paginator = paginatorMock;
    fixture.detectChanges();
    (component as any).paginator = paginatorMock;
  });

  it('debería renderizar al menos un héroe', () => {
    expect(component.data.length).toBe(1);
  });

  it('applyFilter debería filtrar', () => {
    component.applyFilter('super');
    expect(component.filtered.length).toBe(1);
    component.applyFilter('zzz');
    expect(component.filtered.length).toBe(0);
  });
});

class MockHeroService2 {
  list$ = () => of([
    { id: '1', name: 'Superman', power: 'Strength' },
    { id: '2', name: 'Batman', power: 'Intellect' },
    { id: '3', name: 'Wonder Woman', power: 'Lasso' }
  ]);
  delete = jasmine.createSpy('delete');
}

describe('HeroListComponent additional', () => {
  let component: HeroListComponent;
  let fixture: ComponentFixture<HeroListComponent>;
  let router: Router;

  function makeParamMap(init: any) {
    return { get: (k: string) => (k in init ? (init[k] as string) : null) };
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), NoopAnimationsModule],
      declarations: [HeroListComponent],
      providers: [
        { provide: HeroService, useClass: MockHeroService2 },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { queryParamMap: makeParamMap({ q: 'man', size: '10', page: '1' }) },
            queryParamMap: of(makeParamMap({ q: 'man', size: '10', page: '1' })),
            queryParams: of({ q: 'man', size: '10', page: '1' })
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroListComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    const paginatorMock = { pageIndex: 1, pageSize: 10, firstPage: jasmine.createSpy('firstPage') } as any;
    (component as any).paginator = paginatorMock;
    fixture.detectChanges();
    (component as any).paginator = paginatorMock;
  });

  it('term$ filtra, resetea a primera página y actualiza query params', fakeAsync(() => {
    const navSpy = spyOn(router, 'navigate').and.resolveTo(true);
    component.term$.next('bat');
    tick(400);
    fixture.detectChanges();
    expect(component.filtered.map((h: any) => h.name)).toEqual(['Batman']);
    expect((component as any).paginator.firstPage).toHaveBeenCalled();
    expect(component.pageIndex).toBe(0);
    expect(navSpy).toHaveBeenCalled();
    const args: any = navSpy.calls.mostRecent().args[1];
    expect(args.queryParams).toEqual({ q: 'bat', page: 0 });
    expect(args.queryParamsHandling).toBe('merge');
  }));

  it('pageSlice retorna el tramo según pageIndex y pageSize', () => {
    const p: any = (component as any).paginator;
    p.pageSize = 2;
    p.pageIndex = 0;
    component.applyFilter('');
    let slice = component.pageSlice();
    expect(slice.map((h: any) => h.id)).toEqual(['1', '2']);
    p.pageIndex = 1;
    slice = component.pageSlice();
    expect(slice.map((h: any) => h.id)).toEqual(['3']);
    (component as any).paginator = undefined;
    expect(component.pageSlice().length).toBe(3);
  });

  it('add navega a ruta de creación preservando query params', async () => {
    const navSpy = spyOn(router, 'navigate').and.resolveTo(true);
    component.add();
    expect(navSpy).toHaveBeenCalledWith(['/heroes/new'], { queryParamsHandling: 'preserve' });
  });

  it('edit navega a ruta de edición preservando query params', async () => {
    const navSpy = spyOn(router, 'navigate').and.resolveTo(true);
    component.edit({ id: '2', name: 'Batman' });
    expect(navSpy).toHaveBeenCalledWith(['/heroes', '2'], { queryParamsHandling: 'preserve' });
  });
});
