import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild, inject } from '@angular/core';
import { HeroService } from '../../services/hero.service';
import { Hero } from '../../models/hero.model';
import { MatPaginator } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, startWith, Subject, takeUntil } from 'rxjs';
import { ModalComponent, ModalData } from '../../../../shared/components/modal/modal.component';
import { MatDialog } from '@angular/material/dialog';


@Component({ 
  selector: 'app-hero-list',
  standalone: false,
  templateUrl: './hero-list.component.html', 
  styleUrls: ['./hero-list.component.scss'] 
})

export class HeroListComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly svc = inject(HeroService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);

  displayedColumns: string[] = ['name', 'power', 'actions'];

  data: Hero[] = [];
  filtered: Hero[] = [];


  pageIndex: number = 0;
  pageSize: number = 5;
  initialQuery: string = '';

  term$ = new Subject<string>();
  destroy$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {

    const queryParms = this.route.snapshot.queryParamMap;
    const query = queryParms.get('q') ?? '';
    const size = queryParms.get('size');
    const page = queryParms.get('page');
    this.initialQuery = query;
    if (size) this.pageSize = +size || this.pageSize;
    if (page) this.pageIndex = +page || this.pageIndex;

    this.svc.list$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(list => {
        this.data = list;
        this.applyFilter(this.initialQuery);
      });

    this.term$.pipe( debounceTime(200), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(t => {
        this.applyFilter(t);

        if (this.paginator) this.paginator.firstPage();
        this.pageIndex = 0;

        this.router.navigate([], {
          queryParams: { q: t || null, page: 0 },
          queryParamsHandling: 'merge'
        });
    });
  }

  ngAfterViewInit(): void {
    if (!this.paginator) return;

    this.paginator.pageSize = this.pageSize;
    this.paginator.pageIndex = this.pageIndex;

    this.paginator.page
      .pipe(takeUntil(this.destroy$))
      .subscribe(ev => {
        this.pageIndex = ev.pageIndex;
        this.pageSize = ev.pageSize;
        this.router.navigate([], {
          queryParams: { page: this.pageIndex || null, size: this.pageSize || null },
          queryParamsHandling: 'merge'
        });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private lastTerm = '';

  applyFilter(searchTerm: string): void {
    const term = (searchTerm ?? '').trim().toLowerCase();
    const prevPageIndex = this.paginator ? this.paginator.pageIndex : this.pageIndex;

    // Si no hay termino, usa la la lista completa, si no filta por el term
    this.filtered = !term ? this.data : this.data.filter(h => h.name.toLowerCase().includes(term));

    // Calcular último índice de página válido según el nuevo length
    const lastPageIndex = Math.max(0, Math.ceil(this.filtered.length / this.pageSize) - 1);

    // Si el índice actual se sale del rango, lo ajusta
    let nextIndex = prevPageIndex;
    if (prevPageIndex > lastPageIndex) nextIndex = lastPageIndex;

    if (this.paginator) this.paginator.pageIndex = nextIndex;
    this.pageIndex = nextIndex;

    // Si cambió el pageIndex por el ajuste, se actualiza la URL sin cambiar el resto de los paramteros
    if (nextIndex !== prevPageIndex) {
      this.router.navigate([], {
        queryParams: { page: nextIndex || null },
        queryParamsHandling: 'merge'
      });
    }

    this.lastTerm = term;
  }

  pageSlice(): Hero[] {
    if (!this.paginator) return this.filtered;
    const start = this.paginator.pageIndex * this.paginator.pageSize;
    const end = start + this.paginator.pageSize;
    return this.filtered.slice(start, end);
  }

  add(): void {
    this.router.navigate(['/heroes/new'], { queryParamsHandling: 'preserve' });
  }

  edit(hero: Hero): void {
    this.router.navigate(['/heroes', hero.id], { queryParamsHandling: 'preserve' });
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
    this.router.navigate([], {
      relativeTo: this.route,
      queryParamsHandling: 'preserve'
    });
  }
}