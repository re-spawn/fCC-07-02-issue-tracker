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
      return 'missing required field issue_title';
    }
    const issueText = issue.issue_text;
    if (issueText == undefined || issueText == '') {
      return 'missing required field issue_text';
    }
    const createdBy = issue.created_by;
    if (createdBy == undefined || createdBy == '') {
      return 'missing required field created_by';
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

}

module.exports = IssuesDB;
