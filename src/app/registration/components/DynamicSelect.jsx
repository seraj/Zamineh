import React, { Fragment } from 'react';
import { Field } from 'react-final-form-html5-validation'
import axios from 'axios'
import Urls from '../../components/Urls';



class DynamicSelect extends React.Component {
    state = {
        isLoading: false,
        options: [],
    };
    componentDidMount() {
        this.getOptions()
    }
    getOptions = () => {
        axios.get(`${Urls().api()}/${this.props.server}`).then(response => {
            this.setState({
                options: response.data.unit
            })
        })
    }
    render() {

        return (
            <div className='DynamicSelect'>
                <Field
                    name={this.props.name}
                    validate={this.props.validate}
                    component={this.props.component}
                    placeholder={this.props.placeholder}
                    control
                >
                    <option value=''>{this.props.placeholder}</option>
                    {this.state.options && this.state.options.map((item, index) => (
                        <option value={item.value} key={index}>{item.title}</option>

                    ))}
                </Field>
            </div>
        );
    }



    _handleChange = (e) => {
        const { checked, name } = e.target;
        this.setState({ [name]: checked });
    }
    _handleSearch = (query) => {
        this.setState({ isLoading: true });
        makeAndHandleRequest(this.props.api, query)
            .then(({ options }) => {
                this.setState({
                    isLoading: false,
                    options,
                });
            });

    }
}
/* example-end */
// <DynamicSelect
// name={`${name}.size.unit`}
// component={select}
// placeholder='انتخاب واحد اندازه گیری'
// validate={value => value ? undefined : 'وارد کردن واحد الزامی میباشد'}
// server='gallery-app/artist/step-configs/?step=step3'
// />
export default DynamicSelect;