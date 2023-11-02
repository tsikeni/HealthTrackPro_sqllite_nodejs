
import serial
import sqlite3
import time
from w1thermsensor import W1ThermSensor


sensor = W1ThermSensor()
ser = serial.Serial('COM3', 9600)

connection = sqlite3.connect("patients_data.db")
cursor = connection.cursor()
cursor.execute("CREATE TABLE IF NOT EXISTS patients (id TEXT PRIMARY KEY, rate REAL, status INTEGER DEFAULT 0, temperature REAL)")
connection.commit()

while True:
    if ser.in_waiting > 0:
        heart_rate = ser.readline().decode('utf-8').rstrip()
        
        temperatureC = sensor.get_temperature()

        cursor.execute("INSERT INTO patients (id, rate, status, temperature) VALUES (?, ?, ?, ?)", (str(time.time()), float(heart_rate), 0, temperatureC))
        connection.commit()

        print(f"Heart Rate: {heart_rate}, Temperature: {temperatureC}°C")


