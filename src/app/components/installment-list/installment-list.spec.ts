import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallmentList } from './installment-list';

describe('InstallmentList', () => {
  let component: InstallmentList;
  let fixture: ComponentFixture<InstallmentList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstallmentList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstallmentList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
