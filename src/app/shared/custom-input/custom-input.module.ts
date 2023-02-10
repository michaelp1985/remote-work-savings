import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyInputDirectiveDirective } from './currency-input-directive.directive';



@NgModule({
  declarations: [
    CurrencyInputDirectiveDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CurrencyInputDirectiveDirective
  ]
})
export class CustomInputModule { }
