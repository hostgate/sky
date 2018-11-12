import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
    MdAutocompleteModule,
    MdButtonModule,
    MdButtonToggleModule,
    MdCardModule,
    MdCheckboxModule,
    MdChipsModule,
    MdDatepickerModule,
    MdDialogModule,
    //MdExpansionModule,
    MdGridListModule,
    MdIconModule,
    MdInputModule,
    MdListModule,
    MdMenuModule,
    MdNativeDateModule,
    MdPaginatorModule,
    MdProgressBarModule,
    MdProgressSpinnerModule,
    MdRadioModule,
   // MdRippleModule,
    MdSelectModule,
    MdSidenavModule,
    //MdSliderModule,
    MdSlideToggleModule,
    MdSnackBarModule,
    MdSortModule,
    MdTableModule,
   MdTabsModule,
    MdToolbarModule, 
    DateAdapter,
    MdTooltipModule,
    MdPaginatorIntl,
  } from '@angular/material';
  import {HttpModule} from '@angular/http';
  import {CdkTableModule} from '@angular/cdk/table';
import { DateFormat } from './date-format';
import { MyClassIntl } from './my-class-intl';
@NgModule({
    exports: [
        CdkTableModule,
        MdAutocompleteModule,
        MdButtonModule,
        MdButtonToggleModule,
        MdCardModule,
        MdCheckboxModule,
        MdChipsModule,
        MdDatepickerModule,
        MdDialogModule,
      //  MdExpansionModule,
        MdGridListModule,
        MdIconModule,
        MdInputModule,
        MdListModule,
        MdMenuModule,
        MdPaginatorModule,
        MdProgressBarModule,
        MdProgressSpinnerModule,
        MdRadioModule,
       // MdRippleModule,
        MdSelectModule,
        MdSidenavModule,
        //MdSliderModule,
        MdSlideToggleModule,
        MdSnackBarModule,
        MdSortModule,
        MdTableModule,
       MdTabsModule,
        MdToolbarModule,
        MdTooltipModule,
      ],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpModule, 
        MdNativeDateModule,
        ReactiveFormsModule,
    ],
  declarations: [],
providers: [
    { provide: DateAdapter, useClass: DateFormat },
],
})
export class MaterialModule { 
  constructor(private dateAdapter:DateAdapter<Date>) {
		this.dateAdapter.setLocale('he-IL'); // DD/MM/YYYY
	}
}
