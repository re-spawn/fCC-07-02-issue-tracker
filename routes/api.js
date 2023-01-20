'use strict';

const IssuesDB = require('../issuesDB.js');
let issuesDB = new IssuesDB;

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
      let project = req.params.project;
      let result = issuesDB.addIssue(project, req.body);
      if (typeof result == 'string') {
        res.status(400).send(result);
      } else {
        res.json(result);
      }
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
          console.log("PUT: Project not in DB!");
        } else {
          let issueIndex = projects[projectIndex].issues.findIndex((issue) => {
            return issue._id == req.body._id;
          });
          if (issueIndex == -1) {
            res.json({
              "error": "could not update",
              "_id": req.body._id
            });
            console.log("PUT: Issue does not exist");
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
                  // NEED TO EXIT forEach LOOP HERE
                } else {
                  projects[projectIndex].issues[issueIndex][key] = req.body[key];
                }
              } else if (key == "open" && typeof req.body[key] != "boolean") {
                res.json({
                  "error": "could not update",
                  "_id": req.body._id
                });
                console.log("PUT: Open must be boolean");
                // NEED TO EXIT forEach LOOP HERE
              } else {
                projects[projectIndex].issues[issueIndex][key] = req.body[key];
              }
            });
            // NEED TO UPDATE updated_on HERE
            fs.writeFileSync(db, JSON.stringify(projects));
            res.json({
              "result": "successfully updated",
              "_id": req.body._id
            });
            console.log("PUT: Updated issue", projects[projectIndex].issues[issueIndex]);
          }
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
