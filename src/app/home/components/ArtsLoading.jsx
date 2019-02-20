import React from 'react';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import Container from 'reactstrap/lib/Container';

const LoadedComponent = ({ width, height, margin }) => {
    return (<div className='loading'
        style={{
            width: width,
            height: height,
            marginBottom: margin
        }}
    />
    )
}

const ArtsLoading = (props) => {
    var Arts = [];
    for (var i = 0; i < 6; i++) {
        Arts.push(
            <div className='Arts' key={i}>
                <div className='thumb'>
                    <LoadedComponent width='180px' height='180px' margin='5px' />

                </div>
                <div className='art_details'>
                    <LoadedComponent width='120px' height='10px' margin='5px' />
                    <LoadedComponent width='90px' height='10px' margin='5px' />

                </div>
            </div>
        );
    }
    return (
        <>

            <section className='isloading'>

                <Container>
                    <Row>
                        {Arts}
                    </Row>


                </Container>
            </section>
        </>
    )
}

export default ArtsLoading;