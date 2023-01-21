const fs = require('fs');
const DB = './db';

function IssuesDB() {

  this.reset = function() {
    if (fs.existsSync(DB)) {
      fs.rmSync(DB);
    } 
  };

  this.getProject = function(project) {
    // returns project object or error string
    let result;
    let projects, projectIndex;
    if (fs.existsSync(DB)) {
      projects = JSON.parse(fs.readFileSync(DB));
      projectIndex = projects.findIndex((element) => {
        return element.project == project;
      });
      if (projectIndex == -1) {
        result = 'no such project'; // project not in DB
      } else {
        result = projects[projectIndex];
      }
    } else {
      result = 'no such project'; // no DB
    }
    return result;
  };

  this.addProject = function(project) {
    // returns project object or error string
    let result;
    let projects;
    if (this.getProject(project) != 'no such project') {
      result = 'project already exists';
    } else {
      if (fs.existsSync(DB)) {
        projects = JSON.parse(fs.readFileSync(DB));
      } else {
        projects = [];
      }
      projects.push({
        "project": project,
        "issues": []
      });
      fs.writeFileSync(DB, JSON.stringify(projects));
      result = projects[projects.length - 1];
    }
    return result;
  };
    
  // intended to be private to IssuesDB
  // called by this.addIssue & this.updateIssue
  this.updateProject = function(project, issues) {
    // returns project object or error string
    let result;
    let projects, projectIndex;
    if (this.getProject(project) == 'no such project') {
      result = 'no such project';
    } else {
      projects = JSON.parse(fs.readFileSync(DB));
      projectIndex = projects.findIndex((element) => {
        return element.project == project;
      });
      projects[projectIndex].issues = issues;
      fs.writeFileSync(DB, JSON.stringify(projects));
      result = projects[projectIndex];
    }
    return result;
  };

  this.getIssues = function(project) {
    // returns issues array or error string
    let result;
    let projectObj = this.getProject(project);
    if (projectObj == 'no such project') {
      result = 'no such project'; 
    } else {
      result = projectObj.issues;
    }
    return result;
  };

  this.addIssue = function(project, issue) {
    // returns issue or error string
    let issues = this.getIssues(project);
    if (issues == 'no such project') {
      issues = this.addProject(project).issues;
    }
    const issueTitle = issue.issue_title;
    if (issueTitle == undefined || issueTitle == '') {
      return 'required field(s) missing';
    }
    const issueText = issue.issue_text;
    if (issueText == undefined || issueText == '') {
      return 'required field(s) missing';
    }
    const createdBy = issue.created_by;
    if (createdBy == undefined || createdBy == '') {
      return 'required field(s) missing';
    }
    const assignedTo = (issue.assigned_to == undefined) ? "" : issue.assigned_to;
    const statusText = (issue.status_text == undefined) ? "" : issue.status_text;
    let date = new Date();
    let issueObj = {
      "_id": project + (issues.length + 1),
      "issue_title": issueTitle,
      "issue_text": issueText,
      "created_on": date.toUTCString(),
      "updated_on": date.toUTCString(),
      "created_by": createdBy,
      "assigned_to": assignedTo,
      "open": true,
      "status_text": statusText,     
    };
    issues.push(issueObj);
    this.updateProject(project, issues);
    return issueObj;
  };

  this.updateIssue = function(project, issue) {
    // returns result string or error string
    const issueId = issue._id;
    if (issueId == undefined || issueId == '') {
      return 'missing _id';
    }
    let keys = Object.keys(issue);
    if (keys.length == 1) { // keys[0] == _id
      return 'no update field(s) sent';
    }
    let issues = this.getIssues(project);
    if (issues == 'no such project') {
      return 'could not update'; // no such project
    };
    let issueIndex = issues.findIndex((element) => {
      return element._id == issueId;
    });
    if (issueIndex == -1) {
      return 'could not update'; // no such issue
    }
    let issueObj = issues[issueIndex];
    keys.forEach((key) => {
      if (['issue_title', 'issue_text', 'created_by', 'open'].includes(key) && issue[key] == "") {
        return 'could not update'; // required field(s) missing
      }
      if (key == 'open' && typeof issue[key] != 'boolean') {
        return 'could not update'; // open not boolean
      }
      issueObj[key] = issue[key];
    });
    issues[issueIndex] = issueObj;
    this.updateProject(project, issues);
    return 'successfully updated';
  };

};

module.exports = IssuesDB;
