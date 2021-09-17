import React from 'react';
import { Button } from 'react-bootstrap';
import moment from 'moment';
import { } from 'react-router-dom';
import { BsFillTrashFill } from 'react-icons/bs';
import API from '../API/API';

const RentItem = (props) => {
    return (
        <>
            {moment(props.end).isBefore(moment(), 'day') ? //If the rent is finished status is "Ended"
                <tr className="text-center" style={{ 'backgroundColor': '#cfcfcf' }}>
                    <td>{props.category}</td>
                    <td>{props.vehicle_id}</td>
                    <td>{moment(props.start).format('Do MMMM YYYY')}</td>
                    <td>{moment(props.end).format('Do MMMM YYYY')}</td>
                    <td>{props.days}</td>
                    <td className="text-center">{props.age}</td>
                    <td>{props.extra_driver}</td>
                    <td>{props.extra_ins === 0 ? 'No' : 'Yes'}</td>
                    <td>{props.km}</td>
                    <td>{props.final_price}€</td>
                    <td style={{'color':'red'}}><b>Ended</b></td>
                </tr> : //If the rent is active status is "Active",if the rent is future there's a button to delete it
                <tr className="text-center">
                    <td>{props.category}</td>
                    <td>{props.vehicle_id}</td>
                    <td>{moment(props.start).format('Do MMMM YYYY')}</td>
                    <td>{moment(props.end).format('Do MMMM YYYY')}</td>
                    <td>{props.days}</td>
                    <td>{props.age}</td>
                    <td>{props.extra_driver}</td>
                    <td>{props.extra_ins === 0 ? 'No' : 'Yes'}</td>
                    <td>{props.km}</td>
                    <td>{props.final_price}€</td>
                    <td style={{'color':'#33ff00'}}>{moment(props.start).isSameOrBefore(moment(), 'day') && moment(props.end).isSameOrAfter(moment(), 'day') ? <b>Active</b> : <Button variant="danger" size="sm" id={props.id} onClick={(ev) => { API.deleteRent(ev).then(() => { props.reInitList() }) }}><BsFillTrashFill /></Button>}</td>
                </tr>}
        </>
    )
}

export default RentItem