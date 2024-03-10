import re
from sqlalchemy import create_engine, text
import os

engine = create_engine(os.environ['DB_CONNECTION_STR'])

def load_jobs_from_db():
  with engine.connect() as conn:
    result = conn.execute(text("select * from jobs"))
    jobs = []
    for row in result.all():
      jobs.append(row._asdict())
    return jobs

def load_job_from_db(id):
  with engine.connect() as conn:
    result = conn.execute(text("select * from jobs where id = :val"), {"val": id})
    rows = result.all()
    if len(rows) == 0:
      return None
    else:
      return rows[0]._asdict()

def add_application_to_db(job_id, data):
  with engine.connect() as conn:
    result=conn.execute(text("SELECT * FROM applications WHERE email = :email AND job_id = :job_id"), {"email":data["email"], "job_id":job_id})
    rows = result.all()
    if len(rows) != 0:
      return False
    else:
      query = text("INSERT INTO applications (job_id, full_name, email, linkedin_url, education, work_experience, resume_url) VAlUES (:job_id, :name, :email, :linkedin_url, :education, :workexp, :resume_url)")
      result=conn.execute(query, 
                 {"job_id": job_id, 
                  "name": data['name'], 
                  "email": data["email"],
                  "linkedin_url": data["linkedin_url"],
                  "education": data["education"],
                  "workexp": data["workexp"],
                  "resume_url": data["resume_url"]})
      conn.commit()
      return True    
    