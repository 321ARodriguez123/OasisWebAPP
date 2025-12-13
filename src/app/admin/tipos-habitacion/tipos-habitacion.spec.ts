import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposHabitacionComponent } from './tipos-habitacion';

describe('TiposHabitacion', () => {
  let component: TiposHabitacionComponent;
  let fixture: ComponentFixture<TiposHabitacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiposHabitacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiposHabitacionComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
