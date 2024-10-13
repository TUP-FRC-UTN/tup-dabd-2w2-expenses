import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetByLotAndPeriodComponent } from './get-by-lot-and-period.component';

describe('GetByLotAndPeriodComponent', () => {
  let component: GetByLotAndPeriodComponent;
  let fixture: ComponentFixture<GetByLotAndPeriodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetByLotAndPeriodComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetByLotAndPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
