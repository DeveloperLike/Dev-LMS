import React, { useEffect, useState } from 'react';
import { Accordian } from './Accordian';


export const ActivityReport = ({activityList,leadActivityListGetApi}) => {
  useEffect(()=>{
    leadActivityListGetApi();
  },[]);
  
  return (
    <div>
      {/* <br />
      <p><strong>Tracking URL: &nbsp;</strong>  {allActivityList.tracking_url}</p>
      <p><strong>Source: &nbsp;</strong> {allActivityList.lead_source}</p>
      <p><strong>Created by: &nbsp;</strong> {allActivityList.lead_source}</p>
      <br /> */}
        <Accordian activityList={activityList}/>
    </div>
  )
}





