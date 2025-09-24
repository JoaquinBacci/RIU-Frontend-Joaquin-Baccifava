import { Component, inject } from '@angular/core';
import { LoadingService } from './shared/services/loading.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private readonly loading = inject(LoadingService);
  loading$: Observable<boolean> = this.loading.loading$;
}