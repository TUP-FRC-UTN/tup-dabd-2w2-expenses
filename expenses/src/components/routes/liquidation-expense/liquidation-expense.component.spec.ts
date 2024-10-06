import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidationExpenseComponent } from './liquidation-expense.component';

describe('LiquidationExpenseComponent', () => {
  let component: LiquidationExpenseComponent;
  let fixture: ComponentFixture<LiquidationExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiquidationExpenseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiquidationExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
