import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapturaEmailComponent } from './captura-email.component';

describe('CapturaEmailComponent', () => {
  let component: CapturaEmailComponent;
  let fixture: ComponentFixture<CapturaEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapturaEmailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CapturaEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
