import React from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import Candidates from './CandidatesList/CandidatesList'
import CalendarComponent from '../../Components/Calendar/Calendar'

export default function Dashboard() {
  return (
    <div style={{display: 'flex', flexDirection: 'row'}}>
        <Navbar/>
        {/* <Candidates></Candidates> */}
        <CalendarComponent/>
    </div>
  )
}
