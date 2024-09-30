import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import CatContext from '../context/Category';
import Add from '@mui/icons-material/Add';
import { useDebounce } from 'use-debounce';

const Modal = () => {
  const { cat, setCat, fetch, setFetch } = useContext(CatContext);
  
  const [entries, setEntries] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'p1',
    favourite: false,
    category: '',
    status: 'pending'
  });
  let clearFields = () =>{
    setEntries({
      title: '',
      description: '',
      dueDate: '',
      priority: 'p1',
      favourite: false,
      category: '',
      status: 'pending'
    });
  }

  const [debouncedSearchTerm] = useDebounce(entries.category, 10);
  const [categories, setCategories] = useState([]); 

  const searchTasks = async (search) => {
    const token = Cookies.get('token');
    try {
        const res = await axios.get(`https://todo-server-tau-snowy.vercel.app/app/categories/search/${search}`, {
            headers: { Authorization: token },
            withCredentials: true,
        });
        setCategories(res.data.categories); 
        console.log(res.data.categories)
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
};


  useEffect(() => {
    if (debouncedSearchTerm) {
      searchTasks(debouncedSearchTerm);
    } else {
      setCategories([]); 
    }
  }, [debouncedSearchTerm]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEntries(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCategorySelect = (category) => {
    setEntries(prevState => ({
        ...prevState,
        category: category 
    }));
    console.log(entries.category, "ajdhjabsdkjabkdj")
    setCategories([]); 
};


  const handleSubmit = async (e) => {
    e.preventDefault(); 
    const token = Cookies.get('token');
    try {
      const res = await axios.post('https://todo-server-tau-snowy.vercel.app/app/tasks', {
        ...entries
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        }
      });
      console.log('Task created:', res.data);
      setCat(cat);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <div>
  <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered w-75 mx-auto">
      <div className="modal-content shadow-sm border rounded" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="modal-header bg-danger text-white py-2">
          <h5 className="modal-title fs-6" id="exampleModalLabel">ADD TASK</h5>
          <button 
            type="button" 
            className="btn-close text-white" 
            data-bs-dismiss="modal" 
            aria-label="Close" 
            onClick={() => clearFields()} 
            style={{ backgroundColor: 'white', border: 'none', height: '15px', width: '15px' }}
          />
        </div>
        <div className="modal-body p-3">
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label className="form-label fw-bold">Title</label>
              <input 
                type="text" 
                name="title" 
                value={entries.title} 
                className="form-control form-control-sm" 
                placeholder="Enter task title" 
                onChange={handleChange} 
                style={{ borderRadius: '6px' }} 
              />
            </div>
            <div className="mb-2">
              <label className="form-label fw-bold">Description</label>
              <textarea 
                name="description" 
                value={entries.description} 
                className="form-control form-control-sm" 
                placeholder="Enter task description" 
                onChange={handleChange} 
                rows="2"
                style={{ borderRadius: '6px' }} 
              />
            </div>
            <div className="mb-2">
              <label className="form-label fw-bold">Due Date</label>
              <input 
                type="date" 
                name="dueDate" 
                value={entries.dueDate} 
                className="form-control form-control-sm" 
                onChange={handleChange} 
                style={{ borderRadius: '6px' }} 
              />
            </div>
            <div className="mb-2">
              <label className="form-label fw-bold">Priority</label>
              <select 
                name="priority" 
                value={entries.priority} 
                className="form-select form-select-sm" 
                onChange={handleChange} 
                style={{ borderRadius: '6px' }} 
              >
                <option value="p1">Priority 1</option>
                <option value="p2">Priority 2</option>
                <option value="p3">Priority 3</option>
              </select>
            </div>
            <div className="mb-2 d-flex align-items-center">
              <label className="form-label fw-bold me-2">Favourite</label>
              <input 
                type="checkbox" 
                name="favourite" 
                checked={entries.favourite} 
                className="form-check-input" 
                onChange={handleChange} 
                style={{ width: '18px', height: '18px' }} 
              />
            </div>
            <div className="mb-2">
              <label className="form-label fw-bold">Category</label>
              <input 
                type="text" 
                name="category" 
                value={entries.category} 
                onChange={handleChange} 
                className="form-control form-control-sm" 
                placeholder="Enter category" 
                style={{ borderRadius: '6px' }} 
              />
              {categories.length > 0 && (
                <ul className="list-group mt-2" style={{ maxHeight: '100px', overflowY: 'auto' }}>
                  {categories.map((cat, index) => (
                    <li 
                      key={index} 
                      className="list-group-item bg-light border text-dark" 
                      onClick={() => handleCategorySelect(cat.name)} 
                      style={{ cursor: 'pointer', borderRadius: '4px', padding: '8px' }}
                    >
                      {cat.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="modal-footer border-top-0 pt-2">
              <button 
                type="submit" 
                className="btn btn-danger btn-sm" 
                data-bs-dismiss="modal" 
                onClick={(e) => {
                  e.preventDefault()
                  setFetch(true)
                }}
              >
                Add Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>


  );
};

export const AddButton = () => {
  return (
    <button className="floating-button" data-bs-toggle="modal" data-bs-target="#exampleModal">
      <Add />
    </button>
  );
};



export default Modal;















// <div>
//       <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
//         <div className="modal-dialog modal-dialog-centered w-75 mx-auto">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h5 className="modal-title" id="exampleModalLabel">ADD TASK</h5>
//               <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={()=>clearFields()} />
//             </div>
//             <div className="modal-body">
//               <form onSubmit={handleSubmit}>
//                 <div className="mb-3">
//                   <label className="form-label">Title</label>
//                   <input type="text" name="title" value={entries.title} className="form-control" placeholder="Enter item title" onChange={handleChange} />
//                 </div>
//                 <div className="mb-3">
//                   <label className="form-label">Description</label>
//                   <textarea name="description" value={entries.description} className="form-control" placeholder="Enter item description" onChange={handleChange}></textarea>
//                 </div>
//                 <div className="mb-3">
//                   <label className="form-label">Date</label>
//                   <input type="date" name="dueDate" value={entries.dueDate} className="form-control" onChange={handleChange} />
//                 </div>
//                 <div className="mb-3">
//                   <label className="form-label">Priority</label>
//                   <select name="priority" value={entries.priority} className="form-select" onChange={handleChange}>
//                     <option value="p1">p1</option>
//                     <option value="p2">p2</option>
//                     <option value="p3">p3</option>
//                   </select>
//                 </div>
//                 <div className="mb-3">
//                   <label className="form-label">Favourite</label>
//                   <input type="checkbox" name="favourite" checked={entries.favourite} className="form-check-input" onChange={handleChange} />
//                 </div>
//                 <div className="mb-3">
//                   <label className="form-label">Category</label>
//                   <input 
//                     type="text" 
//                     name="category" 
//                     value={entries.category} 
//                     onChange={handleChange} 
//                     className="form-control" 
//                     placeholder="Enter category" 
//                   />
//                   {categories.length > 0 && (
//                     <ul className="list-group mt-2">
//                       {categories.map((cat, index) => (
//                         <li 
//                           key={index} 
//                           className="list-group-item bg-danger" 
//                           onClick={() => handleCategorySelect(cat.name)}
//                           style={{ cursor: 'pointer', color:"black" }} 
//                         >
//                           {cat.name}
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </div>
//                 <div className="modal-footer">
//                   <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
//                   <button type="submit" className="btn btn-primary" data-bs-dismiss="modal" onClick={()=>{
//                     setFetch(!fetch)
//                     }}>Add Task</button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>