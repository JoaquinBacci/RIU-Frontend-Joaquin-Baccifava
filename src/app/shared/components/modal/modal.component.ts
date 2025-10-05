
import { Component, inject, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { firstValueFrom } from 'rxjs';

export interface ModalData { title: string; message: string; confirmText?: string; cancelText?: string; }

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: 'modal.component.html',
})

export class ModalComponent {

  dialogRef: MatDialogRef<ModalComponent> = inject(MatDialogRef<ModalComponent>);
  data: ModalData = inject(MAT_DIALOG_DATA)
  
  static open(dialog: MatDialog, data: ModalData): Promise<boolean> {
      return firstValueFrom(dialog.open(ModalComponent, { data }).afterClosed()).then(v => !!v);
  }
}