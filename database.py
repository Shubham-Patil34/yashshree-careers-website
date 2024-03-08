from sqlalchemy import create_engine, text

engine = create_engine("mysql+pymysql://ysDB_coolportor:c08260b6e4f3f4eef77f9a715b712666504efa6e@tze.h.filess.io:3307/ysDB_coolportor?charset=utf8mb4")

def load_jobs_from_db():
  with engine.connect() as conn:
    result = conn.execute(text("select * from jobs"))
    jobs = []
    for row in result.all():
      jobs.append(row._asdict())
    return jobs