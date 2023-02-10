import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appCurrencyInput]'
})
export class CurrencyInputDirectiveDirective{

  private el: HTMLInputElement;

  constructor(private elementRef: ElementRef) {
    this.el = this.elementRef.nativeElement;
  }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string){    
    //this.el.value = this.formatAsCurrency(value);
  }

  @HostListener('focus', ['$event.target.value'])
  onFocus(value: string) {
    this.el.value = '';
  }

  @HostListener('blur', ['$event.target.value'])
  onBlur(value: string) {
    this.el.value = this.formatAsCurrency(value);
  }

  private formatAsNumber(value: string): string {
    return value.replace(/[^\d]/g, '');
  }

  private formatAsCurrency(value: string): string {

    if (!value.includes('.')){
      console.log(value);
      value += '.00';
    }    
    
    const numberValue = parseFloat(value.replace(/[^\d]/g, '')) / 100;
    let newNum = numberValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    console.log(newNum);
    return newNum;
  }
}

