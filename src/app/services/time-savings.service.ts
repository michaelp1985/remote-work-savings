import { Injectable } from '@angular/core';
import { ChildCare } from '../models/child-care';
import { Commute } from '../models/commute.model';
import { RemoteWorkhistory } from '../models/remote-workhistory.model';
import { TimeData } from '../models/time.model';
import { Misc } from '../models/misc';

@Injectable({
  providedIn: 'root',
})
export class TimeSavingsService {  

  constructor() {}

  calculateTotalTimeSavingsToday(
    commuteData: Commute,
    remoteWorkHistory: RemoteWorkhistory,
    childCare: ChildCare,
    misc: Misc
  ): TimeData {
    let timeSavedInMinutes = this.calculateTotalTimeSavedByMinutes(commuteData.commuteMinutesPerDay, remoteWorkHistory).totalMinutesSaved;
    timeSavedInMinutes += this.calculateTotalTimeSavedByMinutes(childCare.commuteInMinutesPerDay, remoteWorkHistory).totalMinutesSaved;
    timeSavedInMinutes += this.calculateTotalTimeSavedByMinutes(misc.morningRoutineInMinutes, remoteWorkHistory).totalMinutesSaved;

    let minutesSaved = timeSavedInMinutes % 60;
    let hoursSaved = Math.floor(timeSavedInMinutes / 60);
    let daysSaved = Math.floor(hoursSaved / 24);
    let weeksSaved = Math.floor(daysSaved / 5);

    let timeSaved: TimeData = {
      totalMinutesMinusHoursSaved: minutesSaved,
      totalMinutesSaved: timeSavedInMinutes,
      totalHoursSaved: hoursSaved,
      totalDaysSaved: daysSaved,
      totalWeeksSaved: weeksSaved,
    };

    return timeSaved;
  }

  calculateTotalTimeSavedByMinutes(minsPerDay: number, remoteWorkHistory: RemoteWorkhistory): TimeData {
    const totalRemoteWorkingDays =
      this.getTotalRemoteWorkingDays(remoteWorkHistory);

    let timeSavedInMinutes =
      totalRemoteWorkingDays * minsPerDay;
    let minutesSaved = timeSavedInMinutes % 60;
    let hoursSaved = Math.floor(timeSavedInMinutes / 60);
    let daysSaved = Math.floor(hoursSaved / 24);
    let weeksSaved = Math.floor(daysSaved / 5);

    let timeSaved: TimeData = {
      totalMinutesMinusHoursSaved: minutesSaved,
      totalMinutesSaved: timeSavedInMinutes,
      totalHoursSaved: hoursSaved,
      totalDaysSaved: daysSaved,
      totalWeeksSaved: weeksSaved,
    };

    return timeSaved;
  }

  getTotalRemoteWorkingDays(remoteWorkHistory: RemoteWorkhistory) {
    const totalPossibleWorkingDays =
      this.getTotalPossibleWorkingDays(remoteWorkHistory);

    const totalWeeks = Math.floor(totalPossibleWorkingDays / 5);

    return remoteWorkHistory.remoteWorkDaysPerWeek * totalWeeks;
  }

  getTotalRemoteWorkWeeks(remoteWorkHistory: RemoteWorkhistory) {
    return Math.floor((remoteWorkHistory.endDate.getTime() - remoteWorkHistory.startDate.getTime()) / (1000 * 3600 * 24 * 7));
  }

  getTotalPossibleWorkingDays(remoteWorkHistory: RemoteWorkhistory) {
    let currentDate = new Date();
    let startYear = remoteWorkHistory.startDate.getFullYear();
    let endYear = remoteWorkHistory.endDate.getFullYear();
    let totalDays = 0;

    while (startYear < endYear) {
      totalDays += this.getDaysInYear(startYear);
      startYear++;
    }

    // get days since the current year has begun
    if (currentDate.getFullYear() == endYear) {
      let daysThisYear = this.getDayOfYear(currentDate);
      let daysToRemove = this.getDayOfYear(remoteWorkHistory.startDate);

      totalDays += daysThisYear;
      totalDays -= daysToRemove;
    }

    // account for weekends
    let weekendDays = (totalDays / 7) * 2;

    totalDays -= weekendDays;

    //account for hollidays
    totalDays -= remoteWorkHistory.holidayCountPerYear * (endYear - startYear);

    return Math.ceil(totalDays);
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
    return this.isLeapYear(year) ? 366 : 365;
  }

  getWorkingDaysOfMonthByYear(
    month: number,
    year: number,
    startDay: number = 1
  ) {
    let workingdays = 0;
    let date = new Date(year, month - 1, startDay);

    while (date.getFullYear() == year && date.getMonth() < month) {
      if (date.getDay() != 0 && date.getDay() != 6) {
        workingdays++;
      }
      date.setDate(date.getDate() + 1);
    }

    return workingdays;
  }

  isLeapYear(year: number): boolean {
    return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
  }
}
