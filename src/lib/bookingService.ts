import { indyMowerDb as db } from "./indyMowerFirebase";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc,
  Timestamp 
} from "firebase/firestore";

interface BookingDetails {
  customerInfo: {
    date: string;
    time: string;
    [key: string]: any; // for other customer info fields
  };
  [key: string]: any; // for other booking fields
}

// Check if a time slot is available
export async function checkTimeSlotAvailability(date: string, time: string) {
  try {
    const bookingsRef = collection(db, "bookings");
    const selectedDate = new Date(date);
    
    // Set time range for the query (start and end of the selected date)
    const startDate = new Date(selectedDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(selectedDate);
    endDate.setHours(23, 59, 59, 999);

    const q = query(
      bookingsRef,
      where("date", ">=", Timestamp.fromDate(startDate)),
      where("date", "<=", Timestamp.fromDate(endDate)),
      where("time", "==", time)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.empty; // Returns true if the time slot is available
  } catch (error) {
    console.error("Error checking time slot availability:", error);
    throw error;
  }
}

// Get all booked times for a specific date
export async function getBookedTimes(date: string) {
  try {
    const bookingsRef = collection(db, "bookings");
    const selectedDate = new Date(date);
    
    // Set time range for the query
    const startDate = new Date(selectedDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(selectedDate);
    endDate.setHours(23, 59, 59, 999);

    const q = query(
      bookingsRef,
      where("customerInfo.date", "==", date)
    );

    const querySnapshot = await getDocs(q);
    const bookedTimes: string[] = [];
    
    querySnapshot.forEach((doc) => {
      const booking = doc.data();
      if (booking.customerInfo?.time) {
        bookedTimes.push(booking.customerInfo.time);
      }
    });

    console.log('Found booked times:', bookedTimes);
    return bookedTimes;
  } catch (error) {
    console.error("Error getting booked times:", error);
    return [];
  }
}

// Create a new booking
export async function createBooking(bookingDetails: BookingDetails) {
  try {
    const bookingsRef = collection(db, "bookings");
    const selectedDate = new Date(bookingDetails.customerInfo.date);
    
    // Check if the time slot is still available
    const isAvailable = await checkTimeSlotAvailability(
      bookingDetails.customerInfo.date,
      bookingDetails.customerInfo.time
    );

    if (!isAvailable) {
      throw new Error("This time slot is no longer available");
    }

    // Add the booking to Firestore
    await addDoc(bookingsRef, {
      ...bookingDetails,
      date: Timestamp.fromDate(selectedDate),
      createdAt: Timestamp.now()
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
}

export async function testFirebaseConnection() {
  try {
    // Test 1: Try to create a test booking
    const testBooking = {
      customerInfo: {
        email: "test@test.com",
        address: "123 Test St",
        date: new Date().toISOString().split('T')[0], // Today's date
        time: "9:00 AM"
      },
      services: "Test Service",
      totalPrice: 50,
      timestamp: new Date().toISOString()
    };

    console.log("Creating test booking...");
    await createBooking(testBooking);
    console.log("✅ Test booking created successfully!");

    // Test 2: Check if we can read booked times
    console.log("Checking booked times...");
    const bookedTimes = await getBookedTimes(testBooking.customerInfo.date);
    console.log("✅ Retrieved booked times:", bookedTimes);

    return "All tests passed!";
  } catch (error) {
    console.error("❌ Test failed:", error);
    throw error;
  }
}




