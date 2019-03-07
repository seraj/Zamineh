import React, { useState, useEffect } from "react";

import axios from "axios";
import Urls from "../Urls";
import Pagination from "../Pagination/Pagination";
import { FourColumnArt } from "../ArtArtist/Arts";
import { Loading } from "../Spinner/Spinner";
import FollowInline from "../ui-components/FollowInline";
import styles from "./Shows.scss";

const ShowSet = ({ items }) => {
  const [initialized, setInitialized] = useState(false);
  const [Data, setData] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!initialized) {
      handleData();
      setInitialized(true);
    }
  });
  const handleData = page => {
    axios
      .get(`${Urls().api()}/shows/arts/`, {
        params: {
          id: items.id,
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
    handleData(selected);
  };
  return (
    <div className={styles.showSet}>
      {loading && <Loading />}
      {items && (
        <div className="title">
          <div className="metadata">
            {items.gallery && (
              <>
                <a
                  className="name"
                  href={`${Urls().gallery()}${items.gallery.slug}`}
                >
                  {items.gallery.name}
                </a>
                <FollowInline
                  id={items.gallery.id}
                  type="galleries"
                  isFollowed={items.gallery.is_flw}
                />
              </>
            )}
            <br />
            <a href={`${Urls().show()}${items.slug}`}>{items.title}</a>
            <div className="info">{items.info}</div>
          </div>
        </div>
      )}
      {Data && Data.results && <FourColumnArt Arts={Data.results} />}
      {Data && Data.page_count > 1 && (
        <Pagination
          pageCount={Data.page_count}
          onPageChange={handlePageClick}
        />
      )}
    </div>
  );
};
export default ShowSet;
