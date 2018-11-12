import { Component, OnInit, Input } from '@angular/core';
import { ObligationService } from '../../users/obligation.service';

@Component({
  selector: 'app-obligation',
  templateUrl: './obligation.component.html',
  styleUrls: ['./obligation.component.css']
})
export class ObligationComponent implements OnInit {

  constructor(
    private obligationService:ObligationService
  ) { }
  @Input() id:number;
  @Input() loading:Boolean;
  obligation:any;
  ngOnInit() {
    this.loading=true;
    this.obligationService.getObligation(this.id).subscribe(obligation=>{
      this.loading=false;
      this.obligation=obligation;
      if(!this.obligation.credit)this.obligation.credit=0.0;
      let c=
      this.obligation.can_use=parseFloat(this.obligation.credit)+parseFloat(this.obligation.obligation);
      if(this.obligation.can_use<0){
        this.obligation.can_use=0;
      }
    });
  }

}
