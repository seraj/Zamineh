
import React from 'react';
import axios from 'axios';
import Urls from "../components/Urls";
import PropTypes from 'prop-types';
import { FilePond, File, registerPlugin } from 'react-filepond';
import SecurityManager from '../security/SecurityManager';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImageValidateSize from 'filepond-plugin-image-validate-size';

import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
registerPlugin(FilePondPluginImageValidateSize, FilePondPluginImagePreview, FilePondPluginFileValidateType);

class Uploader extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            files: []
        }
    }

    componentDidMount() {
    }
    GetArticles = () => {

        axios.get(`${Urls().api()}/gallery-app/artist/profile-pic/`)
            .then((response) => {
                this.setState({
                    articles: response.data
                })
            })
            .catch((response) => {
                console.log(response);
            });
    }
    handleUploadFile = () => {
        // console.log(this.pond)
    }

    render() {
        const {
            name,
            server,
            Multiple,
            maxFiles,
            allowImagePreview,
            Load,
        } = this.props;

        return (
            <React.Fragment>

                <FilePond
                    ref={ref => this.pond = ref}
                    allowMultiple={Multiple}
                    allowFileTypeValidation
                    acceptedFileTypes={['image/png', 'image/*']}
                    maxFiles={maxFiles}
                    name='image'
                    // oninit={() => this.handleUploadFile()}
                    allowImagePreview={allowImagePreview}
                    allowDrop
                    allowImageValidateSize


                    allowReplace

                    labelIdle='فایل را اینجا بکشید یا انتخاب کنید'
                    labelFileLoading="در حال بارگذاری..."
                    labelFileProcessing="در حال بارگذاری"
                    labelFileProcessingComplete="بارگذاری با موفقیت انجام شد"
                    labelTapToUndo="برای پاک کردن کلیک کنید"
                    labelTapToCancel="لغو کردن بارگذاری"
                    labelTapToRetry="دوباره سعی کن"
                    labelButtonRemoveItem="حذف"
                    labelButtonAbortItemLoad="لغو بارگذاری"
                    labelButtonRetryItemLoad="دوباره"
                    labelButtonAbortItemProcessing="لغو عملیات"
                    labelButtonUndoItemProcessing="برگشت"
                    labelButtonProcessItem="بارگذاری"
                    labelFileLoadError="خطای بارگذاری"
                    labelFileWaitingForSize='حجم تصویر شناسایی نشد'






                    server={{
                        // revert: null,
                        process: (fieldName, file, metadata, load, error, progress, abort) => {

                            // fieldName is the name of the input field
                            // file is the actual file object to send
                            const formData = new FormData();
                            formData.append(fieldName, file, file.name);

                            const url = `${Urls().api()}${server}`;
                            const request = axios({
                                method: 'POST',
                                url: `${url}`,
                                data: formData,
                                config: {
                                    headers: {}
                                }
                            })
                                .then(function (response) {
                                    load(response.responseText);
                                })

                                .catch(function (response) {
                                    console.log(response);
                                });


                            request.upload.onprogress = (e) => {
                                progress(e.lengthComputable, e.loaded, e.total);
                            };

                            request.onload = function () {
                                if (request.status >= 200 && request.status < 300) {
                                    load(request.responseText);
                                }
                                else {
                                    error('oh no');
                                }
                            };

                            request.send(formData);

                            return {
                                abort: () => {
                                    request.abort();
                                    abort();
                                }
                            };
                        },
                        revert: (uniqueFileId, load, error) => {

                            // Should remove the earlier created temp file here
                            // ...

                            // Can call the error method if something is wrong, should exit after
                            error('oh my goodness');

                            // Should call the load method when done, no parameters required
                            load();
                        },
                        restore: './restore/',
                        load: Load ? Load : null,
                        fetch: './fetch/'
                    }}
                    onupdatefiles={(fileItems) => {
                        this.setState({
                            files: fileItems.map(fileItem => fileItem.file)
                        });
                    }}


                >

                    <File src={this.props.files} origin="local" />



                </FilePond>

            </React.Fragment >

        )
    }
}
Uploader.propTypes = {
    maxFiles: PropTypes.number,
};

Uploader.defaultProps = {
    // mapPosition: [35.7, 51.4],
    maxFiles: 3,
    allowImagePreview: true,
};

export default Uploader;
