import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings/settings.component';
import { SettingsService } from './settings.service';
import { TranslateModule } from 'ng2-translate';
import { MaterialModule } from '../material.module';
import { EditComponent } from './edit/edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ValidErrModule } from '../valid-err/valid-err.module';
import { AuthenticationService } from '../login/authentication.service';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,MaterialModule,FormsModule,
    ReactiveFormsModule,ValidErrModule,
  ],
  declarations: [SettingsComponent, EditComponent],
  providers:[{ provide: SettingsService, useClass: SettingsService },
    AuthenticationService],
  entryComponents: [
    EditComponent
  ]
})
export class SettingsModule { }
