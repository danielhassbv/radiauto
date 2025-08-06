import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LubrificantesComponent } from './lubrificantes.component';

describe('LubrificantesComponent', () => {
  let component: LubrificantesComponent;
  let fixture: ComponentFixture<LubrificantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LubrificantesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LubrificantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
