import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotelPendingComponent } from './motel-pending.component';

describe('MotelPendingComponent', () => {
  let component: MotelPendingComponent;
  let fixture: ComponentFixture<MotelPendingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MotelPendingComponent]
    });
    fixture = TestBed.createComponent(MotelPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
