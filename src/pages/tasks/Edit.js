//import hook useState dan useEffect from react
import { useState, useEffect } from 'react';

//import component Bootstrap React
import { Card, Container, Row, Col , Form, Button, Alert } from 'react-bootstrap';

//import axios
import axios from 'axios';

//import hook history dan params dari react router dom
import { useHistory, useParams } from "react-router-dom";

function EditTask() {

    //state
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    //state validation
    const [validation, setValidation] = useState({});

    //history
    const history = useHistory();

    //get ID from parameter URL
    const { id } = useParams();

    //hook useEffect
    useEffect(() => {
        //panggil function "getTaskById"
        getTaskById();
        
    },[id]);

    //function "getTaskById"
    const getTaskById = async() => {

        //get data from server
        const response = await axios.get(`http://localhost:3001/api/task/${id}`);
        //get response data
        const data = await response.data.result.items

        //assign data to state
        setName(data.name);
        setDescription(data.description);

    };

    //function "updateTask"
    const updateTask = async (e) => {
        e.preventDefault();
        
        //send data to server
        await axios.put(`http://localhost:3001/api/task/${id}`, {
            name: name,
            description: description
        })
        .then(() => {

            //redirect
            history.push('/task');

        })
        .catch((error) => {

            //assign validation on state
            setValidation(error.response.data);
        })
        
    };

    return (
        <Container className="mt-3">
            <Row>
                <Col md="{12}">
                    <Card className="border-0 rounded shadow-sm">
                        <Card.Body>

                            {
                                validation.errors &&
                                    <Alert variant="danger">
                                        <ul class="mt-0 mb-0">
                                            { validation.errors.map((error, index) => (
                                                <li key={index}>{ `${error.param} : ${error.msg}` }</li>
                                            )) }
                                        </ul>
                                    </Alert>
                            }

                            <Form onSubmit={ updateTask }>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>NAMA TASK</Form.Label>
                                    <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Masukkan Nama" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>DESKRIPSI</Form.Label>
                                    <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Masukkan Description" />
                                </Form.Group>

                                <Button variant="primary" type="submit">
                                    UPDATE
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default EditTask;