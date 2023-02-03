import React from 'react';
import { utils } from "../utils/utils"
import "./index.css"

const StarDIsplay = (props) => {
    return (
        <div>
            {utils.range(1, props.count).map((starId) => (
                <div key={starId} className="star" />
            ))}
        </div>
    );
};

export default StarDIsplay;