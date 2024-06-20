import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMotelComponent } from './add-motel.component';

describe('AddMotelComponent', () => {
  let component: AddMotelComponent;
  let fixture: ComponentFixture<AddMotelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddMotelComponent]
    });
    fixture = TestBed.createComponent(AddMotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
