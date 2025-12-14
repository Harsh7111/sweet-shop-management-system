import os
import sqlite3

def check_db(db_path, db_name):
    print(f"\n{'='*70}")
    print(f"📁 {db_name}")
    print(f"Location: {db_path}")
    
    if not os.path.exists(db_path):
        print("❌ FILE DOES NOT EXIST")
        return
    
    # Get file size
    size = os.path.getsize(db_path)
    print(f"Size: {size:,} bytes ({size/1024:.2f} KB)")
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Count users
        cursor.execute("SELECT COUNT(*) FROM users")
        user_count = cursor.fetchone()[0]
        
        # Count sweets
        cursor.execute("SELECT COUNT(*) FROM sweets")
        sweet_count = cursor.fetchone()[0]
        
        print(f"👥 Users: {user_count}")
        print(f"🍬 Sweets: {sweet_count}")
        
        # Show actual data
        if user_count > 0:
            cursor.execute("SELECT username, email FROM users")
            print("\n📋 Users list:")
            for user in cursor.fetchall():
                print(f"   - {user[0]} ({user[1]})")
        
        if sweet_count > 0:
            cursor.execute("SELECT name, price, quantity FROM sweets")
            print("\n📋 Sweets list:")
            for sweet in cursor.fetchall():
                print(f"   - {sweet[0]}: ${sweet[1]} (Stock: {sweet[2]})")
        
        conn.close()
        
    except Exception as e:
        print(f"❌ Error reading database: {e}")

# Check all three databases
print("🔍 CHECKING ALL DATABASES...")

check_db("sweetshop.db", "ROOT - sweetshop.db (NEW)")
check_db("test.db", "ROOT - test.db")
check_db("backend/sweetshop.db", "BACKEND - sweetshop.db (OLD)")

print("\n" + "="*70)