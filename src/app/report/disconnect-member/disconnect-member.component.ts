import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { HotmobileStatusService } from '../../hotmobile-status/hotmobile-status.service';
import { CellcomStatusService } from '../../cellcom-status/cellcom-status.service';
import { OrderService } from '../../order/order.service';

@Component({
  selector: 'app-disconnect-member',
  templateUrl: './disconnect-member.component.html',
  styleUrls: ['./disconnect-member.component.css']
})
export class DisconnectMemberComponent implements OnInit {

  constructor( 
    public dialogRef: MdDialogRef<DisconnectMemberComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private hotmobileStatusService:HotmobileStatusService,
    private cellcomStatusService:CellcomStatusService,
  private orderService:OrderService) { 
      this.row=this.data.row;
  }
  row:any=null;
  company:number;
  loading:Boolean=false;
  phone:any=null;
  sim:any=null;
  ngOnInit(){
    //this.connect();
  }
  disconnect(){
    this.company=this.row.company_id;
    this.sim=this.row.sim;
    this.phone=this.row.phone;
    if(this.row.accepted_moved_to_phone=='1')this.phone=this.row.moved_to_phone;
    this.loading=true;
    
    if(this.company!=1){
      this.cellcomStatusService.disconnect(this.phone).subscribe(res=>{
          this.loading=false;
          this.dialogRef.close();
      });
    }
    else{
      this.hotmobileStatusService.disconnect(this.phone).subscribe(res=>{
        console.log(this.phone);
        console.log(this.company); 
        this.loading=false;
        this.dialogRef.close();
      });
    }
    this.orderService.cancelCompleted(this.row).subscribe(r=>{});
  }
  
  onNoClick(){
    this.dialogRef.close();
  }
}
