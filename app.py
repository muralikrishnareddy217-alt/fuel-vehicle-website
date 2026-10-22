import os
import mysql.connector
from mysql.connector import Error
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", "Murali@77"),
    "database": os.getenv("DB_NAME", "fuel_analysis"),
    "autocommit": True
}

def connect_db():
    return mysql.connector.connect(**DB_CONFIG)


def init_db():
    try:
        conn = connect_db()
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS vehicles (
                id INT AUTO_INCREMENT PRIMARY KEY,
                brand VARCHAR(100) NOT NULL,
                model VARCHAR(100) NOT NULL,
                year INT NOT NULL,
                fuel_type VARCHAR(50) NOT NULL,
                mileage DECIMAL(10,2) NOT NULL,
                color VARCHAR(50) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        cursor.close()
        conn.close()
        print("Database initialized successfully.")
    except Error as e:
        print("MySQL error:", e)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/save", methods=["POST"])
def save_vehicle():
    brand = request.form.get("brand", "").strip()
    model = request.form.get("model", "").strip()
    year = request.form.get("year", "").strip()
    fuel_type = request.form.get("fuel_type", "").strip()
    mileage = request.form.get("mileage", "").strip()
    color = request.form.get("color", "").strip()

    if not brand or not model or not year or not fuel_type or not mileage or not color:
        return jsonify({"success": False, "message": "Please fill all fields."}), 400

    try:
        year = int(year)
        mileage = float(mileage)

        if year < 1900 or year > 2100 or mileage <= 0:
            return jsonify({"success": False, "message": "Invalid vehicle details."}), 400

        conn = connect_db()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO vehicles (brand, model, year, fuel_type, mileage, color)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (brand, model, year, fuel_type, mileage, color))
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({
            "success": True,
            "message": "Vehicle saved successfully.",
            "vehicle": f"{brand} {model}"
        })

    except ValueError:
        return jsonify({"success": False, "message": "Year and mileage must be valid numbers."}), 400

    except Error as e:
        return jsonify({"success": False, "message": f"MySQL error: {e}"}), 500


@app.route("/records")
def get_records():
    try:
        conn = connect_db()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, brand, model, year, fuel_type, mileage, color
            FROM vehicles
            ORDER BY id DESC
        """)
        rows = cursor.fetchall()
        cursor.close()
        conn.close()

        records = [
            {
                "id": r[0],
                "brand": r[1],
                "model": r[2],
                "year": r[3],
                "fuel_type": r[4],
                "mileage": float(r[5]),
                "color": r[6]
            }
            for r in rows
        ]
        return jsonify({"records": records})

    except Error as e:
        return jsonify({"error": str(e)}), 500


@app.route("/search")
def search_records():
    query = request.args.get("q", "").strip()

    try:
        conn = connect_db()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, brand, model, year, fuel_type, mileage, color
            FROM vehicles
            WHERE brand LIKE %s OR model LIKE %s
            ORDER BY id DESC
        """, (f"%{query}%", f"%{query}%"))
        rows = cursor.fetchall()
        cursor.close()
        conn.close()

        records = [
            {
                "id": r[0],
                "brand": r[1],
                "model": r[2],
                "year": r[3],
                "fuel_type": r[4],
                "mileage": float(r[5]),
                "color": r[6]
            }
            for r in rows
        ]
        return jsonify({"records": records})

    except Error as e:
        return jsonify({"error": str(e)}), 500


@app.route("/report")
def fuel_report():
    try:
        conn = connect_db()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT COUNT(*),
                   COALESCE(AVG(mileage), 0)
            FROM vehicles
        """)
        summary = cursor.fetchone()

        cursor.execute("""
            SELECT brand, model, AVG(mileage), COUNT(*)
            FROM vehicles
            GROUP BY brand, model
            ORDER BY AVG(mileage) DESC
        """)
        by_vehicle = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify({
            "total_records": summary[0],
            "avg_mileage": float(summary[1] or 0),
            "by_vehicle": [
                {
                    "brand": row[0],
                    "model": row[1],
                    "avg_mileage": float(row[2]),
                    "count": row[3]
                }
                for row in by_vehicle
            ]
        })

    except Error as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    init_db()
    app.run(debug=True, host="0.0.0.0", port=5000)
