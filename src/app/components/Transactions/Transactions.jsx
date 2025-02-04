import React, { useState, useEffect } from "react";
import moment from "moment-jalaali";
import Urls from "../Urls";

import { Img } from "../General";
import NumbersConvertor from "../NumbersConvertor";
import ThousandSeparator from "../ThousandSeparator";
import styles from "./Transactions.scss";

export default function TransactionList({ item }) {
  const [More, setMore] = useState(false);
  const onMoreClick = () => {
    if (More === false) {
      setMore(true);
    } else setMore(false);
  };
  return (
    <div className={styles.transaction}>
      <h2>
        جزئیات سفارش شماره{" "}
        <div className="serial">
          <span>{item.serial}</span>
        </div>
      </h2>
      <ul className="list">
        <li>
          <i className="zicon icon-39" />
          وضعیت سفارش :‌{" "}
          <span style={{ color: item.status_color }}>{item.status}</span>
        </li>
        {item.submit_date && (
          <li>
            <i className="zicon icon-39" />
            زمان ثبت سفارش :‌{" "}
            <span>
              {NumbersConvertor().convertToPersian(
                moment(item.submit_date.date, "YYYY-MM-DD").format(
                  "jDD jMMMM jYYYY"
                )
              )}{" "}
              ساعت{" "}
              {NumbersConvertor().convertToPersian(item.submit_date.start_time)}
            </span>
          </li>
        )}
        {item.dl_date && (
          <>
            <li>
              <i className="zicon icon-34" />
              زمان انتخابی ارسال :‌{" "}
              <span>
                {NumbersConvertor().convertToPersian(
                  moment(item.dl_date.date, "YYYY-MM-DD").format(
                    "jDD jMMMM jYYYY"
                  )
                )}{" "}
                بین ساعت{" "}
                {NumbersConvertor().convertToPersian(item.dl_date.start_time)}{" "}
                تا {NumbersConvertor().convertToPersian(item.dl_date.end_time)}
              </span>
            </li>
            <li>
              <i className="zicon icon-34" />
              {item.dl_date.detail}
            </li>
          </>
        )}
        {item.address && (
          <li>
            <i className="zicon icon-34" />
            آدرس : <span>{item.address.address}</span>
          </li>
        )}
      </ul>
      <div onClick={() => onMoreClick()} className="showMore">
        {More ? "بستن جزئیات بیشتر" : "دیدن جزئیات"}
      </div>
      {More && (
        <>
          <hr />
          <h2>جزئیات پرداخت</h2>
          <ul className="list">
            {item.price.discount_price !== 0 && (
              <li>
                <i className="zicon icon-37" />
                تخفیف :‌{" "}
                <span>
                  {NumbersConvertor().convertToPersian(
                    ThousandSeparator(item.price.discount_price)
                  )}{" "}
                  تومان
                </span>
              </li>
            )}
            <li>
              <i className="zicon icon-42" />
              هزینه ارسال :‌{" "}
              <span>
                {item.price.delivery_price === 0
                  ? "رایگان"
                  : `${NumbersConvertor().convertToPersian(
                      ThousandSeparator(item.price.total_price)
                    )} تومان`}
              </span>
            </li>
            {item.price.credit_price && (
              <li>
                <i className="zicon icon-42" />
                اعتبار حساب :‌
                <span>
                  {NumbersConvertor().convertToPersian(
                    ThousandSeparator(item.price.credit_price)
                  )}
                  تومان
                </span>
              </li>
            )}
            {item.price.tax_price !== 0 && (
              <li>
                <i className="zicon icon-37" />
                مالیات :‌{" "}
                <span>
                  {NumbersConvertor().convertToPersian(
                    ThousandSeparator(item.price.tax_price)
                  )}{" "}
                  تومان
                </span>
              </li>
            )}
            {item.price.total_price && (
              <li>
                <i className="zicon icon-42" />
                مجموع قیمت آثار :‌{" "}
                <span>
                  {NumbersConvertor().convertToPersian(
                    ThousandSeparator(item.price.total_price)
                  )}{" "}
                  تومان
                </span>
              </li>
            )}
            {item.price.payment_price && (
              <li>
                <i className="zicon icon-42" />
                کل مبلغ پرداختی :‌{" "}
                <span>
                  {NumbersConvertor().convertToPersian(
                    ThousandSeparator(item.price.payment_price)
                  )}{" "}
                  تومان
                </span>
              </li>
            )}
          </ul>

          {item.cart && item.cart.length > 0 && (
            <>
              <hr />
              <h2>{item.cart.length > 1 ? "سفارش‌ها" : "سفارش"}</h2>

              <div className="orders">
                {item.cart.map((order, index) => (
                  <a
                    key={index}
                    href={`${Urls().arts()}${order.slug}`}
                    className="order"
                  >
                    <Img
                      img={order.img.img}
                      alt={order.name}
                      width={parseInt(70 * order.img.ratio)}
                      //height={70}
                      style={{
                        minWidth: order.img.img !== "" ? 80 : 0
                      }}
                    />
                    <div className="details">
                      <span className="bold">{order.name}</span>
                      {order.artist && order.artist !== "" && (
                        <a href={`${Urls().artist()}${order.artist.slug}`}>
                          <span>{order.artist.name}</span>
                        </a>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
