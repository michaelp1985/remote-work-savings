import { NgModule } from '@angular/core';
import { 
  minDateValidator,
  maxDateValidator,
  minNumberValidator
} from './custom-validators';

@NgModule({
  providers: [    
    { provide: 'MIN_DATE_VALIDATOR', useValue: minDateValidator },
    { provide: 'MAX_DATE_VALIDATOR', useValue: maxDateValidator },
    { provide: 'MIN_NUMBER_VALIDATOR', useValue: minNumberValidator }
  ]
})
export class CustomValidatorsModule {  
  static minDateValidator = minDateValidator;
  static maxDateValidator = maxDateValidator;
  static minNumberValidator = minNumberValidator;
}