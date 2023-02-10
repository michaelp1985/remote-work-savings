import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-misc',
  templateUrl: './misc.component.html',
  styleUrls: ['./misc.component.css']
})
export class MiscComponent implements OnInit {

  clothingCost: number = 0;
  gettingReadyTimeInMinutes: number = 0;  

  constructor(private readonly userService: UserService) { }

  ngOnInit(): void {
    this.clothingCost = this.userService.user.misc.clothingCostPerYear;
    this.gettingReadyTimeInMinutes = this.userService.user.misc.morningRoutineInMinutes;
  }

  ngOnDestroy(){
    this.userService.user.misc.clothingCostPerYear = this.clothingCost;
    this.userService.user.misc.morningRoutineInMinutes = this.gettingReadyTimeInMinutes;
  }
}
