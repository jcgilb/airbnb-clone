import os
import json
import uuid
import boto3
import botocore

# BUCKET_NAME = os.environ.get("S3_BUCKET")
BUCKET_NAME = "joannas-s3-bucket"
S3_LOCATION = f"http://{BUCKET_NAME}.s3.us-west-1.amazonaws.com/"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}

s3 = boto3.client("s3",
    aws_access_key_id=os.environ.get("S3_KEY"),
    aws_secret_access_key=os.environ.get("S3_SECRET")
)

def allowed_file(filename):
    return "." in filename and \
          filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def get_unique_filename(filename):
    ext = filename.rsplit(".", 1)[1].lower()
    unique_filename = uuid.uuid4().hex
    return f"{unique_filename}.{ext}"

def upload_file_to_s3(file, acl="public-read"):
    print("file in cool.py", file)
    try:
        s3.upload_fileobj(
            file,
            BUCKET_NAME,
            file.filename,
            ExtraArgs={
                "ACL": acl,
                "ContentType": file.content_type
            }
        )
    except Exception as e:
        # in case our s3 upload fails
        return {"errors": str(e)}

    return {"url": f"{S3_LOCATION}{file.filename}"}

def delete_image_from_s3(filename):
    s3.delete_object(
      Bucket=BUCKET_NAME, 
      Key=filename
      )