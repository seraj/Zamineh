import React from "react";
import {
  FormCheck,
  ControlFeedback,
  FormCheckLabel,
  FormGroup,
  Label,
  Button,
  RadioGroup
} from "@smooth-ui/core-sc";
import Row from "reactstrap/lib/Row";
import Col from "reactstrap/lib/Col";
import Modal from "../../components/ui-components/Modal/Modal";
import { Field } from "react-final-form-html5-validation";
import { FieldArray } from "react-final-form-arrays";
import Divider from "../../components/Divider";
import Uploader from "../../components/Uploader";
import PersianDatePicker from "../../components/datepicker/PersianDatePicker";
import Alert from "../../components/Alert/Alert";
import { Loading } from "../../components/Spinner/Spinner";

import InputAsyncTypeahead from "../components/InputAsyncTypeahead";
import styles from "../Registration.scss";

const LinkButton = Button.withComponent("a");
const Error = ({ name }) => (
  <Field name={name} subscription={{ error: true, touched: true }}>
    {({ meta: { touched, error } }) =>
      touched && error ? (
        <ControlFeedback valid={!error}>{error}</ControlFeedback>
      ) : null
    }
  </Field>
);
const SubmittedArt = Arts => {
  return Arts.filter(arts => {
    return arts.submitted === true;
  });
};
const unSubmittedArt = Arts => {
  return Arts.filter(arts => {
    return arts.submitted === false;
  });
};
export const Exhibition = (
  {
    SingleArtSubmit,
    SingleEXBSubmit,
    StepData,
    StepConfig,
    input,
    select,
    radio,
    textarea,
    LabelRequired,
    addArt,
    key,
    name,
    onExbRemoveClick,
    handleRemoveExbArt,
    onChangeDatepicker,
    index,
    values
  },
  ...props
) => {
  const exbIndex = index;
  const ExbData = StepData.exb_set ? StepData.exb_set[index] : null;
  const unSubmittedArts = values.exb_set[index]
    ? unSubmittedArt(values.exb_set[index].art_set).length
    : null;

  return (
    <div
      className={`${styles.RegistrationSection} part ${
        ExbData && ExbData.submitted ? `submitted` : ``
      }`}
    >
      {ExbData && ExbData.loading && <Loading />}
      <LinkButton onClick={onExbRemoveClick} className={styles.removethis}>
        حذف این نمایشگاه
      </LinkButton>
      <Row>
        <Field name={`${name}.id`} component={input} hidden />
        <Col xs={12}>
          <Divider text={`مشخصات نمایشگاه ${index + 1}`} orientation="right" />
        </Col>
        {unSubmittedArts > 0 && (
          <Col xs={12}>
            <Alert
              message={`شما در این نمایشگاه ${unSubmittedArts} اثر ثبت نشده دارید.لطفا نسبت به تکمیل اطلاعات اثر اقدام نمایید`}
              type="error"
              style={{ marginBottom: 15 }}
              icon
              rtl
            />
          </Col>
        )}
        <Col lg={3} md={4} sm={12} xs={12}>
          <FormGroup>
            <Label className={LabelRequired}>نمایشگاه</Label>
            <div className="clearfix" />
            <RadioGroup>
              <FormCheck inline>
                <Field
                  name={`${name}.type`}
                  component={radio}
                  type="radio"
                  id={`${name}.solo`}
                  value="solo"
                />
                <FormCheckLabel htmlFor={`${name}.solo`}>
                  انفرادی
                </FormCheckLabel>
              </FormCheck>
              <FormCheck inline>
                <Field
                  name={`${name}.type`}
                  component={radio}
                  type="radio"
                  id={`${name}.group`}
                  value="group"
                />
                <FormCheckLabel htmlFor={`${name}.group`}>گروهی</FormCheckLabel>
              </FormCheck>
            </RadioGroup>

            <Error name={`${name}.type`} />
          </FormGroup>
        </Col>
        <Col lg={3} md={4} sm={12} xs={12}>
          <FormGroup>
            <Label className={LabelRequired}>نام مجموعه</Label>
            <Field
              name={`${name}.name`}
              component={input}
              placeholder="نام مجموعه"
              // validate={value => value ? undefined : 'وارد کردن نام مجموعه میباشد'}
              control
            />
            <Error name={`${name}.name`} />
          </FormGroup>
        </Col>
        <Col lg={3} md={4} sm={12} xs={12}>
          <FormGroup>
            <Label className={LabelRequired}>زمان برگذاری</Label>
            <PersianDatePicker
              name={`${name}.date`}
              // defaultValue='1991-03-21'
              onChangeDatepicker={onChangeDatepicker}
            />
            <Error name={`${name}.date`} />
          </FormGroup>
        </Col>
        <Col lg={3} md={4} sm={12} xs={12}>
          <FormGroup>
            <Label className={LabelRequired}>محل برگذاری</Label>
            <Field
              name={`${name}.address`}
              component={input}
              placeholder="محل برگذاری"
              // validate={value => value ? undefined : 'وارد کردن محل برگذاری میباشد'}
              control
            />
            <Error name={`${name}.address`} />
          </FormGroup>
        </Col>
        <Col lg={12} md={12} sm={12} xs={12}>
          <FormGroup>
            <Label className={LabelRequired}>
              دلیل برگذاری را شرح دهید #مثلا
            </Label>
            <Field
              name={`${name}.desc`}
              component={textarea}
              maxLength="500"
              placeholder="..."
              // validate={value => value ? undefined : 'الزامی'}
              control
            />
            <Error name={`${name}.desc`} />
          </FormGroup>
        </Col>

        <Col xs={12}>
          <Divider text="تمام آثار این نمایشگاه" orientation="right" />
        </Col>

        <FieldArray name={`${name}.art_set`}>
          {({ fields }) => (
            <>
              {fields.map((name, index) => (
                <SingleArt
                  key={index}
                  name={name}
                  StepData={StepData}
                  StepConfig={StepConfig}
                  ServerData={
                    StepData.exb_set
                      ? StepData.exb_set[exbIndex].art_set[index]
                      : null
                  }
                  LocalData={values.exb_set[exbIndex].art_set[index]}
                  index={index}
                  ParentIndex={exbIndex}
                  input={input}
                  select={select}
                  values={values}
                  LabelRequired={LabelRequired}
                  SingleArtSubmit={() =>
                    SingleArtSubmit(values, index, exbIndex)
                  }
                  onArtRemoveClick={() =>
                    handleRemoveExbArt(
                      fields,
                      "art_id",
                      values,
                      exbIndex,
                      index
                    )
                  }
                />
              ))}
              <Col lg={12} md={12} sm={12} xs={12}>
                <div className={styles.addSectionButton}>
                  <button
                    type="button"
                    onClick={() =>
                      addArt(
                        fields.push,
                        "Art",
                        values.exb_set && values.exb_set[exbIndex].id
                      )
                    }
                  >
                    <i />
                    <span>اضافه کردن اثر</span>
                  </button>
                </div>
              </Col>
            </>
          )}
        </FieldArray>

        <Col sm={12} className="text-left">
          <LinkButton
            onClick={() => SingleEXBSubmit(values, exbIndex)}
            className="zbtn black bradius"
          >
            ثبت نمایشگاه
          </LinkButton>
        </Col>
      </Row>
    </div>
  );
};

export const Collection = (
  {
    SingleArtSubmit,
    Step4_SingleColSubmit,
    StepData,
    StepConfig,
    input,
    select,
    radio,
    textarea,
    LabelRequired,
    addArt,
    importArttoCollection,
    openArtModal,
    ModalToggle,
    name,
    onCollectionRemoveClick,
    Step4_handleRemove,
    index,
    values
  },
  ...props
) => {
  const ColIndex = index;
  const ColData = StepData.collection_set
    ? StepData.collection_set[index]
    : null;
  const unSubmittedArts = values.collection_set[index]
    ? unSubmittedArt(values.collection_set[index].art_set).length
    : null;
  return (
    <div
      className={`${styles.RegistrationSection} part ${
        ColData && ColData.submitted ? `submitted` : ``
      }`}
    >
      {ColData && ColData.loading && <Loading />}
      <LinkButton
        onClick={onCollectionRemoveClick}
        className={styles.removethis}
      >
        حذف این مجموعه
      </LinkButton>
      <Row>
        <Field name={`${name}.id`} component={input} hidden />
        <Col xs={12}>
          <Divider text={`مشخصات مجموعه ${index + 1}`} orientation="right" />
        </Col>
        {unSubmittedArts > 0 && (
          <Col xs={12}>
            <Alert
              message={`شما در این مجموعه ${unSubmittedArts} اثر ثبت نشده دارید.لطفا نسبت به تکمیل اطلاعات اثر اقدام نمایید`}
              type="error"
              style={{ marginBottom: 15 }}
              icon
              rtl
            />
          </Col>
        )}
        <Col lg={3} md={4} sm={12} xs={12}>
          <FormGroup>
            <Label className={LabelRequired}>نام مجموعه</Label>
            <Field
              name={`${name}.name`}
              component={input}
              placeholder="نام مجموعه"
              // validate={value => value ? undefined : 'وارد کردن نام مجموعه میباشد'}
              control
            />
            <Error name={`${name}.name`} />
          </FormGroup>
        </Col>
        <Col lg={9} md={8} sm={12} xs={12}>
          <FormGroup>
            <Label className={LabelRequired}>
              دلیل برگذاری را شرح دهید #مثلا
            </Label>
            <Field
              name={`${name}.desc`}
              component={textarea}
              maxLength="500"
              placeholder="..."
              // validate={value => value ? undefined : 'الزامی'}
              control
            />
            <Error name={`${name}.desc`} />
          </FormGroup>
        </Col>

        <Col xs={12}>
          <Divider text="تمام آثار این مجموعه" orientation="right" />
        </Col>

        <FieldArray name={`${name}.art_set`}>
          {({ fields }) => (
            <>
              {fields.map((name, index) => (
                <SingleArt
                  key={index}
                  name={name}
                  StepData={StepData}
                  StepConfig={StepConfig}
                  ServerData={
                    StepData.collection_set
                      ? StepData.collection_set[ColIndex].art_set[index]
                      : null
                  }
                  LocalData={values.collection_set[ColIndex].art_set[index]}
                  index={index}
                  input={input}
                  select={select}
                  hasExtraFields
                  values={values}
                  LabelRequired={LabelRequired}
                  SingleArtSubmit={() =>
                    SingleArtSubmit(values, index, ColIndex)
                  }
                  onArtRemoveClick={() =>
                    Step4_handleRemove(
                      fields,
                      "art_id",
                      values,
                      ColIndex,
                      index,
                      "CollectionArt"
                    )
                  }
                />
              ))}
              <Col xs={12}>
                <Row>
                  <Col xs={SubmittedArt(values.art_set).length > 0 ? 6 : 12}>
                    <div className={styles.addSectionButton}>
                      <button
                        type="button"
                        className=""
                        onClick={() =>
                          addArt(
                            fields.push,
                            "Art",
                            values.collection_set &&
                              values.collection_set[ColIndex].id
                          )
                        }
                      >
                        <i />
                        <span>اضافه کردن اثر</span>
                      </button>
                    </div>
                  </Col>
                  {SubmittedArt(values.art_set).length > 0 && (
                    <Col xs={6}>
                      <div className={styles.importArtButton}>
                        <button
                          type="button"
                          className=""
                          onClick={() => openArtModal()}
                        >
                          <i />
                          <span>درون ریزی آثار</span>
                        </button>
                      </div>
                      <Modal
                        isOpen={ModalToggle}
                        toggle={openArtModal}
                        className={styles.importArts}
                        title={"ثبت نام / ورودرون ریزی آثار مختلط"}
                      >
                        <Row>
                          <Col xs={12}>
                            <p>
                              شما میتوانید آثار ثبت شده را برای استفاده در این
                              قسمت انتخاب کنید
                            </p>
                          </Col>
                          {values &&
                            values.art_set &&
                            SubmittedArt(values.art_set).map((arts, index) => (
                              <Col key={index} xs={12}>
                                <div className="_art">
                                  {arts.name}
                                  <a
                                    className={`import-button`}
                                    onClick={() =>
                                      importArttoCollection(
                                        index,
                                        arts.id,
                                        values.collection_set[ColIndex].id
                                      )
                                    }
                                  />
                                </div>
                              </Col>
                            ))}
                        </Row>
                      </Modal>
                    </Col>
                  )}
                </Row>
              </Col>
            </>
          )}
        </FieldArray>

        <Col sm={12} className="text-left">
          <LinkButton
            onClick={() => Step4_SingleColSubmit(values, ColIndex)}
            className="zbtn black bradius"
          >
            ثبت مجموعه
          </LinkButton>
        </Col>
      </Row>
    </div>
  );
};
export const SingleArt = ({
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
  const UploadServer = `/gallery-app/art/upload-img/${
    LocalData ? LocalData.id : ""
  }/`;
  return (
    <Col lg={6} md={6} sm={12} xs={12}>
      <div
        className={`_art ${
          ServerData && ServerData.submitted ? `submitted` : ``
        }`}
      >
        {ServerData && ServerData.loading && <Loading />}
        <LinkButton onClick={onArtRemoveClick} className={styles.removethis}>
          حذف این اثر
        </LinkButton>
        <Row>
          <Field name={`${name}.id`} component={input} hidden />
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
                // validate={value => value ? undefined : 'وارد کردن نام اثر میباشد'}
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
                // validate={value => value ? undefined : 'وارد کردن سال تولید اثر میباشد'}
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
                // validate={value => value ? undefined : 'وارد کردن متریال الزامی میباشد'}
              />
              <Error name={`${name}.mat_set`} />
            </FormGroup>
          </Col>
          {hasExtraFields && (
            <Col lg={12} md={12} sm={12} xs={12}>
              <FormGroup className={LabelRequired}>
                <Label className={LabelRequired}>بستر اثر</Label>
                <InputAsyncTypeahead
                  clearButton
                  name={`${name}.medium_set`}
                  api="/gallery-app/medium/autocomplete/?phrase"
                  placeholder="بستر استفاده شده در اثر"
                  // validate={value => value ? undefined : 'وارد کردن بستر الزامی میباشد'}
                />
                <Error name={`${name}.medium_set`} />
              </FormGroup>
            </Col>
          )}
          <Col lg={12} md={12} sm={12} xs={12}>
            <Divider text={`ابعاد اثر`} orientation="right" />
          </Col>
          <Col lg={6} md={6} sm={12} xs={12}>
            <FormGroup>
              <Label className={LabelRequired}>واحد</Label>
              <Field
                name={`${name}.size.unit`}
                component={select}
                // validate={value => value ? undefined : 'واردن کردن واحد اجباری میباشد'}
                control
                arrow={false}
              >
                <option value="" disabled>
                  انتخاب واحد اندازه گیری
                </option>
                {StepConfig &&
                  StepConfig.unit.map((item, index) => (
                    <option value={item.value} key={index}>
                      {item.title}
                    </option>
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
                // validate={value => value ? undefined : 'وارد کردن طول اثر الزامی میباشد'}
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
                // validate={value => value ? undefined : 'وارد کردن ارتفاع اثر الزامی میباشد'}
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
                // validate={value => value ? undefined : 'وارد کردن عمق اثر الزامی میباشد'}
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
                  // validate={value => value ? undefined : 'وارد کردن نام گالری الزامی میباشد'}
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
            >
              ثبت
            </LinkButton>
          </Col>
        </Row>
      </div>
    </Col>
  );
};
