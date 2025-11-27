import sequelize, { User } from '../model/index.js';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedUsers() {
  try {
    const usersDataPath = path.join(__dirname, 'users.json');
    const usersData = JSON.parse(fs.readFileSync(usersDataPath, 'utf-8'));

    await sequelize.authenticate();
    console.log('✅ Database connection established');

    await sequelize.sync({ alter: true });
    console.log('✅ Database models synced');

    console.log('\n📝 Seeding users...');
    
    for (const userData of usersData) {
      const existingUser = await User.findOne({ where: { email: userData.email } });
      
      if (existingUser) {
        console.log(`⚠️  User ${userData.email} already exists, skipping...`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      await User.create({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
      });

      console.log(`✅ Created ${userData.role}: ${userData.email}`);
    }

    console.log('\n✨ Seeding completed successfully!');
    console.log('\n📋 Created users:');
    console.log('   Admin: admin@gmail.com (password: admin)');
    console.log('   Teachers: tone@gmail.com, ttwo@gmail.com (passwords: tone, ttwo)');
    console.log('   Students: sone@gmail.com, stwo@gmail.com (passwords: sone, stwo)');
    
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

seedUsers();

