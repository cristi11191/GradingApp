-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user'
);

-- CreateTable
CREATE TABLE "Project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "attachmentURL" TEXT
);

-- CreateTable
CREATE TABLE "Collaborator" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "projectId" INTEGER NOT NULL,
    CONSTRAINT "Collaborator_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Deliverable" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "attachmentURL" TEXT,
    "projectId" INTEGER NOT NULL,
    CONSTRAINT "Deliverable_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Evaluation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "score" REAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "deliverableId" INTEGER,
    "userID" INTEGER NOT NULL,
    "createdOn" DATETIME NOT NULL,
    CONSTRAINT "Evaluation_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Evaluation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
