import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Table from './Table'; // Import the Table component
import './table.css';


function GameTable(props) {
    return (
        <Container className="container">
            <Row>
                <Col>
                    {/* Render the Table component up to 4*/}
                    <Table table={props.table} user={props.user} players_num={4} />
                </Col>
            </Row>
        </Container>
    );
}

export default GameTable;

