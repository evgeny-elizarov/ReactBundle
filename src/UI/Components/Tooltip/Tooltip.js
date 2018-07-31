import React from 'react';
import classNames from "classnames";

const Tooltip = ({ styleClass, message, show }) => (
    <div
        className={classNames("tooltip fade bottom in", styleClass)}
        style={{display: show  == null ? 'auto' : (show  ? 'block' : 'none')}}
        role="tooltip">
        <div className="tooltip-arrow" style={{left: "50%"}} />
        <div className="tooltip-inner">{message}</div>
    </div>
);

export default Tooltip;