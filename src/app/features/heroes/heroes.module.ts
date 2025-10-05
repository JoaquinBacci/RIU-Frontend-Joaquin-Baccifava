import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { HeroListComponent } from './components/hero-list/hero-list.component';
import { HeroFormComponent } from './components/hero-form/hero-form.component';
import { UppercaseDirective } from '../../shared/directives/uppercase.directive';
import { MatDialogModule } from '@angular/material/dialog';



const routes: Routes = [
  { path: '', component: HeroListComponent },
  { path: 'new', component: HeroFormComponent },
  { path: ':id', component: HeroFormComponent },
];


@NgModule({
  declarations: [HeroListComponent, HeroFormComponent, UppercaseDirective],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    RouterModule.forChild(routes),
    MatDialogModule
  ]
})
export class HeroesModule { }