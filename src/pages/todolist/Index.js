//import hook useState dan useEffect from react
import { useState, useEffect } from 'react';

//import component Bootstrap React
import { Card, Container, Row, Col, Button, Table, Modal, Form } from 'react-bootstrap';

//import axios
import axios from 'axios';
import moment from 'moment';
import '../../alert.css';


function TodoList() {
  //define state
  const [todolist, setTodolist] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [inputErrors, setInputErrors] = useState({});
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const statusList = ['failed', 'progress', 'done'];

  //useEffect hook
  useEffect(() => {
    //panggil method "fetchData"
    fetchData();
  }, []);

  //function "fetchData"
  const fetchData = async () => {
    //fetching
    const response = await axios.get('http://localhost:3001/api/dolist');
    const dataTask = await axios.get('http://localhost:3001/api/task');
    //get response data
    const data = response.data.result.items;
    const task = dataTask.data.result.items;
    setTasks(task);
    //assign response data to state "posts"
    setTodolist(data);
  };

  const getStatusColor = (status) => {
    if (status === 'done') {
      return 'green';
    } else if (status === 'progress') {
      return 'yellow';
    } else if (status === 'failed') {
      return 'red';
    } else {
      return 'black';
    }
  };

  const getStatusBackground = (status) => {
    if (status === 'done') {
      return '#E6F7E0';
    } else if (status === 'progress') {
      return '#FFF9C4';
    } else if (status === 'failed') {
      return '#FFEBEE';
    } else {
      return 'white';
    }
  };

  const handleModalClose = () => {
    clearForm()
    setShowModal(false);
  };

  const handleModalShow = () => {
    setShowModal(true);
  };

  const handleTaskChange = (event) => {
    console.log(event.target.value)
    setSelectedTask(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleDueDateChange = (event) => {
    setDueDate(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const clearForm = (event)=>{
    setShowModal(false);
    setSelectedTask('');
    setDescription('');
    setDueDate('');
    setName('');
    setSelectedStatus('');
    setInputErrors({});
  }

  const handleAddTodo = async () => {
    // Reset input errors
    setInputErrors({});

    // Validate input fields
    let isValid = true;

    if (selectedTask === '') {
      setInputErrors((prevState) => ({
        ...prevState,
        task: 'Kolom task belum diisi!',
      }));
      isValid = false;
    }

    if (name === '') {
      setInputErrors((prevState) => ({
        ...prevState,
        name: 'Kolom nama belum diisi!',
      }));
      isValid = false;
    }

    if (dueDate === '') {
      setInputErrors((prevState) => ({
        ...prevState,
        dueDate: 'Kolom deadline belum diisi!',
      }));
      isValid = false;
    }

    if (selectedStatus === '') {
      setInputErrors((prevState) => ({
        ...prevState,
        status: 'Kolom status belum diisi!',
      }));
      isValid = false;
    }

    if (isValid) {
      const newTodo = {
        task: selectedTask,
        name: name,
        dueDate: dueDate,
        status: selectedStatus,
      };

      console.log(newTodo)

      try {
        await axios.post('http://localhost:3001/api/dolist', newTodo);
        handleModalClose();
        fetchData();
      } catch (error) {
        console.error('Error adding todo:', error);
        const errorMessage = error.response.data.message.join(' & '); // Menggabungkan pesan error dengan tanda "&" di antara mereka
        setErrorMessage(errorMessage);
        setErrorModalVisible(true); 
      }
    }
  };

  return (
    <Container className="mt-3">
      <Row>
        <Col md={12}>
          <Card className="border-0 rounded shadow-sm">
            <Card.Body>
              <Button variant="success" className="mb-3" onClick={handleModalShow}>
                TAMBAH TODOLIST
              </Button>
              <Table striped bordered hover className="mb-1">
                <thead>
                  <tr>
                    <th>NO.</th>
                    <th>NAMA</th>
                    <th>TASK</th>
                    <th>DESKRIPSI</th>
                    <th>DEADLINE</th>
                    <th>STATUS</th>
                    <th>AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {todolist.map((todolists, index) => (
                    <tr key={todolists.id}>
                      <td>{index + 1}</td>
                      <td>{todolists.name}</td>
                      <td>{todolists.task.name}</td>
                      <td>{todolists.description}</td>
                      <td>{moment(todolists.due_date).format('D-MM-YYYY')}</td>
                      <td style={{ color: getStatusColor(todolists.status), backgroundColor: getStatusBackground(todolists.status) }}>
                        {todolists.status}
                      </td>
                      <td className="text-center"></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Todolist</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="taskSelect">
              <Form.Label>Task</Form.Label>
              <Form.Control as="select" value={selectedTask} onChange={handleTaskChange} className={inputErrors.task ? 'error' : ''}>
                <option value="">--Pilih Task--</option>
                {tasks.map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.name}
                  </option>
                ))}
              </Form.Control>
              {inputErrors.task && <div className="error-message">{inputErrors.task}</div>}
            </Form.Group>

            <Form.Group controlId="nameInput">
              <Form.Label>Nama</Form.Label>
              <Form.Control type="text" value={name} onChange={handleNameChange} className={`input-field ${inputErrors.name ? 'error' : ''}`} />
              {inputErrors.name && <div className="error-message">{inputErrors.name}</div>}
            </Form.Group>

            <Form.Group controlId="descriptionInput">
              <Form.Label>Deskripsi</Form.Label>
              <Form.Control type="text" value={description} onChange={handleDescriptionChange} />
            </Form.Group>

            <Form.Group controlId="dueDateInput">
              <Form.Label>Tanggal Deadline</Form.Label>
              <Form.Control type="date" value={dueDate} onChange={handleDueDateChange} className={inputErrors.dueDate ? 'error' : ''} />
              {inputErrors.dueDate && <div className="error-message">{inputErrors.dueDate}</div>}
            </Form.Group>

            <Form.Group controlId="statusSelect">
              <Form.Label>Status</Form.Label>
              <Form.Control as="select" value={selectedStatus} onChange={handleStatusChange} className={inputErrors.status ? 'error' : ''}>
                <option value="">--Pilih Status--</option>
                {statusList.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Form.Control>
              {inputErrors.status && <div className="error-message">{inputErrors.status}</div>}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleAddTodo}>
            Tambah
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={errorModalVisible} onHide={() => setErrorModalVisible(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{errorMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setErrorModalVisible(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
export default TodoList;
