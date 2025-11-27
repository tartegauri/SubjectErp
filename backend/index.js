import express from "express"
import cors from "cors"
import "./utils/db.js"
import sequelize, { User, Subject, TeacherSubject, Enrollment, Assignment } from "./model/index.js"
import authRoutes from "./route/user.js"
import { authMiddleware } from "./middleware/authMiddleware.js"
import adminRoutes from "./route/admin.js"
import teacherRoutes from "./route/teacher.js"
import studentRoutes from "./route/student.js"

const app = express()

const NODE_ENV = process.env.NODE_ENV || "development"
const PORT = process.env.PORT || 5000

app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(express.json())

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    const syncOptions = NODE_ENV === 'development' ? { alter: true } : { alter: false };
    await sequelize.sync(syncOptions);
    console.log('✅ Database models synced successfully');
  } catch (error) {
    console.error('❌ Unable to sync database:', error);
    process.exit(1);
  }
};

syncDatabase().then(() => {
  app.use("/api", authRoutes);
  app.use(authMiddleware)
  app.use("/api/admin", adminRoutes);
  app.use("/api/teacher", teacherRoutes);
  app.use("/api/student", studentRoutes);

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`)
    console.log(`📦 Environment: ${NODE_ENV}`)
  })
}).catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
})