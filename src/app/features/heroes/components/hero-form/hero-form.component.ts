import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeroService } from '../../services/hero.service';


@Component({ 
  selector: 'app-hero-form', 
  standalone: false,
  templateUrl: './hero-form.component.html', 
  styleUrls: ['./hero-form.component.scss'] 
})
export class HeroFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly svc = inject(HeroService);


  id: string | null = null;


  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    power: [''],
    description: ['']
  });


  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.svc.getById$(this.id).subscribe(h => {
        if (h) this.form.patchValue({ name: h.name, power: h.power ?? '', description: h.description ?? '' });
      });
    }
  }


  save() {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    if (this.id) {
      this.svc.update({ id: this.id, ...value });
    } else {
      this.svc.create(value);
    }
    this.router.navigate(['/heroes']);
  }


  cancel() { this.router.navigate(['/heroes']); }
}