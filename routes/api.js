'use strict';

const fs = require('fs');
const db = './db';

module.exports = function (app) {
  
  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      if (fs.existsSync(db)) {
        let projects = JSON.parse(fs.readFileSync(db));
        let projectIndex = projects.findIndex((element) => {
          return element.project == project;
        });
        if (projectIndex == -1) {
          res.json([]);
          console.log("GET: No issues for project " + project);
        } else {
          let issues = [...projects[projectIndex].issues];
          Object.keys(req.query).forEach((key) => {
            issues = issues.filter((issue) => {
              return issue[key] == req.query[key];
            });
          });
          res.json([...issues]);
          console.log("GET: issues", issues);
        }
      } else {
        res.json([]);
        console.log("GET: No issues DB");
      }
    })
    
    .post(function (req, res){
      // Projects DB
      let project = req.params.project;
      if (fs.existsSync(db)) {
        var projects = JSON.parse(fs.readFileSync(db));
      } else {
        var projects = [];
      }
      let projectIndex = projects.findIndex((element) => {
        return element.project == project;
      });
      if (projectIndex == -1) {
        projectIndex = projects.length;
        projects.push({
          "project": project,
          "issues": []
        });
      }
      // Required Fields
      const issueTitle = req.body.issue_title;
      const issueText = req.body.issue_text;
      const createdBy = req.body.created_by;
      if (issueTitle == undefined || issueTitle == '' ||
          issueText == undefined || issueText == '' ||
          createdBy == undefined || createdBy == '') {
        res.sendStatus(400);
        return;
      }
      // Optional Fields
      const assignedTo = (req.body.assigned_to == undefined) ? "" : req.body.assigned_to;
      const statusText = (req.body.status_text == undefined) ? "" : req.body.status_text;
      let date = new Date();
      // Issue
      let issue = {
        "_id": project + (projects[projectIndex].issues.length + 1),
        "issue_title": issueTitle,
        "issue_text": issueText,
        "created_on": date.toUTCString(),
        "updated_on": date.toUTCString(),
        "created_by": createdBy,
        "assigned_to": assignedTo,
        "open": true,
        "status_text": statusText,
      };
      projects[projectIndex].issues.push({...issue});
      fs.writeFileSync(db, JSON.stringify(projects));
      res.json({...issue});
      console.log("POST: projects[projectIndex].project", projects[projectIndex].project);
      console.log("POST: projects[projectIndex].issues", projects[projectIndex].issues);
    })
    
    .put(function (req, res){
      let project = req.params.project;
      if (fs.existsSync(db)) {
        let projects = JSON.parse(fs.readFileSync(db));
        let projectIndex = projects.findIndex((element) => {
          return element.project == project;
        });
        if (projectIndex == -1) {
          res.json({
            "error": "could not update",
            "_id": req.body._id
          });
          console.log("PUT: No issues for project " + project);
        } else {
          let issueIndex = projects[projectIndex].issues.findIndex((issue) => {
            return issue._id == req.body._id;
          });
          if (issueIndex == -1) {
            res.json({
              "error": "could not update",
              "_id": req.body._id
            });
          } else {
            Object.keys(req.body).forEach((key) => {
              if (req.body[key] == "") {
                if (key == "issue_title" ||
                    key == "issue_text" ||
                    key == "created_by" ||
                    key == "open") {
                  res.json({
                    "error": "could not update",
                    "_id": req.body._id
                  });
                  console.log("PUT: Required field cannot be set to empty string");
                } else {
                  projects[projectIndex].issues[issueIndex][key] = req.body[key];
                }
              } else if (key == "open" && typeof req.body[key] != "boolean") {
                res.json({
                  "error": "could not update",
                  "_id": req.body._id
                });
                console.log("PUT: Open must be boolean");
              } else {
                projects[projectIndex].issues[issueIndex][key] = req.body[key];
              }
            });
          }
          res.json({
            "result": "successfully updated",
            "_id": req.body._id
          });
          console.log("PUT: updated issue", projects[projectIndex].issues[issueIndex]);
        }
      } else {
        res.json({
          "error": "could not update",
          "_id": req.body._id
        });
        console.log("PUT: Issues DB missing!");
      }
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });

    /* TEMPLATES ***********************
    {
      '_id': 'string',
      'issue_title': 'string',
      'issue_text': 'string',
      'created_on': 'date',
      'updated_on': 'date',
      'created_by': 'string',
      'assigned_to': 'string',
      'open': boolean,
      'status_text': 'string'
    }
    ********************************* */
    
};
