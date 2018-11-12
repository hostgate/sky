import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComparisonsComponent, DisconnectDialog } from './comparisons/comparisons.component';
import { ComparisonsService } from './comparisons.service';
import { MomentModule } from 'angular2-moment';
import { MaterialModule } from '../material.module';
import { YnModule } from '../pipes/yn.module';
import { TranslateModule } from 'ng2-translate';
import { RouterModule } from '@angular/router';
import { ValidErrModule } from '../valid-err/valid-err.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ExcelService } from '../excel.service';
import { AuthenticationService } from '../login/authentication.service';

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
  declarations: [
    ComparisonsComponent,DisconnectDialog
  ],
  entryComponents: [
    DisconnectDialog,ComparisonsComponent
  ],
  exports:[
    DisconnectDialog
  ],
  providers: [
    { provide: ComparisonsService, useClass: ComparisonsService },
    { provide: ExcelService, useClass: ExcelService },
    AuthenticationService
  ],
})
export class ComparisonsModule { }
