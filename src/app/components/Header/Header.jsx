import React from "react";
import { Link } from "react-router-dom";

import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Collapse from 'reactstrap/lib/Collapse';
import Navbar from 'reactstrap/lib/Navbar';
import NavbarToggler from 'reactstrap/lib/NavbarToggler';

import MediaQuery from 'react-responsive';

import { IconProfile } from "../Icons";
import SecurityManager from "../../security/SecurityManager";


import { Navigation, MobileNav } from "./Navigation/Navigation";
import SearchForm from "../Search/SearchForm/SearchForm";
import styles from './Header.scss'
function Logo() {
    return (

        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 112 112'>

            <path
                fill="none"
                stroke="#000"
                strokeWidth="5"
                strokeLinecap="square"
                strokeMiterlimit="2.6131"
                d='M107.7,107.7H4.3V4.3h103.5V107.7z M38.8,38.8h34.5 M38.8,56h34.5 M38.8,21.5v69 M73.2,21.5v69 M107.7,73.2H4.3'
            />
        </svg>

    );
}

class AppHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userinfoDropDown: false,
            navigation: [],
            isOpen: false
        };
    }
    componentDidMount() { }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
    userinfoDropDown = () => {
        this.setState({
            userinfoDropDown: !this.state.userinfoDropDown
        });
    };

    logout = async () => {
        await SecurityManager().logout();
        location.reload();
        this.forceUpdate();
    };

    render() {
        const url = window.location.href;
        const { isLogined, navList, openModal } = this.props;
        return (
            <React.Fragment>
                <Row>
                    {!isLogined &&
                        <MediaQuery query="(max-width: 768px)">
                            <Col xs="12" lg="12" md="12" sm="12" className="mobileLogin">
                                <div className="mobile-login-btn right">
                                    <button
                                        className="zbtn"
                                        onClick={() => openModal(true)}
                                    >
                                        <span>ثبت نام / ورود</span>
                                    </button>
                                </div>
                                <div className="mobile-login-btn left">
                                    <button className="zbtn">ثبت نام گالری</button>
                                </div>
                            </Col>
                        </MediaQuery>
                    }
                </Row>
                <header className={`${styles.header} fixed`}>
                    <MediaQuery query="(max-width: 768px)">
                        <div className="menu-collapse">
                            <Collapse isOpen={this.state.isOpen} navbar>
                                <MobileNav navList={navList} />

                            </Collapse>
                        </div>
                        <div className={styles.MobileNavigation}>
                            <div className="logoMobile">
                                <div className={styles.logo}>
                                    <Link to='/'>
                                        <span className="text">خانه</span>
                                        <Logo />
                                    </Link>
                                </div></div>
                            <div className="menuMobile">

                                <Navbar color="#fff" light expand="md" className="navigation">
                                    <NavbarToggler onClick={this.toggle} />

                                </Navbar>
                            </div>
                            <div className="SearchMobile">
                                <SearchForm />
                            </div>
                        </div>
                    </MediaQuery>
                    <Row>
                        <MediaQuery query="(min-width: 769px)">

                            <Col xs="12" lg="6" md={!isLogined ? 5 : 6} sm="12">
                                <Row>
                                    <Col xs="auto">
                                        <div className={styles.logo}>
                                            <Link to='/'>
                                                <span className="text">خانه</span>
                                                <Logo />
                                            </Link>
                                        </div>
                                    </Col>
                                    <SearchForm />
                                </Row>
                            </Col>
                            <Col xs="12" lg="6" md={!isLogined ? 7 : 6} sm="12">
                                <Navbar color="#fff" light expand="md" className="navigation">
                                    <NavbarToggler onClick={this.toggle} />
                                    <Collapse isOpen={this.state.isOpen} navbar>
                                        <Navigation navList={navList} isLogined={isLogined} className="ml-auto" />


                                    </Collapse>

                                    <div className={styles.loginbtn}>
                                        {isLogined &&
                                            <span
                                                data-anchor="right"
                                                className={styles.zaminehDropdown}
                                                data-mode="hover"
                                            >
                                                <IconProfile
                                                    height="42px"
                                                    width="42px"
                                                    fill="transparent"
                                                    stroke="#000"
                                                />
                                                <div className={`${styles.zaminehDropdown}-menu`}>
                                                    <a href="/profile">پروفایل</a>
                                                    <a href="/profile">پروفایل</a>
                                                    <a onClick={this.logout}>خروج</a>
                                                </div>
                                            </span>
                                        }
                                        {!isLogined &&
                                            <button
                                                className="zbtn white"
                                                onClick={() => openModal(true)}
                                            >
                                                <span>ثبت نام / ورود</span>
                                            </button>
                                        }
                                        <button className="zbtn black">ثبت نام گالری</button>
                                    </div>
                                </Navbar>
                            </Col>
                        </MediaQuery>
                    </Row>
                </header>

            </React.Fragment>
        );
    }
}
export default AppHeader;
