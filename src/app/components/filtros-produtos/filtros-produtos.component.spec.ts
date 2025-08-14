import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosProdutosComponent } from './filtros-produtos.component';

describe('FiltrosProdutosComponent', () => {
  let component: FiltrosProdutosComponent;
  let fixture: ComponentFixture<FiltrosProdutosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltrosProdutosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltrosProdutosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
