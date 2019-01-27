import React from 'react';
import {
    Link
} from 'react-router-dom'
import {
    Container,
    Row,
    Col
} from 'reactstrap';

function Logo() {
    return (
        <div className='logo'>
            <svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 283.46 228.93'>
                <defs />
                <g id='Layer_2' data-name='Layer 2'>
                    <g id='Layer_1-2' data-name='Layer 1'>
                        <g id='_Group_' data-name='&lt;Group&gt;'>
                            <polyline points='95.93 45.78 95.95 45.78 187.51 45.78' className='cls-1'
                            />
                            <polyline points='95.93 91.57 95.95 91.57 187.51 91.57' className='cls-1'
                            />
                            <polyline points='95.93 137.36 95.95 137.36 187.51 137.36' className='cls-1'
                            />
                            <polyline points='95.95 0 95.95 45.78 95.95 91.57 95.95 137.36 95.95 183.14 95.95 228.93'
                                className='cls-1' />
                            <polyline points='187.51 0 187.51 45.78 187.51 91.57 187.51 137.36 187.51 183.14 187.51 228.93'
                                className='cls-1' />
                            <polyline points='283.46 183.14 187.51 183.14 95.95 183.14 0 183.14' className='cls-1'
                            />
                        </g>
                    </g>
                </g>
            </svg>
        </div>
    );
}

function Column(props) {
    return (
        <Col {...props} />
    );
}
function Content(props) {
    return (
        <section className='footer-links' {...props} />
    );
}
function Links(props) {
    return (
        <section className='links' {...props} />
    );
}
function Title(props) {
    return (
        <span className='title' {...props} />
    );
}
function NavItem({ href, context }) {
    return (
        <li className='NavItem'>
            <a href={href}>
                {context}
            </a>
        </li>
    );
}
function Copyright(props) {
    return (
        <div className='copyright' {...props} />
    );
}
class AppFooter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            navigation: []
        };

    }
    componentDidMount() {
    }

    render() {

        const url = window.location.href;
        const { birthday_start, birthday_end, isLogined } = this.props;
        return (
            <React.Fragment>
                <footer>
                    <Container>
                        <section className='footer'>
                            <Row>

                                <Column lg='6' md='6' sm='12' xs='12'>
                                    <Row>
                                        <Column lg='4' md='4' sm='12' xs='12'>
                                            <Content>
                                                <Links>
                                                    <Title>درباره ما</Title>
                                                    <ul>
                                                        <NavItem href='#' context='تست س' />

                                                    </ul>
                                                </Links>
                                            </Content>
                                        </Column>
                                        <Column lg='4' md='4' sm='12' xs='12'>
                                            <Content>
                                                <Links>
                                                    <Title>درباره ما</Title>
                                                    <ul>
                                                        <NavItem href='#' context='تست س' />

                                                    </ul>
                                                </Links>
                                            </Content>
                                        </Column>
                                        <Column lg='4' md='4' sm='12' xs='12'>
                                            <Content>
                                                <Links>
                                                    <Title>درباره ما</Title>
                                                    <ul>
                                                        <NavItem href='#' context='تست س' />

                                                    </ul>
                                                </Links>
                                            </Content>
                                        </Column>

                                    </Row>
                                </Column>
                                <Column lg='6' md='6' sm='12' xs='12'>
                                    <Row>
                                        <Column lg='6' md='6' sm='12' xs='12'>
                                            <Content>
                                                <Links>
                                                    <Title>درباره ما</Title>
                                                    <ul>
                                                        <NavItem href='#' context='تست س' />

                                                    </ul>
                                                </Links>
                                            </Content>
                                        </Column>
                                        <Column lg='6' md='6' sm='12' xs='12'>
                                            <Content>
                                                <Links>
                                                    <Title>درباره ما</Title>
                                                    <ul>
                                                        <NavItem href='#' context='تست س' />

                                                    </ul>
                                                </Links>
                                            </Content>
                                        </Column>
                                    </Row>
                                </Column>
                            </Row>

                        </section>
                        <Copyright>
                            <Row>
                                <Column xs='auto' className='links'>
                                    <Logo />
                                </Column>
                                <Column xs='auto' className='socials'>

                                </Column>
                            </Row>
                        </Copyright>
                    </Container>
                </footer>

            </React.Fragment>
        )
    }
}
export default AppFooter;