"use strict"; 

// Function to submit form after recaptcha is solved
 function onSubmit(token) {
   document.getElementById("job-application").submit();
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
 function sendOTP() {
   const otp_inp = document.getElementById('otp');
   const otp_btn = document.getElementById('verifyButton');
   const email = document.getElementById('email');


   let otp_val = Math.floor(1000 + Math.random() * 10000);
   let emailbody = `Your OTP is ${otp_val}`;
    // console.log(email.value);
   Email.send({
       SecureToken : "30e401d2-b930-4664-b45d-ac3a5d75320b",
       To : email.value,
       From : "yashshareemungush@gmail.com",
       Subject : "Email Verification - Yashshree Careers",
       Body : emailbody
   }).then(
     message => {
       // console.log("message", message);
       if (message === "OK"){
           showToast("OTP is send to " + email.value);         
         // alert("OTP send to you email " + email.value);

         document.getElementById('otpField').style.display = 'block';
         otp_btn.style.display = 'block';
         document.getElementById('sendOTPButton').textContent  = 'Resend OTP';

         otp_btn.addEventListener('click', () => {
           if(otp_inp.value == otp_val){
             showToast("Email verified successfully...");             
             // alert("Email address verified...");
           }else{
             showToast("OTP is incorrect...!");             
             // alert("OTP is incorrect...!");
           }
         });
       }
      }
   );
 }

// Function to show toast with custom message
function showToast(message){
  const toastLiveExample = document.getElementById('liveToast');
  const toastBody = toastLiveExample.querySelector('.toast-body');
  toastBody.innerHTML = message;
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
  toastBootstrap.show()
}
