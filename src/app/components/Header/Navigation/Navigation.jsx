import React from 'react';
import { Link } from 'react-router-dom';
import ReactResizeDetector from 'react-resize-detector';
import Nav from 'reactstrap/lib/Nav';
import NavItem from 'reactstrap/lib/NavItem';
import styles from '../Header.scss'
import NavStyle from './Navigation.scss'


function MoreLinks({ links }) {
    const url = window.location.href;

    return (
        <span
            data-anchor='right'
            className={styles.zaminehDropdown}
            data-mode='hover'
        >
            <div className={`nav-link ${NavStyle.MoreBtn}`} >
                بیشتر
            </div>
            <div className={`${styles.zaminehDropdown}-menu`}>

                {links && links.map((items, index) => (
                    <Link
                        key={index}
                        to={items.link}
                        className={url.includes(items.link) ? 'active' : ''}>
                        {items.name}
                    </Link>
                ))}
            </div>
        </span >
    )
}
const Menu = ({ navList, className, isLogined, width, height }) => {
    const url = window.location.href;
    // console.log('navList', navList)
    var nav = navList ? [...navList] : [];
    var moreNav = []
    const NavReducer = (length) => {
        if (nav.length == length) {
            var menuItem = nav.pop();
            moreNav.push(menuItem)
        }
    }
    if (nav) {
        if (!isLogined) {
            if (window.innerWidth <= 1500) {
                NavReducer(7)
            }
            if (window.innerWidth <= 1440) {
                NavReducer(6)
            }
            if (window.innerWidth <= 1325) {
                NavReducer(5)
            }
            if (window.innerWidth <= 1200) {
                NavReducer(4)
            }
            if (window.innerWidth <= 1090) {
                NavReducer(3)
            }
            if (window.innerWidth <= 830) {
                NavReducer(2)
            }
        }
        else {
            if (window.innerWidth <= 1400) {
                NavReducer(7)
            }
            if (window.innerWidth <= 1340) {
                NavReducer(6)
            }
            if (window.innerWidth <= 1225) {
                NavReducer(5)
            }
            if (window.innerWidth <= 1070) {
                NavReducer(4)
            }
            if (window.innerWidth <= 920) {
                NavReducer(3)
            }
            if (window.innerWidth <= 800) {
                NavReducer(2)
            }
        }
    }

    return (
        <Nav navbar className={`${NavStyle.Nav} ${className}`}>
            {nav &&
                nav.map((item, index) => (
                    <NavItem key={index}>
                        <Link className={`nav-link ${url.includes(item.link) ? 'active' : ''}`} to={item.link}>
                            {item.name}
                        </Link>
                    </NavItem>
                ))}
            {moreNav != '' &&
                <MoreLinks links={moreNav} />
            }
        </Nav>
    )
}
export function Navigation({ navList, className, isLogined }) {
    return (
        <ReactResizeDetector handleWidth handleHeight>
            <Menu navList={navList} className={className} isLogined={isLogined} />
        </ReactResizeDetector>
    )

}
export function MobileNav({ navList, className }) {
    return (
        <Nav navbar className={className}>
            {navList &&
                navList.map((item, index) => (
                    <NavItem key={index}>
                        <Link className='nav-link' to={item.link}>
                            {item.name}
                        </Link>
                    </NavItem>
                ))}
        </Nav>
    )

}