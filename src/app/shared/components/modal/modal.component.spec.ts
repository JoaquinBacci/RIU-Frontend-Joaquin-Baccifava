import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ModalComponent, ModalData } from './modal.component';

describe('ModalComponent', () => {
  let fixture: ComponentFixture<ModalComponent>;
  let component: ModalComponent;

  const makeDialogRefSpy = () =>
    ({ close: jasmine.createSpy('close') }) as unknown as MatDialogRef<ModalComponent>;

  const baseData: ModalData = {
    title: 'Título de prueba',
    message: 'Mensaje de prueba',
  };

  function configure(data: Partial<ModalData> = {}, dialogRef: MatDialogRef<ModalComponent> = makeDialogRefSpy()) {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [
        ModalComponent,
        NoopAnimationsModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { ...baseData, ...data } },
        { provide: MatDialogRef, useValue: dialogRef },
      ]
    });
    return TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(ModalComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      return { fixture, component, dialogRef };
    });
  }

  it('crea el componente', async () => {
    await configure();
    expect(component).toBeTruthy();
  });

  it('renderiza título y mensaje', async () => {
    await configure();
    const titleEl = fixture.debugElement.query(By.css('[mat-dialog-title]')).nativeElement as HTMLElement;
    const msgEl = fixture.debugElement.query(By.css('[mat-dialog-content]')).nativeElement as HTMLElement;

    expect(titleEl.textContent?.trim()).toBe(baseData.title);
    expect(msgEl.textContent?.trim()).toBe(baseData.message);
  });

  it('muestra labels por defecto cuando no se pasan textos custom', async () => {
    await configure(); // sin confirmText ni cancelText
    const btns = fixture.debugElement.queryAll(By.css('button'));
    const cancelBtn = btns[0].nativeElement as HTMLButtonElement;
    const confirmBtn = btns[1].nativeElement as HTMLButtonElement;

    expect(cancelBtn.textContent?.trim()).toBe('Cancelar');
    expect(confirmBtn.textContent?.trim()).toBe('Confirmar');
  });

  it('muestra labels custom cuando se proveen', async () => {
    await configure({ confirmText: 'Sí', cancelText: 'No' });
    const btns = fixture.debugElement.queryAll(By.css('button'));
    const cancelBtn = btns[0].nativeElement as HTMLButtonElement;
    const confirmBtn = btns[1].nativeElement as HTMLButtonElement;

    expect(cancelBtn.textContent?.trim()).toBe('No');
    expect(confirmBtn.textContent?.trim()).toBe('Sí');
  });

  it('al clickear Cancelar, cierra con false', async () => {
    const dialogRef = makeDialogRefSpy();
    await configure({}, dialogRef);

    const cancelBtn = fixture.debugElement.queryAll(By.css('button'))[0].nativeElement as HTMLButtonElement;
    cancelBtn.click();
    fixture.detectChanges();

    expect(dialogRef.close).toHaveBeenCalledOnceWith(false);
  });

  it('al clickear Confirmar, cierra con true', async () => {
    const dialogRef = makeDialogRefSpy();
    await configure({}, dialogRef);

    const confirmBtn = fixture.debugElement.queryAll(By.css('button'))[1].nativeElement as HTMLButtonElement;
    confirmBtn.click();
    fixture.detectChanges();

    expect(dialogRef.close).toHaveBeenCalledOnceWith(true);
  });

  describe('ModalComponent.open', () => {
    it('resuelve a true cuando el diálogo se cierra con un valor truthy', fakeAsync(async () => {
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [MatDialogModule, NoopAnimationsModule, ModalComponent],
      }).compileComponents();

      const dialog = TestBed.inject(MatDialog);

      const p = ModalComponent.open(dialog, { title: 't', message: 'm' });

      const opened = dialog.openDialogs[0];
      opened.close('valor truthy');

      tick();

      await expectAsync(p).toBeResolvedTo(true);
    }));

    it('resuelve a false cuando el diálogo se cierra con un valor falsy', fakeAsync(async () => {
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [MatDialogModule, NoopAnimationsModule, ModalComponent],
      }).compileComponents();

      const dialog = TestBed.inject(MatDialog);

      const p = ModalComponent.open(dialog, { title: 't', message: 'm' });

      const opened = dialog.openDialogs[0];
      opened.close(undefined); // valor falsy

      tick();

      await expectAsync(p).toBeResolvedTo(false);
    }));
  });
});
