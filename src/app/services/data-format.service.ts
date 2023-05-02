export class DataFormatService {
  constructor() {}

  static formatAsCurrency(value: number): string {
    let newNum = value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    return newNum;
  }

  static formatMinutesAsDaysHoursMinutes(minutes: number): string {
    let days = Math.floor(minutes / 1440);
    minutes -= days * 1440;
    let hours = Math.floor(minutes / 60);
    minutes -= hours * 60;
    return `${days}:${hours}:${minutes}`;
  }
}
