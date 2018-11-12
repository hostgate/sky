import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
import { AuthenticationService } from '../../login/authentication.service';
import { CellcomStatusService } from '../cellcom-status.service';

@Component({
  selector: 'app-cellcom-status',
  templateUrl: './cellcom-status.component.html',
  styleUrls: ['./cellcom-status.component.css']
})
export class CellcomStatusComponent implements OnInit {
  details:any=null;
  phone:string='';
  loading:Boolean=false;
  last_job:any=null;
  constructor( private router:Router,
    private trans:TranslateService, 
    private lsService:LocalStorageService,
    public authService:AuthenticationService,
    private route: ActivatedRoute,
    private cellcomStatusService:CellcomStatusService) {}
    sim:string=null; 
    ngOnInit() { 
    }
    loadDetails(){
      this.loading=true;
      this.details=null;
      this.cellcomStatusService.get(this.phone).subscribe(res=>{
        this.loading=false;
        this.details=res; 
        if(res==false){
          this.details='0';
        }
        

      });
    }

    connect(){
      this.loading=true;
      this.last_job=null;
      this.cellcomStatusService.connect(this.phone).subscribe(res=>{
        this.loading=false;
        this.sim='';
        if(res && res['last_job']){
          this.last_job=res['last_job'];
        }
        else{
          this.loadDetails();
        }
      });
    }
    disconnect(){
      this.loading=true;
      this.last_job=null;
      this.cellcomStatusService.disconnect(this.phone).subscribe(res=>{
        this.loading=false;
        this.sim='';
        if(res && res['last_job']){
          this.last_job=res['last_job'];
        }
        else{
          this.loadDetails();
        }
       
      });
    }
    changeSim(){
      this.loading=true;
      this.last_job=null;
      this.cellcomStatusService.change_sim(this.phone,this.sim).subscribe(res=>{
        this.loading=false;
        this.sim='';
        if(res && res['last_job']){
          this.last_job=res['last_job'];
        }
        else{
          this.loadDetails();
        }
      });
    }

}
