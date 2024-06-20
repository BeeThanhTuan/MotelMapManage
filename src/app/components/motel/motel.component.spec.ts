import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotelComponent } from './motel.component';

describe('MotelComponent', () => {
  let component: MotelComponent;
  let fixture: ComponentFixture<MotelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MotelComponent]
    });
    fixture = TestBed.createComponent(MotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
