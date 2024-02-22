import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './gameTable.css'; // Import the CSS file
import Table from './Table'; // Import the Table component



function GameTable(props) {
    return (
        <Container className="container">
            <Row>
                <Col>
                    {/* Render the Table component up to 4*/}
                    <Table user={props.user} players_num={4} />
                </Col>
            </Row>
        </Container>
    );
}

export default GameTable;

