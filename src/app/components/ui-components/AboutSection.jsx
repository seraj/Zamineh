import React from "react";
import { Link } from "react-router-dom";
import Urls from "../Urls";
import { Img } from "../General";
import DefaultStyle from "../../static/scss/_boxStyle.scss";
import FollowInline from "../ui-components/FollowInline";

import styles from "./uiComponents.scss";
const AboutSection = props => {
  return (
    <div className={styles.aboutSection}>
      <div className={styles.aboutHeader}>
        <Link to={props.url}>
          <div className="image">
            <Img
              img={props.img}
              alt={props.name}
              width={45}
              height={45}
              style={{
                minWidth: 45
              }}
            />
          </div>
        </Link>
        <div className="info">
          <Link to={props.url}>
            <h2 className="title">{props.title}</h2>
          </Link>
          <span>
            {props.underTitle}
            <FollowInline
              id={props.id}
              type={props.type}
              isFollowed={props.follow.is_flw}
            />
          </span>
        </div>
      </div>
      <div className="context">
        <p>{props.context}</p>
      </div>
    </div>
  );
};
export default AboutSection;
