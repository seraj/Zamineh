import React from "react"
import { withRouter } from 'react-router-dom'


class AddSingleArtForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            Data: []
        }
    }

    render() {
        const { Data } = this.state
        return (
            <React.Fragment>
                <SingleArt
                    name={'singleArt'}
                    StepData={Data}
                    StepConfig={StepConfig}
                    ServerData={StepData.art_set[index]}
                    LocalData={values.art_set[index]}
                    index={index}
                    input={AdaptedInput}
                    select={AdaptedSelect}
                    values={values}
                    LabelRequired={LabelRequired}
                    SingleArtSubmit={() => Step4_SingleArtSubmit(values, index, null, 'SingleArt')}
                    hasExtraFields
                    onArtRemoveClick={() => Step4_handleRemove(fields, 'art_id', values, 'Col Index', index)}
                />
            </React.Fragment>
        )
    }
}


const SingleArt = ({
    SingleArtSubmit,
    input,
    select,
    StepData,
    StepConfig,
    ServerData,
    LocalData,
    name,
    index,
    onArtRemoveClick,
    hasExtraFields,
    LabelRequired,
    values
}) => {
    const UploadServer = `/gallery-app/art/upload-img/${LocalData ? LocalData.id : ''}/`;
    return (
        <Col lg={6} md={6} sm={12} xs={12}>
            <div className={`_art ${ServerData && ServerData.submitted ? `submitted` : ``}`}>
                {ServerData && ServerData.loading &&
                    <Loading />
                }
                <LinkButton onClick={onArtRemoveClick} className={styles.removethis}>حذف این اثر</LinkButton>
                <Row>
                    <Field
                        name={`${name}.id`}
                        component={input}
                        hidden
                    />
                    <Col lg={12} md={12} sm={12} xs={12}>
                        <Divider text={`اثر شماره ${index + 1}`} orientation="right" />
                    </Col>
                    <Col lg={6} md={6} sm={12} xs={12}>
                        <FormGroup>
                            <Label className={LabelRequired}>نام اثر</Label>
                            <Field
                                name={`${name}.name`}
                                component={input}
                                placeholder="نام اثر"
                                validate={value => value ? undefined : "وارد کردن نام اثر میباشد"}
                                control
                            />
                            <Error name={`${name}.name`} />
                        </FormGroup>
                    </Col>
                    <Col lg={6} md={6} sm={12} xs={12}>
                        <FormGroup>
                            <Label className={LabelRequired}>سال تولید</Label>
                            <Field
                                name={`${name}.year`}
                                component={input}
                                value="sdsada"
                                placeholder="سال تولید اثر"
                                validate={value => value ? undefined : "وارد کردن سال تولید اثر میباشد"}
                                control
                            />
                            <Error name={`${name}.year`} />
                        </FormGroup>
                    </Col>
                    <Col lg={12} md={12} sm={12} xs={12}>
                        <FormGroup className={LabelRequired}>
                            <Label className={LabelRequired}>متریال اثر</Label>
                            <InputAsyncTypeahead
                                multiple
                                clearButton
                                name={`${name}.mat_set`}
                                api="/gallery-app/material/autocomplete/?phrase"
                                placeholder="متریال استفاده شده در اثر"
                                validate={value => value ? undefined : "وارد کردن متریال الزامی میباشد"}
                            />
                            <Error name={`${name}.mat_set`} />
                        </FormGroup>
                    </Col>
                    {hasExtraFields &&
                        <Col lg={12} md={12} sm={12} xs={12}>
                            <FormGroup className={LabelRequired}>
                                <Label className={LabelRequired}>بستر اثر</Label>
                                <InputAsyncTypeahead
                                    clearButton
                                    name={`${name}.medium_set`}
                                    api="/gallery-app/medium/autocomplete/?phrase"
                                    placeholder="بستر استفاده شده در اثر"
                                    validate={value => value ? undefined : "وارد کردن بستر الزامی میباشد"}
                                />
                                <Error name={`${name}.medium_set`} />
                            </FormGroup>
                        </Col>
                    }
                    <Col lg={12} md={12} sm={12} xs={12}>
                        <Divider text={`ابعاد اثر`} orientation="right" />
                    </Col>
                    <Col lg={6} md={6} sm={12} xs={12}>
                        <FormGroup>
                            <Label className={LabelRequired}>واحد</Label>
                            <Field
                                name={`${name}.size.unit`}
                                component={select}
                                validate={value => value ? undefined : "واردن کردن واحد اجباری میباشد"}
                                control
                                arrow={false}
                            >
                                <option value="" disabled>انتخاب واحد اندازه گیری</option>
                                {StepConfig && StepConfig.unit.map((item, index) => (
                                    <option value={item.value} key={index}>{item.title}</option>

                                ))}
                            </Field>


                            <Error name={`${name}.size.unit`} />
                        </FormGroup>
                    </Col>
                    <Col lg={6} md={6} sm={12} xs={12}>
                        <FormGroup>
                            <Label className={LabelRequired}>طول</Label>
                            <Field
                                name={`${name}.size.width`}
                                component={input}
                                placeholder="طول اثر"
                                validate={value => value ? undefined : "وارد کردن طول اثر الزامی میباشد"}
                                control
                            />
                            <Error name={`${name}.size.width`} />
                        </FormGroup>
                    </Col>
                    <Col lg={6} md={6} sm={12} xs={12}>
                        <FormGroup>
                            <Label className={LabelRequired}>ارتفاع</Label>
                            <Field
                                name={`${name}.size.height`}
                                component={input}
                                placeholder="ارتفاع اثر"
                                validate={value => value ? undefined : "وارد کردن ارتفاع اثر الزامی میباشد"}
                                control
                            />
                            <Error name={`${name}.size.height`} />
                        </FormGroup>
                    </Col>
                    <Col lg={6} md={6} sm={12} xs={12}>
                        <FormGroup>
                            <Label className={LabelRequired}>عمق</Label>
                            <Field
                                name={`${name}.size.depth`}
                                component={input}
                                placeholder="عمق اثر"
                                validate={value => value ? undefined : "وارد کردن عمق اثر الزامی میباشد"}
                                control
                            />
                            <Error name={`${name}.size.depth`} />
                        </FormGroup>
                    </Col>
                    {hasExtraFields && [
                        <Col lg={12} md={12} sm={12} xs={12}>
                            <Divider text={`گالری`} orientation="right" />
                        </Col>,
                        <Col lg={12} md={12} sm={12} xs={12}>
                            <FormGroup>
                                <Label className={LabelRequired}>گالری مالک اثر</Label>
                                <InputAsyncTypeahead
                                    allowNew
                                    newSelectionPrefix="اضافه کردن این گالری:"
                                    name={`${name}.gallery`}
                                    api="/gallery-app/gallery/autocomplete/?phrase"
                                    placeholder="نام گالری مالک اثر"
                                    validate={value => value ? undefined : "وارد کردن نام گالری الزامی میباشد"}
                                />
                                <Error name={`${name}.gallery`} />
                            </FormGroup>
                        </Col>
                    ]}

                    <Col xs={12}>
                        <Label className={LabelRequired}>بارگذاری آثار</Label>
                        <Uploader
                            server={UploadServer}
                            name={`${name}.img`}
                            files={ServerData ? ServerData.img : null}
                            // Multiple
                            // maxFiles={5}
                            allowImagePreview={false}
                        />
                    </Col>
                    <Col xs={12}>
                        <LinkButton
                            onClick={SingleArtSubmit}
                            className="zbtn black bradius d-block"
                        >ثبت</LinkButton>
                    </Col>
                </Row>
            </div>
        </Col>
    )
}
export default withRouter(AddSingleArtForm);
