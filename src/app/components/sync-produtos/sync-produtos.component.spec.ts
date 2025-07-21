import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncProdutosComponent } from './sync-produtos.component';

describe('SyncProdutosComponent', () => {
  let component: SyncProdutosComponent;
  let fixture: ComponentFixture<SyncProdutosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SyncProdutosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SyncProdutosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
