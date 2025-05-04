import { NavLink } from 'react-router-dom';
import '../css/Navbar.css';
import { useAuthContext } from '../context/authContext';

function Navbar() {
    const {user} = useAuthContext();
    return (
        <>
            <nav className="navbar">
                <div className="navbar-container">
                    <NavLink className={({ isActive }) => isActive ? 'navbar-logo active' : 'navbar-logo'} to="/">
                        <img src='https://cdn-icons-png.flaticon.com/128/15220/15220714.png' alt='home' className='icon_styles' />
                        <span>Busy Buy</span>
                    </NavLink>
                    <ul className='nav-menu'>
                        <li className="nav-item">
                            <NavLink className={({ isActive }) => isActive ? 'nav-links active' : 'nav-links'} to="/">
                                <span>
                                    <img className="icon_styles" src="https://cdn-icons-png.flaticon.com/128/9713/9713295.png" alt="Home" />
                                </span>
                                Home
                            </NavLink>
                        </li>
                        {user ? <>
                            <li className="nav-item">
                                <NavLink className={({ isActive }) => isActive ? 'nav-links active' : 'nav-links'} to="/myorders">
                                    <span>
                                        <img className="icon_styles" src="https://cdn-icons-png.flaticon.com/128/7257/7257815.png" alt="My Orders" />
                                    </span>
                                    My Orders
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className={({ isActive }) => isActive ? 'nav-links active' : 'nav-links'} to="/cart">
                                    <span>
                                        <img className="icon_styles" src="https://cdn-icons-png.flaticon.com/128/4290/4290854.png" alt="Cart" />
                                    </span>
                                    Cart
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className={({ isActive }) => isActive ? 'nav-links active' : 'nav-links'} to="/logout">
                                    <span>
                                        <img className="icon_styles" src="https://cdn-icons-png.flaticon.com/128/1348/1348448.png" alt="Logout" />
                                    </span>
                                    Logout
                                </NavLink>
                            </li>
                            {/* <li className='nav-item'>
                                <NavLink className={({isActive})=> isActive ? 'nav-links active': 'nav-links'} to='/addProduct' style={{paddingLeft:20}}>
                                    +
                                </NavLink>
                            </li> */}
                        </>
                            :
                            <li className="nav-item">
                                <NavLink className={({ isActive }) => isActive ? 'nav-links active' : 'nav-links'} to="/signin">
                                    <span>
                                        <img className="icon_styles" src="https://cdn-icons-png.flaticon.com/128/2996/2996170.png" alt="SignIn" />
                                    </span>
                                    SignIn
                                </NavLink>
                            </li>
                        }
                    </ul>
                </div>
            </nav>
            
        </>
    );
}

export default Navbar;
