import { Component, OnInit , Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA,ENTER } from '@angular/material';
import { HotmobileStatusService } from '../../hotmobile-status/hotmobile-status.service';
import { CellcomStatusService } from '../../cellcom-status/cellcom-status.service';

@Component({
  selector: 'app-refresh-connect',
  templateUrl: './refresh-connect.component.html',
  styleUrls: ['./refresh-connect.component.css']
})
export class RefreshConnectComponent implements OnInit {

  constructor( 
    public dialogRef: MdDialogRef<RefreshConnectComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private hotmobileStatusService:HotmobileStatusService,
    private cellcomStatusService:CellcomStatusService) { 
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
  connect(){
    this.company=this.row.company_id;
    this.sim=this.row.sim;
    this.phone=this.row.phone;
    if(this.row.accepted_moved_to_phone=='1')this.phone=this.row.moved_to_phone;
    this.loading=true;
    if(this.company!=1){
      this.cellcomStatusService.disconnect(this.phone).subscribe(res=>{
        this.cellcomStatusService.change_sim(this.phone,this.sim).subscribe(res=>{
          this.loading=false;
          this.dialogRef.close();
        });
      });
    }
    else{
      this.hotmobileStatusService.change_sim(this.phone,this.sim).subscribe(res=>{
        this.loading=false;
        this.dialogRef.close();
      });
    }
    
  }
  onNoClick(){
    this.dialogRef.close();
  }
}
