import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import { Hero } from '../models/hero.model';
import { CreateHeroRequest, UpdateHeroRequest } from '../models/hero.request.model';


@Injectable({ providedIn: 'root' })
export class HeroService {
  private readonly _heroes$ = new BehaviorSubject<Hero[]>([
    { id: uuid(), name: 'Superman', power: 'Fuerza', description: 'Hombre de acero' },
    { id: uuid(), name: 'Spiderman', power: 'Araña', description: 'Amistoso vecino' },
    { id: uuid(), name: 'Manolito el fuerte', power: 'Empuje', description: 'Leyenda local' },
  ]);


  list$(): Observable<Hero[]> { return this._heroes$.asObservable(); }

  getById$(id: string): Observable<Hero | undefined> {
    return this._heroes$.pipe(map(list => list.find(h => h.id === id)));
  }

  searchByName$(term: string): Observable<Hero[]> {
    const t = term.trim().toLowerCase();
    if (!t) return this.list$();
    return this._heroes$.pipe(map(list => list.filter(h => h.name.toLowerCase().includes(t))));
  }

  create(req: CreateHeroRequest): Hero {
    const hero: Hero = { id: uuid(), ...req };
    const next = [...this._heroes$.value, hero];
    this._heroes$.next(next);
    return hero;
  }

  update(req: UpdateHeroRequest): Hero {
    const idx = this._heroes$.value.findIndex(h => h.id === req.id);
    if (idx === -1) throw new Error('Hero not found');
    const updated: Hero = { ...this._heroes$.value[idx], ...req };
    const next = this._heroes$.value.slice();
    next[idx] = updated;
    this._heroes$.next(next);
    return updated;
  }

  delete(id: string): void {
    const next = this._heroes$.value.filter(h => h.id !== id);
    this._heroes$.next(next);
  }
}