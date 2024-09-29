import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import TodayIcon from '@mui/icons-material/Today';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CategoryIcon from '@mui/icons-material/Category';

const Tasks = () => {
  const [isToggled, setIsToggled] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Manage state for each task
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Task 1', description: '', priority: 'Medium', reminder: '', isChecked: false, isHovered: false },
    { id: 2, name: 'Task 2', description: '', priority: 'High', reminder: '', isChecked: false, isHovered: false }
  ]);

  const toggleMenu = () => {
    setIsToggled(!isToggled);
  };

  const handleTaskHover = (id, isHovered) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, isHovered } : task));
  };

  const handleCheckboxChange = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, isChecked: !task.isChecked } : task));
  };

  const handleAddTaskClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveTask = () => {
    // Logic to save the new task
    setShowModal(false);
  };

  return (
    <div>
      <div className='d-none d-lg-block'>
        <div id="wrapper" className={isToggled ? "wrapper-content toggled" : "wrapper-content"}>
          <div id="sidebar-wrapper">
            <ul className="sidebar-nav">
              <li className="sidebar-brand">
                <a href="#">Ahmad Amman</a>
              </li>
              <li className='mt-3'>
                <Button onClick={handleAddTaskClick}><AddCircleOutlineIcon /> Add Task</Button>
              </li>
              <li>
                <a href="/search"><SearchIcon /> Search</a>
              </li>
              <li>
                <a href="#"><TodayIcon /> Today</a>
              </li>
              <li className="active">
                <a href="#"><FavoriteBorderIcon /> Favourite</a>
              </li>
              <li>
                <a href="#"><CategoryIcon /> Category</a>
              </li>
            </ul>
          </div>
          <div id="page-content-wrapper">
            <nav className="navbar navbar-default">
              <div className="container-fluid">
                <div className="navbar-header">
                  <button
                    className="btn-menu btn btn-success btn-toggle-menu px-3 py-2 rounded-3"
                    type="button"
                    onClick={toggleMenu}
                  >
                    <i className="fa-solid fa-bars" />
                  </button>
                </div>
              </div>
            </nav>
            <div className="container mt-5">
              <div className="row px-5">
                <div className="mx-auto w-75">
                  <div className='h2 fw-bold'>ALL TASKS</div>
                  <input type="text" style={{ outline: "none", width: "100%", border: "none" }} placeholder='Search' className='py-2 ps-3 mt-2 h5 fw-normal rounded-2' />
                  {tasks.map(task => (
                    <div
                      key={task.id}
                      className='mt-4 task-body'
                      onMouseEnter={() => handleTaskHover(task.id, true)}
                      onMouseLeave={() => handleTaskHover(task.id, false)}
                    >
                      <div className='d-flex justify-content-between w-100 py-3 px-3 bg-white rounded-2'>
                        <label className="custom-checkbox">
                          <input
                            type="checkbox"
                            checked={task.isChecked}
                            onChange={() => handleCheckboxChange(task.id)}
                          />
                          <span className="checkmark"></span>
                          <span className={task.isChecked ? "crossed-task" : ""}>
                            {task.name}
                          </span>
                        </label>
                        <div className='button-container'>
                          <button
                            className={`btn btn-danger rounded-3 special-button ${task.isHovered ? 'hovered' : ''}`}
                          >
                            pending
                          </button>
                          {task.isHovered && (
                            <button
                              className='btn btn-primary menu-button'
                            >
                              <i className="fa-solid fa-bars" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='d-block d-lg-none'>
        <div id="page-content-wrapper">
          <nav className="navbar navbar-default">
            <div className="container-fluid">
              <div className="navbar-header">
                <Button className="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
                  <i className="fa-solid fa-bars" />
                </Button>
              </div>
            </div>
          </nav>
          <div className="container mt-5">
            <div className="row px-5">
              <div className="mx-auto w-75">
                <div className='h2 fw-bold'>ALL TASKS</div>
                <input type="text" style={{ outline: "none", width: "100%", border: "none" }} placeholder='Search' className='py-2 ps-3 mt-2 h5 fw-normal rounded-2' />
                {tasks.map(task => (
                  <div
                    key={task.id}
                    className='mt-4 task-body'
                    onMouseEnter={() => handleTaskHover(task.id, true)}
                    onMouseLeave={() => handleTaskHover(task.id, false)}
                  >
                    <div className='d-flex justify-content-between w-100 py-3 px-3 bg-white rounded-2'>
                      <label className="custom-checkbox">
                        <input
                          type="checkbox"
                          checked={task.isChecked}
                          onChange={() => handleCheckboxChange(task.id)}
                        />
                        <span className="checkmark"></span>
                        <span className={task.isChecked ? "crossed-task" : ""}>
                          {task.name}
                        </span>
                      </label>
                      <div className='button-container'>
                        <button
                          className={`btn btn-danger rounded-3 special-button ${task.isHovered ? 'hovered' : ''}`}
                        >
                          pending
                        </button>
                        {task.isHovered && (
                          <button
                            className='btn btn-primary menu-button'
                          >
                            <i className="fa-solid fa-bars" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="offcanvas offcanvas-start" tabIndex={-1} id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
          <div className="offcanvas-header">
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" />
          </div>
          <div className="offcanvas-body">
            <ul className="sidebar-nav">
              <li className="sidebar-brand">
                <a href="#">Ahmad Amman</a>
              </li>
              <li className='mt-3'>
                <Button onClick={handleAddTaskClick}><AddCircleOutlineIcon /> Add Task</Button>
              </li>
              <li>
                <a href="/search"><SearchIcon /> Search</a>
              </li>
              <li>
                <a href="#"><TodayIcon /> Today</a>
              </li>
              <li className="active">
                <a href="#"><FavoriteBorderIcon /> Favourite</a>
              </li>
              <li>
                <a href="#"><CategoryIcon /> Category</a>
              </li>
            </ul>
          </div>
        </div>
      </div>


      
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label htmlFor="taskName" className="form-label">Task Name</label>
              <input type="text" className="form-control" id="taskName" placeholder="Enter task name" />
            </div>
            <div className="mb-3">
              <label htmlFor="taskDescription" className="form-label">Task Description</label>
              <textarea className="form-control" id="taskDescription" rows="3" placeholder="Enter task description"></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="priority" className="form-label">Priority</label>
              <select className="form-select" id="priority">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="reminder" className="form-label">Reminder</label>
              <input type="datetime-local" className="form-control" id="reminder" />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCloseModal}>
            Save Task
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Tasks;
