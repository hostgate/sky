import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidErrComponent } from './valid-err/valid-err.component';
import { TranslateService, TranslateModule } from "ng2-translate";
import { MaterialModule } from '../material.module';
@NgModule({
  imports: [
    CommonModule,TranslateModule,
    MaterialModule
  ],
  exports:[ValidErrComponent,TranslateModule],
  declarations: [ValidErrComponent]
})
export class ValidErrModule { }
