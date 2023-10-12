import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoUserLaboComponent } from './info-user-labo.component';

describe('InfoUserLaboComponent', () => {
  let component: InfoUserLaboComponent;
  let fixture: ComponentFixture<InfoUserLaboComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoUserLaboComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoUserLaboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
