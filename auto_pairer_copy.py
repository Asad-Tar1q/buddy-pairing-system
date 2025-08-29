import re
import pandas as pd
import os
from mentor_mentee_classes import *

medicine_pattern = r"(medicine|pharmacy|dent.*|law)"

def remove_medics(interested_courses):
    if pd.isna(interested_courses):
        return interested_courses
    
    return ','.join([
        course.strip() 
        for course in interested_courses.split(',') 
        if not re.match(medicine_pattern, course.strip(), flags=re.IGNORECASE)
    ])

def get_mentor_mentee_dfs(mentors_file, mentees_file):
    # Load directly from separate Excel files
    mentor_df = pd.read_excel(mentors_file)
    mentee_df = pd.read_excel(mentees_file)

    print("Mentor columns after cleaning:", mentor_df.columns.tolist())
    print("Mentee columns after cleaning:", mentee_df.columns.tolist())

    # Clean column names
    mentee_df.columns = [clean_text(col) for col in mentee_df.columns]
    mentor_df.columns = [clean_text(col) for col in mentor_df.columns]

    # Remove medical-related mentee interests
    if 'What_are_you_interested_in_studying_at_university_Select_all_that_you_may_be_interested_in' in mentee_df.columns:
        mentee_df['What_are_you_interested_in_studying_at_university_Select_all_that_you_may_be_interested_in'] = (
            mentee_df['What_are_you_interested_in_studying_at_university_Select_all_that_you_may_be_interested_in'].apply(remove_medics)
        )

    # Remove duplicate mentees by email
    if 'What_is_your_email_address' in mentee_df.columns:
        mentee_df = mentee_df[~mentee_df.duplicated(subset='What_is_your_email_address', keep='first')]

    print("Mentee data loaded:", mentee_df.shape)
    print("Mentor data loaded:", mentor_df.shape)

    return (mentor_df.dropna(how="all"), mentee_df.dropna(how="all"))

def clean_text(text):
    if isinstance(text, str):  # Only apply to strings
        text = re.sub(r"\s+", "_", text)
        text = re.sub(r"[^\w_]", "", text)
    return text.strip("_")

def make_csvs(mentor_df, mentee_df, from_scratch=True):
    brother_mentors = [mentor_df.columns.tolist()]
    sister_mentors = [mentor_df.columns.tolist()]
    brother_mentees = [mentee_df.columns.tolist()]
    sister_mentees = [mentee_df.columns.tolist()]

    print("First mentor row:", mentor_df.iloc[0].to_dict() if not mentor_df.empty else None)
    print("First mentee row:", mentee_df.iloc[0].to_dict() if not mentee_df.empty else None)

    for row in mentor_df.itertuples():
        print(f"Mentor row: {row}")
        if hasattr(row, 'Are_you_a_brother_or_a_sister'):
            print(f"Mentor gender: {row.Are_you_a_brother_or_a_sister}")
        if getattr(row, 'Are_you_a_brother_or_a_sister', None) == "Brother":
            brother_mentors.append(row)
        else:
            sister_mentors.append(row)

    for row in mentee_df.itertuples():
        print(f"Mentee row: {row}")
        if hasattr(row, 'Are_you_a_brother_or_a_sister'):
            print(f"Mentee gender: {row.Are_you_a_brother_or_a_sister}")
        if getattr(row, 'Are_you_a_brother_or_a_sister', None) == "Brother":
            brother_mentees.append(row)
        else:
            sister_mentees.append(row)

    folder = os.path.join(os.getcwd(), "csvs")
    if not os.path.isdir(folder):
        os.mkdir(folder)

    if from_scratch:
        mentor_df['current_student_numbers'] = 0

    mentor_df.to_csv(os.path.join(folder, "mentors.csv"), index=False)
    mentee_df.to_csv(os.path.join(folder, "mentees.csv"), index=False)

    pd.DataFrame(brother_mentors).to_csv(os.path.join(folder, "brother_mentors.csv"), index=False, header=False)
    pd.DataFrame(sister_mentors).to_csv(os.path.join(folder, "sister_mentors.csv"), index=False, header=False)
    pd.DataFrame(brother_mentees).to_csv(os.path.join(folder, "brother_mentees.csv"), index=False, header=False)
    pd.DataFrame(sister_mentees).to_csv(os.path.join(folder, "sister_mentees.csv"), index=False, header=False)

if __name__ == "__main__":
    mentor_df, mentee_df = get_mentor_mentee_dfs(
        "mentors.xlsx", "mentees.xlsx"
    )
    make_csvs(mentor_df, mentee_df)

    mentor_list = MentorList(os.path.join("csvs", "mentors.csv"))
    print("MentorList loaded. Number of mentors:", len(mentor_list.mentor_pairings))
    for row in mentee_df.itertuples():
        if pd.notna(row):
            mentee = Mentee(row)
            print(f"Pairing mentee: {mentee.full_name}, gender: {mentee.gender}, interested_subjects: {mentee.interested_subjects}")
            mentor_list.pair_mentee(mentee)

    print("Pairing complete. Exception students:", [m.full_name for m in mentor_list.exception_students])
    mentor_list.make_mentor_mentee_json()
