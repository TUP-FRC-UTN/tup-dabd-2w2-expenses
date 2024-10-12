import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesLiquidationExpenseComponent } from './expenses-liquidation-expense.component';

describe('ExpensesLiquidationExpenseComponent', () => {
  let component: ExpensesLiquidationExpenseComponent;
  let fixture: ComponentFixture<ExpensesLiquidationExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpensesLiquidationExpenseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpensesLiquidationExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
