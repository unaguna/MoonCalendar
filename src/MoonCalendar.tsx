import * as React from 'react'

import * as cal from './Calendar'

type Day = cal.Day
type Month = cal.Month
type Year = cal.Year
type DayOfTheWeek = cal.DayOfTheWeek

interface MoonCalendarProps {
  year?: Year
  month?: Month
}

interface MoonCalendarState {
  year: Year
  month: Month
}

interface DateTdProp {
  day: Day | null,
  moonAge: number | null,
  dayOfTheWeek: DayOfTheWeek | null
}

function mod(a: number, b: number): number {
  return ((a%b)+b)%b
}

export default class MoonCalendar extends React.Component<MoonCalendarProps, MoonCalendarState> {
  constructor(props: MoonCalendarProps) {
    super(props)
    const now = new Date()
    this.state = {
      year: props.year !== undefined ? props.year : now.getFullYear(),
      month: props.month !== undefined ? props.month : cal.Month.valueOf(now.getMonth()+1)
    }

    this.moveToPrevMonth = this.moveToPrevMonth.bind(this)
    this.moveToNextMonth = this.moveToNextMonth.bind(this)
    this.handleChangeYear = this.handleChangeYear.bind(this)
    this.handleChangeMonth = this.handleChangeMonth.bind(this)
  }


  private dayOfTheWeekOfFirst(): DayOfTheWeek {
    return cal.DayOfTheWeek.of(this.state.year, this.state.month, 1)
  }

  private moonAge(year: Year, month: Month, day: Day): number {
    const c = [0,2,0,2,2,4,5,6,7,8,9,10]
    return (mod((year - 11), 19)* 11 + c[cal.Month.toInteger(month)-1] + day) % 30
  }

  private moveToPrevMonth() {
    const year = this.state.month == "Jan." ? this.state.year-1 : this.state.year
    const month = cal.Month.prevOf(this.state.month)
    this.setState({year, month})
  }

  private moveToNextMonth() {
    const year = this.state.month == "Dec." ? this.state.year+1 : this.state.year
    const month = cal.Month.nextOf(this.state.month)
    this.setState({year, month})
  }

    private handleChangeYear(event: React.FormEvent<HTMLInputElement>): void {
      this.setState({year: Number(event.currentTarget.value)})
    }

    private handleChangeMonth(event: React.ChangeEvent<HTMLSelectElement>): void {
      this.setState({month: cal.Month.valueOf(Number(event.currentTarget.selectedOptions[0].value))})
    }

  render(): JSX.Element {
    const dOf1 = cal.DayOfTheWeek.toInteger(this.dayOfTheWeekOfFirst())
    const emptyTr = [null,null,null,null,null,null,null]
    const trs = [0,1,2,3,4,5].map((_, row: number)=>
      emptyTr.map<DateTdProp|null>((_, i:number)=> {
        const {year, month}: MoonCalendarState = this.state
        const day = cal.Day.valueOf(i+1+7*row-dOf1, month, year)
        return day !== null ? {day, moonAge: this.moonAge(year, month, day), dayOfTheWeek: cal.DayOfTheWeek.of(year,month,day)} : null
      })
    )

    return (
      <table>
        <tr>
          <td className="prev_button_container"><Button handleClick={this.moveToPrevMonth} text="Prev" /></td>
          <th colSpan={5}>
            <MonthInput month={this.state.month} handleChange={this.handleChangeMonth}/>
            <YearInput year={this.state.year} handleChange={this.handleChangeYear}/>
          </th>
          <td className="next_button_container"><Button handleClick={this.moveToNextMonth} text="Next" /></td>
        </tr>
        {trs.map((v:Array<DateTdProp|null>) => <WeekTr days={v} />)}
      </table>
    );
  }
}

interface WeekTrProp {
  days: Array<DateTdProp | null>
}


const WeekTr = (prop: WeekTrProp) => {
  return (
    <tr>{prop.days.map((value) => <DateTd day={value!==null ? value.day : null} moonAge={value!==null ? value.moonAge : null} dayOfTheWeek={value!==null ? value.dayOfTheWeek : null}/>)}</tr>
  )
}

const DateTd = (prop: DateTdProp) => {
  if(prop.day !== null && prop.moonAge !== null && prop.dayOfTheWeek !== null){
    return (
      <td className={`date ${prop.dayOfTheWeek.toLowerCase()}`}><span className="day">{prop.day}</span><MoonChar moonAge={prop.moonAge}/></td>
    )
  } else {
    return <td className="date empty-date"></td>
  }
}

interface MoonCharProps {
  moonAge: number
}

class MoonChar extends React.Component<MoonCharProps, Object> {
  private static moonAgeStr = ["🌑","🌒","🌓","🌔","🌕","🌖","🌗","🌘"]
  private static moonStr(moonAge: number): string {
    return MoonChar.moonAgeStr[Math.round((moonAge%30)/30*8)%8]
  }
  private moonStr(): string {
    return MoonChar.moonStr(this.props.moonAge)
  }
  render(): JSX.Element {
    return (
      <span className="moonAge" title={this.props.moonAge.toString()}>{this.moonStr()}</span>
    )
  }
}

interface ButtonProps {
  handleClick: () => void;
  text: string
}

/** Buttonコンポーネント */
const Button: React.SFC<ButtonProps> = props => {
  const { handleClick, text }: ButtonProps = props;
  return <button onClick={handleClick}>{text}</button>;
};


interface YearInputProps {
  year: number
  handleChange: (event: React.FormEvent<HTMLInputElement>) => void;
}

const YearInput: React.SFC<YearInputProps> = props => {
  const { year, handleChange }: YearInputProps = props;
  return (
    <input
      className="year"
      type="number"
      value={year}
      onChange={handleChange}
    />
  );
};

interface MonthInputProps {
  month: Month
  handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const MonthInput: React.SFC<MonthInputProps> = props => {
  const { month, handleChange }: MonthInputProps = props;
  return (
    <select className="month" onChange={handleChange}>
      {[1,2,3,4,5,6,7,8,9,10,11,12].map((m: number)=>
        <option value={m.toString()} selected={cal.Month.toInteger(month)===m}>{cal.Month.toLongString(cal.Month.valueOf(m))}</option>
      )}
    </select>
  )
}
