import React from 'react';
import { Table } from 'react-bootstrap';
import CarItem from './CarItem.js'

//CarList component receives, by App component, cars array in which Car catalogue is stored. 
const CarList = (props) => {
   return (
      <>
         <Table striped bordered hover variant="dark">
            <thead>
               <tr>
                  <th>#</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Model</th>
               </tr>
            </thead>
            <tbody>
               {
                  //For each Car object in cars array, a CarItem is produced
                  props.cars.map((car) => <CarItem key={car.id} id={car.id} category={car.category} brand={car.brand} model={car.model} />)
               }

            </tbody>
         </Table>
      </>
   )
}
export default CarList