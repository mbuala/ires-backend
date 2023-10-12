import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultatsPatientsComponent } from './resultats-patients.component';

describe('ResultatsPatientsComponent', () => {
  let component: ResultatsPatientsComponent;
  let fixture: ComponentFixture<ResultatsPatientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultatsPatientsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultatsPatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
