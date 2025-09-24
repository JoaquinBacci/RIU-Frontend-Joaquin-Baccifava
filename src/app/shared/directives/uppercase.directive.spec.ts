import { FormControl, NgControl } from '@angular/forms';
import { UppercaseDirective } from './uppercase.directive';

describe('UppercaseDirective', () => {
  it('convierte a mayúsculas', () => {
    const dummy = { control: new FormControl('') } as unknown as NgControl;
    const dir = new UppercaseDirective(dummy);
    const input = document.createElement('input');
    input.value = 'abc';
    dir.onInput({ target: input } as any);
    expect(dummy.control?.value).toBe('ABC');
  });
});