import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMotelComponent } from './update-motel.component';

describe('UpdateMotelComponent', () => {
  let component: UpdateMotelComponent;
  let fixture: ComponentFixture<UpdateMotelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateMotelComponent]
    });
    fixture = TestBed.createComponent(UpdateMotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
