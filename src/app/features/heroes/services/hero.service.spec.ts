import { HeroService } from './hero.service';
import { firstValueFrom } from 'rxjs';

describe('HeroService', () => {
  let svc: HeroService;

  beforeEach(() => { svc = new HeroService(); });

  it('debería listar héroes iniciales', async () => {
    const list = await firstValueFrom(svc.list$());
    expect(list.length).toBeGreaterThan(0);
  });

  it('debería crear, obtener, actualizar y borrar', async () => {
    const created = svc.create({ name: 'BATMAN' });
    const found = await firstValueFrom(svc.getById$(created.id));
    expect(found?.name).toBe('BATMAN');

    const updated = svc.update({ id: created.id, name: 'BATMAN++' });
    expect(updated.name).toBe('BATMAN++');

    svc.delete(created.id);
    const after = await firstValueFrom(svc.getById$(created.id));
    expect(after).toBeUndefined();
  });

  it('searchByName$ filtra por substring', async () => {
    svc.create({ name: 'Ironman' });
    const r = await firstValueFrom(svc.searchByName$('man'));
    expect(r.some(h => h.name.includes('man') || h.name.includes('Man'))).toBeTrue();
  });
});
