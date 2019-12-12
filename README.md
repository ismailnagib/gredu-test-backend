# gredu-test-backend
Test for a job application as a fullstack developer in [Gredu](https://gredu.asia).

<br />

## How to run this:
First, you need to clone the repository then open your terminal and go to the application directory. After that, type into the terminal:
```
mv template.env .env
```
Open the `.env` file using your favorite IDE and fill in the fields:
```
MONGO_DB= // Fill this with your MongoDB connection url
```

<br />

#### Without Docker
Go back to your terminal and type in:
```
npm install
npm start
```
The application will be available on `http://localhost:3000`.

<br />

#### With Docker
Go back to your terminal and type in:
```
docker build . -t [image-name]
docker run --env-file .env -p 3000:[your-desired-port] [image-name]
```
The application will be available on `http://localhost:[your-desired-port]`.

<br />

## API Documentation:

Route                   | Method | Body                           | Description                                           
------------------------|--------|--------------------------------|-------------------------------------------------------
/ping                   | GET    | -                              | See if the service is running                         
/student                | GET    | -                              | Get a list of all students                           
/student/:id            | GET    | -                              | Get a student                                        
/student/summary/:id    | GET    | -                              | Get a student's (with _id that match `:id`) summary    
/student/distribution   | GET    | -                              | Get students' program distribution                    
/student                | POST   | name (string), program (string)| Create a student                                      
/schedule/:id           | PUT    | scheduleId (string)            | Add a schedule (with _id that match `scheduleId`) to the schedules of a student (with _id that match `:id`)
/subject                | GET    | -                              | Get a list of all subjects                      
/subject                | POST   | name (string)                  | Create a subject                                      
/schedule               | GET    | -                              | Get a list of all schedules                           
/schedule               | POST   | semester (object), semester.number (number, 1-2), semester.year (number, 0~), program (string), subjectId (string), classroom (number), day (number), credit(number)| Create a schedule (with subject with _id that match `subjectId`)

<br />

##### Supported additional environment variables:

Key                       | Description
--------------------------|-------------------------------------------------------------------------------------------------
PORT                      | Set the port in which the application will run (default: 3000)
MAX_CLASSROOM             | Set the maximum number of classroom that can be used in schedules, minimum value: 1 (default: 8)
MAX_STUDENT_PER_CLASSROOM | Set the maximum number of student that can go to a classroom / participate on a schedule, minimum value: 1 (default: 20)
MAX_DAY                   | Set the maximum number of day that can be used in schedules, minimum value: 1 (default: 6)
MAX_CREDIT                | Set the maximum number of credit that can be used by students to participate on schedules, minimum value: 1 (default: 20)
MINUTE_PER_CREDIT         | Set how long a credit equals to in time, in minute, minimum value: 1 (default: 45)
MAX_MINUTE                | Set the max weekly study time for the students, in minute, minimum value: 1 * MINUTE_PER_CREDIT (default: 2400)
