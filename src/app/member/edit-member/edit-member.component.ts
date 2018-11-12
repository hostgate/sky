import { Component, OnInit } from '@angular/core';
import { MemberService } from '../member.service';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
import { AuthenticationService } from '../../login/authentication.service';

@Component({
  selector: 'app-edit-member',
  templateUrl: './edit-member.component.html',
  styleUrls: ['./edit-member.component.css']
})
export class EditMemberComponent implements OnInit {
  lan:any;
  constructor(private memberService:MemberService,private trans:TranslateService, private lsService:LocalStorageService,
    public authService:AuthenticationService) { 
    this.lan=this.lsService.getStorage('lan');
    this.trans.onLangChange.subscribe((event: LangChangeEvent) => {
      this.lan=event.lang;
    });
    localStorage.setItem('currentComponent','app-edit-member');
   }

  ngOnInit() {
  }

}
