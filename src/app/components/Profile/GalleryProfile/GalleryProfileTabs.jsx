import React, { useState, useEffect } from "react";
import cookie from "react-cookies";
import Row from "reactstrap/lib/Row";
import Col from "reactstrap/lib/Col";

import axios from "axios";
import SecurityManager from "../../../security/SecurityManager";
import Urls from "../../Urls";
import { Toast } from "../../Toast/Toast";
import Modal from "../../ui-components/Modal/Modal";

import { Loading } from "../../Spinner/Spinner";
import Pagination from "../../Pagination/Pagination";
import { FourColumnArt } from "../../ArtArtist/Arts";
import { FlatList } from "../../ui-components/List/List";
import { Img } from "../../General";
import TransactionList from "../../Transactions/Transactions";
import SupportTicket from "../../SupportTicket/SupportTicket";

import {
  EditGallery,
  ChangePassword,
  SupportTicketForm
} from "./GalleryProfileForms";

import styles from "../Profile.scss";

export const Tabz = ({ type }) => {
  const [initialized, setInitialized] = useState(false);
  const [Data, setData] = useState();

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!initialized) {
      getData(type);
      setInitialized(true);
    }
  });
  const getData = (slug, page) => {
    axios
      .get(`${Urls().api()}/gallery-app/gallery/${slug}/list/`, {
        params: {
          page: page
        }
      })
      .then(({ data }) => {
        setData(data);
        setLoading(false);
      });
  };
  const handlePageClick = data => {
    let selected = data.selected + 1;
    setLoading(true);
    getData(type, selected);
  };
  const onGalleryBtnClick = item => {
    let Result = Data.results.filter(art => art.id === item.id);
    axios
      .post(`${Urls().api()}/gallery-app/show-in-zamineh/toggle/`, {
        type: "Art",
        art_id: item.id
      })
      .then(({ data }) => {
        Result[0].in_zamineh = data.status;
        setData({
          ...Data,
          Result
        });
      });
  };
  const showInZaminehShowClick = item => {
    let Result = Data.results.filter(items => items.id === item.id);
    axios
      .post(`${Urls().api()}/gallery-app/show-in-zamineh/toggle/`, {
        type: "Show",
        show_id: item.id
      })
      .then(({ data }) => {
        Result[0].in_zamineh = data.status;
        setData({
          ...Data,
          Result
        });
      });
  };

  const editShow = id => {
    window.location.replace(`${Urls().AddExhibitionsGallery()}/?exb_id=${id}`);
  };
  const GalleryProfileBtn = item => (
    <>
      <div
        onClick={() => onGalleryBtnClick(item)}
        className={`${styles.GalleryBtn} ${item.in_zamineh ? "active" : ""}`}
      >
        {item.in_zamineh ? "برداشتن از زمینه" : "نمایش در زمینه"}
      </div>
    </>
  );
  const showInZaminehSHOWS = item => (
    <>
      <div
        onClick={() => showInZaminehShowClick(item)}
        className={`${styles.GalleryBtn} ${item.in_zamineh ? "active" : ""}`}
      >
        {item.in_zamineh ? "برداشتن از زمینه" : "نمایش در زمینه"}
      </div>
      {item.in_zamineh === false && item.in_review === false && (
        <div
          onClick={() => editShow(item.id)}
          className={`${styles.GalleryBtn}`}
        >
          ویرایش این نمایشگاه
        </div>
      )}
    </>
  );
  return (
    <>
      {loading && (
        <div style={{ height: 150 }}>
          <Loading background="#fff" />
        </div>
      )}
      {type === "art" && (
        <>
          {Data && Data.results && Data.results.length > 0 ? (
            <section className={styles.tabSection}>
              <h2 className={styles.title} />
              <FourColumnArt
                Arts={Data.results}
                GalleryProfile={true}
                GalleryProfileContent={GalleryProfileBtn}
              />

              {Data.page_count > 1 && (
                <Row>
                  <Col xs={12}>
                    <Pagination
                      pageCount={Data.page_count}
                      onPageChange={handlePageClick}
                    />
                  </Col>
                </Row>
              )}
            </section>
          ) : (
            <h2 className={styles.title}>
              شما اثر ثبت شده ای در این گالری ندارید
            </h2>
          )}
        </>
      )}
      {type === "artist" && (
        <>
          {Data && Data.results && Data.results.length > 0 ? (
            <section className={styles.tabSection}>
              <h2 className={styles.title} />
              <Row>
                {Data.results.map((artist, index) => (
                  <Col lg={3} md={4} sm={6} xs={12} key={index}>
                    <FlatList
                      img={artist.img}
                      url={`${Urls().artist()}${artist.slug}`}
                      item={artist}
                    />
                  </Col>
                ))}
                {Data.page_count > 1 && (
                  <Col xs={12}>
                    <Pagination
                      pageCount={Data.page_count}
                      onPageChange={handlePageClick}
                    />
                  </Col>
                )}
              </Row>
            </section>
          ) : (
            <h2 className={styles.title}>
              شما هنرمند ثبت شده ای در این گالری ندارید
            </h2>
          )}
        </>
      )}

      {type === "show" && (
        <>
          {Data && Data.results && Data.results.length > 0 ? (
            <section className={`${styles.tabSection} shows`}>
              <h2 className={styles.title} />
              <a
                style={{ marginBottom: 15 }}
                href={Urls().AddExhibitionsGallery()}
                className={`zbtn bradius black`}
              >
                اضافه کردن نمایشگاه
              </a>
              <Row>
                {Data.results.map((show, index) => (
                  <Col key={index} lg={4} md={6} sm={6} xs={12}>
                    <div className="feature">
                      <a href={Urls().show() + show.slug} className="img-link">
                        <div className="img img-hoverable">
                          <Img
                            img={show.img}
                            alt={show.title}
                            width="100%"
                            height="250px"
                          />
                        </div>
                      </a>
                      <div className="details">
                        <a href={Urls().show() + show.slug}>
                          <h3>{show.title}</h3>
                          <h4>{show.full_title}</h4>
                        </a>
                        {showInZaminehSHOWS(show)}
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </section>
          ) : (
            <h2 className={styles.title}>
              شما نمایشگاه ثبت شده ای در این گالری ندارید
            </h2>
          )}
        </>
      )}
    </>
  );
};

export const Settings = ({ Config }) => {
  const [initialized, setInitialized] = useState(false);
  const [Data, setData] = useState();
  const [MapData, setMapData] = useState();
  const [loading, setLoading] = useState(true);
  const [FormTab, setFormTab] = useState("edit");
  const [formLoading, setFormLoading] = useState(false);
  useEffect(() => {
    if (!initialized) {
      handleData();
      setInitialized(true);
    }
  });
  const handleData = () => {
    axios
      .get(`${Urls().api()}/gallery-app/gallery/profile/edit/`)
      .then(({ data }) => {
        setData(data);
        setLoading(false);
      });
  };
  const onMapClick = event => {
    setMapData(event.latlng);
  };
  const handleSubmit = values => {
    setFormLoading(true);
    if (!Validation(values)) {
      Toast("warning", "اطلاعات تکمیل نمیباشد");
    } else {
      axios
        .post(`${Urls().api()}/gallery-app/gallery/profile/edit/`, values, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        })
        .then(({ data }) => {
          setData(data);
          setFormLoading(false);
          Toast("success", `اطلاعات شما با موفقیت ثبت شد`);
        })
        .catch(err => {
          if (err.response.status == 403) {
            Toast("warning", "پروفایل شما تایید نشده است.");
            setFormLoading(false);
          } else {
            Toast("warning", "مشکلی رخ داده است!");
            setFormLoading(false);
          }
        });
    }
  };

  const Validation = value => {
    if (
      value.name == "" ||
      value.address.address == undefined ||
      value.address.address == "" ||
      value.address.tel == undefined ||
      value.address.tel == "" ||
      value.work_hours.start_time == undefined ||
      value.work_hours.start_time == "" ||
      value.work_hours.end_time == undefined ||
      value.work_hours.end_time == "" ||
      value.holiday_set == undefined ||
      value.holiday_set == "" ||
      value.email == null ||
      value.email == "" ||
      value.sheba_num == null ||
      value.sheba_num == "" ||
      value.owner.name == undefined ||
      value.owner.name == "" ||
      value.owner.tel == undefined ||
      value.owner.tel == ""
    ) {
      return false;
    } else {
      return true;
    }
  };

  const sendConfirmCode = () => {
    axios
      .post(`${Urls().api()}/gallery-app/forgot/code/`, {
        username: Config.username,
        client_id: cookie.load("client_id", { path: "" }),
        client_secret: cookie.load("client_secret", { path: "" }),
        user_type: "Gallery"
      })
      .then(({ data }) => {
        setData(data);
      });
  };
  const handleChangePassword = values => {
    axios
      .post(`${Urls().api()}/gallery-app/forgot/password/`, {
        username: Config.username,
        password: values.password,
        code: values.code,
        client_id: SecurityManager().getClientIDSecret("id", "Gallery"),
        client_secret: SecurityManager().getClientIDSecret("secret", "Gallery"),
        user_type: "Gallery"
      })
      .then(({ data }) => {
        SecurityManager().setGalleryRegAccessToken(data.access_token);
        SecurityManager().setGalleryRegRefreshToken(data.refresh_token);
      });
  };
  return (
    <>
      {loading && (
        <div style={{ height: 150 }}>
          <Loading background="#fff" />
        </div>
      )}
      <section className={styles.tabSection}>
        <div className={styles.tabButton}>
          <button
            className={`zbtn bradius ${FormTab === "edit" ? "black" : ""}`}
            onClick={() => setFormTab("edit")}
          >
            ویرایش اطلاعات گالری
          </button>
          <button
            className={`zbtn bradius ${FormTab === "password" ? "black" : ""}`}
            onClick={() => setFormTab("password")}
          >
            تغییر رمز عبور
          </button>
        </div>
        {FormTab === "edit" && (
          <EditGallery
            loading={formLoading}
            values={Data}
            handleSubmit={handleSubmit}
            onMapClick={onMapClick}
            config={Config}
          />
        )}
        {FormTab === "password" && (
          <>
            <h2>تغییر رمز عبور</h2>
            <button
              className={`zbtn bradius black`}
              onClick={() => sendConfirmCode()}
            >
              دریافت کد تایید
            </button>

            <ChangePassword
              loading={formLoading}
              values={Data}
              handleSubmit={handleChangePassword}
              hideUpload={true}
            />
          </>
        )}
      </section>
    </>
  );
};

export const Notification = () => {
  const [initialized, setInitialized] = useState(false);
  const [Data, setData] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!initialized) {
      handleData();
      setInitialized(true);
    }
  });
  const handleData = () => {
    axios
      .get(`${Urls().api()}/gallery-app/gallery/notifications/`)
      .then(({ data }) => {
        setData(data);
        sendData();
        setLoading(false);
      });
  };
  const sendData = () => {
    axios.post(`${Urls().api()}/gallery-app/gallery/notifications/`);
  };
  return (
    <>
      {loading && (
        <div style={{ height: 150 }}>
          <Loading background="#fff" />
        </div>
      )}

      <section className={styles.tabSection}>
        <h2 className={styles.title}>رخدادها</h2>
        {Data &&
          Data.results.map((item, index) => (
            <div
              key={index}
              className={`${styles.notification} ${item.is_seen ? "" : "seen"}`}
            >
              <h2>{item.body}</h2>
              <span className="notification_time">
                {item.date} {item.time}
              </span>
            </div>
          ))}
      </section>
    </>
  );
};

export const Transactions = () => {
  const [initialized, setInitialized] = useState(false);
  const [Data, setData] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!initialized) {
      handleData();
      setInitialized(true);
    }
  });
  const handleData = () => {
    axios
      .get(`${Urls().api()}/gallery-app/panel/transaction/list/`)
      .then(({ data }) => {
        setData(data);
        setLoading(false);
      });
  };

  return (
    <>
      {loading && (
        <div style={{ height: 150 }}>
          <Loading background="#fff" />
        </div>
      )}

      <section className={styles.tabSection}>
        <h2 className={styles.title}>تراکنش‌ها</h2>
        {Data && Data.results.length > 0
          ? Data.results.map((item, index) => (
              <TransactionList key={index} item={item} />
            ))
          : ""}
      </section>
    </>
  );
};

export const Ticket = () => {
  const [initialized, setInitialized] = useState(false);
  const [Data, setData] = useState();
  const [modal, setModal] = useState(false);
  const [Types, setTypes] = useState();
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  useEffect(() => {
    if (!initialized) {
      setLoading(false);
      getData();
      getTypes();
      setInitialized(true);
    }
  });
  const getData = page => {
    axios
      .get(`${Urls().api()}/gallery-app/panel/support-tickets/`, {
        params: {
          page: page
        }
      })
      .then(({ data }) => {
        setData(data);
        setLoading(false);
      });
  };
  const getTypes = () => {
    axios
      .get(`${Urls().api()}/gallery-app/panel/support-types/`)
      .then(({ data }) => {
        setTypes(data);
      });
  };
  const handleSubmit = values => {
    setFormLoading(true);
    axios
      .post(`${Urls().api()}/gallery-app/panel/support-tickets/`, values, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      })
      .then(({ data }) => {
        setData(data);
        Toast("success", `درخواست با موفقیت ثبت شد`);
        setFormLoading(false);
        setModal(false);
      })
      .catch(err => {
        setFormLoading(false);
      });
  };

  return (
    <>
      {loading && (
        <div style={{ height: 150 }}>
          <Loading background="#fff" />
        </div>
      )}

      <section className={styles.tabSection}>
        <h2 className={styles.title}>تیکت‌های پشتیبانی</h2>
        <div className={styles.tabButton}>
          <button
            className={`zbtn bradius black`}
            onClick={() => setModal(true)}
          >
            درخواست جدید
          </button>
        </div>
        {Data && Data.results.length > 0 ? (
          Data.results.map((item, index) => (
            <SupportTicket key={index} item={item} />
          ))
        ) : (
          <h2>شما تابحال درخواستی ثبت نکرده‌اید.</h2>
        )}
      </section>

      <Modal
        isOpen={modal}
        toggle={() => setModal(false)}
        title={"درخواست پشتیبانی"}
      >
        <SupportTicketForm
          loading={formLoading}
          types={Types}
          handleSubmit={handleSubmit}
        />
      </Modal>
    </>
  );
};
