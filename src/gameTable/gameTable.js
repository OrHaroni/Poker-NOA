import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import tableImg from './tableGame.png'; // Import the image
import './gameTable.css'; // Import the CSS file
import Table from './Table'; // Import the Table component



function GameTable() {
    return (
        <Container className="container">
            <Row>
                <Col>
                    <Table />
                </Col>
            </Row>
        </Container>
    );
}

export default GameTable;

