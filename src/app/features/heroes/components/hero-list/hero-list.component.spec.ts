import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HeroListComponent } from './hero-list.component';
import { HeroService } from '../../services/hero.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

class MockHeroService {
  list$ = () => of([{ id: '1', name: 'Superman' }]);
  delete = jasmine.createSpy('delete');
}

describe('HeroListComponent', () => {
  let component: HeroListComponent;
  let fixture: ComponentFixture<HeroListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        RouterTestingModule
      ],
      declarations: [HeroListComponent],
      providers: [{ provide: HeroService, useClass: MockHeroService }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
