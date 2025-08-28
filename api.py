from fastapi import FastAPI, UploadFile, File, Body
from typing import Optional
import pandas as pd
from pandas import ExcelWriter
import math
import os
import json
from auto_pairer_copy import get_mentor_mentee_dfs, make_csvs
from mentor_mentee_classes import MentorList, Mentee
import pandas as pd
from initial_code.generate_emails import generate_emails


from fastapi.responses import FileResponse
app = FastAPI()


@app.post("/send-emails")
def send_emails():
    import os
    import re
    import win32com.client

    emails_dir = os.path.join(os.getcwd(), "emails")
    outlook = win32com.client.Dispatch("Outlook.Application")

    sent_count = 0
    for mentor_folder in os.listdir(emails_dir):
        mentor_path = os.path.join(emails_dir, mentor_folder)
        if not os.path.isdir(mentor_path):
            continue

        # Mentor details
        mentor_details_path = os.path.join(mentor_path, "mentor_details.json")
        if not os.path.exists(mentor_details_path):
            print(f"[DEBUG] Mentor details not found for {mentor_folder}")
            continue
        with open(mentor_details_path, "r") as f:
            mentor = json.load(f)
        mentor_email_addr = mentor.get("short_code")
        print(f"[DEBUG] Mentor: {mentor.get('full_name')} | Raw email: {mentor_email_addr}")
        if re.match(r'^[a-zA-Z]{2,}[0-9]{2,}$', mentor_email_addr):
            mentor_email_addr = f"{mentor_email_addr}@ic.ac.uk"
        print(f"[DEBUG] Mentor formatted email: {mentor_email_addr}")
        # Accept emails ending with @ic.ac.uk or @imperial.ac.uk
        if not (mentor_email_addr.endswith("@ic.ac.uk") or mentor_email_addr.endswith("@imperial.ac.uk")):
            print(f"[DEBUG] Mentor email invalid, skipping: {mentor_email_addr}")
            continue  # skip if email is not valid

    # No mentor notification; mentor will receive a copy of each mentee email

        # Send mentee emails
        mentee_details_dir = os.path.join(mentor_path, "mentees_details")
        for json_file in os.listdir(mentee_details_dir):
            if json_file.endswith('.json'):
                json_path = os.path.join(mentee_details_dir, json_file)
                with open(json_path, "r") as jf:
                    mentee = json.load(jf)
                mentee_full_name = mentee.get('full_name', '').replace(' ', '_')
                mentee_email_addr = mentee.get('email')
                txt_filename = f"{mentor_folder}_{mentee_full_name}.txt"
                mentee_email_path = os.path.join(mentor_path, txt_filename)
                print(f"[DEBUG] Looking for mentee email file: {mentee_email_path}")
                if os.path.exists(mentee_email_path):
                    with open(mentee_email_path, "r") as f:
                        body = f.read()
                    print(f"[DEBUG] Mentee: {mentee_full_name} | Email: {mentee_email_addr}")
                    # Send to mentee
                    if mentee_email_addr:
                        print(f"[DEBUG] Sending mentee email to {mentee_email_addr}")
                        try:
                            mail = outlook.CreateItem(0)
                            mail.To = mentee_email_addr
                            mail.Subject = "Your UCAS Mentor Introduction"
                            mail.Body = body
                            mail.Send()
                            sent_count += 1
                            print(f"[DEBUG] Mentee email sent: {mentee_email_addr}")
                        except Exception as e:
                            print(f"[ERROR] Failed to send mentee email to {mentee_email_addr}: {e}")
                    else:
                        print(f"[DEBUG] Mentee email missing in JSON, skipping.")
                    # Send same email to mentor
                    print(f"[DEBUG] Sending copy to mentor: {mentor_email_addr}")
                    try:
                        mail = outlook.CreateItem(0)
                        mail.To = mentor_email_addr
                        mail.Subject = f"Copy of UCAS Mentor Introduction for {mentee_full_name}"
                        mail.Body = body
                        mail.Send()
                        sent_count += 1
                        print(f"[DEBUG] Mentor copy sent: {mentor_email_addr}")
                    except Exception as e:
                        print(f"[ERROR] Failed to send mentor copy to {mentor_email_addr}: {e}")
                else:
                    print(f"[DEBUG] Mentee email file does not exist: {mentee_email_path}")

    print(f"[DEBUG] Total emails sent: {sent_count}")
    return {"message": f"Sent {sent_count} emails via Outlook."}



# This endpoint performs the full pairing process as in the main block of auto_pairer copy.py
@app.post("/pair")
def pair_mentors_mentees(
    mentee_form_name: str = "mentee_test",
    mentor_form_name: str = "mentor_test"
):
    # Use mentors.xlsx directly
    spreadsheet_path = "mentors.xlsx"

    # Run pairing logic
    mentor_df, mentee_df = get_mentor_mentee_dfs(
        spreadsheet_path, mentee_form_name, mentor_form_name
    )
    make_csvs(mentor_df, mentee_df)

    mentor_list = MentorList(os.path.join("csvs", "mentors.csv"))
    for row in mentee_df.itertuples():
        if pd.notna(row):
            mentor_list.pair_mentee(Mentee(row))

    # Build the pairings JSON (same as make_mentor_mentee_json, but return instead of write)
    def sanitize(obj):
        # Recursively replace NaN with None in dicts/lists
        if isinstance(obj, dict):
            return {k: sanitize(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [sanitize(v) for v in obj]
        elif isinstance(obj, float) and math.isnan(obj):
            return None
        else:
            return obj

    json_mentor_mentee_pairs_data = []
    json_unpaired_mentor_data = []
    json_unpaired_mentee_data = [
        {"mentee": sanitize(vars(mentee))} for mentee in mentor_list.exception_students
    ]
    for (mentor, mentees) in mentor_list.mentor_pairings:
        if mentees:
            entry = {
                "mentor": sanitize(vars(mentor)),
                "mentees": [sanitize(vars(mentee)) for mentee in mentees],
            }
            json_mentor_mentee_pairs_data.append(entry)
        else:
            entry = {"mentor": sanitize(vars(mentor))}
            json_unpaired_mentor_data.append(entry)

    # Automatically export pairings to spreadsheet
    pairings_rows = []
    for entry in json_mentor_mentee_pairs_data:
        mentor = entry.get("mentor", {})
        mentees = entry.get("mentees", [])
        for mentee in mentees:
            row = {
                "Mentor Name": mentor.get("full_name"),
                "Mentor Short Code": mentor.get("short_code"),
                "Mentor Year": mentor.get("year"),
                "Mentor Course": mentor.get("course"),
                "Mentor Gender": mentor.get("gender"),
                "Mentee Name": mentee.get("full_name"),
                "Mentee Email": mentee.get("email"),
                "Mentee Subjects": mentee.get("interested_subjects")
            }
            pairings_rows.append(row)
    pairings_df = pd.DataFrame(pairings_rows)
    unpaired_mentors_df = pd.DataFrame([m.get("mentor", {}) for m in json_unpaired_mentor_data])
    unpaired_mentees_df = pd.DataFrame([m.get("mentee", {}) for m in json_unpaired_mentee_data])
    export_path = "pairings_export.xlsx"
    with ExcelWriter(export_path) as writer:
        pairings_df.to_excel(writer, sheet_name="Pairings", index=False)
        unpaired_mentors_df.to_excel(writer, sheet_name="Unpaired_Mentors", index=False)
        unpaired_mentees_df.to_excel(writer, sheet_name="Unpaired_Mentees", index=False)

    return {
        "pairings": json_mentor_mentee_pairs_data,
        "unpaired_mentors": json_unpaired_mentor_data,
        "unpaired_mentees": json_unpaired_mentee_data
    }

@app.post("/generate-emails")
def generate_emails_api():
    generate_emails()
    return {"message": "Emails generated."}

