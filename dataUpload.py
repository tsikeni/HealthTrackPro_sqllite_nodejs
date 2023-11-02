import requests
import sqlite3
import matplotlib.pyplot as plt
import time

def upload_data(id, rate):
    formData = {"id": id, "heart_rate": rate}
    try:
        HTTP_Request = requests.post("http://localhost:3000/api/heartRate", data=formData)
        if HTTP_Request.status_code == 200:
            return True
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
    return False

def main():
    connection = sqlite3.connect("patients_data.db")
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM patients WHERE status=0")
    records = cursor.fetchall()

    timestamps = []  # to store timestamps
    rates = []  # to store heart rates

    for record in records:
        id, rate, status = record
        if upload_data(id, rate):
            cursor.execute("UPDATE patients SET status=1 WHERE id=?", (id,))
            connection.commit()
        
        # Add the timestamp and heart rate to the lists
        timestamps.append(int(time.time()))  # Use current time as timestamp
        rates.append(rate)

    connection.close()

    # Plot the heart rate data using Matplotlib
    plt.plot(timestamps, rates, marker='o', linestyle='-')
    plt.xlabel('Timestamp')
    plt.ylabel('Heart Rate')
    plt.title('Heart Rate Data Over Time')
    plt.grid(True)
    plt.show()

if __name__ == "__main__":
    main()
