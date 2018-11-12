import { Component, OnInit, Input } from '@angular/core';
import { LocalStorageService } from '../../local-storage.service';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { AuthenticationService } from '../../login/authentication.service';

@Component({
  selector: 'app-agent-obligation',
  templateUrl: './agent-obligation.component.html',
  styleUrls: ['./agent-obligation.component.css']
})
export class AgentObligationComponent implements OnInit {
  @Input() agent:any;
  @Input()
  public openObligationUpdate: Function; 
  lan:any;
  constructor(
    private trans:TranslateService, 
    private lsService:LocalStorageService,
    public authService:AuthenticationService) {
      this.lan=this.lsService.getStorage('lan');
      this.trans.onLangChange.subscribe((event: LangChangeEvent) => {
        this.lan=event.lang;
      });
      localStorage.setItem('currentComponent','app-agent-obligation');
     }

  ngOnInit() {
  }

}
