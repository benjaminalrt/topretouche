import React, { useState } from "react";
import moment from 'moment'
import { daysInMonth } from 'lib/utilities';
moment.locale('fr');

const Dates: React.FC = () => {
    const [date, setDate] = useState(new Date())

    const setMonth = (m) => {
        let newDate = new Date(date);
        // Cas où le jour est supérieur au nombre de jour dans le mois
        let day = newDate.getDate();
        let days = daysInMonth(m, newDate.getFullYear());

        if(day > days) {
        newDate.setDate(days);
        }

        newDate.setMonth(m);
        setDate(newDate)
    }
    const setDay = (d) => {
        let newDate = new Date(date);
        newDate.setDate(d+1);
        setDate(newDate)
    }

    return(
        <div>
            <div className="flex space-x-4">


            {/* Gestion des mois */}
            {Array(12).fill(0).map((_,i) => (
            <button key={i} onClick={() => setMonth(i)} className={"flex-initial btn flex items-center justify-center capitalize " + (date.getMonth() == i ? 'btn-active' : '')}>
            {moment((i+1) + '-1').format('MMMM')}
            </button>
            ))}
            </div>
            <div className="mt-4 flex space-x-4">

            {/* Gestion des jours */}
            {Array(daysInMonth(date.getMonth(), date.getFullYear())).fill(0).map((_,i) => (
            <button key={i} onClick={() => setDay(i)} className={"flex-initial btn btn-small flex items-center justify-center capitalize " + (date.getDate() == i+1 ? 'btn-active' : '')}>
            {i+1}
            </button>
            ))}
            </div>

        </div>
    )
}

export default Dates;
