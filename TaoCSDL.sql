
create database task_management

CREATE TABLE Users (
    UserID SERIAL PRIMARY KEY,
    Username VARCHAR(50) UNIQUE,
    Password VARCHAR(255), 
    Fullname VARCHAR(200),
    Email VARCHAR(255),
    Isadmin INT DEFAULT 0
);

CREATE TABLE Projects (
    ProjectID SERIAL PRIMARY KEY,
    UserID INT,
    Title VARCHAR(255),
    Description TEXT,
    StartDate DATE DEFAULT CURRENT_DATE, 
    EndDate DATE DEFAULT CURRENT_DATE,
    Visibility BOOLEAN DEFAULT true,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);


CREATE TABLE Tasks (
    TaskID SERIAL PRIMARY KEY,
    UserID INT,
    Title VARCHAR(255),
    Description TEXT,
    Priority INT, -- hoặc nếu priority có thể là chuỗi: Priority VARCHAR(255)
    Deadline TIMESTAMP,
    Status INT CHECK (Status >= 0 AND Status <= 100),
    ProjectID INT,
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (ProjectID) REFERENCES Projects(ProjectID)
);

CREATE TABLE Notes (
    NoteID SERIAL PRIMARY KEY,
    TaskID INT,
    UserID INT,
    Content TEXT,
    Timestamp TIMESTAMP,
    FOREIGN KEY (TaskID) REFERENCES Tasks(TaskID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

CREATE TABLE Attachments (
    AttachmentID SERIAL PRIMARY KEY,
    TaskID INT,
    UserID INT,
    FileName VARCHAR(255),
    FilePath TEXT,
    FOREIGN KEY (TaskID) REFERENCES Tasks(TaskID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

CREATE TABLE AuditLog (
    LogID SERIAL PRIMARY KEY,
    UserID INT,
    Action VARCHAR(50),
    Details TEXT,
    Timestamp TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);
select * from users
select * from projects
select * from tasks
select * from notes 
select * from attachments
select * from auditlog

INSERT INTO Users (Username, Password, Fullname, Email,isadmin)
VALUES 
  ('ad', '1', 'Admin', 'admin@example.com',1)

INSERT INTO Projects (UserID, Title, Description, StartDate, EndDate)
VALUES 
	(1, 'Project One One', 'Description for Project One', '2022-01-01', '2022-01-31')
INSERT INTO Tasks (UserID, Title, Description, Priority, Deadline, Status, ProjectID)
VALUES 
  (1, 'Task One', 'Description for Task One', 1, '2022-01-15', 10, 1)
  
  
-- Insert into Users table
INSERT INTO Users (Username, Password, Fullname, Email)
VALUES 
  ('user1', 'hashed_password_1', 'User One', 'user1@example.com'),
  ('user2', 'hashed_password_2', 'User Two', 'user2@example.com');

-- Insert into Projects table
INSERT INTO Projects (UserID, Title, Description, StartDate, EndDate)
VALUES 
  (1, 'Project One', 'Description for Project One', '2022-01-01', '2022-01-31'),
  (2, 'Project Two', 'Description for Project Two', '2022-02-01', '2022-02-28');

-- Insert into Tasks table
INSERT INTO Tasks (UserID, Title, Description, Priority, Deadline, Status, ProjectID)
VALUES 
  (1, 'Task One', 'Description for Task One', 1, '2022-01-15', 10, 1),
  (2, 'Task Two', 'Description for Task Two', 2, '2022-02-15', 20, 2);

-- Insert into Notes table
INSERT INTO Notes (TaskID, UserID, Content, Timestamp)
VALUES 
  (1, 1, 'Note content for Task One', '2022-01-05'),
  (2, 2, 'Note content for Task Two', '2022-02-05');

-- Insert into Attachments table
INSERT INTO Attachments (TaskID, UserID, FileName, FilePath)
VALUES 
  (1, 1, 'Attachment_One.pdf', '/attachments/attachment_one.pdf'),
  (2, 2, 'Attachment_Two.docx', '/attachments/attachment_two.docx');

-- Insert into AuditLog table
INSERT INTO AuditLog (UserID, Action, EntityType, EntityID, Details, Timestamp)
VALUES 
  (1, 'CREATE', 'Task', 1, 'Task One created', '2022-01-10'),
  (2, 'UPDATE', 'Project', 2, 'Project Two updated', '2022-02-15');

