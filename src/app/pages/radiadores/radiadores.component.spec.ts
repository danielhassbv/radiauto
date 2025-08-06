import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiadoresComponent } from './radiadores.component';

describe('RadiadoresComponent', () => {
  let component: RadiadoresComponent;
  let fixture: ComponentFixture<RadiadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadiadoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadiadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
