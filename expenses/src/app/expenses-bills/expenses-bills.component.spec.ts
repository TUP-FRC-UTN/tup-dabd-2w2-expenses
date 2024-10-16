import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesBillsComponent } from './expenses-bills.component';

describe('ExpensesBillsComponent', () => {
  let component: ExpensesBillsComponent;
  let fixture: ComponentFixture<ExpensesBillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpensesBillsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpensesBillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
