import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesBillsNavComponent } from './expenses-bills-nav.component';

describe('ExpensesBillsNavComponent', () => {
  let component: ExpensesBillsNavComponent;
  let fixture: ComponentFixture<ExpensesBillsNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpensesBillsNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpensesBillsNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
