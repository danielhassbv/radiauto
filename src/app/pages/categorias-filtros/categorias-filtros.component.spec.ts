import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriasFiltrosComponent } from './categorias-filtros.component';

describe('CategoriasFiltrosComponent', () => {
  let component: CategoriasFiltrosComponent;
  let fixture: ComponentFixture<CategoriasFiltrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriasFiltrosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriasFiltrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
