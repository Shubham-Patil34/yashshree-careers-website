from flask import Flask, render_template, jsonify, request
from flask_mail import Mail, Message
from sqlalchemy import false
from database import load_jobs_from_db, load_job_from_db, add_application_to_db
import os
import requests
app = Flask(__name__)

app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = os.environ['USER_EMAIL']
app.config['MAIL_PASSWORD'] = os.environ['EMAIL_TOCKEN']
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True

mail = Mail(app)

@app.route("/")
def hello_yashsree():
  jobs=load_jobs_from_db()
  return render_template('home.html', jobs=jobs);

@app.route("/api/jobs")
def list_jobs():
  return jsonify(load_jobs_from_db())

@app.route("/job/<id>")
def show_job(id,):
  job=load_job_from_db(id)
  return render_template('jobpage.html',
                         job=job,
                         site_key=os.environ['SITE_KEY'],
                        domain_ref=os.environ['DOMAIN_REF'],
                        isCpatchaVerified="True");

@app.route("/job/<id>/apply", methods=['post'])
def apply_to_job(id):
  secret_response = request.form['g-recaptcha-response']
  url = os.environ['VERIFICATION_URL']
  key = os.environ['SECRET_KEY']
  verify_response = requests.post(url=f'{url}?secret={key}&response={secret_response}').json()
  job=load_job_from_db(id)
  if verify_response['success'] == True:
    data = request.form
    if add_application_to_db(id, data):
      return render_template('application_submitted.html',
                             application=data,
                             job=job)
    else:
      return render_template('application_failed.html',    
                           application=data, 
                           job=job)
  else:
    return render_template('jobpage.html',
       job=job,
       site_key=os.environ['SITE_KEY'],
      domain_ref=os.environ['DOMAIN_REF'],
                           isCaptchaVerified="False");

@app.route("/sendemail", methods=['post'])
def sendEmailVerificationMail():
  data = request.json
  receiver = data.get('receiver')
  body = data.get('body')
  msg = Message(subject='Email Verification - Yashshree Careers',
                sender=os.environ['USER_EMAIL'],
                recipients=[receiver])
  msg.html = body
  mail.send(msg)
  return jsonify({'status': 'OK'})
  
if __name__ == "__main__":
  app.run(host='0.0.0.0', debug=True)