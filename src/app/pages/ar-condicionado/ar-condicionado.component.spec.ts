import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArCondicionadoComponent } from './ar-condicionado.component';

describe('ArCondicionadoComponent', () => {
  let component: ArCondicionadoComponent;
  let fixture: ComponentFixture<ArCondicionadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArCondicionadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArCondicionadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
