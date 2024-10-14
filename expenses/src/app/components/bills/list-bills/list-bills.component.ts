import { Component, inject, NgModule, OnInit } from '@angular/core';
import { Bill } from '../../../models/bill';
import { BillService } from '../../../services/bill.service';
import Period from '../../../models/period'
import { Provider } from '../../../models/provider';
import Category from '../../../models/category';
import { CategoryService } from '../../../services/category.service';
import { ProviderService } from '../../../services/provider.service';
import { FormsModule } from '@angular/forms';
import { PeriodService } from '../../../services/period.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-list-bills',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './list-bills.component.html',
  styleUrl: './list-bills.component.css'
})
export class ListBillsComponent implements OnInit {

  bills: Bill[] = [];
  filteredBills: Bill[] = [];
  billservice = inject(BillService);
  categoryService = inject(CategoryService);
  periodService = inject(PeriodService);
  providerService = inject(ProviderService);
  categoryList: Category[] = [];
  selectedCategory: Category = new Category();
  providersList: Provider[] = [];
  selectedProvider: Provider = new Provider();
  periodsList: Period[] = [];
  selectedPeriod: Period = new Period();


  ngOnInit(): void {
    this.loadBills();
    this.getCategories();
    this.getProviders();
    this.getPeriods();

  }



  filterBills() {

    console.log(JSON.stringify(this.selectedPeriod.month))
    console.log(JSON.stringify(this.selectedProvider))
    console.log(JSON.stringify(this.selectedCategory))
    this.filteredBills = this.filteredBills.filter((bill) => {
      const matchesPeriod = this.selectedPeriod ? (bill.period_id.month === this.selectedPeriod.month && bill.period_id.year === this.selectedPeriod.year) : true;
      const matchesProvider = this.selectedProvider ? (bill.supplier_id.id === this.selectedProvider.id) : true;
      const matchesCategory = this.selectedCategory ? (bill.category_id.categoryBillId === this.selectedCategory.categoryBillId) : true;

      return matchesPeriod && matchesProvider && matchesCategory
    })
  }

  unFilterBills(){
    this.filteredBills=this.bills
    this.selectedCategory = new Category();
    this.selectedPeriod= new Period();
    this.selectedProvider= new Provider();
  }

  openUpdateModal(bill: Bill) {
    return null
  }

  loadBills() {
    this.billservice.getAllBills().subscribe((bills) => {
      this.bills = bills;
      this.filteredBills = bills
    })
    console.log(this.bills);
  }
  getCategories() {
    this.categoryService.getAllCategories().subscribe((categories) => {
      this.categoryList = categories
    })
  }
  getProviders() {
    this.providerService.getAllProviders().subscribe((providers) => {
      this.providersList = providers
    })
  }

  getPeriods() {
    this.periodService.get().subscribe((periods) => {
      this.periodsList = periods
    })
  }

  openDeleteModal(id: number) {
    return null
  }
}
