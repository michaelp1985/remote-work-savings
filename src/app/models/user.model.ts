import { ChildCare } from "./child-care";
import { City } from "./city.model";
import { Commute } from "./commute.model";
import { Misc } from "./misc";
import { RemoteWorkhistory } from "./remote-workhistory.model";
import { State } from "./state.model";

export class User {
  remoteWorkHistory: RemoteWorkhistory = new RemoteWorkhistory();  
  commute: Commute = new Commute(); 
  childCare: ChildCare = new ChildCare();        
  misc: Misc = new Misc();
  state: State = new State();
  city?: City;  
}
