import React from 'react';
function Icon(props) {
  return (
    <svg
      className={`icon icon-${props.name}`}
      viewBox='0 0 58.11 58.11'
      {...props}
    />
  );
}
function Lines(props) {
  return (
    <g
      id='line'
      data-name='Lines'
      style={{
        fill: `${props.fill}`,
        stroke: `${props.stroke}`
      }}
      {...props}
    />
  );
}
function Path(props) {
  return <path className={`path path-${props.name}`} d={props.d} />;
}

// Icons Component
export const IconProfile = props => (
  <Icon {...props} name='user'>
    <Lines fill={props.fill} stroke={props.stroke}>
      <Path
        name='user'
        d='M57.4.71H.71V57.4H57.4Zm-39,42.49V39.66a10.61,10.61,0,1,1,21.21,0V43.2M29.06,14.91A7.07,7.07,0,1,1,22,22,7.07,7.07,0,0,1,29.06,14.91Z'
      />
    </Lines>
  </Icon>
);

export const IconSave = props => (
  <Icon height={props.height} width={props.width} name='heart'>
    <Lines fill={props.fill} stroke={props.stroke} strokeWidth='3'>
      <Path
        name='heart'
        d='M15.06,29.2 L3.11,15.59 C0.145512102,12.1851504 0.222908984,7.09360806 3.28951796,3.78043756 C6.35612694,0.467267051 11.4265089,-0.0028612023 15.05,2.69 C18.6723809,-0.0249070143 23.7603561,0.435379189 26.8367037,3.75629 C29.9130513,7.07720082 29.9835415,12.1854673 27,15.59 L15.06,29.2 Z'
      />
    </Lines>
  </Icon>
);
export const IconPlus = props => (
  <Icon height={props.height} width={props.width} name='plus'>
    <Lines fill={props.fill} stroke={props.stroke} strokeWidth='3'>
      <Path
        name='plus'
        d='M57.4.71H.71V57.4H57.4ZM14.91,29.06H43.2M29.06,14.91V43.2'
      />
    </Lines>
  </Icon>
);
export const IconArrowLeft = props => (
  <Icon height={props.height} width={props.width} name='arrow-left'>
    <Lines fill={props.fill} stroke={props.stroke} strokeWidth='3'>
      <Path
        name='arrow-left'
        d='M57.4.71H.71V57.4H57.4ZM36.13,14.91,22,29.05,36.13,43.2'
      />
    </Lines>
  </Icon>
);
export const IconArrowRight = props => (
  <Icon height={props.height} width={props.width} name='arrow-right'>
    <Lines fill={props.fill} stroke={props.stroke} strokeWidth='3'>
      <Path
        name='arrow-right'
        d='M57.4.71H.71V57.4H57.4ZM22,14.91,36.13,29.05,22,43.2'
      />
    </Lines>
  </Icon>
);
