export type Day = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 |
   17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31
export type Month = "Jan." | "Feb." | "Mar." | "Apr." | "May" | "Jun." | "Jul." | "Aug." | "Sep." | "Oct." | "Nov." | "Dec."
export type Year = number
export type DayOfTheWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun"

export namespace Day {
  export function valueOf(num: number, month: Month|null=null, year: Year|null=null): Day|null {
    const max = month != null ? Month.lengthOf(month, year) : 31
    return Math.round(num)===num && 1<=num && num<=max ? num as Day : null
  }
}

export namespace Month {
  const array: Array<Month> = ["Dec.", "Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov."]

  export function nextOf(month: Month): Month {
    return Month.valueOf(Month.toInteger(month)+1)
  }

  export function prevOf(month: Month): Month {
    return Month.valueOf(Month.toInteger(month)+11)
  }

  export function valueOf(num: number): Month {
    return array[num%12]
  }

  export function toInteger(month: Month): number {
    switch(month){
      case "Jan.": return 1
      case "Feb.": return 2
      case "Mar.": return 3
      case "Apr.": return 4
      case "May" : return 5
      case "Jun.": return 6
      case "Jul.": return 7
      case "Aug.": return 8
      case "Sep.": return 9
      case "Oct.": return 10
      case "Nov.": return 11
      case "Dec.": return 12
    }
  }


  export function toLongString(month: Month): string {
    switch(month){
      case "Jan.": return "January"
      case "Feb.": return "February"
      case "Mar.": return "March"
      case "Apr.": return "April"
      case "May" : return "May"
      case "Jun.": return "June"
      case "Jul.": return "July"
      case "Aug.": return "August"
      case "Sep.": return "September"
      case "Oct.": return "October"
      case "Nov.": return "November"
      case "Dec.": return "December"
    }
  }

  export function toZellersInteger(month: Month): number {
    switch(month){
      case "Jan.": return 13
      case "Feb.": return 14
      case "Mar.": return 3
      case "Apr.": return 4
      case "May" : return 5
      case "Jun.": return 6
      case "Jul.": return 7
      case "Aug.": return 8
      case "Sep.": return 9
      case "Oct.": return 10
      case "Nov.": return 11
      case "Dec.": return 12
    }
  }

  export function lengthOf(month: Month, year: Year | null = null): number{
    switch(month){
      case "Jan.": return 31
      case "Feb.":
        if(year === null || year % 4 !== 0 || (year % 100 === 0 && year % 400 !== 0)) return 28
        else return 29
      case "Mar.": return 31
      case "Apr.": return 30
      case "May" : return 31
      case "Jun.": return 30
      case "Jul.": return 31
      case "Aug.": return 31
      case "Sep.": return 30
      case "Oct.": return 31
      case "Nov.": return 30
      case "Dec.": return 31
    }
  }
}

export namespace DayOfTheWeek {
  export const MON: DayOfTheWeek = "Mon"
  export const TUE: DayOfTheWeek = "Tue"
  export const WED: DayOfTheWeek = "Wed"
  export const THU: DayOfTheWeek = "Thu"
  export const FRI: DayOfTheWeek = "Fri"
  export const SAT: DayOfTheWeek = "Sat"
  export const SUN: DayOfTheWeek = "Sun"


  export function of(year: Year, month: Month, day: Day): DayOfTheWeek {
    const m = Month.toZellersInteger(month)
    const y = m >= 13 ? year-1 : year
    const century = Math.floor(y / 100)
    const yearByCentury = y % 100
    const gamma = 5 * century + Math.floor(century / 4)
    const dOW = day + Math.floor(26*(m+1)/10) + yearByCentury + Math.floor(yearByCentury/4) + gamma + 6
    return DayOfTheWeek.valueOf(dOW)
  }

  export function toInteger(dayOfTheWeek: DayOfTheWeek): number {
    switch(dayOfTheWeek) {
      case "Sun": return 0
      case "Mon": return 1
      case "Tue": return 2
      case "Wed": return 3
      case "Thu": return 4
      case "Fri": return 5
      case "Sat": return 6
    }
  }

  export function valueOf(num: number): DayOfTheWeek {
    switch(num%7){
      case 0: return SUN
      case 1: case -6: return MON
      case 2: case -5: return TUE
      case 3: case -4: return WED
      case 4: case -3: return THU
      case 5: case -2: return FRI
      case 6: case -1: return SAT
      default: throw new TypeError()
    }
  }
}
