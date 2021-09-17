import React from 'react';

//CarItem component receives id, category, brand and model props from CarList and it shows these as a table row
const CarItem = (props) => {
    return (
        <>
            <tr>
                <td>{props.id}</td>
                <td>{props.category}</td>
                <td>{props.brand}</td>
                <td>{props.model}</td>
            </tr>
        </>
    )
}
export default CarItem