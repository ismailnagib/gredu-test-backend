# gredu-test-backend
Test for a job application as a fullstack developer in [Gredu](https://gredu.asia).

## How to run this:
First, you need to clone the repository then open your terminal and go to the application directory. After that, type into the terminal:
```
mv template.env .env
```
Open the `.env` file using your favorite IDE and fill in the fields:
```
MONGO_DB= // Fill this with your MongoDB connection url
```

#### Without Docker
Go back to your terminal and type in:
```
npm install
npm start
```
The application will be available on `http://localhost:3000`

#### With docker
Go back to your terminal and type in:
```
docker build . -t [image-name]
docker run --env-file .env -p 3000:[your-desired-port] [image-name]
```
The application will be available on `http://localhost:[your-desired-port]`

##### Supported additional environment variables:
```
PORT= // Set the port in which the application will run (default: 3000)
MAX_CLASSROOM= // Set the maximum number of classroom that can be used in schedules, minimum value: 1 (default: 8)
MAX_STUDENT_PER_CLASSROOM= // Set the maximum number of student that can go to a classroom / participate on a schedule, minimum value: 1 (default: 20)
MAX_DAY= // Set the maximum number of day that can be used in schedules, minimum value: 1 (default: 6)
MAX_CREDIT= // Set the maximum number of credit that can be used by students to participate on schedules, minimum value: 1 (default: 20)
MINUTE_PER_CREDIT= // Set how long a credit equals to in time, in minute, minimum value: 1 (default: 45)
MAX_MINUTE= // Set the max weekly study time for the students, in minute, minimum value: 1 * MINUTE_PER_CREDIT (default: 2400)
```
