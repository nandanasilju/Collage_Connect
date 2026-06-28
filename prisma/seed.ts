import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import path from "path";

const adapter = new PrismaBetterSqlite3({
  url: "file:prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.reviewLike.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.savedCollege.deleteMany({});
  await prisma.recentlyViewed.deleteMany({});
  await prisma.facility.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.collegeImage.deleteMany({});
  await prisma.college.deleteMany({});
  await prisma.user.deleteMany({});

  // Hash password for users
  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  const studentPasswordHash = await bcrypt.hash("student123", 10);

  // Create Admin
  const admin = await prisma.user.create({
    data: {
      name: "Admin Officer",
      email: "admin@college.com",
      password: adminPasswordHash,
      role: "ADMIN",
      profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    },
  });

  // Create Student
  const student = await prisma.user.create({
    data: {
      name: "Hari Kumar",
      email: "hari@gmail.com",
      password: studentPasswordHash,
      role: "USER",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      preferredBranch: "Computer Science & Engineering",
      preferredLocation: "Ernakulam",
      budget: 85000,
    },
  });

  console.log("Seeded Users:", { admin: admin.email, student: student.email });

  // Add Colleges
  const collegesData = [
    {
      name: "College of Engineering, Trivandrum (CET)",
      location: "Sreekaryam",
      district: "Trivandrum",
      state: "Kerala",
      type: "Government",
      autonomous: true,
      description: "Established in 1939, College of Engineering, Trivandrum (CET) is the first engineering college in the state of Kerala. CET is consistently ranked among the top engineering colleges in India, offering world-class infrastructure, exceptional research facilities, and record-breaking placement records. Its alumni network spans across global technology giants and academic institutions.",
      fees: 35000,
      rating: 4.8,
      placementPercentage: 96,
      highestPackage: 45.0,
      averagePackage: 8.5,
      hostel: true,
      transport: true,
      website: "https://www.cet.ac.in",
      image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800",
      latitude: 8.5444,
      longitude: 76.9054,
      nearbyBusStand: "Sreekaryam Bus Junction (1 km)",
      nearbyRailway: "Trivandrum Central Railway Station (10 km)",
      nearbyAirport: "Trivandrum International Airport (12 km)",
      aiScore: 98.2,
      courses: [
        { name: "Computer Science & Engineering", duration: "4 Years", intake: 120 },
        { name: "Electronics & Communication Engineering", duration: "4 Years", intake: 120 },
        { name: "Electrical & Electronics Engineering", duration: "4 Years", intake: 90 },
        { name: "Mechanical Engineering", duration: "4 Years", intake: 120 },
        { name: "Civil Engineering", duration: "4 Years", intake: 120 },
      ],
      facilities: ["Central Library", "Research Labs", "Hostel Block", "High-speed WiFi", "Cricket Ground", "Gymnasium", "Indoor Stadium", "Cafeteria"],
      images: [
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
      ],
    },
    {
      name: "TKM College of Engineering, Kollam",
      location: "Karicode",
      district: "Kollam",
      state: "Kerala",
      type: "Government-Aided",
      autonomous: true,
      description: "Thangal Kunju Musaliar (TKM) College of Engineering, founded in 1958, is a premier institute of technology in south India. Being the first government-aided engineering college in Kerala, TKM has long stood as a beacon of academic excellence and social commitment, offering highly accredited engineering programmes with strong industrial tie-ups.",
      fees: 40000,
      rating: 4.7,
      placementPercentage: 92,
      highestPackage: 32.0,
      averagePackage: 6.8,
      hostel: true,
      transport: true,
      website: "https://www.tkmce.ac.in",
      image: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=800",
      latitude: 8.8789,
      longitude: 76.6322,
      nearbyBusStand: "Karicode Bus Stop (0.2 km)",
      nearbyRailway: "Kollam Junction Railway Station (6 km)",
      nearbyAirport: "Trivandrum International Airport (70 km)",
      aiScore: 94.5,
      courses: [
        { name: "Computer Science & Engineering", duration: "4 Years", intake: 120 },
        { name: "Electronics & Communication Engineering", duration: "4 Years", intake: 120 },
        { name: "Mechanical Engineering", duration: "4 Years", intake: 120 },
        { name: "Chemical Engineering", duration: "4 Years", intake: 60 },
      ],
      facilities: ["Digital Library", "Seminar Halls", "Hostel", "Sports Complex", "Innovation Center", "Automotive Lab"],
      images: [
        "https://images.unsplash.com/photo-1527891751199-7225231a68dd?auto=format&fit=crop&q=80&w=800",
      ],
    },
    {
      name: "Government Model Engineering College (MEC)",
      location: "Thrikkakara",
      district: "Ernakulam",
      state: "Kerala",
      type: "Government",
      autonomous: false,
      description: "Model Engineering College (MEC) Ernakulam, established in 1989 by IHRD, is famed for its exceptional placement record. MEC consistently ranks among the top placements in the state, with recruiters like Amazon, Nvidia, and Microsoft visiting campus annually. Situated in the tech-hub of Kochi, it offers robust industry exposure.",
      fees: 35000,
      rating: 4.6,
      placementPercentage: 98,
      highestPackage: 40.0,
      averagePackage: 8.2,
      hostel: false,
      transport: true,
      website: "https://www.mec.ac.in",
      image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5c?auto=format&fit=crop&q=80&w=800",
      latitude: 10.0287,
      longitude: 76.3292,
      nearbyBusStand: "Thrikkakara Bus Stop (0.5 km)",
      nearbyRailway: "Aluva Railway Station (8 km)",
      nearbyAirport: "Cochin International Airport (20 km)",
      aiScore: 96.0,
      courses: [
        { name: "Computer Science & Engineering", duration: "4 Years", intake: 120 },
        { name: "Computer Science & Engineering (AI)", duration: "4 Years", intake: 60 },
        { name: "Electronics & Communication Engineering", duration: "4 Years", intake: 120 },
        { name: "Electrical & Electronics Engineering", duration: "4 Years", intake: 60 },
      ],
      facilities: ["Computer Center", "IoT Lab", "Badminton Court", "Hostel Tie-ups", "Canteen", "Incubation Center"],
      images: [
        "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800",
      ],
    },
    {
      name: "Government Engineering College, Thrissur (GECT)",
      location: "Ramavarmapuram",
      district: "Thrissur",
      state: "Kerala",
      type: "Government",
      autonomous: true,
      description: "Government Engineering College, Thrissur is one of the oldest and most prestigious engineering institutions in Kerala. Established in 1957, GECT is a major center for technical education, innovation, and research. Spread over 75 acres, the campus provides students with a highly stimulating environment for academic and personal growth.",
      fees: 15000,
      rating: 4.6,
      placementPercentage: 88,
      highestPackage: 28.0,
      averagePackage: 6.2,
      hostel: true,
      transport: true,
      website: "https://www.gectcr.ac.in",
      image: "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&q=80&w=800",
      latitude: 10.5539,
      longitude: 76.2235,
      nearbyBusStand: "Ramavarmapuram Bus Stop (0.1 km)",
      nearbyRailway: "Thrissur Railway Station (6 km)",
      nearbyAirport: "Cochin International Airport (55 km)",
      aiScore: 92.1,
      courses: [
        { name: "Computer Science & Engineering", duration: "4 Years", intake: 60 },
        { name: "Mechanical Engineering", duration: "4 Years", intake: 120 },
        { name: "Production Engineering", duration: "4 Years", intake: 60 },
        { name: "Chemical Engineering", duration: "4 Years", intake: 60 },
      ],
      facilities: ["Makerspace", "Auditorium", "Residential Hostels", "Gym", "Football Ground", "Testing Labs"],
      images: [],
    },
    {
      name: "Rajagiri School of Engineering & Technology (RSET)",
      location: "Kakkanad",
      district: "Ernakulam",
      state: "Kerala",
      type: "Private",
      autonomous: true,
      description: "Rajagiri School of Engineering & Technology (RSET) Kakkanad, is a leading private self-financing college known for its disciplined atmosphere and high-end infrastructure. Affiliated with APJ Abdul Kalam Technological University, RSET offers dynamic tech programs, top placement connections, and excellent student amenities in Ernakulam.",
      fees: 95000,
      rating: 4.4,
      placementPercentage: 85,
      highestPackage: 22.0,
      averagePackage: 5.5,
      hostel: true,
      transport: true,
      website: "https://www.rajagiritech.ac.in",
      image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800",
      latitude: 9.9922,
      longitude: 76.3578,
      nearbyBusStand: "Kakkanad Bus Stand (2.5 km)",
      nearbyRailway: "Ernakulam Junction (12 km)",
      nearbyAirport: "Cochin International Airport (24 km)",
      aiScore: 88.5,
      courses: [
        { name: "Computer Science & Engineering", duration: "4 Years", intake: 180 },
        { name: "Information Technology", duration: "4 Years", intake: 60 },
        { name: "Artificial Intelligence & Data Science", duration: "4 Years", intake: 60 },
        { name: "Applied Electronics & Instrumentation", duration: "4 Years", intake: 60 },
      ],
      facilities: ["AC Computer Labs", "Auditorium", "Indoor Sports Arena", "Centralized Hostels", "Wifi Campus", "Cafeteria"],
      images: [],
    },
    {
      name: "Federal Institute of Science and Technology (FISAT)",
      location: "Mookkannoor",
      district: "Ernakulam",
      state: "Kerala",
      type: "Private",
      autonomous: false,
      description: "Federal Institute of Science and Technology (FISAT) is a self-financing engineering college established and managed by the Federal Bank Officers Association Educational Society (FBOAES). With ISO certification and NBA accreditations, FISAT stands out for its high academic standards, active professional chapters (IEEE, ACM), and excellent labs.",
      fees: 85000,
      rating: 4.3,
      placementPercentage: 84,
      highestPackage: 20.0,
      averagePackage: 5.2,
      hostel: true,
      transport: true,
      website: "https://www.fisat.ac.in",
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800",
      latitude: 10.2212,
      longitude: 76.4087,
      nearbyBusStand: "Angamaly Bus Stand (7 km)",
      nearbyRailway: "Angamaly Railway Station (7 km)",
      nearbyAirport: "Cochin International Airport (15 km)",
      aiScore: 86.4,
      courses: [
        { name: "Computer Science & Engineering", duration: "4 Years", intake: 180 },
        { name: "Electronics & Communication Engineering", duration: "4 Years", intake: 120 },
        { name: "Electrical & Electronics Engineering", duration: "4 Years", intake: 60 },
      ],
      facilities: ["FAB Lab", "ATM Counter", "Modern Gym", "Boys & Girls Hostel", "College Buses", "Seminar Hall"],
      images: [],
    },
    {
      name: "Mar Athanasius College of Engineering (MACE)",
      location: "Kothamangalam",
      district: "Ernakulam",
      state: "Kerala",
      type: "Government-Aided",
      autonomous: false,
      description: "Mar Athanasius College of Engineering (MACE), founded in 1961, was the first government-aided engineering college in Asia to be set up under Christian management. Over the years, MACE has established itself as an institution of high reputation, attracting top-rank holders in the state entrance exam (KEAM) and placing students across multi-national firms.",
      fees: 40000,
      rating: 4.5,
      placementPercentage: 89,
      highestPackage: 25.0,
      averagePackage: 6.0,
      hostel: true,
      transport: true,
      website: "https://www.mace.ac.in",
      image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800",
      latitude: 10.0638,
      longitude: 76.6214,
      nearbyBusStand: "Kothamangalam Bus Terminal (1.2 km)",
      nearbyRailway: "Aluva Railway Station (30 km)",
      nearbyAirport: "Cochin International Airport (32 km)",
      aiScore: 91.0,
      courses: [
        { name: "Computer Science & Engineering", duration: "4 Years", intake: 120 },
        { name: "Civil Engineering", duration: "4 Years", intake: 120 },
        { name: "Mechanical Engineering", duration: "4 Years", intake: 120 },
      ],
      facilities: ["Central Workshop", "Indoor Stadium", "Substation", "Hostel Rooms", "Library & Information Center"],
      images: [],
    },
    {
      name: "NSS College of Engineering, Palakkad",
      location: "Akathethara",
      district: "Palakkad",
      state: "Kerala",
      type: "Government-Aided",
      autonomous: false,
      description: "NSS College of Engineering, Palakkad is one of the premier government-aided engineering institutions in Kerala. Founded in 1960 by the Nair Service Society under the leadership of Bharatha Kesari Mannathu Padmanabhan, the college provides high-quality technical education across major disciplines and is nestled in a beautiful campus at Akathethara.",
      fees: 38000,
      rating: 4.2,
      placementPercentage: 80,
      highestPackage: 18.0,
      averagePackage: 4.8,
      hostel: true,
      transport: true,
      website: "https://www.nssce.ac.in",
      image: "https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc?auto=format&fit=crop&q=80&w=800",
      latitude: 10.8228,
      longitude: 76.6425,
      nearbyBusStand: "NSS Junction Bus Stop (0.1 km)",
      nearbyRailway: "Palakkad Junction Railway Station (5 km)",
      nearbyAirport: "Coimbatore International Airport (65 km)",
      aiScore: 84.2,
      courses: [
        { name: "Computer Science & Engineering", duration: "4 Years", intake: 60 },
        { name: "Instrumentation & Control Engineering", duration: "4 Years", intake: 60 },
        { name: "Mechanical Engineering", duration: "4 Years", intake: 120 },
      ],
      facilities: ["College Ground", "Hostels", "Instrumentation Labs", "Gym", "NSS Co-operative Store"],
      images: [],
    },
  ];

  for (const c of collegesData) {
    const college = await prisma.college.create({
      data: {
        name: c.name,
        location: c.location,
        district: c.district,
        state: c.state,
        type: c.type,
        autonomous: c.autonomous,
        description: c.description,
        fees: c.fees,
        rating: c.rating,
        placementPercentage: c.placementPercentage,
        highestPackage: c.highestPackage,
        averagePackage: c.averagePackage,
        hostel: c.hostel,
        transport: c.transport,
        website: c.website,
        image: c.image,
        latitude: c.latitude,
        longitude: c.longitude,
        nearbyBusStand: c.nearbyBusStand,
        nearbyRailway: c.nearbyRailway,
        nearbyAirport: c.nearbyAirport,
        aiScore: c.aiScore,
        courses: {
          create: c.courses,
        },
        facilities: {
          create: c.facilities.map((fac) => ({ name: fac })),
        },
        images: {
          create: c.images.map((img) => ({ url: img })),
        },
      },
    });

    console.log(`Seeded College: ${college.name}`);
  }

  // Retrieve CET & MEC to add some mock reviews and saved states
  const cet = await prisma.college.findFirst({ where: { name: { contains: "Trivandrum" } } });
  const mec = await prisma.college.findFirst({ where: { name: { contains: "Model" } } });

  if (cet && mec) {
    // Add Saved Colleges for Student
    await prisma.savedCollege.create({
      data: {
        userId: student.id,
        collegeId: cet.id,
      },
    });

    await prisma.recentlyViewed.create({
      data: {
        userId: student.id,
        collegeId: mec.id,
      },
    });

    // Add Reviews
    const r1 = await prisma.review.create({
      data: {
        rating: 5,
        comment: "Excellent infrastructure and unmatched academic legacy. Placements are stellar and the campus life at CET is incredible!",
        userId: student.id,
        collegeId: cet.id,
        approved: true,
      },
    });

    // Seed some other user's review for student to like
    const dummyUser = await prisma.user.create({
      data: {
        name: "Anjali Nair",
        email: "anjali@gmail.com",
        password: studentPasswordHash,
        role: "USER",
        profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
      },
    });

    const r2 = await prisma.review.create({
      data: {
        rating: 4,
        comment: "Placements are top-tier. Model Engineering College has a small campus, but the academic quality and coding culture are world-class.",
        userId: dummyUser.id,
        collegeId: mec.id,
        approved: true,
      },
    });

    // Student likes Anjali's review
    await prisma.reviewLike.create({
      data: {
        userId: student.id,
        reviewId: r2.id,
      },
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
