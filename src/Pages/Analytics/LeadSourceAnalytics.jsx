import React from 'react'
import AnalyticsCityChart from './AnalyticsByCity'
import { AnalysisByState } from './AnalysisByState'
import { AnalysisByLeadSource } from './AnalysisByLeadSource'
import AnalyticsByCounsellors from './AnalyticsByCounsellors'
import AnalyticsByCampaign from './AnalyticsByCampaign'

export const LeadSourceAnalytics = () => {
  return (
    <div>
      <AnalyticsCityChart/>
      <br />
      <AnalysisByState/>
      <br />
      <AnalysisByLeadSource/>
      <br />
      <AnalyticsByCounsellors/>
      <br />
      <AnalyticsByCampaign/>
    </div>
  )
}
