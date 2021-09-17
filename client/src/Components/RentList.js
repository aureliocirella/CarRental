import React from 'react';
import { Table, Alert } from 'react-bootstrap';
import RentItem from './RentItem.js';
import moment from 'moment'

const RentList = (props) => {
   return (
      <>
         {props.invalid_rentlist !== true ? <Table striped bordered hover variant="dark">
            <thead>
               <tr className="text-center">
                  <th>Category</th>
                  <th>Vehicle #</th>
                  <th>Start date</th>
                  <th>End date</th>
                  <th>Number of days</th>
                  <th>Driver's age</th>
                  <th>Number of driver</th>
                  <th>Extra insurance</th>
                  <th>Km/day</th>
                  <th>Final price</th>
                  <th>Status</th>
               </tr>
            </thead>
            <tbody>
               {props.user_rent.sort((a, b) => { //RentList is sorted placing first Ended rentals, then Active ones and finally Future ones
                  if (moment(a.start).diff(moment(b.start), 'days') > 0) { return 1 }
                  else if (moment(a.start).diff(moment(b.start), 'days') === 0 && moment(a.end).diff(moment(b.end), 'days') > 0) {
                     return 1
                  } else { return -1 }
               }).map((rent, index) => <RentItem key={rent.id} id={rent.id} vehicle_id={rent.vehicle_id} category={rent.cat} start={rent.start} end={rent.end} days={rent.n_days} age={rent.age} extra_driver={rent.extra_driver} extra_ins={rent.extra_ins} reInitList={props.reInitList} km={rent.km !== 0 ? rent.km : 'Unlimited'} final_price={rent.final_price}/>)}
            </tbody>
         </Table> : <Alert variant='danger'>
               Rental list not available.
            </Alert>}
      </>
   )
}
export default RentList