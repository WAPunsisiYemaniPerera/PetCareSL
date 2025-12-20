FROM python:3.11

# setting the working folder
WORKDIR /app

# first put the requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# then copy all the codes
COPY . .

# create Hugging Face Permissions
RUN chmod 777 .

# Run the server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]