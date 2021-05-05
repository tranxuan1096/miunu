import React, { useRef, useState } from 'react';
import { NavLink, useLocation, useRouteMatch } from 'react-router-dom';
import './navbar.scss';

const NavBar = () => {
    let { url } = useRouteMatch();
    let location = useLocation();
    let [toggle, setToggle] = useState(false);
    let contentRef = useRef()
    const handleToggle = e => {
        e.preventDefault();
        setToggle(!toggle)
    }
    const clickOutside = e => {
        const { target } = e;
        // e.stopPropagation();
        if (!contentRef.current.contains(target)) {
            setToggle(false)
        }

    }
    return (<div className="miu-nav">
        <span className="miu-nav__toggle" onClick={handleToggle}>Menu</span>
        <div className={`miu-nav__list ${toggle ? 'open' : ''}`} ref={contentRef} >
            <NavLink className="miu-nav__link" activeClassName={location.pathname !== '/' ? null : 'active'} to={`/`}>Miu HotPot</NavLink>
            <NavLink className="miu-nav__link" activeClassName={location.pathname !== '/typhu' ? null : 'active'} to={`/typhu`}>Miunopoly</NavLink>
        </div>
    </div>);
}

export default NavBar;