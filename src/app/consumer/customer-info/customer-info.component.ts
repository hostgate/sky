import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService } from '../../login/authentication.service';

@Component({
  selector: 'app-customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.css']
})
export class CustomerInfoComponent implements OnInit {

  constructor(
    public authService:AuthenticationService) { 

    localStorage.setItem('currentComponent','app-customer-info');
    }

  @Input() customer:any;
  @Input()
  public load: Function; 
  ngOnInit() {
  }

}
