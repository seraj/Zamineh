import React, { useState, useEffect } from "react";
import { generatePath } from "react-router-dom";
import createBrowserHistory from "history/createBrowserHistory";

import axios from "axios";
import Urls from "../Urls";
import { Loading } from "../Spinner/Spinner";
import Pagination from "../Pagination/Pagination";
import { FourColumnArt } from "../ArtArtist/Arts";
import RecomArtist from "../../home/components/RecomArtist";
import { Checkbox } from "../ui-components/Form/inputs";
import NumbersConvertor from "../NumbersConvertor";

import styles from "./Categories.scss";

const history = createBrowserHistory();

const CategoriesArts = ({ slug, isLogined, openModal }) => {
  const [initialized, setInitialized] = useState(false);
  const [Data, setData] = useState();
  const [Values, setValues] = useState({
    mode: null,
    only_for_sale: null,
    price_range: null,
    size: null,
    medium: null,
    sort: null
  });
  const [loading, setLoading] = useState(true);
  const [Resultloading, setResultloading] = useState(true);

  useEffect(() => {
    if (!initialized) {
      handleData();
      setInitialized(true);
    }
  });
  const handleData = params => {
    axios
      .get(`${Urls().api()}/gene/${slug}/filter/`, { params: params })
      .then(({ data }) => {
        setData(data);
        setLoading(false);
        setResultloading(false);
      });
  };
  const handlePageClick = data => {
    let selected = data.selected + 1;
    setLoading(true);
    handleData(selected);
  };
  const handleFormChange = (type, value) => {
    setResultloading(true);
    let allValue = Values;
    if (type === Data.filter.mode.type) {
      allValue[Data.filter.mode.type] = value;
      allValue["medium"] = null;
      allValue["price_range"] = null;
      allValue["only_for_sale"] = null;
      allValue["size"] = null;
      allValue["sort"] = null;
      setValues(allValue);
      //   console.log(type, value, Values);
      handleData(Values);
    } else {
      //   console.log(type, value);
      allValue[type] = value;
      allValue[Data.filter.mode.type] = null;
      setValues(allValue);
      handleData(Values);
    }
  };

  const urlParams = (sale, size, price, medium) => {
    history.push({
      pathname: `
            ${sale ? `only_for_sale=${sale}&&` : ``}        
            ${size ? `size=${size}&&` : ``}        
            ${price ? `price=${price}&&` : ``}        
            ${medium ? `medium=${medium}` : ``}        
            `
    });
  };
  const filterFormRef = form => {
    form = form;
  };
  return (
    <>
      {loading && (
        <div style={{ height: 150 }}>
          <Loading background="#fff" />
        </div>
      )}

      {Data && Data.filter && (
        <div className={styles.artFilter}>
          <form ref={filterFormRef}>
            {Values.mode !== "" && (
              <div
                onClick={() =>
                  handleFormChange(
                    Data.filter.mode.type,
                    Values.mode === Data.filter.mode.value
                      ? null
                      : Data.filter.mode.value
                  )
                }
                className={`filter-button ${
                  Values.mode === "artist" ? "active" : ""
                }`}
              >
                <Checkbox
                  disabled={true}
                  id={Data.filter.mode.value}
                  label={Data.filter.mode.title}
                  checked={Values.mode}
                />
              </div>
            )}
            {Values.only_for_sale !== "" && (
              <div
                onClick={() =>
                  handleFormChange(
                    "only_for_sale",
                    Values.only_for_sale ? null : true
                  )
                }
                className={`filter-button ${
                  Values.only_for_sale ? "active" : ""
                }`}
              >
                <Checkbox
                  disabled={true}
                  id={Data.filter.only_for_sale.value}
                  label={Data.filter.only_for_sale.title}
                  checked={Values.only_for_sale}
                />
              </div>
            )}
            <FilterDropDown
              name="اندازه"
              data={Data.filter.size_set}
              defaultOptionClick={() => handleFormChange("size", null)}
              value={Values.size}
              handleChange={handleFormChange}
              options={Data.filter.size_set}
            />
            <FilterDropDown
              name="قیمت"
              data={Data.filter.price_set}
              defaultOptionClick={() => handleFormChange("price_range", null)}
              value={Values.price_range}
              handleChange={handleFormChange}
              options={Data.filter.price_set}
            />
            <FilterDropDown
              name="بستر"
              data={Data.filter.medium_set}
              defaultOptionClick={() => handleFormChange("medium", null)}
              value={Values.medium}
              handleChange={handleFormChange}
              options={Data.filter.medium_set}
            />
          </form>
        </div>
      )}
      {Data && Data.art_set && Data.art_set.length > 0 && (
        <div className={`${styles.Sections} nobb`}>
          {Resultloading && <Loading />}
          <FourColumnArt Arts={Data.art_set} />
          {Data && Data.page_count > 1 && (
            <Pagination
              pageCount={Data.page_count}
              onPageChange={handlePageClick}
            />
          )}
        </div>
      )}
      {Data && Data.artist_set && Data.artist_set.length > 0 && (
        <div className={`${styles.Sections} nobb`}>
          {Resultloading && <Loading />}
          <RecomArtist artist={Data.artist_set} foreignItems={true} />
          {Data && Data.page_count > 1 && (
            <Pagination
              pageCount={Data.page_count}
              onPageChange={handlePageClick}
            />
          )}
        </div>
      )}
    </>
  );
};

export default CategoriesArts;

const FilterDropDown = ({
  name,
  options,
  value,
  handleChange,
  defaultOptionClick,
  data
}) => {
  const activeValue = data.filter(item => item.value === value);
  return (
    <>
      {options && options.length > 0 && (
        <div
          className={`filter-dropdown ${value != null ? "is-active" : null}`}
        >
          <div className="filter-nav-main-text">{name}</div>
          <div className="filter-nav-active-text">
            {value != null && activeValue !== null
              ? activeValue[0].title
              : null}
          </div>
          <i className="icon fas fa-caret-down" />
          <nav className="filter-dropdown-nav">
            <a onClick={defaultOptionClick}>
              <span className="filter-dropdown-text">همه</span>
            </a>
            {options.map((item, index) => (
              <a
                key={index}
                onClick={() => handleChange(item.type, item.value)}
              >
                <span className="filter-dropdown-text">{item.title}</span>
                <span className="filter-dropdown-count">
                  ({NumbersConvertor().convertToPersian(item.count)})
                </span>
              </a>
            ))}
          </nav>
        </div>
      )}
    </>
  );
};
