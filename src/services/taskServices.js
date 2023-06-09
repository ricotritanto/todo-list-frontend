import http from "../http-common"

const getAll = () =>{
    return http.get('/task')
}

const get = id => {
    return http.get(`/task/${id}`);
  };
  
  const create = data => {
    return http.post("/task", data);
  };
  
  const update = (id, data) => {
    return http.put(`/task/${id}`, data);
  };
  
  const remove = id => {
    return http.delete(`/task/${id}`);
  };
  
  const removeAll = () => {
    return http.delete(`/task`);
  };
  
//   const findByTitle = title => {
//     return http.get(`/todolist?title=${title}`);
//   };

const TaskServices = {
    getAll,
    get,
    create,
    update,
    remove,
    removeAll,
}

export default TaskServices