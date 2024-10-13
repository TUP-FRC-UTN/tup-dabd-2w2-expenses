import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetByPeriodComponent } from './get-by-period.component';

describe('GetByPeriodComponent', () => {
  let component: GetByPeriodComponent;
  let fixture: ComponentFixture<GetByPeriodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetByPeriodComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetByPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
