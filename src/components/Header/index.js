import './header.css';
import logo from '../../assets/logo.png';

import { Link } from 'react-router-dom';
import { MdAccountCircle } from "react-icons/md";
import { FiHome } from "react-icons/fi";

export default function Header(){

    return(
        <div className="sidebar">
            <div>
                <img src={logo} alt="Univap logo"/>
            </div>

            <Link to="/dashboard">
                <FiHome color="#fff" size={25}/>
                Home
            </Link>

            <Link to="/profile">
                <MdAccountCircle color="#fff" size={25}/>
                Conta
            </Link>
        </div>
    )
}