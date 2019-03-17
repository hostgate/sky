import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
import { AuthenticationService } from '../../login/authentication.service';
import { HotmobileStatusService } from '../hotmobile-status.service';

@Component({
  selector: 'app-hotmobile-status',
  templateUrl: './hotmobile-status.component.html',
  styleUrls: ['./hotmobile-status.component.css']
})
export class HotmobileStatusComponent implements OnInit {
  details:any=null;
  phone:string='';
  loading:Boolean=false;
  constructor( private router:Router,
    private trans:TranslateService, 
    private lsService:LocalStorageService,
    public authService:AuthenticationService,
    private route: ActivatedRoute,
    private hotmobileStatusService:HotmobileStatusService) {}
    sim:string=null; 
    ngOnInit() { 
    }
    loadDetails(){
      this.loading=true;
      this.details=null;
      this.hotmobileStatusService.get(this.phone).subscribe(res=>{
        this.loading=false;
        this.details=res;

      });
    }

    connect(){
      this.loading=true;
      this.hotmobileStatusService.connect(this.phone).subscribe(res=>{
        this.loading=false;
        this.sim='';
        this.loadDetails();
      });
    }
    connect7(){
      this.loading=true;
      this.hotmobileStatusService.connect7(this.phone).subscribe(res=>{
        this.loading=false;
        this.sim='';
        this.loadDetails();
      });
    }
    disconnect(){
      this.loading=true;
      this.hotmobileStatusService.disconnect(this.phone).subscribe(res=>{
        this.loading=false;
        this.sim='';
        this.loadDetails();
      });
    }
    disconnect6(){
      this.loading=true;
      this.hotmobileStatusService.disconnect6(this.phone).subscribe(res=>{
        this.loading=false;
        this.sim='';
        this.loadDetails();
      });
    }
    changeSim(){
      this.loading=true;
      this.hotmobileStatusService.change_sim(this.phone,this.sim).subscribe(res=>{
        this.loading=false;
        this.sim='';
        this.loadDetails();
      });
    }

}
