import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import SearchIcon from '@mui/icons-material/Search';
import TodayIcon from '@mui/icons-material/Today';
import CategoryIcon from '@mui/icons-material/Category';
import AddIcon from '@mui/icons-material/Add';
import CatContext from '../context/Category';
import DeleteIcon from '@mui/icons-material/Delete';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from 'axios';
import Cookies from 'js-cookie';

const Items = () => {
  const { cat, setCat } = useContext(CatContext); 
  const [inputValue, setInputValue] = useState('');
  const [user, setUser] = useState({});
  const [catName, setCatName] = useState([]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      createCategory();
      setCat(!cat);
    }
  };

  const fetchUser = async () => {
    const token = Cookies.get('token');
    try {
      const res = await axios.get('https://todo-server-tau-snowy.vercel.app/app/user', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        }
      });
      setUser(res.data.user);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const createCategory = async () => {
    if (!inputValue) {
      alert("Category name cannot be empty!"); 
      return; 
    }
    const token = Cookies.get('token');
    try {
      await axios.post('https://todo-server-tau-snowy.vercel.app/app/categories', { name: inputValue }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        }
      });
      setInputValue('');
      getCategory();
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const getCategory = async () => {
    const token = Cookies.get('token');
    try {
      const res = await axios.get('https://todo-server-tau-snowy.vercel.app/app/categories', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        }
      });
      setCatName(res.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const removeItem = async (_id, e) => {
    e.preventDefault();
    const token = Cookies.get('token');
    try {
      await axios.delete(`https://todo-server-tau-snowy.vercel.app/app/categories/${_id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        }
      });
      getCategory(); 
    } catch (error) {
      console.error('Error removing category:', error);
    }
  };

  useEffect(() => {
    fetchUser();
    getCategory();
  }, []);

  return (
    <ul className="sidebar-nav">
      <li className="sidebar-brand">
        <Link to="#" style={{marginLeft:"-20px"}}>
          <AccountCircleIcon style={{fontSize:"40px"}} className='mb-1 pb-1'/> {user.name}
        </Link>
      </li>
      <li>
        <Link className='mt-2'>
          <button type="button" className="btn" style={{ outline: "none", border: "none" }} data-bs-toggle="modal" data-bs-target="#exampleModal">
            <ControlPointIcon style={{ color: "#d60000", fontSize:"25px" }} /> Add Task
          </button>
        </Link>
      </li>
      <li>
        <Link to="/"><SearchIcon /> Search</Link>
      </li>
      <li>
        <Link to="/today"><TodayIcon /> Today</Link>
      </li>
      <li>
        <Link className='d-flex justify-content-between align-items-center'>
          <span><CategoryIcon /> Categories</span>
          <span className='me-3' onClick={() => {
            setCat(!cat)
            setInputValue('')
            }}>
              <AddIcon className='addIcon' /></span>
        </Link>
      </li>
      <li className='inputItemLi'>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`inputItems ms-3 ps-1 ${cat ? "d-none" : "d-block"}`}
          style={{ outline: "none" }}
        />
      </li>
      {catName.map((category) => (
        <li key={category._id}>
          <Link to={`/category/${category._id}`} className='categoryButton d-flex justify-content-between'>
            <span>{category.name}</span>
            <span onClick={(e) => removeItem(category._id, e)} className='me-3'><DeleteIcon className='deleteIcon'/></span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Items;
