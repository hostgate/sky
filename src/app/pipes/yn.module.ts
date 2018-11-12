import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { YnPipe } from './yn.pipe';
import { ToFixedPipe } from './to-fixed.pipe';

@NgModule({
    imports:        [BrowserModule],
    declarations:   [YnPipe, ToFixedPipe],
    exports:        [YnPipe,ToFixedPipe],
})

export class YnModule {
} 