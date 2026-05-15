import React, { useEffect, useState } from "react";
import PendingFollowUpNew from "./Components/PendingFollowUpNew";

const FollowupNew = ({mode}) => {
    return (
        <>
            {/* <div className="mx-6 pb-5 bg-white px-4"> */}
                <PendingFollowUpNew mode={mode}/>
            {/* </div> */}
        </>
    );
};

export default FollowupNew;
