import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({ 
  selector: '[appUppercase]',
  standalone: false
})
export class UppercaseDirective {
  constructor(private control: NgControl) { }
  @HostListener('input', ['$event'])
  onInput(ev: Event) {
    const target = ev.target as HTMLInputElement;
    const upper = target.value.toUpperCase();
    this.control.control?.setValue(upper, { emitEvent: false });
  }
}