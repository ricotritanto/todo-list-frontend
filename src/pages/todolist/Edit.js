// import hook useState dan useEffect from react
import { useState, useEffect } from 'react';

// import component Bootstrap React
import { Card, Container, Row, Col , Form, Button, Modal } from 'react-bootstrap';

// import axios
import axios from 'axios';

// import hook history dan params dari react router dom
import { useHistory, useParams } from "react-router-dom";

function EditDolist() {
  // state
  const [name, setName] = useState('');
  const [taskList, setTaskList] = useState([]);
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('');

  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [inputErrors, setInputErrors] = useState({});

  // state validation
  const statusList = ['failed', 'progress', 'done'];
  
  const [errorMessage, setErrorMessage] = useState('');
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  // history
  const history = useHistory();

  // get ID from parameter URL
  const { id } = useParams();

  // hook useEffect
  useEffect(() => {
    // panggil function "getPostById"
    fetchData();
  },[]);

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleTaskChange = (event) => {
    setSelectedTask(event.target.value);
  };

  // function "getPostById"
  const fetchData = async () => {
    try {
      // get data from server
        const response = await axios.get(`http://localhost:3001/api/dolist/${id}`);   
      // get response data
        const data = response.data.result.items;
        // assign data to state
        setName(data.name);
        setDescription(data.description);
        setDueDate(data.due_date);
        setStatus(data.status);
        setSelectedStatus(data.status); // set selectedStatus with initial value from data.status
        setSelectedTask(data.taskId);

        const tasksResponse = await axios.get('http://localhost:3001/api/task');
        const tasksData = tasksResponse.data.result.items;
        setTaskList(tasksData);
        // setSelectedTask(data.taskId);
    } catch (error) {
        console.error(error);
    }
  };

  // function "updatePost"
  const updateTask = async (e) => {
    e.preventDefault()
    setInputErrors({});

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
    try {
        await axios.put(`http://localhost:3001/api/dolist/${id}`, {
          task: selectedTask,
          name: name,
          dueDate: dueDate,
          status: selectedStatus,
          description: description
        })
        .then(() => {
          //redirect
          history.push('/todolist');

      })
    } catch (error) {
      // assign validation on state
        const errorMessage = error.response.data.message.join(' & ');
        setErrorMessage(errorMessage)
        setErrorModalVisible(true)
      }
    }
  };

  return (
    <Container className="mt-3">
      <Row>
        <Col md="{12}">
          <Card className="border-0 rounded shadow-sm">
            <Card.Body>
              <Form onSubmit={updateTask}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Name</Form.Label>
                    <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputErrors.name ? 'error' : ''} placeholder="Masukkan Nama" />
                </Form.Group>
                
                <Form.Group controlId="taskSelect">
                    <Form.Label>Task</Form.Label>
                    <Form.Control
                        as="select"
                        value={selectedTask}
                        onChange={handleTaskChange}
                        className={inputErrors.task ? 'error' : ''}
                    >
                        <option value="">--Pilih task--</option>
                            {taskList.map((task) => (
                                <option
                                    key={task.id}
                                    value={task.id}
                                    defaultValue={task.id === selectedTask}
                                >
                                    {task.name}
                                </option>
                            ))}
                    </Form.Control>
                    {inputErrors.task && (
                        <div className="error-message">{inputErrors.task}</div>
                    )}
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Deskripsi</Form.Label>
                  <Form.Control
                        as="textarea"
                        rows={3}
                        value={description || ''}
                        onChange={(e) => setDescription(e.target.value)}
                        className={inputErrors.description ? 'error' : ''}
                    />
                </Form.Group>

                <Form.Group controlId="dueDateInput">
                  <Form.Label>Tanggal Deadline</Form.Label>
                  <Form.Control
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                  {inputErrors.dueDate && (
                    <div className="error-message">{inputErrors.dueDate}</div>
                  )}
                </Form.Group>

                <Form.Group controlId="statusSelect">
                  <Form.Label>Status</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedStatus}
                    onChange={handleStatusChange}
                    className={inputErrors.status ? 'error' : ''}
                  >
                    <option value="">--Pilih Status--</option>
                    {statusList.map((status) => (
                      <option
                        key={status}
                        value={status}
                        defaultValue={status === selectedStatus} // set selected attribute based on condition
                      >
                        {status}
                      </option>
                    ))}
                  </Form.Control>
                  {inputErrors.status && (
                    <div className="error-message">{inputErrors.status}</div>
                  )}
                </Form.Group>

                <Button variant="primary" type="submit">
                  UPDATE
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
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

export default EditDolist;
