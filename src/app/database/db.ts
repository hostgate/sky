import { BehaviorSubject } from "rxjs";

export class DB {
    dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    get data(): any[] { return this.dataChange.value; }
    constructor(res:any[]) {
      if(res.length>0)
      res.forEach(element=>{
        this.add(element)
      });
    }
    add(element:any) {
      const copiedData = this.data.slice();
      copiedData.push(element);
      this.dataChange.next(copiedData);
    }
  }