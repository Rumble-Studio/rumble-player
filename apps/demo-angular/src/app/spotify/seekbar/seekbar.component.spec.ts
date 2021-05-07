import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeekbarComponent } from './seekbar.component';

describe('SeekbarComponent', () => {
  let component: SeekbarComponent;
  let fixture: ComponentFixture<SeekbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeekbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeekbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
