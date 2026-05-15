export const packageCodes = [
  { label: "Not Confirmed Yet", value: 0 },
  { label: "Admission", value: 1 },
  { label: "Admission & Visa", value: 2 },
  { label: "Admission, Visa & Accommodation", value: 3 },
  { label: "Only Visa", value: 4 },
  { label: "QAP (Admission + Visa)", value: 5 },
  { label: "Only Application", value: 6 },
  { label: "Opportunity Card", value: 7 },
  { label: "QAP (PP)", value: 8 },
  { label: "Only Accommodation", value: 9 },
  { label: "Visa & Accommodation", value: 10 },
  { label: "Admission & Accommodation", value: 11 },
  { label: "QAP Accommodation", value: 12 },
  { label: "Only PDS", value: 13 },
  { label: "Admission & PDS", value: 14 },
  { label: "Admission,Visa & PDS", value: 15 },
  { label: "Adm,visa,Accomm & PDS", value: 16 },
  { label: "Accommodation & PDS", value: 17 },
  { label: "Visa & PDS", value: 18 },
  { label: "Basic", value: 19 },
  { label: "Standard", value: 20 },
  { label: "Premium", value: 21 },
  { label: "Visa", value: 22 },
  { label: "Accommodation", value: 23 },
  { label: "Basic + Visa", value: 24 },
  { label: "Standard + Visa", value: 25 },
  { label: "Basic + Visa + Accommodation", value: 26 },
  { label: "Standard + Visa + Accommodation", value: 27 },
  { label: "Premium + Accommodation", value: 28 },
  { label: "Basic + Accommodation", value: 29 },
  { label: "Standard + Accommodation", value: 30 },
  { label: "Standard+Additional University", value: 31 },
  { label: "Standard+Accommodation+Additional University", value: 32 },
  { label: "Standard+Visa+Additional University", value: 33 },
  { label: "Standard+Visa+Accommodation+Additional University", value: 34 },
  { label: "Premium Part Payment", value: 35 },
  { label: "Premium Part Payment+Accommodation", value: 36 },
];

export const stStatusOptions = [
  { label: "Active", value: 0 },
  { label: "Hold", value: 1 },
  { label: "Drop", value: 2 },
  { label: "Alumni", value: 3 },
  { label: "InActive", value: 4 },
  { label: "Admission Deferred", value: 5 },
  { label: "Deferred Active", value: 6 },
  { label: "Ref / VIP", value: 7 },
  { label: "Refund", value: 8 },
  { label: "Hold Not Eligible", value: 9 },
  { label: "Hold payment Pending", value: 10 },
  { label: "Hold Not Responding", value: 11 },
  { label: "Hold Not Approved", value: 12 },
  { label: "Reference", value: 13 },
  { label: "VVIP", value: 14 }
];

export const clStatusOptions = [
  { label: 'Not Updated', value: 0 },
  { label: 'Course List in Process', value: 2 },
  { label: 'CL Created', value: 9 },
  { label: 'Need To Disucss', value: 10 },
  { label: 'Discussed Not Shared', value: 11 },
  { label: 'Need to Share', value: 12 },
  { label: "Discussed But Can't Share", value: 13 },
  { label: 'Shared', value: 3 },
  { label: 'Partial Final', value: 4 },
  { label: 'Exceptionally Final', value: 5 },
  { label: 'Final', value: 1 },
  { label: 'Final and Reopen', value: 6 }
];

export const paymentStatusOptions = [
  { value: "Accommodation Amount pending", label: "Accommodation Amount pending" },
  { value: "Admission Process Started", label: "Admission Process Started" },
  { value: "Admission Amount pending", label: "Admission Amount pending" },
  { value: "Registration Amount pending", label: "Registration Amount pending" },
  { value: "Visa Process Started", label: "Visa Process Started" },
  { value: "Hold", label: "Hold" },
  { value: "Completed", label: "Completed" },
  { value: "Drop", label: "Drop" },
  { value: "Refund", label: "Refund" },
  { value: "Visa Amount pending", label: "Visa Amount pending" },
];

export const cvStatusOptions = [
  { label: "Assigned for Making", value: "Assigned for Making" },
  { label: "Not Yet Assigned", value: "Not Yet Assigned" },
  { label: "CV Not Required", value: "CV Not Required" },
  { label: "Temp Final CV", value: "Temp Final CV" },
  { label: "Assigned for Review", value: "Assigned for Review" },
  { label: "Final CV", value: "Final CV" }
];

export const admStatusList = [
  { label: "Approved", value: "Approved" },
  { label: "Not Applied Yet", value: "Not Applied Yet" },
  { label: "Dropped by Student", value: "Dropped by Student" },
  { label: "Cancel", value: "Cancel" },
  { label: "Rejected", value: "Rejected" },
  { label: "Admission Given", value: "Admission Given" },
  { label: "Admission Accepted By Student", value: "Admission Accepted By Student" },
  { label: "Final Admission Accepted", value: "Final Admission Accepted" },
  { label: "Applied", value: "Applied" },
];

export const visaStatusList = [
  { label: "8) MOCK TWO DONE", value: "8) MOCK TWO DONE" },
  { label: "N.A.", value: "N.A." },
  { label: "4) YG Visa Docs Verified and Sent", value: "4) YG Visa Docs Verified and Sent" },
  { label: "1) Visa Process Email done & Checklist sent by ER", value: "1) Visa Process Email done & Checklist sent by ER" },
  { label: "2) VISA PROCESS EMAIL & CALL DONE", value: "2) VISA PROCESS EMAIL & CALL DONE" },
  { label: "5) Financials received", value: "5) Financials received" },
  { label: "6) MOCK ONE DONE", value: "6) MOCK ONE DONE" },
  { label: "3) YG VISA DOCS PREPARED", value: "3) YG VISA DOCS PREPARED" },
  { label: "VISA PROCESS CALL DONE", value: "VISA PROCESS CALL DONE" },
  { label: "0)VISA NOT STARTED DUE TO LOW PAYMENT", value: "0)VISA NOT STARTED DUE TO LOW PAYMENT" },
  { label: "7) Full file recieved & Verified by YG", value: "7) Full file recieved & Verified by YG" },
  { label: "7) Mock Two Done", value: "7) Mock Two Done" },
  { label: "1) Visa Process Email done & Checklist sent by ERP", value: "1) Visa Process Email done & Checklist sent by ERP" },
  { label: "1) VISA CHECKLIST SENT BY ERP", value: "1) VISA CHECKLIST SENT BY ERP" },
  { label: "0) Visa Process not started due to low payment", value: "0) Visa Process not started due to low payment" },
  { label: "0", value: "0" },
  { label: "2) Visa Process Call Done/Google Meet", value: "2) Visa Process Call Done/Google Meet" },
  { label: "Not Applicable", value: "Not Applicable" },
];

export const baStatusList = [
  { label: "1)BA INTRO EMAIL AND CALL", value: "1)BA INTRO EMAIL AND CALL" },
  { label: "0) BA NOT STARTED DUE TO LOW PAYMENT", value: "0) BA NOT STARTED DUE TO LOW PAYMENT" },
  { label: "0) BA Process not started due to low payment", value: "0) BA Process not started due to low payment" },
  { label: "1) BA Intro Email done & Checklist sent by ERP", value: "1) BA Intro Email done & Checklist sent by ERP" },
  { label: "2)BA OPENED", value: "2)BA OPENED" },
  { label: "2) BA Intro Call Done", value: "2) BA Intro Call Done" },
  { label: "3) BA Opened", value: "3) BA Opened" },
  { label: "3)FUNDS TRANSFERRED", value: "3)FUNDS TRANSFERRED" },
  { label: "4) Funds Transferred", value: "4) Funds Transferred" },
  { label: "BA INTRO CALL DONE", value: "BA INTRO CALL DONE" },
  { label: "BLOCKED", value: "BLOCKED" },
  { label: "N/A", value: "N/A" },
  { label: "Not Applicable", value: "Not Applicable" },
];

export const visaFileStatusOptions = [
  { label: "", value: "" },
  { label: "0", value: "0" },
  { label: "0) APPOINTMENT NOT BOOKED", value: "0) APPOINTMENT NOT BOOKED" },
  { label: "0) To be Filled", value: "0) To be Filled" },
  { label: "1) Partially Filled", value: "1) Partially Filled" },
  { label: "10) Rejected", value: "10) Rejected" },
  { label: "11) To be re-applied", value: "11) To be re-applied" },
  { label: "2) APPLIED", value: "2) APPLIED" },
  { label: "2) Under Review", value: "2) Under Review" },
  { label: "3) APPROVED", value: "3) APPROVED" },
  { label: "4) Launched & Waitlisted", value: "4) Launched & Waitlisted" },
  { label: "4) STAMPED", value: "4) STAMPED" },
  { label: "5) Launched & Submitted", value: "5) Launched & Submitted" },
  { label: "5) REJECTED", value: "5) REJECTED" },
  { label: "6) Appointment Booked", value: "6) Appointment Booked" },
  { label: "7) Applied", value: "7) Applied" },
  { label: "8) TO BE REBOOKED", value: "8) TO BE REBOOKED" },
  { label: "9) Stamped", value: "9) Stamped" },
  { label: "Not Sent", value: "Not Sent" },
  { label: "WAITLISTED", value: "WAITLISTED" }
];

export const apsStatusOptions = [
  { label: "", value: "" },
  { label: "0) APS NOT STARTED DUE TO LOW PAYMENT", value: "0) APS NOT STARTED DUE TO LOW PAYMENT" },
  { label: "1)INTRO APS EMAIL & CALL DONE", value: "1)INTRO APS EMAIL & CALL DONE" },
  { label: "2) YG APS/VISA FORM RECEIVED", value: "2) YG APS/VISA FORM RECEIVED" },
  { label: "3)APS FORM FILLED BY YG", value: "3)APS FORM FILLED BY YG" },
  { label: "4)APS FORM COMPLETED & CHECKLIST SENT", value: "4)APS FORM COMPLETED & CHECKLIST SENT" },
  { label: "5)FINAL FILE RECEIVED AND VERIFIED", value: "5)FINAL FILE RECEIVED AND VERIFIED" },
  { label: "6)DOCS SENT TO APS", value: "6)DOCS SENT TO APS" },
  { label: "7)APS CERTI. FOLLOWUP", value: "7)APS CERTI. FOLLOWUP" },
  { label: "8)APS RECEIVED & UPLOADED ON DROPBOX", value: "8)APS RECEIVED & UPLOADED ON DROPBOX" },
  { label: "APS RECEIVED(SELF APPLIED)", value: "APS RECEIVED(SELF APPLIED)" },
  { label: "FOREIGN DEGREE", value: "FOREIGN DEGREE" },
  { label: "NA", value: "NA" },
  { label: "NOT APPLICABLE", value: "NOT APPLICABLE" },
  { label: "PURSUING CLASS 12", value: "PURSUING CLASS 12" },
  { label: "REJECTION", value: "REJECTION" },
  { label: "SELF APPLIED", value: "SELF APPLIED" }
];

export function getYearDropdown() {
  const startYear = 2012;
  const currentYear = new Date().getFullYear();
  const years = [];

  for (let year = startYear; year <= currentYear; year++) {
    years.push(year);
  }

  return years;
}
export function getMonthDropdown() {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return months.map((month, index) => ({
    label: month,
    value: index + 1
  }));
}


// const branchdata = [
//   {
//     year : 2025,
//     totalCounts :123,
//     quarters : [
//       {
//         quater : 'Q1',
//         totalCounts : 40,
//         months : [
//           {months : 'January', count : 10},
//           {months : 'February', count : 10},
//           {months : 'March', count : 10},
//         ]
//       },
//       {
//         quater : 'Q2',
//         totalCounts : 40,
//         months : [
//           {months : 'January', count : 10},
//           {months : 'February', count : 10},
//           {months : 'March', count : 10},
//         ]
//       },
//     ]
//   }
// ]