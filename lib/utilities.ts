import moment from 'moment'

export function daysInMonth(m : number, y : number) {
    return new Date(y, m + 1, 0).getDate();
}

export function sameDay(d1 : Date, d2 : Date) {
    const format = 'DMMYY'
    return moment(d1).format(format) == moment(d2).format(format)
}

export function sameMonth(d1 : Date, d2 : Date) {
    const format = 'MMYY'
    return moment(d1).format(format) == moment(d2).format(format)
}