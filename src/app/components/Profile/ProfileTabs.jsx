import React, { useState, useEffect } from "react";
import createBrowserHistory from "history/createBrowserHistory";
import cookie from "react-cookies";

import axios from "axios";
import Urls from "../Urls";
import Alert from "../Alert/Alert";
import { Toast } from "../Toast/Toast";

import { Loading } from "../Spinner/Spinner";
import { ThreeColumnArt, FourColumnArt } from "../ArtArtist/Arts";
import { ResultsGrid } from "../Gallery/Galleries/SingleGallery";
import TransactionList from "../Transactions/Transactions";

import { EditProfile, Report } from "./ProfileForms";
import RecomArtist from "../../home/components/RecomArtist";
import Categories from "../../home/components/Categories";

import styles from "./Profile.scss";

const history = createBrowserHistory();

export const Saves = () => {
  const [initialized, setInitialized] = useState(false);
  const [Data, setData] = useState();
  const [savedArt, setsavedArt] = useState();
  const [followedArtists, setFollowedArtists] = useState();
  const [followedGalleries, setFollowedGalleries] = useState();
  const [followedCats, setFollowedCats] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!initialized) {
      getData("saves", setsavedArt);
      getData("artists", setFollowedArtists);
      getData("categories", setFollowedCats);
      getData("galleries", setFollowedGalleries);
      // getData('save',setsavedArt)
      setInitialized(true);
    }
  });
  const getData = (slug, Data) => {
    axios.get(`${Urls().api()}/client-app/client/${slug}/`).then(({ data }) => {
      Data(data);
      setLoading(false);
    });
  };
  const onFollowClick = () => {};
  return (
    <>
      {loading && (
        <div style={{ height: 150 }}>
          <Loading background="#fff" />
        </div>
      )}
      {savedArt && savedArt.art_set && (
        <section className={styles.tabSection}>
          <h2 className={styles.title}>
            ذخیره شده‌ها <span>{savedArt.count} اثر ذخیره شده</span>
          </h2>
          <ThreeColumnArt Arts={savedArt.art_set} />
        </section>
      )}

      {followedArtists && followedArtists.artist_set && (
        <section className={styles.tabSection}>
          <h2 className={styles.title}>
            هنرمندانی که دنبال میکنید{" "}
            <span>{followedArtists.count} هنرمند دنبال میکنید</span>
          </h2>
          <RecomArtist
            artist={followedArtists.artist_set}
            foreignItems={true}
          />
        </section>
      )}
      {followedGalleries && followedGalleries.gallery_set && (
        <section className={styles.tabSection}>
          <h2 className={styles.title}>
            گالری‌هایی که دنبال میکنید{" "}
            <span>{followedGalleries.count} گالری‌ دنبال میکنید</span>
          </h2>
          <ResultsGrid
            item={followedGalleries.gallery_set}
            onFollowClick={onFollowClick}
          />
        </section>
      )}
      {followedCats && followedCats.cat_set && (
        <section className={styles.tabSection}>
          <h2 className={styles.title}>
            دسته بندی‌هایی که دنبال میکنید{" "}
            <span>{followedCats.count} دسته بندی‌ دنبال میکنید</span>
          </h2>
          <Categories
            cats={followedCats.cat_set}
            art_set={followedCats.art_set}
            foreignItems={true}
          />
        </section>
      )}
    </>
  );
};

export const Settings = ({ slug }) => {
  const [initialized, setInitialized] = useState(false);
  const [Data, setData] = useState();
  const [Cities, setCities] = useState();
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  useEffect(() => {
    if (!initialized) {
      handleData();
      getCities();
      setInitialized(true);
    }
  });
  const handleData = () => {
    axios
      .get(`${Urls().api()}/client-app/client/profile/edit/`)
      .then(({ data }) => {
        setData(data);
        setLoading(false);
      });
  };
  const getCities = () => {
    axios
      .post(
        `${Urls().api()}/cities/`,
        {
          client_id: cookie.load("client_id", { path: "/" }),
          client_secret: cookie.load("client_secret", { path: "/" })
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        }
      )
      .then(({ data }) => {
        setCities(data);
      });
  };
  const handleSubmit = values => {
    setFormLoading(true);
    const Values = {
      ...values,
      client_id: cookie.load("auth_client_id", { path: "/" }),
      client_secret: cookie.load("auth_client_secret", { path: "/" })
    };

    axios
      .post(`${Urls().api()}/client-app/client/profile/edit/`, Values, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      })
      .then(({ data }) => {
        setData(data);
        handleData();
        setFormLoading(false);
        Toast("success", `اطلاعات شما با موفقیت ثبت شد`);
      })
      .catch(err => {
        Toast("warning", `مشکلی پیش آمده است!`);
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
        <h2 className={styles.title}>مشخصات شما</h2>
        <EditProfile
          loading={formLoading}
          values={Data}
          handleSubmit={handleSubmit}
          cities={Cities}
        />
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
      .get(`${Urls().api()}/client-app/client/notifications/`)
      .then(({ data }) => {
        setData(data);
        sendData();
        setLoading(false);
      });
  };
  const sendData = () => {
    axios.post(`${Urls().api()}/client-app/client/notifications/`);
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
          Data.notif_set.map((item, index) => (
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
      .get(`${Urls().api()}/client-app/client/transactions/`)
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
        {Data && Data.transaction_set.length > 0 ? (
          Data.transaction_set.map((item, index) => (
            <TransactionList key={index} item={item} />
          ))
        ) : (
          <h2>شما تابحال تراکنشی ثبت نکرده‌اید.</h2>
        )}
      </section>
    </>
  );
};

export const ReportBug = () => {
  const [initialized, setInitialized] = useState(false);
  const [Data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  useEffect(() => {
    if (!initialized) {
      setLoading(false);
      setInitialized(true);
    }
  });
  const handleSubmit = values => {
    setFormLoading(true);
    console.log(values);
    axios
      .post(`${Urls().api()}/client-app/client/report-bug/`, values)
      .then(({ data }) => {
        setData(data);
        Toast("success", `گزارش با موفقیت ثبت شد`);

        setFormLoading(false);
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
        <h2 className={styles.title}>گزارش خطا در وبسایت</h2>
        <Report
          loading={formLoading}
          values={Data}
          handleSubmit={handleSubmit}
        />
      </section>
    </>
  );
};
