import moment from 'moment'
import { useReducer } from 'react';

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

export function range(start : number, end : number) {
    return Array(end - start + 1).fill(2).map((_, idx) => start + idx)
}

const trans = {
    clearing : {
        cb : 'Carte bancaire',
        esp : 'Espèces',
        no : 'Aucun'
    },
    type : {
        depot : 'Dépôt',
        retrait : 'Retrait'
    }
}

export function tr(string : string) {
    const parts = string.split('.')
    let tr;
    let transArray = trans;
    parts.forEach(p => {
        tr = transArray[p];
        if(typeof tr == 'string'){
            //
        } else if(typeof tr == 'object'){
            transArray = tr;
        } else {
            tr = string
        }
    })
    return tr
}

const forceUpdateReducer = (i) => i + 1

export const useForceUpdate = () => {
  const [, forceUpdate] = useReducer(forceUpdateReducer, 0)
  return forceUpdate
}