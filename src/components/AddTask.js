import React, { useState } from "react";
import TaskDataService from "../services/taskServices";

const AddTask = () => {
    const initialTaskState = {
      id: null,
      name: "",
      description: "",
    };
    const [task, setTask] = useState(initialTaskState);
    const [submitted, setSubmitted] = useState(false);
  
    const handleInputChange = event => {
      const { name, value } = event.target;
      setTask({ ...task, [name]: value });
    };

    const saveTask = () => {
      var data = {
        name: task.name,
        description: task.description
      };

      TaskDataService.create(data)
      .then(response => {
        setTask({
          id: response.data.id,
          name: response.data.name,
          description: response.data.description,
        });
        setSubmitted(true);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };
  const newTask = () => {
    setTask(initialTaskState);
    setSubmitted(false);
  };


    return(
      <div className="submit-form">
      {submitted ? (
        <div>
          <h4>You submitted successfully!</h4>
          <button className="btn btn-success" onClick={newTask}>
            Add
          </button>
        </div>
      ) : (
        <div>
          <div className="form-group">
            <label htmlFor="title">Task Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              required
              value={task.name}
              onChange={handleInputChange}
              name="task"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              className="form-control"
              id="description"
              required
              value={task.description}
              onChange={handleInputChange}
              name="description"
            />
          </div>

          <button onClick={saveTask} className="btn btn-success">
            Submit
          </button>
        </div>
      )}
    </div>
  );
}

export default AddTask;