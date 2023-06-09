//import hook useState dan useEffect from react
import { useState, useEffect } from 'react';

//import react router dom
import { Link } from "react-router-dom";

//import component Bootstrap React
import { Card, Container, Row, Col, Button, Table, Modal } from 'react-bootstrap';

//import axios
import axios from 'axios';

function TaskIndex() {

    //define state
    const [tasks, setTasks] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTaskId, setDeleteTaskId] = useState('');

    //useEffect hook
    useEffect(() => {

        //panggil method "fetchData"
        fectData();

    }, []);

    //function "fetchData"
    const fectData = async () => {
        //fetching
        const response = await axios.get('http://localhost:3001/api/task');
        //get response data
        console.log(response)
        const data = await response.data.result.items;

        //assign response data to state "posts"
        setTasks(data);
    }

    const handleDelete = async () => {
        // tambahkan konfirmasi alert sebelum menghapus
        console.log(deleteTaskId)
        await axios.delete(`http://localhost:3001/api/task/${deleteTaskId}`);
        fectData();
        setShowDeleteModal(false);
    }

    const openDeleteModal = (id) => {
        setDeleteTaskId(id);
        setShowDeleteModal(true);
    }

    const closeDeleteModal = () => {
        setDeleteTaskId('');
        setShowDeleteModal(false);
    }

    return (
        <Container className="mt-3">
            <Row>
                <Col md="{12}">
                    <Card className="border-0 rounded shadow-sm">
                        <Card.Body>
                            <Button as={Link} to="/task/create" variant="success" className="mb-3">TAMBAH TASK</Button>
                            <Table striped bordered hover className="mb-1">
                                <thead>
                                    <tr>
                                        <th>NO.</th>
                                        <th>NAME</th>
                                        <th>DESCRIPTION</th>
                                        <th colspan="2" className="text-center">AKSI</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { tasks.map((tasks, index) => (
                                        <tr key={ tasks.id }>
                                            <td>{ index + 1 }</td>
                                            <td>{ tasks.name }</td>
                                            <td>{ tasks.description }</td>
                                            <td className="text-center">
        	                                    <Button as={Link} to={`/task/edit/${tasks.id}`} variant="primary" size="sm" className="me-2">EDIT</Button>
                                            </td>
                                            <td className="text-center">
                                                {/* <Button onClick={() => deleteTask(tasks.id)} variant="danger" size="sm">HAPUS</Button>
                                                 */}
                                                 <Button onClick={() => openDeleteModal(tasks.id)} variant="danger" size="sm">HAPUS</Button>
                                            </td>
                                        </tr>
                                    )) }
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Modal show={showDeleteModal} onHide={closeDeleteModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Konfirmasi Hapus</Modal.Title>
                </Modal.Header>
                <Modal.Body>Apakah Anda yakin ingin menghapus task ini?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeDeleteModal}>Batal</Button>
                    <Button variant="danger" onClick={handleDelete}>Hapus</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default TaskIndex;