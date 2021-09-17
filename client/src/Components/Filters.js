import React from 'react';
import { Nav, ButtonGroup, ToggleButton, Button } from 'react-bootstrap';

const Filters = (props) => { //Everytime a ToggleButton is clicked, setFilters props is called in order to modify filter parameters for CarList component
    return (
        <>
            <Nav className='flex-column'>
                <Nav.Item>
                    <b>Category</b>
                </Nav.Item>
                {getCategory(props)}
                <Nav.Item>
                    <b>Brand</b>
                </Nav.Item>
                {getBrand(props)}
                <ButtonGroup className='mb-2'>
                    <Button type="checkbox" className='btn-reset' value={1} onClick={(ev) => { props.setFilters('reset', ev); }}>Reset filters</Button>
                </ButtonGroup>
            </Nav>
        </>
    );
}
//For each category a ToggleButton component is rendered
function getCategory(props) {
    let category = props.category;
    category.sort();
    return category.map((cat, index) => (
        <ButtonGroup toggle className='mb-2' key={index}>
            <ToggleButton type="checkbox" checked={props.filter_categories[cat]} className='btn-check' value={1} key={index} onChange={(ev) => { props.setFilters('categories', ev); }}>{cat}</ToggleButton>
        </ButtonGroup>));
}

//For each brand a ToggleButton component is rendered
function getBrand(props) {
    let brand = props.brand.sort();
    return brand.map((brand, index) => (
        <ButtonGroup toggle className="mb-2" key={index}>
            <ToggleButton type="checkbox" checked={props.filter_brands[brand]} className='btn-check' key={index} value={1} onChange={(ev) => { props.setFilters('brands', ev); }}>{brand}</ToggleButton>
        </ButtonGroup>));
}

export default Filters;