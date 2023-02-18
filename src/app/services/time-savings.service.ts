import { Injectable } from '@angular/core';
import { ChildCare } from '../models/child-care';
import { Commute } from '../models/commute.model';
import { RemoteWorkhistory } from '../models/remote-workhistory.model';
import { TimeData } from '../models/time.model';

@Injectable({
  providedIn: 'root'
})
export class TimeSavingsService {

  readonly holidaysTotal: number = 6;

  constructor() { }

  calculateTimeSavingsToday(commuteDate: Commute, remoteWorkHistory: RemoteWorkhistory, childCare: ChildCare): TimeData {    
    
    const totalRemoteWorkingDays = this.getTotalRemoteWorkingDays(remoteWorkHistory);  
    
    // caculate time saved per day
    let timeSavedInMinutes = (totalRemoteWorkingDays * commuteDate.commuteMinutesPerDay);
    let minutesSaved = timeSavedInMinutes % 60;
    let hoursSaved = Math.floor(timeSavedInMinutes / 60);
    let daysSaved = Math.floor(hoursSaved / 24);
    let weeksSaved = Math.floor(daysSaved / 5);
    
    let timeSaved: TimeData = {
      totalMinutesMinusHoursSaved: minutesSaved,
      totalMinutesSaved: timeSavedInMinutes,
      totalHoursSaved: hoursSaved,
      totalDaysSaved: daysSaved,
      totalWeeksSaved: weeksSaved
    }

    return timeSaved;
  }

  getTotalRemoteWorkingDays(remoteWorkHistory: RemoteWorkhistory){

    const totalPossibleWorkingDays = this.getTotalPossibleWorkingDays(remoteWorkHistory);
    const totalWeeks = Math.floor(totalPossibleWorkingDays / 5);
    return remoteWorkHistory.remoteWorkDays * totalWeeks;
  }

  getTotalPossibleWorkingDays(remoteWorkHistory: RemoteWorkhistory){

    let currentDate = new Date();
    let startYear = remoteWorkHistory.startDate.getFullYear();
    let currentYear = new Date().getFullYear();
    let totalDays = 0;

    while(startYear < currentYear){
      totalDays += this.getDaysInYear(startYear);
      startYear++;
    }

    // get days since the current year has begun
    let daysThisYear = this.getDayOfYear(currentDate);

    // remove days from starting year
    let daysToRemove = this.getDayOfYear(remoteWorkHistory.startDate);
    
    // account for weekends
    totalDays += daysThisYear;
    totalDays -= daysToRemove;
    let weekendDays = ( totalDays / 7 ) * 2;

    totalDays -= weekendDays;

    //account for hollidays 
    totalDays -= this.holidaysTotal * ( currentYear - startYear); 
    
    return totalDays;
  }

  getDayOfYear(date: Date): number {    
    const dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    var mn = date.getMonth();
    var dn = date.getDate();
    var dayOfYear = dayCount[mn] + dn;
    if (mn > 1 && this.isLeapYear(date.getFullYear())) dayOfYear++;
    return dayOfYear;
  }

  getDaysInYear(year: number): number {
    return (this.isLeapYear(year)) ? 366 : 365;
  }

  getWorkingDaysOfMonthByYear(month: number, year: number, startDay: number = 1) {

    let workingdays = 0;
    let date = new Date(year, month - 1, startDay);

    while(date.getFullYear() == year && date.getMonth() < month){
      if (date.getDay() != 0 && date.getDay() != 6){
        workingdays++;
      }
      date.setDate(date.getDate() + 1);
    }

    return workingdays;
  }

  isLeapYear(year: number): boolean {
    if ((year & 3) != 0) return false;

    return ((year % 100) != 0 || (year % 400) == 0);
  }
}
