import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacultyTabComponent } from './faculty-tab.component';

describe('FacultyTabComponent', () => {
  let component: FacultyTabComponent;
  let fixture: ComponentFixture<FacultyTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacultyTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacultyTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
