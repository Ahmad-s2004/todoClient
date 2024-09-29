import React, { useState, useEffect, useContext } from 'react';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';
import Modal, { AddButton } from '../components/Modal';
import Items from '../components/Items';
import Cookies from 'js-cookie';
import CatContext from '../context/Category';
import axios from 'axios';
import { useDebounce } from 'use-debounce';

const Tasks = () => {
  const { cat, setCat, fetch, setFetch } = useContext(CatContext);
  const token = Cookies.get('token');
  const [isToggled, setIsToggled] = useState(false);
  const [task, setTask] = useState([]);
  const [taskCompletion, setTaskCompletion] = useState({});
  const [noTasksFound, setNoTasksFound] = useState(false);
  const[grid, setGrid] = useState(true)
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 10);
  const [selectedTask, setSelectedTask] = useState(null); 


  
  const toggleMenu = () => {
    setIsToggled(!isToggled);
  };

  const delCookie = (e) => {
    e.preventDefault();
    Cookies.remove('token');
    window.location.href = '/signup';
  };

  const searchTasks = async (search) => {
    try {
      let res;
      if (!search) {
        res = await axios.get('https://todo-server-tau-snowy.vercel.app/app/tasks', {
          headers: {
            Authorization: token,
          },
          withCredentials: true,
        });
      } else {
        res = await axios.get(`https://todo-server-tau-snowy.vercel.app/app/tasks/search?search=${search}`, {
          headers: {
            Authorization: token,
          },
        });
      }
  
      const tasks = res.data.tasks || [];
      setTask(tasks);
      setNoTasksFound(tasks.length === 0);
  
    } catch (error) {
      console.log(error, 'Error');
    }
  };
  

  const deleteTask = async (id) => {
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
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get('https://todo-server-tau-snowy.vercel.app/app/tasks', {
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
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    searchTasks(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  const handleCheckboxChange = (id) => {
    setTaskCompletion(prevState => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
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
                <h3 className="fw-bold">ALL TASKS</h3>
                <input
                  type="text" 
                  placeholder="SEARCH"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-100 py-2 px-4 fw-semibold rounded"
                  style={{ letterSpacing: '0.1rem', outline: 'none', border: '1px solid lightgrey' }}
                />
                <div className='row d-flex justify-content-end px-3'>
                <button className='buttonGrid float-right mt-2' onClick={()=>setGrid(!grid)}>{grid?<ViewAgendaIcon/>:<GridViewIcon/>}</button>

                </div>
              </div>
              <div className='row'>
              {
                task.length>0?
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
                        {x.title.length>40?`${x.title.slice(0,35)}...`:x.title.slice(0,40)}
                      </span>
                      <span
                      className='d-block d-sm-none'
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal2"
                      onClick={() => handleTaskClick(x)}>
                        {x.title.length>40?`${x.title.slice(0,7)}...`:x.title.slice(0,40)}
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

      <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
        <div className="offcanvas-header">
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

export default Tasks;
