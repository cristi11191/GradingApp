/*
  Warnings:

  - Added the required column `fileType` to the `Deliverable` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Deliverable" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "attachmentURL" TEXT,
    "fileType" TEXT NOT NULL,
    "projectId" INTEGER NOT NULL,
    CONSTRAINT "Deliverable_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Deliverable" ("attachmentURL", "description", "id", "projectId", "title") SELECT "attachmentURL", "description", "id", "projectId", "title" FROM "Deliverable";
DROP TABLE "Deliverable";
ALTER TABLE "new_Deliverable" RENAME TO "Deliverable";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
