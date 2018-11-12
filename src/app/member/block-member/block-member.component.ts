import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import { MemberService } from '../member.service';
import { YnPipe } from '../../pipes/yn.pipe';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
import { AuthenticationService } from '../../login/authentication.service';

@Component({
  selector: 'app-block-member',
  templateUrl: './block-member.component.html',
  styleUrls: ['./block-member.component.css']
})
export class BlockMemberComponent implements OnInit {

  loading:Boolean=false;
  lan:any;
  constructor(
    public dialogRef: MdDialogRef<BlockMemberComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private memberService:MemberService,
    public snackBar: MdSnackBar, private route: ActivatedRoute,
    private router:Router,
    private trans:TranslateService,
    private lsService:LocalStorageService,
    public authService:AuthenticationService) {
     this.lan=this.lsService.getStorage('lan');
      this.trans.onLangChange.subscribe((event: LangChangeEvent) => {
        this.lan=event.lang;
       
      });
      localStorage.setItem('currentComponent','app-block-member');
    }
  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
  }
  block(id,blockmsg,openmsg){
    this.data.loading=true;
    let msg=openmsg;
    if(this.data.free=='1'){
      msg=blockmsg;
    }
    this.memberService.blockMember(this.data.member).subscribe(res=>{
      this.snackBar.open(this.data.member.phone, msg, {
        duration: 2000,
      });
      this.data.data.ngOnInit();
      this.dialogRef.close();
    });
  }
}
