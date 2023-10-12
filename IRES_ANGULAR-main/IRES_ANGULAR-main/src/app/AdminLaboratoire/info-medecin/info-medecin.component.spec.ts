import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoMedecinComponent } from './info-medecin.component';

describe('InfoMedecinComponent', () => {
  let component: InfoMedecinComponent;
  let fixture: ComponentFixture<InfoMedecinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoMedecinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoMedecinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
