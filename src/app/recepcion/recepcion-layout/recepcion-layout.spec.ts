import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecepcionLayout } from './recepcion-layout';

describe('RecepcionLayout', () => {
  let component: RecepcionLayout;
  let fixture: ComponentFixture<RecepcionLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecepcionLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecepcionLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
