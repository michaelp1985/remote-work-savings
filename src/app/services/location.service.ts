import { Injectable } from '@angular/core';
import { City } from '../models/city.model';
import { State } from '../models/state.model';

export interface StateCity {
  state: string;
  cities: City[];
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor() { }

  getStates(){
    let states: State[] = JSON.parse("[{\"name\":\"Alabama\",\"abbreviation\":\"AL\",\"area\":\"R30\"},{\"name\":\"Alaska\",\"abbreviation\":\"AK\",\"area\":\"R5XCA\"},{\"name\":\"Arizona\",\"abbreviation\":\"AZ\",\"area\":\"R5XCA\"},{\"name\":\"Arkansas\",\"abbreviation\":\"AR\",\"area\":\"R30\"},{\"name\":\"California\",\"abbreviation\":\"CA\",\"area\":\"SCA\"},{\"name\":\"Colorado\",\"abbreviation\":\"CO\",\"area\":\"SCO\"},{\"name\":\"Connecticut\",\"abbreviation\":\"CT\",\"area\":\"R1X\"},{\"name\":\"Delaware\",\"abbreviation\":\"DE\",\"area\":\"R1Y\"},{\"name\":\"Florida\",\"abbreviation\":\"FL\",\"area\":\"SFL\"},{\"name\":\"Georgia\",\"abbreviation\":\"GA\",\"area\":\"R1Z\"},{\"name\":\"Hawaii\",\"abbreviation\":\"HI\",\"area\":\"R5XCA\"},{\"name\":\"Idaho\",\"abbreviation\":\"ID\",\"area\":\"R40\"},{\"name\":\"Illinois\",\"abbreviation\":\"IL\",\"area\":\"R20\"},{\"name\":\"Indiana\",\"abbreviation\":\"IN\",\"area\":\"R20\"},{\"name\":\"Iowa\",\"abbreviation\":\"IA\",\"area\":\"R20\"},{\"name\":\"Kansas\",\"abbreviation\":\"KS\",\"area\":\"R20\"},{\"name\":\"Kentucky\",\"abbreviation\":\"KY\",\"area\":\"R20\"},{\"name\":\"Louisiana\",\"abbreviation\":\"LA\",\"area\":\"R30\"},{\"name\":\"Maine\",\"abbreviation\":\"ME\",\"area\":\"R1X\"},{\"name\":\"Maryland\",\"abbreviation\":\"MD\",\"area\":\"R1Y\"},{\"name\":\"Massachusetts\",\"abbreviation\":\"MA\",\"area\":\"SMA\"},{\"name\":\"Michigan\",\"abbreviation\":\"MI\",\"area\":\"R20\"},{\"name\":\"Minnesota\",\"abbreviation\":\"MN\",\"area\":\"SMN\"},{\"name\":\"Mississippi\",\"abbreviation\":\"MS\",\"area\":\"R30\"},{\"name\":\"Missouri\",\"abbreviation\":\"MO\",\"area\":\"R20\"},{\"name\":\"Montana\",\"abbreviation\":\"MT\",\"area\":\"R40\"},{\"name\":\"Nebraska\",\"abbreviation\":\"NE\",\"area\":\"R20\"},{\"name\":\"Nevada\",\"abbreviation\":\"NV\",\"area\":\"R5XCA\"},{\"name\":\"New Hampshire\",\"abbreviation\":\"NH\",\"area\":\"R1X\"},{\"name\":\"New Jersey\",\"abbreviation\":\"NJ\",\"area\":\"R1Y\"},{\"name\":\"New Mexico\",\"abbreviation\":\"NM\",\"area\":\"R30\"},{\"name\":\"New York\",\"abbreviation\":\"NY\",\"area\":\"SNY\"},{\"name\":\"North Carolina\",\"abbreviation\":\"NC\",\"area\":\"R1Z\"},{\"name\":\"North Dakota\",\"abbreviation\":\"ND\",\"area\":\"R20\"},{\"name\":\"Ohio\",\"abbreviation\":\"OH\",\"area\":\"SOH\"},{\"name\":\"Oklahoma\",\"abbreviation\":\"OK\",\"area\":\"R20\"},{\"name\":\"Oregon\",\"abbreviation\":\"OR\",\"area\":\"R5XCA\"},{\"name\":\"Pennsylvania\",\"abbreviation\":\"PA\",\"area\":\"R1Y\"},{\"name\":\"Rhode Island\",\"abbreviation\":\"RI\",\"area\":\"R1X\"},{\"name\":\"South Carolina\",\"abbreviation\":\"SC\",\"area\":\"R1Z\"},{\"name\":\"South Dakota\",\"abbreviation\":\"SD\",\"area\":\"R20\"},{\"name\":\"Tennessee\",\"abbreviation\":\"TN\",\"area\":\"R20\"},{\"name\":\"Texas\",\"abbreviation\":\"TX\",\"area\":\"STX\"},{\"name\":\"Utah\",\"abbreviation\":\"UT\",\"area\":\"R40\"},{\"name\":\"Vermont\",\"abbreviation\":\"VT\",\"area\":\"R1X\"},{\"name\":\"Virginia\",\"abbreviation\":\"VA\",\"area\":\"R1Z\"},{\"name\":\"Washington\",\"abbreviation\":\"WA\",\"area\":\"SWA\"},{\"name\":\"West Virginia\",\"abbreviation\":\"WV\",\"area\":\"R1Z\"},{\"name\":\"Wisconsin\",\"abbreviation\":\"WI\",\"area\":\"R20\"},{\"name\":\"Wyoming\",\"abbreviation\":\"WY\",\"area\":\"R40\"}]");;

    return states;
  }

  getCitiesByStateAbbreviation(abbreviation: string){
    let cityData: StateCity[] = JSON.parse("[{\"state\":\"CA\",\"cities\":[{\"name\":\"Los Angeles\",\"area\":\"Y05LA\"},{\"name\":\"San Francisco\",\"area\":\"Y05SF\"}]},{\"state\":\"CO\",\"cities\":[{\"name\":\"Denver\",\"area\":\"YDEN\"}]},{\"state\":\"NY\",\"cities\":[{\"name\":\"New York City\",\"area\":\"Y35NY\"}]},{\"state\":\"TX\",\"cities\":[{\"name\":\"Houston\",\"area\":\"Y44HO\"}]},{\"state\":\"WA\",\"cities\":[{\"name\":\"Seattle\",\"area\":\"Y48SE\"}]},{\"state\":\"MA\",\"cities\":[{\"name\":\"Boston\",\"area\":\"YBOS\"}]},{\"state\":\"FL\",\"cities\":[{\"name\":\"Miami\",\"area\":\"YMIA\"}]},{\"state\":\"IL\",\"cities\":[{\"name\":\"Chicago\",\"area\":\"YORD\"}]},{\"state\":\"OH\",\"cities\":[{\"name\":\"Cleveland\",\"area\":\"YCLE\"}]}]");
    
    return cityData.find((x) => x.state == abbreviation)?.cities ?? [];    
  }
}
