import React, { Fragment } from 'react';
import { Field } from 'react-final-form-html5-validation'
import { Typeahead } from 'react-bootstrap-typeahead';
import makeAndHandleRequest from './makeAndHandleRequest';
import arrify from 'arrify';
import 'react-bootstrap-typeahead/css/Typeahead.css';


const AdaptedTypeahead = ({
    input,
    meta: { valid,
        touched },
    ...rest
}) => (
        <Typeahead {...input} {...rest} selected={input.value} valid={touched ? valid : ''} />
    );
class InputTypeahead extends React.Component {
    state = {
        isLoading: false,
        options: [],
    };

    render() {

        return (
            <div className='InputTypeahead'>
                <Field
                    name={this.props.name}
                    validate={this.props.validate}
                    allowNew={this.props.allowNew}
                    multiple={this.props.multiple}
                    clearButton={this.props.clearButton}
                    newSelectionPrefix='اضافه کردن این ایتم: '
                    component={AdaptedTypeahead}
                    labelKey='name'
                    placeholder={this.props.placeholder}
                    format={arrify}
                    minLength={2}
                    searchText='جستجو...'
                    emptyLabel='یافت نشد.'
                    options={[]}
                    flip
                    selectHintOnEnter
                // highlightOnlyResult
                />
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

export default InputTypeahead;