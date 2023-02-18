import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-food',
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.scss']
})
export class FoodComponent implements OnInit {

  foodCostPerWeek: number = 0;
  beverageCostPerWeek: number = 0;  

  constructor(private readonly userService: UserService) { }

  ngOnInit(): void {
    this.beverageCostPerWeek = this.userService.user.misc.beverageCostPerWeek;
    this.foodCostPerWeek = this.userService.user.misc.foodCostPerWeek;
  }

  ngOnDestroy() {
    this.userService.user.misc.foodCostPerWeek = this.foodCostPerWeek;
    this.userService.user.misc.beverageCostPerWeek = this.beverageCostPerWeek;
    this.userService.calculateFoodBeverageCost();
  }
}
