import React, { Component } from 'react';
import ContentLoader, { Facebook } from 'react-content-loader'

import Container from 'reactstrap/lib/Container';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Section from '../Section/Section';

import styles from './Loaders.scss'
import { style } from '@smooth-ui/core-sc';
const Art = () => (
    <Col lg={2} md={4} sm={6} xs={12}>
        <ContentLoader
            rtl
            ariaLabel='در حال بارگذاری'
            height={250}
            width={140}
            speed={2}
            primaryColor='#f3f3f3'
            secondaryColor='#ecebeb'>
            <rect x='4.57' y='0' rx='0' ry='0' width='140' height='150' />
            <rect x='19.63' y='160' rx='0' ry='0' width='120' height='15' />
            <rect x='39' y='180' rx='0' ry='0' width='100' height='15' />
        </ContentLoader></Col>
);
const TopShow = () => (
    <Col lg={3} md={6} sm={6} xs={12}>
        <ContentLoader
            rtl
            ariaLabel='در حال بارگذاری'
            height={120}
            width={310}
            speed={2}
            primaryColor='#f3f3f3'
            secondaryColor='#ecebeb'>
            <rect x='250' y='0' rx='0' ry='0' width='60' height='60' />
            <rect x='140' y='20' rx='0' ry='0' width='90' height='5' />
            <rect x='120' y='35' rx='0' ry='0' width='110' height='5' />
        </ContentLoader>
    </Col>
);
const Mediums = () => (
    <Col lg={3} md={6} sm={6} xs={12}>
        <ContentLoader
            rtl
            ariaLabel='در حال بارگذاری'
            height={150}
            width={282}
            speed={2}
            primaryColor='#f3f3f3'
            secondaryColor='#ecebeb'>
            <rect x='0' y='0' rx='0' ry='0' width='282' height='100' />

        </ContentLoader>
    </Col>
);
const RenderArts = () => (
    <Container>
        <Row>
            <Art />
            <Art />
            <Art />
            <Art />
            <Art />
            <Art />
        </Row>
    </Container>
)

export const LoadingHome = () => {
    return (
        <React.Fragment>
            <div className='header-slider'></div>
            <Section ExtraClass='section homeContent'>

                <div className={styles.home}>
                    <Container>
                        <Row>
                            <TopShow />
                            <TopShow />
                            <TopShow />
                            <TopShow />
                        </Row>
                        <Row>
                            <Mediums />
                            <Mediums />
                            <Mediums />
                            <Mediums />
                        </Row>

                    </Container>
                    <RenderArts />
                    <RenderArts />
                    <RenderArts />
                    <RenderArts />
                </div>

            </Section>
        </React.Fragment>
    )
}
