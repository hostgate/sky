import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CellcomStatusComponent } from './cellcom-status/cellcom-status.component';
import { CellcomStatusService } from './cellcom-status.service';
import { AuthenticationService } from '../login/authentication.service';
import { LocalStorageService } from '../local-storage.service';
import { MomentModule } from 'angular2-moment';
import { MaterialModule } from '../material.module';
import { YnModule } from '../pipes/yn.module';
import { TranslateModule } from 'ng2-translate';
import { RouterModule } from '@angular/router';
import { ValidErrModule } from '../valid-err/valid-err.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ValidErrModule,
    RouterModule,
    TranslateModule,
    YnModule,
    MaterialModule,
    MomentModule
  ],
  declarations: [CellcomStatusComponent],
  providers: [
    { provide: CellcomStatusService, useClass: CellcomStatusService },
    
     AuthenticationService,
     LocalStorageService
  ]
})
export class CellcomStatusModule { }
