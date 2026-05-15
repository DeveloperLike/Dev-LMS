import { configureStore } from "@reduxjs/toolkit";
import loaderSlice from "./ReduxFunctions";
import loginOtpDataSlice from "./OptSlice";
import notificationSlice from "./NotificationSlice";
import permissionsSlice from "./UserPermission";
import  TemplateDrawerSlice  from "./TemplateDrawerSlice";
import branchSlice from "./DashboardRedux/branchRedux";
import facebookSlice  from "./FacebookToken";
import facebookEmailSlice from "./FacebookEmail";
import leadFilterSlice from "./leadFilterSlice";


export default configureStore({
  reducer: {
    loader: loaderSlice,
    nameloginOtpData: loginOtpDataSlice,
    toastName: notificationSlice,
    permissions: permissionsSlice,
    branch: branchSlice,
    facebookAccessToken: facebookSlice,
    facebookEmail: facebookEmailSlice,
    drawerState: TemplateDrawerSlice,
    leadFilter: leadFilterSlice
  },
});



