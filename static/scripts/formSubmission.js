"use strict"; 
let IS_EMAIL_VERIFIED = false;

// Function to submit form after recaptcha is solved
 function onSubmit(token) {
   if(IS_EMAIL_VERIFIED){
     document.getElementById("reallySubmit").click();
   }
   else{
     showToast("Please verify email address first...", "text-warning");
   }
 }

// Funcction to enable the send OTP button only when email is entered
 function enableSendOTP() {
     var emailValue = document.getElementById('email').value;
     var sendOTPButton = document.getElementById('sendOTPButton');
     if (emailValue.trim() !== '') {
         sendOTPButton.disabled = false;
     } else {
         sendOTPButton.disabled = true;
     }
 }

// Function to send OTP to the user email and validating it
 function sendOTP(emailTocken) {
   const otp_inp = document.getElementById('otp');
   const otp_btn = document.getElementById('verifyButton');
   const email = document.getElementById('email');


   let otp_val = Math.floor(Math.random() * 900000) + 100000;
   let emailbody = getOTPTemplate(otp_val);;
   
    // console.log(email.value);
   Email.send({
       SecureToken : emailTocken,
       To : email.value,
       From : "yashshareemungush@gmail.com",
       Subject : "Email Verification - Yashshree Careers",
       Body : emailbody
   }).then(
     message => {
       // console.log("message", message);
       if (message === "OK"){
           showToast("OTP is send to " + email.value, "text-info");         
         // alert("OTP send to you email " + email.value);

         document.getElementById('otpField').style.display = 'block';
         otp_btn.style.display = 'block';
         document.getElementById('sendOTPButton').textContent  = 'Resend OTP';

         otp_btn.addEventListener('click', () => {
           if(otp_inp.value == otp_val){
             IS_EMAIL_VERIFIED = true;
             showToast("Email verified successfully...", "text-success");             
             // alert("Email address verified...");
           }else{
             showToast("OTP is incorrect...!", "text-danger");             
             // alert("OTP is incorrect...!");
           }
         });
       }
      }
   );
 }

// Function to show toast with custom message
function showToast(message, type){
  const toastLiveExample = document.getElementById('liveToast');
  const toastBody = toastLiveExample.querySelector('.toast-body');
  toastBody.classList.add(type);
  toastBody.innerHTML = `<strong>` + message + `<strong>`;
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
  toastBootstrap.show()
}

// Function to get the otp email template
function getOTPTemplate(emailOTP){
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">

    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify your login</title>
      <!--[if mso]><style type="text/css">body, table, td, a { font-family: Arial, Helvetica, sans-serif !important; }</style><![endif]-->
    </head>

    <body style="font-family: Helvetica, Arial, sans-serif; margin: 0px; padding: 0px; background-color: #ffffff;">
      <table role="presentation"
        style="width: 100%; border-collapse: collapse; border: 0px; border-spacing: 0px; font-family: Arial, Helvetica, sans-serif; background-color: rgb(239, 239, 239);">
        <tbody>
          <tr>
            <td align="center" style="padding: 1rem 2rem; vertical-align: top; width: 100%;">
              <table role="presentation" style="max-width: 600px; border-collapse: collapse; border: 0px; border-spacing: 0px; text-align: left;">
                <tbody>
                  <tr>
                    <td style="padding: 40px 0px 0px;">
                      <div style="text-align: left;">
                        <div style="padding-bottom: 20px;"><img src="https://f04750e5-1a96-458c-bde2-df8ad17066a8-00-391788aeq6qlf.pike.replit.dev/static/logo.png" alt="Company" style="width: 56px;"></div>
                      </div>
                      <div style="padding: 20px; background-color: rgb(255, 255, 255);">
                        <div style="color: rgb(0, 0, 0); text-align: left;">
                          <h1 style="margin: 1rem 0">Verification code</h1>
                          <p style="padding-bottom: 16px">Please use the verification code below to sign in.</p>
                          <p style="padding-bottom: 16px"><strong style="font-size: 130%">${emailOTP}</strong></p>
                          <p style="padding-bottom: 16px">If you didn’t request this, you can ignore this email.</p>
                          <p style="padding-bottom: 16px">Thanks,<br>The Yashshree team</p>
                        </div>
                      </div>
                      <div style="padding-top: 20px; color: rgb(153, 153, 153); text-align: center;">
                        <p style="padding-bottom: 16px">Made with ♥ in Kamathi</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </body>

    </html>`;
}
