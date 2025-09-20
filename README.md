# Vue Jobs Backend

This is the backend API for the Vue Jobs application using JSON Server.

## Deployment on Railway

1. Create a new project on Railway
2. Connect this `vue-jobs-backend` folder (not the vue-jobs-final folder)
3. Railway will automatically detect the Node.js app and deploy it
4. The API will be available at your Railway URL

## Local Development

```bash
npm install
npm run dev
```

The API will be available at `http://localhost:8000`

## API Endpoints

- `GET /jobs` - Get all jobs
- `GET /jobs/:id` - Get a specific job
- `POST /jobs` - Create a new job
- `PUT /jobs/:id` - Update a job
- `DELETE /jobs/:id` - Delete a job

## Environment Variables

Railway will automatically set the `PORT` environment variable.