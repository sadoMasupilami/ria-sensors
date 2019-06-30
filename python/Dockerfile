FROM python:3 as weather

WORKDIR /python

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD [ "python", "./weather.py" ]
