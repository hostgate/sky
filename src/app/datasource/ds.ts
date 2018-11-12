import { DataSource } from "@angular/cdk/collections";
import { BehaviorSubject } from "rxjs";
import { DB } from "../database/db";
import { MdSort, MdPaginator } from "@angular/material";
import { Observable } from "rxjs/Observable";

export class DS extends DataSource<any> {
    _filterChange = new BehaviorSubject('');
    get filter(): string { return this._filterChange.value; }
    set filter(filter: string) { this._filterChange.next(filter); }
    constructor(private _Database: DB, 
                private _sort: MdSort,
                private _paginator: MdPaginator) {
      super();
    }
    connect(): Observable<any[]> {
      const displayDataChanges = [
        this._Database.dataChange,
        this._filterChange,
        this._sort.sortChange,
        this._paginator.page,
      ];
      return Observable.merge(...displayDataChanges).map(() => {
        const data= this.getSortedData().filter((item: any) => {
          let searchStr ;
          Object.keys(item).forEach(function(key) {
            searchStr+=item[key]+" ";
            
            });
            searchStr=searchStr.toLowerCase();
          return searchStr.indexOf(this.filter.toLowerCase()) != -1;
        });
        const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
        return data.splice(startIndex, this._paginator.pageSize);
      });
    }
    getFSData():any[]{
      return this.getSortedData().filter((item: any) => {
        let searchStr ;
        Object.keys(item).forEach(function(key) {
          searchStr+=item[key]+" ";
          
          });
          searchStr=searchStr.toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) != -1;
      });
    }
    getSortedData(): any[] {
      const data = this._Database.data.slice();
      if (!this._sort.active || this._sort.direction == '') { return data; }
      return data.sort((a, b) => {
        let propertyA: number|string = '';
        let propertyB: number|string = '';
        [propertyA, propertyB] = [a[this._sort.active], b[this._sort.active ]];
        let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
        let valueB = isNaN(+propertyB) ? propertyB : +propertyB;
        return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
      });
    }
    disconnect() {}
  }
  