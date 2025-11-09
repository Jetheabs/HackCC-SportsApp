#include "httplib.h"
#include <iostream>
#include <string>
#include <sstream>
#include <algorithm>
#include <sqlite3.h>
#include <cmath>

using namespace std;
using namespace httplib;

struct User {
    string username;
    string password;
    int age = 0;
    double heightFt = 0;
    double weightLbs = 0;
    double bmi = 0;
    double bench = 0;
    double squat = 0;
    double deadlift = 0;

    // reps for leaderboard
    int benchReps = 0;
    int squatReps = 0;
    int deadliftReps = 0;
};

// SQLite database pointer
sqlite3* db = nullptr;
User* currentUser = nullptr;

// Helper to extract value from simple JSON-like string
string extractValue(const string& body, const string& key) {
    size_t pos = body.find("\"" + key + "\":");
    if (pos == string::npos) return "";
    pos = body.find(":", pos) + 1;
    size_t end = body.find_first_of(",}", pos);
    string val = body.substr(pos, end - pos);
    val.erase(remove(val.begin(), val.end(), '\"'), val.end());
    val.erase(remove(val.begin(), val.end(), ' '), val.end());
    return val;
}

// Initialize SQLite DB
void initDatabase() {
    if(sqlite3_open("accounts.db", &db)) {
        cerr << "Can't open database: " << sqlite3_errmsg(db) << endl;
        exit(1);
    }

    const char* sql = R"(
        CREATE TABLE IF NOT EXISTS users(
            username TEXT PRIMARY KEY,
            password TEXT,
            age INTEGER DEFAULT 0,
            height REAL DEFAULT 0,
            weight REAL DEFAULT 0,
            benchReps INTEGER DEFAULT 0,
            squatReps INTEGER DEFAULT 0,
            deadliftReps INTEGER DEFAULT 0
        );
    )";

    char* errMsg = nullptr;
    if(sqlite3_exec(db, sql, nullptr, nullptr, &errMsg) != SQLITE_OK) {
        cerr << "SQL error: " << errMsg << endl;
        sqlite3_free(errMsg);
    }
}

// Load user from DB
bool loadUser(const string& username, User& user) {
    string sql = "SELECT * FROM users WHERE username = ?;";
    sqlite3_stmt* stmt;
    if(sqlite3_prepare_v2(db, sql.c_str(), -1, &stmt, nullptr) != SQLITE_OK) return false;
    sqlite3_bind_text(stmt, 1, username.c_str(), -1, SQLITE_STATIC);

    bool found = false;
    if(sqlite3_step(stmt) == SQLITE_ROW) {
        user.username = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 0));
        user.password = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 1));
        user.age = sqlite3_column_int(stmt, 2);
        user.heightFt = sqlite3_column_double(stmt, 3);
        user.weightLbs = sqlite3_column_double(stmt, 4);
        user.benchReps = sqlite3_column_int(stmt, 5);
        user.squatReps = sqlite3_column_int(stmt, 6);
        user.deadliftReps = sqlite3_column_int(stmt, 7);
        found = true;
    }
    sqlite3_finalize(stmt);
    return found;
}

// Save user stats and reps
void saveUser(const User& user) {
    string sql = R"(INSERT OR REPLACE INTO users
        (username, password, age, height, weight, benchReps, squatReps, deadliftReps)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);)";

    sqlite3_stmt* stmt;
    if(sqlite3_prepare_v2(db, sql.c_str(), -1, &stmt, nullptr) != SQLITE_OK) return;

    sqlite3_bind_text(stmt, 1, user.username.c_str(), -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 2, user.password.c_str(), -1, SQLITE_STATIC);
    sqlite3_bind_int(stmt, 3, user.age);
    sqlite3_bind_double(stmt, 4, user.heightFt);
    sqlite3_bind_double(stmt, 5, user.weightLbs);
    sqlite3_bind_int(stmt, 6, user.benchReps);
    sqlite3_bind_int(stmt, 7, user.squatReps);
    sqlite3_bind_int(stmt, 8, user.deadliftReps);

    sqlite3_step(stmt);
    sqlite3_finalize(stmt);
}

int main() {
    initDatabase();
    Server svr;
    svr.set_mount_point("/", "./public");

    // SIGNUP (username + password only)
    svr.Post("/signup", [](const Request& req, Response& res){
        if(req.body.empty()){ res.set_content("No data received", "text/plain"); return; }

        string username = extractValue(req.body, "username");
        string password = extractValue(req.body, "password");

        User tempUser;
        if(loadUser(username, tempUser)){
            res.set_content("Username already exists!", "text/plain");
            return;
        }

        User newUser; newUser.username = username; newUser.password = password;
        saveUser(newUser);

        res.set_content("Account created successfully! Please enter your personal info next.", "text/plain");
    });

    // LOGIN
    svr.Post("/login", [](const Request& req, Response& res){
        if(req.body.empty()){ res.set_content("No data received", "text/plain"); return; }

        string username = extractValue(req.body, "username");
        string password = extractValue(req.body, "password");

        User tempUser;
        if(!loadUser(username, tempUser) || tempUser.password != password){
            res.set_content("Invalid username or password", "text/plain");
            return;
        }

        currentUser = &tempUser;

        // Check if personal info is missing
        if(currentUser->age == 0 || currentUser->heightFt == 0 || currentUser->weightLbs == 0){
            res.set_content("Login successful! Please enter your personal information.", "text/plain");
        } else {
            res.set_content("Login successful!", "text/plain");
        }
    });

    // SAVE OR UPDATE PERSONAL INFO
    svr.Post("/saveStats", [](const Request& req, Response& res){
        if(!currentUser){ res.set_content("Please log in first", "text/plain"); return; }
        if(req.body.empty()){ res.set_content("No data received", "text/plain"); return; }

        currentUser->age = stoi(extractValue(req.body, "age"));
        currentUser->heightFt = stod(extractValue(req.body, "height"));
        currentUser->weightLbs = stod(extractValue(req.body, "weight"));

        double heightIn = currentUser->heightFt * 12;
        currentUser->bmi = (currentUser->weightLbs*703)/(heightIn*heightIn);

        double modifier = 1.0;
        if(currentUser->age >= 31 && currentUser->age <= 50) modifier = 0.8;
        else if(currentUser->age > 50) modifier = 0.6;

        currentUser->bench = currentUser->weightLbs * 0.75 * modifier;
        currentUser->squat = currentUser->weightLbs * 1.0 * modifier;
        currentUser->deadlift = currentUser->weightLbs * 1.2 * modifier;

        saveUser(*currentUser); // persist changes

        res.set_content("Personal info saved successfully!", "text/plain");
    });

    cout << "Server running at http://localhost:8081\n";
    svr.listen("0.0.0.0", 8081);

    sqlite3_close(db);
}
