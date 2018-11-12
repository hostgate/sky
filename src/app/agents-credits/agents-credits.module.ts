import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentsCreditsComponent } from './agents-credits/agents-credits.component';
import { AgentsCreditsService } from './agents-credits.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ValidErrModule } from '../valid-err/valid-err.module';
import { TranslateModule } from 'ng2-translate';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';
import { YnModule } from '../pipes/yn.module';
import { AuthenticationService } from '../login/authentication.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ValidErrModule,
    TranslateModule,
    MaterialModule, 
    RouterModule,
    YnModule
  ],
  declarations: [AgentsCreditsComponent],
  exports: [
    AgentsCreditsComponent, 
    TranslateModule,
    ValidErrModule
  ],
  entryComponents: [
    AgentsCreditsComponent
  ],
  providers:[
    {provide: AgentsCreditsService, useClass: AgentsCreditsService},
    AuthenticationService
  ],
})
export class AgentsCreditsModule { }
