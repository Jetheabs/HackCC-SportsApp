#include "httplib.h"
#include <iostream>
#include <string>
#include <sstream>
#include <map>
#include <cmath>
#include <vector>
#include <algorithm>
using namespace std;
using namespace httplib;

struct User {
    int age;
    double heightFt;
    double weightLbs;
    double bmi;
    double bench;
    double squat;
    double deadlift;
};

// Get current user from auth backend
bool getCurrentUser(User &user) {
    Client auth("localhost", 8081);
    auto res = auth.Get("/currentUser");
    if(!res || res->status != 200) return false;

    string body = res->body;
    vector<string> values;
    size_t start = 0, end = 0;
    while((end = body.find(',', start)) != string::npos){
        values.push_back(body.substr(start, end - start));
        start = end + 1;
    }
    values.push_back(body.substr(start));

    if(values.size() < 7) return false;

    user.age = stoi(values[0]);
    user.heightFt = stod(values[1]);
    user.weightLbs = stod(values[2]);
    user.bmi = stod(values[3]);
    user.bench = stod(values[4]);
    user.squat = stod(values[5]);
    user.deadlift = stod(values[6]);

    return true;
}

int main() {
    Server svr;
    svr.set_mount_point("/", "./public");

    // Endpoint to calculate calories burned
    svr.Post("/calculate", [](const Request& req, Response& res){
        User currentUser;
        if(!getCurrentUser(currentUser)){
            res.set_content("No user logged in or auth server not reachable","text/plain");
            return;
        }

        if(req.body.empty()){ res.set_content("No data received","text/plain"); return; }

        // Parse simple activity and duration manually
        string activity = "", durationStr = "";
        size_t pos1 = req.body.find("activity");
        size_t pos2 = req.body.find("duration");

        if(pos1 != string::npos){
            activity = req.body.substr(req.body.find(":", pos1)+1, req.body.find(",", pos1)-req.body.find(":", pos1)-1);
            activity.erase(remove(activity.begin(), activity.end(), '\"'), activity.end());
            activity.erase(remove(activity.begin(), activity.end(), ' '), activity.end());
        }
        if(pos2 != string::npos){
            durationStr = req.body.substr(req.body.find(":", pos2)+1);
            durationStr.erase(remove(durationStr.begin(), durationStr.end(), '\"'), durationStr.end());
            durationStr.erase(remove(durationStr.begin(), durationStr.end(), ' '), durationStr.end());
        }

        double duration = stod(durationStr); // minutes

        // MET values for activities
        map<string,double> METs = {
            {"running", 9.8},
            {"walking", 3.5},
            {"cycling", 7.5},
            {"swimming", 8.0},
            {"yoga", 2.5}
        };

        double MET = 5.0; // default MET if activity not found
        auto it = METs.find(activity);
        if(it != METs.end()) MET = it->second;

        double hours = duration / 60.0;
        double weightKg = currentUser.weightLbs / 2.20462;
        double calories = MET * weightKg * hours;

        stringstream ss;
        ss << "Activity:" << activity << ","
           << "Duration:" << duration << " mins,"
           << "Calories Burned:" << round(calories);

        res.set_content(ss.str(), "text/plain");
    });

    cout << "Calc server running at http://localhost:8082\n";
    svr.listen("0.0.0.0", 8082);
}
