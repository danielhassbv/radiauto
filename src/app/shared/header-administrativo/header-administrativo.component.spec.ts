import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderAdministrativoComponent } from './header-administrativo.component';

describe('HeaderAdministrativoComponent', () => {
  let component: HeaderAdministrativoComponent;
  let fixture: ComponentFixture<HeaderAdministrativoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderAdministrativoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderAdministrativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
