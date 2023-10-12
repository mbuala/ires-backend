import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultatsCRRComponent } from './resultats-crr.component';

describe('ResultatsCRRComponent', () => {
  let component: ResultatsCRRComponent;
  let fixture: ComponentFixture<ResultatsCRRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultatsCRRComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultatsCRRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
