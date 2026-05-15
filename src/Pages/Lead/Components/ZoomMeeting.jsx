import React, { useEffect, useRef, useState } from "react";
import ZoomMtg from "@zoomus/websdk";
// import jwt from "jsonwebtoken";

const ZoomMeeting = () => {
  const meetingSDKElement = useRef(null);
  const [meetingStarted, setMeetingStarted] = useState(false);
  const meetingNumber = "82299101615"; // Replace with your meeting number
  const userName = "Yes Germany"; // Replace with the user's name
  const userEmail = "darpan.yesgermany@gmail.com"; //Replace with users email
  const meetingPassword = "659003"; // Replace with your meeting password, if needed.
  const sdkKey = "mZYwBFiIR2KURaIDOK8rWA";
  const sdkSecret = "qsUeO7I58s6M5DD06Bxo4hpIyZHvoQbz";
  const role = 1;

  useEffect(() => {
    // Initialization and meeting logic will go here
    ZoomMtg.setZoomJSLib("https://source.zoom.us/2.11.0/lib", "/av"); //use the latest version.
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareJssdk();
  }, []);

  const startMeeting = (signature) => {
    ZoomMtg.init({
      leaveUrl: window.location.origin,
      success: (success) => {
        console.log(success);
        ZoomMtg.join({
          sdkKey: sdkKey, // Replace with your SDK Key
          signature: signature,
          meetingNumber: meetingNumber,
          userName: userName,
          userEmail: userEmail,
          passWord: meetingPassword,
          success: (success) => {
            console.log("join meeting success");
            setMeetingStarted(true);
          },
          error: (error) => {
            console.log(error);
          },
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
  };

  function generateSignature(sdkKey, sdkSecret, meetingNumber, role) {
    const iat = Math.floor(Date.now() / 1000); // Issued at
    const exp = iat + 60 * 60 * 2; // Expiry time (2 hours)

    const payload = {
      sdkKey: sdkKey,
      mn: meetingNumber,
      role: role,
      iat: iat,
      exp: exp,
      tokenExp: exp,
    };

    return jwt.sign(payload, sdkSecret, { algorithm: "HS256" });
  }
  //   console.log("Zoom SDK Signature:", signature);

  //   const generateSignature = async () => {
  //     try {
  //       const response = await fetch('/api/generatesignature', { // Replace with your server endpoint
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //           meetingNumber: "82299101615",
  //           role: 0, // 0 for attendee, 1 for host.
  //           sdkKey: 'mZYwBFiIR2KURaIDOK8rWA', // Replace with your SDK Key
  //         }),
  //       });

  //       if (!response.ok) {
  //         // throw new Error(HTTP error! status: ${response.status});
  //       }

  //       const data = await response.json();
  //       return data.signature;
  //     } catch (error) {
  //       console.error('Error generating signature:', error);
  //       // Handle the error (e.g., display an error message to the user)
  //       return null;
  //     }
  //   };

  const handleJoinMeeting = () => {
    const signature = generateSignature(sdkKey, sdkSecret, meetingNumber, role);
    if (signature) {
      startMeeting(signature);
    }
  };

  return (
    <div>
      {!meetingStarted && (
        <button onClick={handleJoinMeeting}>Join Meeting</button>
      )}
      <div ref={meetingSDKElement} className="zm-meeting-container"></div>
    </div>
  );
};

export default ZoomMeeting;

// import React, { useEffect, useRef, useState } from "react";
// import { ZoomMtg } from "@zoom/meetingsdk";
// import { PrimaryButton } from "../../../Components/CustomComponents/ButtonUi";

// ZoomMtg.setZoomJSLib("https://source.zoom.us/3.11.2/lib", "/av");
// ZoomMtg.preLoadWasm();
// ZoomMtg.prepareWebSDK();

// const ZoomMeeting = () => {
//     const meetingSDKElement = useRef(null);
//     const [isMeetingJoined, setIsMeetingJoined] = useState(false);

//     const sdkKey = "mZYwBFiIR2KURaIDOK8rWA";
//     const signature = "qsUeO7I58s6M5DD06Bxo4hpIyZHvoQbz";
//     const meetingNumber = "123456789";
//     const passWord = "Yesgermany@123#!";
//     const userName = "darpan.yesgermany@gmail.com";

//     const joinMeeting = () => {
//       ZoomMtg.init({
//         leaveUrl: window.location.origin,
//         isSupportAV: true,
//         success: () => {
//           ZoomMtg.join({
//             sdkKey: sdkKey,
//             signature: signature,
//             meetingNumber: meetingNumber,
//             userName: userName,
//             passWord: passWord,
//             success: () => {
//               console.log("Meeting joined successfully");
//               setIsMeetingJoined(true);
//             },
//             error: (error) => {
//               console.error("Failed to join meeting", error);
//             },
//           });
//         },
//         error: (error) => {
//           console.error("Failed to initialize Zoom SDK", error);
//         },
//       });
//     };

//   return (
//     <div>
//       {/* <button onClick={joinMeeting}>Join Meeting</button> */}
//       <PrimaryButton
//         type="primary"
//         title="Join Meeting"
//         onclick={joinMeeting}
//         htmlType={"submit"}
//       />
//     </div>
//   );
// };

// export default ZoomMeeting;

// import React, { useEffect, useRef, useState } from "react";
// import { ZoomMtg } from "@zoom/meetingsdk";
// import { PrimaryButton } from "../../../Components/CustomComponents/ButtonUi";

// ZoomMtg.setZoomJSLib("https://source.zoom.us/3.11.2/lib", "/av");
// ZoomMtg.preLoadWasm();
// ZoomMtg.prepareWebSDK();

// const ZoomMeeting = () => {
//   const meetingSDKElement = useRef(null);
//   const [isMeetingJoined, setIsMeetingJoined] = useState(false);

//   // Your Zoom Details
//   const sdkKey = "mZYwBFiIR2KURaIDOK8rWA";
//   const meetingNumber = "YOUR_MEETING_NUMBER";
//   const passWord = "Yesgermany@123#!";
//   const userName = "Yes Germany";
//   const userEmail = "darpan.yesgermany@gmail.com";
//   const role = 1; // 1 = Host, 0 = Attendee

//   // ✅ Use the generated signature directly
//   const signature = "YOUR_GENERATED_SIGNATURE";

//   const joinMeeting = () => {
//     ZoomMtg.init({
//       leaveUrl: window.location.origin,
//       isSupportAV: true,
//       success: () => {
//         ZoomMtg.join({
//           sdkKey: sdkKey,
//           signature: signature,
//           meetingNumber: meetingNumber,
//           userName: userName,
//           userEmail: userEmail,
//           passWord: passWord,
//           success: () => {
//             console.log("Meeting joined successfully");
//             setIsMeetingJoined(true);
//           },
//           error: (error) => {
//             console.error("Failed to join meeting", error);
//           },
//         });
//       },
//       error: (error) => {
//         console.error("Failed to initialize Zoom SDK", error);
//       },
//     });
//   };

//   return (
//     <div ref={meetingSDKElement} className="zoom-meeting-container">
//       <PrimaryButton
//         type="primary"
//         className="p-4"
//         title={isMeetingJoined ? "Meeting Joined" : "Join Meeting"}
//         block={false}
//         disabled={isMeetingJoined}
//         onClick={joinMeeting}
//       />
//     </div>
//   );
// };

// export default ZoomMeeting;

//Zoom sdk javascript sample code
// ZoomMtg.preLoadWasm()
// ZoomMtg.prepareWebSDK()

// var authEndpoint = ''
// var sdkKey = ''
// var meetingNumber = '123456789'
// var passWord = ''
// var role = 0
// var userName = 'JavaScript'
// var userEmail = ''
// var registrantToken = ''
// var zakToken = ''
// var leaveUrl = 'https://zoom.us'

// function getSignature() {
//   fetch(authEndpoint, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       meetingNumber: meetingNumber,
//       role: role
//     })
//   }).then((response) => {
//     return response.json()
//   }).then((data) => {
//     console.log(data)
//     startMeeting(data.signature)
//   }).catch((error) => {
//   	console.log(error)
//   })
// }

// function startMeeting(signature) {

//   document.getElementById('zmmtg-root').style.display = 'block'

//   ZoomMtg.init({
//     leaveUrl: leaveUrl,
//     patchJsMedia: true,
//     leaveOnPageUnload: true,
//     success: (success) => {
//       console.log(success)
//       ZoomMtg.join({
//         signature: signature,
//         sdkKey: sdkKey,
//         meetingNumber: meetingNumber,
//         passWord: passWord,
//         userName: userName,
//         userEmail: userEmail,
//         tk: registrantToken,
//         zak: zakToken,
//         success: (success) => {
//           console.log(success)
//         },
//         error: (error) => {
//           console.log(error)
//         },
//       })
//     },
//     error: (error) => {
//       console.log(error)
//     }
//   })
// }
//Zoom sdk javascript sample code

// import React, { useEffect, useRef, useState } from "react";
// import ZoomMtg from "@zoomus/websdk";
// import axios from "axios";

// ZoomMtg.setZoomJSLib("https://source.zoom.us/2.18.0/lib", "/av");
// ZoomMtg.preLoadWasm();
// ZoomMtg.prepareJssdk();

// const ZoomMeeting = ({
//   meetingNumber,
//   meetingPassword,
//   userName,
//   userEmail,
//   role,
// }) => {
//   const [signature, setSignature] = useState("");
//   const meetingSDKElement = useRef(null);

//   useEffect(() => {
//     const fetchSignature = async () => {
//       try {
//         const response = await axios.post("http://localhost:3001/signature", {
//           meetingNumber: meetingNumber,
//           role: role,
//         });
//         setSignature(response.data.signature);
//       } catch (error) {
//         console.error("Error fetching signature:", error);
//       }
//     };

//     fetchSignature();
//   }, [meetingNumber, role]);

//   useEffect(() => {
//     if (signature) {
//       ZoomMtg.init({
//         leaveUrl: window.location.origin,
//         success: (success) => {
//           console.log(success);

//           ZoomMtg.join({
//             sdkKey: process.env.REACT_APP_ZOOM_SDK_KEY, //add your SDK key to your environment variables.
//             signature: signature,
//             meetingNumber: meetingNumber,
//             userName: userName,
//             userEmail: userEmail,
//             passWord: meetingPassword,
//             success: (success) => {
//               console.log("join meeting success");
//             },
//             error: (error) => {
//               console.log(error);
//             },
//           });
//         },
//         error: (error) => {
//           console.log(error);
//         },
//       });
//     }
//   }, [signature, meetingNumber, meetingPassword, userName, userEmail]);

//   return <div ref={meetingSDKElement} className="zoom-meeting-container"></div>;
// };

// export default ZoomMeeting;

// function ZoomMeeting() {
//     const meetingSDKElement = useRef(null);
//     const [meetingStarted, setMeetingStarted] = useState(false);
//     const meetingNumber = "82299101615"; // मीटिंग नंबर बदले
//     const userName = "Yes Germany"; //
//     const userEmail = "darpan.yesgermany@gmail.com"; //
//     const meetingPassword = "659003"; // 
//     const sdkKey = "mZYwBFiIR2KURaIDOK8rWA"; // 
//     const sdkSecret = "qsUeO7I58s6M5DD06Bxo4hpIyZHvoQbz"; // 
  
//     useEffect(() => {
//       ZoomMtg.setZoomJSLib("https://source.zoom.us/2.11.0/lib", "/av");
//       ZoomMtg.preLoadWasm();
//       ZoomMtg.prepareJssdk();
//     }, []);
  
//     const generateSignature = async () => {
//       const iat = Math.round(new Date().getTime() / 1000) - 30;
//       const exp = iat + 60 * 60 * 2;
//       const role = 0;
  
//       const payload = {
//         sdkKey: sdkKey,
//         mn: meetingNumber,
//         role: role,
//         iat: iat,
//         exp: exp,
//         appKey: sdkKey,
//         tokenExp: exp,
//       };
  
//       const signature = jwt.sign(payload, sdkSecret);
//       return signature;
//     };
  
//     const startMeeting = async (signature) => {
//       ZoomMtg.init({
//         leaveUrl: window.location.origin,
//         success: (success) => {
//           console.log(success);
//           ZoomMtg.join({
//             sdkKey: sdkKey,
//             signature: signature,
//             meetingNumber: meetingNumber,
//             userName: userName,
//             userEmail: userEmail,
//             passWord: meetingPassword,
//             success: (success) => {
//               console.log("join meeting success");
//               setMeetingStarted(true);
//             },
//             error: (error) => {
//               console.log(error);
//             },
//           });
//         },
//         error: (error) => {
//           console.log(error);
//         },
//       });
//     };
  
//     const handleJoinMeeting = async () => {
//       const signature = await generateSignature();
//       startMeeting(signature);
//     };
  
//     return (
//       <div>
//         {!meetingStarted && (
//           <button onClick={handleJoinMeeting}>Join Meeting</button>
//         )}
//         <div ref={meetingSDKElement} className="zm-meeting-container"></div>
//       </div>
//     );
//   }