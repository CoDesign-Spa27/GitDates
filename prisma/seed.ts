// seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create users
  const user1 = await prisma.user.create({
    data: {
      email: 'john.doe@example.com',
      username: 'johnny',
      name: 'John Doe',
      password: 'hashedPassword1',
      gender: 'Male',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      dob: new Date('1990-05-15'),
      gitDateProfile: {
        create: {
          githubUsername: 'johnny-github',
          name: 'John Doe',
          repositories: 10,
          followers: 100,
          following: 50,
          mainLanguages: ['JavaScript', 'TypeScript'],
          contributions: 200,
        },
      },
      preferences: {
        create: {
          ageMin: 25,
          ageMax: 35,
          languages: ['English', 'Spanish'],
          city: 'New York',
          state: 'NY',
          country: 'USA',
          gender: 'Female',
          minContributions: 50,
        },
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'jane.doe@example.com',
      username: 'janey',
      name: 'Jane Doe',
      password: 'hashedPassword2',
      gender: 'Female',
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
      dob: new Date('1992-08-20'),
      gitDateProfile: {
        create: {
          githubUsername: 'janey-github',
          name: 'Jane Doe',
          repositories: 15,
          followers: 150,
          following: 75,
          mainLanguages: ['Python', 'Ruby'],
          contributions: 300,
        },
      },
      preferences: {
        create: {
          ageMin: 28,
          ageMax: 40,
          languages: ['English', 'French'],
          city: 'Los Angeles',
          state: 'CA',
          country: 'USA',
          gender: 'Male',
          minContributions: 100,
        },
      },
    },
  });

  // Create accounts
  await prisma.account.create({
    data: {
      userId: user1.id,
      provider: 'google',
      providerAccountId: 'google123',
      access_token: 'googleAccessToken123',
      refresh_token: 'googleRefreshToken123',
    },
  });

  await prisma.account.create({
    data: {
      userId: user2.id,
      provider: 'github',
      providerAccountId: 'github456',
      access_token: 'githubAccessToken456',
      refresh_token: 'githubRefreshToken456',
    },
  });

  // Create sessions
  await prisma.session.create({
    data: {
      userId: user1.id,
      sessionToken: 'sessionToken123',
      accessToken: 'sessionAccessToken123',
      expires: new Date(new Date().getTime() + 3600000), // 1 hour
    },
  });

  await prisma.session.create({
    data: {
      userId: user2.id,
      sessionToken: 'sessionToken456',
      accessToken: 'sessionAccessToken456',
      expires: new Date(new Date().getTime() + 3600000), // 1 hour
    },
  });

  // Create a match
  await prisma.match.create({
    data: {
      senderId: user1.id,
      receiverId: user2.id,
      status: 'PENDING',
    },
  });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
