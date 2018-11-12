import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MemberSearchComponent } from '../member-search/member-search.component';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
import { AuthenticationService } from '../../login/authentication.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  lan:any;
  show_accounts=false;
  constructor(
    private router:Router,
    private trans:TranslateService, 
    private lsService:LocalStorageService,
    public authService:AuthenticationService) {
    this.lan=this.lsService.getStorage('lan');
    this.trans.onLangChange.subscribe((event: LangChangeEvent) => {
      this.lan=event.lang;
    });
    localStorage.setItem('currentComponent','app-home');
   }
  @Input() loading:boolean=false;
  isSearchActive:boolean=false;
  hasPhone:boolean=true;//set in member-search
  phone:any=null;//set in member-search
  phones:any[]=null;//set in member-search
  hasMember:boolean=true;//set in member-search
  member:any=null;//set in member-search
  customers:any[]=null;
  agents:any[]=null;
  hasOrders:boolean=true;//set in member-search
  orders:any[];//set in member-search
  ngOnInit() {}
  phoneLink(){
    if(this.authService.isAgent()){
      return '/הזמנה-חדשה';
    }
    return '/מספר';
  }
}
