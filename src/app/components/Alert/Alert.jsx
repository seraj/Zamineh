import React from 'react';
import './Alert.scss';
function Icon(type) {
    return (
        <React.Fragment>
            {type && type.type === 'info' &&
                <svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                    <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm32 664c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V456c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272zm-32-344a48.01 48.01 0 0 1 0-96 48.01 48.01 0 0 1 0 96z">
                    </path>
                </svg>
            }
            {type && type.type === 'success' &&
                <svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                    <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z">
                    </path>
                </svg>
            }
            {type && type.type === 'warning' &&
                <svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                    <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm32 664c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V456c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272zm-32-344a48.01 48.01 0 0 1 0-96 48.01 48.01 0 0 1 0 96z">
                    </path>
                </svg>
            }
            {type && type.type == 'error' &&
                <svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                    <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 0 1-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z">
                    </path>
                </svg>
            }

        </React.Fragment>
    )

}

export default class AlertNotification extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            Close: false,
            animation: false,

        }
    }
    onCloseClick = () => {
        this.setState({
            animation: true,
        })
        setTimeout(() => {
            this.setState({
                Close: true,
            })
        }, 500);
    }
    render() {
        const { Close, animation } = this.state;
        var ClassName = "sv-alert";
        var _props = this.props,
            description = _props.description,
            type = `${ClassName}-${_props.type}`,
            message = _props.message,
            icon = _props.icon,
            closable = _props.closable,
            banner = _props.banner,
            style = _props.style
        return (
            <React.Fragment>
                {!Close &&
                    <div
                        className={`
                            ${ClassName} 
                            ${type ? type : null} 
                            ${description ? `${ClassName}-with-description` : ``}
                            ${description && !icon ? `${ClassName}-with-description-no-icon` : ``}
                            ${!icon ? `${ClassName}-no-icon` : ``}
                            ${closable ? `${ClassName}-closable` : ``}
                            ${animation ? `${ClassName}-slide-up-leave` : ``}
                        `}
                        style={style}
                    >
                        {icon && <i className={`${ClassName}-icon`}><Icon type={this.props.type} /></i>}
                        {message && <span className={`${ClassName}-message`}>{message}</span>}
                        {description && <span className={`${ClassName}-description`}>{description}</span>}
                        {closable &&
                            <a
                                className={`${ClassName}-close-icon`}
                                onClick={this.onCloseClick}
                            ><i>
                                    <svg viewBox="64 64 896 896" class="" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                        <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z">
                                        </path></svg>
                                </i></a>}
                    </div>
                }
            </React.Fragment>
        );
    }

}