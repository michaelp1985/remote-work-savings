import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyInputDirectiveDirective } from './currency-input-directive.directive';
import { ClearInputDirective } from './clear-input.directive';

@NgModule({
  declarations: [CurrencyInputDirectiveDirective, ClearInputDirective],
  imports: [CommonModule],
  exports: [CurrencyInputDirectiveDirective, ClearInputDirective],
})
export class CustomInputModule {}
