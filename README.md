# Mini Roster System Backend

A scheduling and shift-management backend built with **NestJS**, **GraphQL**, and **TypeORM**.  
It supports recurring schedules, shift instance generation, user assignment, and open shift management.

---

## 🚀 Features

- Create recurring shift schedules (daily, weekly, monthly)
- Auto-generate shift instances (Assignments)
- Support for open/unassigned shifts
- User assignment and reassignment
- GraphQL queries & mutations
- Clean two-layer schedule architecture
- Prevent overlapping user assignments
- Supports optional end dates for schedules

---

## 🧠 System Architecture (Summary)

1. **ShiftSchedule** represents recurring patterns (e.g., "every Monday").
2. **Assignment** is the actual shift instance tied to a specific date.
3. Users can be assigned or left null to create **open shifts**.
4. Modulo arithmetic determines which dates match the recurrence rules.
5. Schedule changes do not modify historical assignments.

---

## 📦 ERD Diagriam
https://drive.google.com/file/d/1ic34TTDxJnacwKJLYkPFuMms8YSFbfhP/view?usp=sharing


# Complete Setup Guide - Mini Roste System


## 📁 Project Structure

Create the following directory structure:

```
roster-system/
├── src/
│   ├── entities/
│   │   ├── base-time.entity.ts
│   │   ├── user.entity.ts
│   │   ├── shift.entity.ts
│   │   ├── shift-schedule.entity.ts
│   │   ├── assignment.entity.ts
│   │   └── cannot-attend.entity.ts
│   ├── enums/
│   │   ├── role.enum.ts
│   │   ├── recurrence-types.enum.ts
│   │   └── assignment-status.enum.ts
│   ├── services/
│   │   ├── user.service.ts
│   │   ├── shift.service.ts
│   │   ├── shift-schedule.service.ts
│   │   ├── assignment.service.ts
│   │   └── cannot-attend.service.ts
│   ├── resolvers/
│   │   ├── user.resolver.ts
│   │   ├── shift.resolver.ts
│   │   ├── shift-schedule.resolver.ts
│   │   ├── assignment.resolver.ts
│   │   └── cannot-attend.resolver.ts
│   ├── dto/
│   │   ├── create-user.input.ts
│   │   ├── create-shift.input.ts
│   │   ├── create-shift-schedule.input.ts
│   │   ├── assign-user.input.ts
│   │   ├── mark-cannot-attend.input.ts
│   │   └── get-shifts-filter.input.ts
│   ├── seed/
│   │   ├── seed.service.ts
│   │   ├── seed.module.ts
│   │   └── seed.ts
│   ├── app.module.ts
│   └── main.ts
├── schema.drawio (Draw.io XML file)
├── sample-queries.graphql
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
└── README.md
```

## 🚀 Step-by-Step Setup

### Step 1: Clone the Project

```bash
# Create project directory
git clone https://github.com/abjerry/mini-roster-system-backend.git
cd mini-roster-system-backend
```
### Step 2: Install Dependencies

```bash 
npm install 
```

### Step 3: Environment Setup

```bash 
cp .example.env .env

```


### Step 4: Seed Database

```bash 
npm run seed
```
### Step 5: Run the Application

```bash
# Development mode with auto-reload
npm run start:dev

# Or production mode
npm run build
npm run start:prod
```


### Step 6: Access GraphQL Playground

Open your browser and navigate to:
```
http://localhost:3000/graphql
```

## 🧪 Testing the System

### Quick Test Workflow

1. **Open GraphQL Playground** at `http://localhost:3000/graphql`


3. **Get all users** to grab UUIDs:
   ```graphql
   query {
     users {
       id
       name
       email
     }
   }
   ```

4. **Get all shifts**:
   ```graphql
   query {
     shifts {
       id
       name
       startTime
       endTime
     }
   }
   ```

5. **Create a schedule**:
   ```graphql
   mutation {
     createShiftSchedule(input: {
       shiftId: "PASTE_SHIFT_ID_HERE"
       startDate: "2024-01-01"
       endDate: "2024-12-31"
       recurrenceType: WEEKLY
       daysOfWeek: [1, 2, 3, 4, 5]
       interval: 1
     }) {
       id
     }
   }
   ```

6. **Generate assignments**:
   ```graphql
   mutation {
     generateAssignments(
       scheduleId: "PASTE_SCHEDULE_ID_HERE"
       startDate: "2024-01-01"
       endDate: "2024-01-31"
     ) {
       id
       date
       status
     }
   }
   ```

7. **View open shifts**:
   ```graphql
   query {
     openShifts(
       startDate: "2024-01-01"
       endDate: "2024-01-31"
     ) {
       id
       date
       schedule {
         shift {
           name
         }
       }
     }
   }
   ```

8. **Assign a user**:
   ```graphql
   mutation {
     assignUser(input: {
       userId: "PASTE_USER_ID_HERE"
       scheduleId: "PASTE_SCHEDULE_ID_HERE"
       date: "2024-01-15"
     }) {
       id
       status
       user {
         name
       }
     }
   }
   ```
 
8. **Remove an Assignment**:
   ```graphql
   mutation  {
    removeAssignment(assignmentId: "assignmentId")
  }
   ```
 