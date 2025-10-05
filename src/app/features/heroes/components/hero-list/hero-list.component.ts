import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { HeroService } from '../../services/hero.service';
import { Hero } from '../../models/hero.model';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { debounceTime, startWith, Subject, takeUntil } from 'rxjs';
import { ModalComponent, ModalData } from '../../../../shared/components/modal/modal.component';
import { MatDialog } from '@angular/material/dialog';


@Component({ 
  selector: 'app-hero-list',
  standalone: false,
  templateUrl: './hero-list.component.html', 
  styleUrls: ['./hero-list.component.scss'] 
})

export class HeroListComponent implements OnInit, OnDestroy {
  private readonly svc = inject(HeroService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  displayedColumns = ['name', 'power', 'actions'];
  data: Hero[] = [];
  filtered: Hero[] = [];

  term$ = new Subject<string>();
  destroy$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.svc.list$().pipe(takeUntil(this.destroy$)).subscribe(list => {
      this.data = list;
      this.applyFilter('');
    });

    this.term$.pipe(startWith(''), debounceTime(200), takeUntil(this.destroy$)).subscribe(t => this.applyFilter(t));
  }

  applyFilter(term: string) {
    const t = term.trim().toLowerCase();
    this.filtered = !t ? this.data : this.data.filter(h => h.name.toLowerCase().includes(t));
    if (this.paginator) this.paginator.firstPage();
  }

  pageSlice(): Hero[] {
    if (!this.paginator) return this.filtered;
    const start = this.paginator.pageIndex * this.paginator.pageSize;
    const end = start + this.paginator.pageSize;
    return this.filtered.slice(start, end);
  }

  add() {
    this.router.navigate(['/heroes/new']);
  }

  edit(hero: Hero) {
    this.router.navigate(['/heroes', hero.id]);
  }

  async remove(hero: Hero) {
    
    let dialogData: ModalData = { 
      title: 'Confirmar borrado', 
      message: `¿Borrar a "${hero.name}"?`, 
      confirmText: 'Borrar', 
      cancelText: 'Cancelar' 
    };

    const confirmed = await ModalComponent.open(this.dialog, dialogData);

    if (!confirmed) return;
    this.svc.delete(hero.id);
  }


  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}