import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { HeroFormComponent } from './hero-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HeroService } from '../../services/hero.service';

class MockHeroService {
  getById$ = () => of({ id: '1', name: 'AAA' });
  create = jasmine.createSpy('create');
  update = jasmine.createSpy('update');
}

describe('HeroFormComponent', () => {
  let component: HeroFormComponent;
  let fixture: ComponentFixture<HeroFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      declarations: [HeroFormComponent],
      providers: [{ provide: HeroService, useClass: MockHeroService }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(HeroFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('form inválido si name vacío', () => {
    component.form.setValue({ name: '', power: '', description: '' });
    expect(component.form.invalid).toBeTrue();
  });

  it('submit crea cuando no hay id', () => {
    component.id = null; // new
    component.form.setValue({ name: 'ABC', power: '', description: '' });
    component.save();
    const svc = TestBed.inject(HeroService) as unknown as MockHeroService;
    expect(svc.create).toHaveBeenCalled();
  });
});
