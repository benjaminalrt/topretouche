import React, { useState, useEffect } from "react"
import { GetServerSideProps } from "next"
import ReactMarkdown from "react-markdown"
import Layout from "components/Layout"
import Project, { ProjectProps } from "components/Project"
import prisma from 'lib/prisma'
import moment from 'moment'
moment.locale('fr');
import { getSession } from "next-auth/client";

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { range, sameDay, sameMonth, useForceUpdate } from "lib/utilities"

import { PencilIcon, TrashIcon, CalendarIcon, TicketIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'
import { isSameMonth } from "date-fns"

import Router from "next/router";

export const getServerSideProps: GetServerSideProps = async ({req, res, params}) => {
  const session = await getSession({req});
  if(!session){
    const url = `/`
    res.writeHead(302, { Location: url })
    res.end()
  } else {
    const project = await prisma.project.findUnique({
      where: {
        id: Number(params?.id) || -1,
      },
      include: {
        transactions: true
      },
    })
    return {
      props: {project, session},
    }
  }
}

type Props = {
  project: ProjectProps,
  session : any
}

const Post: React.FC<Props> = ({project, session} ) => {
  let shop = project.shop
  let initTrans = {
    ticket : '',
    amount : 0,
    type : '',
    clearing : '',
    at : null,
    projectId : project.id
  }

  const [date, setDate] = useState(new Date())
  const [trans, setTrans] = useState(initTrans)
  const [sideBar, setSideBar] = useState('tickets')
  const [tableTypeMode, setTableTypeMode] = useState("all")
  const [serieTicket, setSerieTicket] = useState(9000)
  const forceUpdate = useForceUpdate()

  const submitTrans = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      const body = trans
      const res = await fetch('/api/trans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const newTrans = await res.json();
      project.transactions.push(newTrans)
    } catch (error) {
      console.error(error)
    }
    setTrans({...initTrans, at : date})
  }

  const deleteTrans = async(transId) => {

    try {
      const res = await fetch('/api/trans/'+transId, {
        method: 'DELETE'
      })
      const oldTrans = await res.json();
      project.transactions = project.transactions.filter(t => t.id != transId)
      forceUpdate()

    } catch (error) {
      console.error(error)
    }
  }

  const nextTypeMode = () => {
    switch(tableTypeMode) {
      case "all" : return "depot";
      case "depot" : return "retrait";
      case "retrait" : return "all";
    }
  }
  const typeMode = () => {
    switch(tableTypeMode) {
      case "all" : return "Dépot / retrait";
      case "depot" : return "Dépot";
      case "retrait" : return "Retrait";
    }
  }
  const checkTicket = (ticketNumber) => {
    let isDepot = project.transactions.filter(tr => ticketNumber == tr.ticket && tr.type == "depot").length > 0
    let isRetrait = project.transactions.filter(tr => ticketNumber == tr.ticket && tr.type == "retrait").length > 0

    return isRetrait ? 'retrait' :( isDepot ? 'depot' : 'null');
  }

  useEffect(() => {
    setTrans({...trans, at: date})
  }, [date])

  let transactions = project.transactions.filter(t => sameDay(t.at, date));
  let totalCb = transactions.filter(t => t.clearing == "cb").reduce(function(a,v){ return a + v.amount},0)
  let totalEsp = transactions.filter(t => t.clearing == "esp").reduce(function(a,v){ return a + v.amount},0)
  
  let monthTransactions = project.transactions.filter(t => isSameMonth(t.at, date));
  let totalCumul = monthTransactions.filter(t => t.at.getDate() <= date.getDate()).reduce(function(a,v){ return a + v.amount},0)
  let totalMonthCb = monthTransactions.filter(t => t.clearing == "cb").reduce(function(a,v){ return a + v.amount},0)
  let totalMonthEsp = monthTransactions.filter(t => t.clearing == "esp").reduce(function(a,v){ return a + v.amount},0)

  let ticketArr = range(serieTicket, serieTicket + 99)

  return (
    <Layout>
      
      <div className="container p-4 mx-auto">
        <div className="flex justify-between">
          <div>
            {/* {JSON.stringify(trans)} */}
            <h2 className="text-3xl font-bold	">Tableau du {moment(date).format('dddd D MMMM YYYY')}</h2>

            <form className="mt-3" onSubmit={submitTrans}>
              <div className="flex space-x-5">
                <div className="flex flex-col">
                  <label className="font-semibold text-gray-600 py-2" htmlFor="ticketNumber">Numéro de ticket / Désignation</label>
                  <input required value={trans.ticket} onChange={(e) => setTrans({...trans, ticket: e.target.value})} placeholder="Exemple: 9200" id="ticketNumber" className="input" type="text" />
                </div>
                <div className="flex flex-col">
                  <label className="font-semibold text-gray-600 py-2" htmlFor="type">Dépot / Retrait</label>
                  <select required value={trans.type} onChange={(e) => setTrans({...trans, type: e.target.value})} id="type" className="input">
                    <option disabled value="">-- Choisir --</option>
                    <option value="retrait">Retrait</option>
                    <option value="depot">Dépot</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="font-semibold text-gray-600 py-2" htmlFor="type">Moyen de paiement</label>
                  <select required value={trans.clearing} onChange={(e) => setTrans({...trans, clearing: e.target.value})} id="type" className="input">
                    <option disabled value="">-- Choisir --</option>
                    <option value="cb">Carte bancaire</option>
                    <option value="esp">Espèces</option>
                    <option value="no">Aucun</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="font-semibold text-gray-600 py-2" htmlFor="amount">Montant</label>
                  <input required value={trans.amount ? trans.amount : ''} type="text" placeholder="Exemple : 10€" onChange={(e) => setTrans({...trans, amount: e.target.value ? parseFloat(e.target.value) : 0})} id="amount" className="input" />
                </div>
                
                <div className="flex flex-col">
                  <button className="btn mt-auto" type="submit">Ajouter</button>
                </div>
              </div>
            </form>

            <table className="mt-5 table">
              <thead>
                <tr className="table-lead">
                  <th className="table-cell">Numéro de ticket</th>
                  <th onClick={() => setTableTypeMode(nextTypeMode())} className="select-none w-1/5 table-cell hover:bg-red-200 cursor-pointer">{typeMode()}</th>
                  <th className="table-cell">Moyen de paiement</th>
                  <th className="table-cell">Montant</th>
                  <th className="table-cell">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.filter(t => t.type == (tableTypeMode == "all" ? t.type : tableTypeMode)).map((t,k) => (
                  <tr key={k} className="table-row table-cells table-cells-centered">
                    <td>{t.ticket}</td>
                    <td>{t.type}</td>
                    <td>{t.clearing}</td>
                    <td>{t.amount} €</td>
                    <td>
                      <div className="flex justify-center space-x-2">
                        {/* <button type="button">
                          <PencilIcon className="w-6 text-green-700" />
                        </button> */}
                        <button type="button" onClick={() => deleteTrans(t.id)}>
                          <TrashIcon className="w-6 text-red-700" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <div className="flex">
                <button onClick={() => setSideBar('calendar')} className={"w-1/2 py-3 " + (sideBar == 'calendar' ? 'bg-primary' : 'border-primary') }>
                  <CalendarIcon className={"mx-auto w-6 " + (sideBar == 'calendar' ? 'text-white' : 'text-primary')} />
                </button>
                <button onClick={() => setSideBar('tickets')} className={"w-1/2 py-3 " + (sideBar == 'tickets' ? 'bg-primary' : 'border-primary') }>
                  <TicketIcon className={"mx-auto w-6  "+ (sideBar == 'tickets' ? 'text-white' : 'text-primary')} />
                </button>
            </div>
            <div>
              {sideBar == 'calendar' &&
                <div className="mt-3">
                  <Calendar value={date} onChange={setDate}  locale='fr'/>
                  <div className="mt-3 p-3 border border-gray-500">
                    <h3 className="mb-2 text-2xl">Récapitulatif au {moment(date).format('DD/MM/YY')} :</h3>
                    <ul className="list-disc pl-5">
                      <li>Total carte bancaire :  {totalCb} €</li>
                      <li>Total espèces :  {totalEsp} €</li>
                      <li>Total du jour :  {totalEsp + totalCb} €</li>
                      <li>Total depuis début du mois :  {totalCumul} €</li>
                    </ul>
                  </div>
                  <div className="mt-3 p-3 border border-gray-500">
                    <h3 className="mb-2 text-2xl">Récapitulatif de {moment(date).format('MMMM YYYY')} :</h3>
                    <ul className="list-disc pl-5">
                      <li>Total carte bancaire :  {totalMonthCb} €</li>
                      <li>Total espèces :  {totalMonthEsp} €</li>
                      <li>Total du mois :  {totalMonthCb + totalMonthEsp} €</li>
                    </ul>
                  </div>
                </div>
              }
              {sideBar == 'tickets' &&
                <div className="mt-3" style={{width: '350px'}}>
                  <div>
                    <div className="flex space-x-5 justify-center items-center">
                      <button disabled={serieTicket == 9000} onClick={() => setSerieTicket(serieTicket - 100)}>
                        <ChevronLeftIcon  className={"mx-auto w-10 text-"+(serieTicket == 9000 ? "gray-500 cursor-default" : "primary")} />
                      </button>
                      <span className={"w-10 text-lg font-bold text-primary"}>{serieTicket}</span>
                      <button onClick={() => setSerieTicket(serieTicket + 100)}>
                        <ChevronRightIcon  className={"mx-auto w-10 text-primary"} />
                      </button>
                    </div>
                   <div className="mt-3 grid grid-rows-20 grid-flow-col border border-gray-300">
                      {ticketArr.map((val,key) => {
                          let statut = checkTicket(val);
                          return <div className={"text-center p-1 border border-gray-300 " + (statut == 'retrait' ? 'bg-primary text-white font-bold' : '') + (statut == 'depot' ? 'text-primary font-bold' : '')} key={key}>{val}</div>
                      }
                      )}
                   </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
        
      </div>
    </Layout>
  )
}

export default Post
