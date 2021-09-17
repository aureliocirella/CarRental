import React from 'react';
import { Navbar, Button, Nav } from 'react-bootstrap';
import { AiOutlineLogout, AiOutlineUser, AiFillCar, AiOutlineUnorderedList } from 'react-icons/ai';
import { Link, } from 'react-router-dom';

const MyNavbar = (props) => {
    return (
        <>
            <Navbar bg='dark' variant='dark' expand='sm' fixed='top'>
                <Navbar.Toggle aria-controls='left-sidebar' aria-expanded='false' aria-label='Toggle sidebar' onClick={props.showSidebar} />
                <Nav className='mr-auto'>
                    <Link to='/'> <Navbar.Brand>
                        <Button variant='outline' size='sm'>
                            <AiFillCar color='white' />
                        </Button>
                    CarRental
                </Navbar.Brand>
                    </Link>
                </Nav>
                <Link to='/login'>
                    <Nav className='ml-auto'>
                        <Button variant='outline' size='lg' style={{ 'color': 'white' }}>
                            {props.user}
                            <AiOutlineUser color='white' />
                        </Button>
                    </Nav>
                </Link>
                {props.user !== '' ? //If user is not logged in AiOutlineUnorderedList button is not showed
                    <Link to='/user/rentlist'>
                        <Nav className='ml-auto'>
                            <Button variant='outline' size='lg'>
                                <AiOutlineUnorderedList color='white' />
                            </Button>
                        </Nav>
                    </Link>
                    : null}
                {props.user !== '' ? //If user is not logged in AiOutlineLogout button is not showed
                    <Link to='/'>
                        <Nav className='ml-auto'>
                            <Button variant='outline' size='lg' onClick={props.doLogout}>
                                <AiOutlineLogout color='white' />
                            </Button>
                        </Nav>
                    </Link>
                    : null}
            </Navbar>
        </>
    );
}
export default MyNavbar