import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseChargeTypeSelectComponent } from './expense-charge-type-select.component';

describe('ExpenseChargeTypeSelectComponent', () => {
  let component: ExpenseChargeTypeSelectComponent;
  let fixture: ComponentFixture<ExpenseChargeTypeSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseChargeTypeSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseChargeTypeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
