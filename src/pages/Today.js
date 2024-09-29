import React, { useContext, useEffect, useState } from 'react';
import Modal, { AddButton } from '../components/Modal';
import Items from '../components/Items';
import Cookies from 'js-cookie';
import axios from 'axios';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';



const Today = () => {

  const token = Cookies.get('token');
  const [isToggled, setIsToggled] = useState(false);
  const [task, setTask] = useState([]);
  const [taskCompletion, setTaskCompletion] = useState({});
  const [noTasksFound, setNoTasksFound] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null); 
  const[grid, setGrid] = useState(true)
  const [searchTerm, setSearchTerm] = useState('');
  const toggleMenu = () => {
    setIsToggled(!isToggled);
  };

  const delCookie = (e) => {
    e.preventDefault();
    Cookies.remove('token');
    window.location.href = '/signup';
  };

  
  const fetchTasks = async () => {
    try {
      const res = await axios.get('https://todo-server-tau-snowy.vercel.app/app/tasks/now', {
        headers: {
          Authorization: token,
        },
        withCredentials: true,
      });

      const taskData = res.data.tasks;
      setTask(taskData);
      const completionState = {};
      taskData.forEach(t => {
        completionState[t._id] = false;
      });
      setTaskCompletion(completionState);
      console.log(task, 'najskdbajksd')
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async(id)=>{
    try {
      await axios.delete(`https://todo-server-tau-snowy.vercel.app/app/tasks/${id}`, {
        headers: {
          Authorization: token,
        },
        withCredentials: true,
      });
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  }
  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  useEffect(() => {
    fetchTasks();
    
  }, []);

  const handleCheckboxChange = (id) => {
    setTaskCompletion(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  return (
    <div>
      <AddButton/>
      <div id="wrapper" className={`wrapper-content ${isToggled ? 'toggled' : ''}`}>
        <div id="sidebar-wrapper">
          <Items />
        </div>

        <div id="page-content-wrapper">
          <nav className="navbar navbar-default">
            <div className="container-fluid">
              <div className="navbar-header d-flex">
                <button
                  className="btn-menu btn btn-outline-dark btn-toggle-menu d-none d-lg-block"
                  type="button"
                  onClick={toggleMenu}
                >
                  <i className="fa fa-bars" />
                </button>
                <button
                  className="btn btn-outline-dark d-block d-lg-none"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasExample"
                  aria-controls="offcanvasExample"
                >
                  <i className="fa fa-bars" />
                </button>
                <button className="btn btn-dark ms-2" onClick={delCookie}>
                  Logout
                </button>
              </div>
            </div>
          </nav>

          <div className="container-fluid">
            <div className="task-body-width">
              <div className="mt-5">
                <h3 className="fw-bold">TODAY'S TASKS</h3>
                <div className='row d-flex justify-content-end px-3'>
                <button className='buttonGrid float-right mt-2' onClick={()=>setGrid(!grid)}>{grid?<ViewAgendaIcon/>:<GridViewIcon/>}</button>

                </div>
              </div>
              <div className='row'>
              {
                task?
              (task.map(x => (
                <div className={`px-2 ${grid ? 'col-12': 'col-6'}`}>
                <div
                className="d-flex border rounded my-2 py-3 px-3 align-items-center"
                  key={x._id}
                >
                  <div className="col-10 overflow-hidden">
                    <input
                      type="checkbox"
                      className="me-2"
                      checked={taskCompletion[x._id]}
                      onChange={(e) => {
                        handleCheckboxChange(x._id);
                        deleteTask(x._id);
                      }}
                    />
                    <label
                      className={`fw-semibold h6 ${taskCompletion[x._id] ? 'text-decoration-line-through' : ''}`}
                    >
                      <span
                      className='d-none d-sm-block'
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal2"
                      onClick={() => handleTaskClick(x)}>
                        {x.title ? (x.title.length > 40 ? `${x.title.slice(0, 40)}...` : x.title) : null}
                      </span>
                      <span
                      className='d-block d-sm-none'
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal2"
                      onClick={() => handleTaskClick(x)}>
                        {x.title ? (x.title.length > 40 ? `${x.title.slice(0, 40)}...` : x.title) : null}
                      </span>
                    </label>
                  </div>
                  <div className="col-2 d-flex justify-content-end">
                    <button className={`btn btn-sm ${taskCompletion[x._id] ? 'btn-warning' : 'btn-danger'}`}>
                      {taskCompletion[x._id] ? 'Completed' : 'Pending'}
                    </button>
                  </div>
                </div>
                </div>
              )))
              :
              <div className="text-center mt-5 h4">No Tasks</div>
            }
            </div>
            </div>
          </div>
        </div>
      </div>

      <div className="offcanvas offcanvas-start w-50" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
        <div className="offcanvas-header">
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <Items />
        </div>
      </div>

      <Modal />



      <div
  className="modal fade"
  id="exampleModal2"
  tabIndex="-1"
  aria-labelledby="exampleModal2Label"
  aria-hidden="true"
>
  <div className="modal-dialog modal-dialog-centered w-75 mx-auto">
    <div className="modal-content shadow-sm border-0" style={{ borderRadius: '10px' }}>
      <div className="modal-header border bg-danger text-white py-2">
        <h5 className="modal-title" id="exampleModalLabel" style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
          Task Details
        </h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
          style={{ backgroundColor: 'white', borderRadius: '50%' }}
        />
      </div>
      <div className="modal-body p-4" style={{ backgroundColor: '#f8f9fa' }}>
        {selectedTask ? (
          <div className="task-details">
            <h6 className="mb-3" style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
              <span className="fw-bold">Title: </span> {selectedTask.title}
            </h6>
            <p className="mb-2" style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
              <span className="fw-bold">Description: </span> {selectedTask.description || 'No Description Available'}
            </p>
            <p className="mb-2">
              {selectedTask.favourite ? (
                <>
                  <span className="fw-bold">Favourite: </span> {selectedTask.favourite ? 'Yes' : 'No'}
                </>
              ) : null}
            </p>
            <p className="mb-2">
              {selectedTask.category ? (
                <>
                  <span className="fw-bold">Category: </span> {selectedTask.category}
                </>
              ) : null}
            </p>
            <p className="mb-2">
              {selectedTask.priority ? (
                <>
                  <span className="fw-bold">Priority: </span>{' '}
                  <span
                    className={`badge ${
                      selectedTask.priority === 'p1'
                        ? 'bg-danger'
                        : selectedTask.priority === 'p2'
                        ? 'bg-warning'
                        : 'bg-success'
                    }`}
                  >
                    {selectedTask.priority.toUpperCase()}
                  </span>
                </>
              ) : null}
            </p>
            <p className="mb-2">
              {selectedTask.dueDate ? (
                <>
                  <span className="fw-bold">Due Date: </span> {selectedTask.dueDate.slice(0, 10)}
                </>
              ) : null}
            </p>
            <p className="mb-2">
              <span className="fw-bold">Status: </span>{' '}
              <span
                className={`badge ${taskCompletion[selectedTask._id] ? 'bg-success' : 'bg-secondary'}`}
              >
                {taskCompletion[selectedTask._id] ? 'Completed' : 'Pending'}
              </span>
            </p>
          </div>
        ) : (
          <p className="text-center text-muted">No task selected</p>
        )}
      </div>
      <div className="modal-footer border-top-0 p-2">
        <button type="button" className="btn btn-secondary btn-sm" data-bs-dismiss="modal">
          Close
        </button>
      </div>
    </div>
  </div>
</div>
    </div>
  );
};

export default Today;
