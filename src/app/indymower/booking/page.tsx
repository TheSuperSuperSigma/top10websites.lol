"use client";

import { useState, useEffect } from 'react';
import styles from './booking.module.css';
import IndyMowerNavbar from '@/components/IndyMowerNavbar';
import { useRouter } from 'next/navigation';
import { getBookedTimes, createBooking, testFirebaseConnection } from '@/lib/bookingService';

interface ServiceOption {
  id: string;
  name: string;
  description: string;
  price: number;
  selected: boolean;
  icon?: string;
}

interface CustomerInfo {
  email: string;
  address: string;
  phone?: string;
  date: string;
  time: string;
}

export default function Booking() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<ServiceOption[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [progress, setProgress] = useState(25);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    email: '',
    address: '',
    phone: '',
    date: '',
    time: ''
  });
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);

  const currentDate = new Date();
  const twoWeeksFromNow = new Date(currentDate);
  twoWeeksFromNow.setDate(currentDate.getDate() + 14);
  const maxDate = twoWeeksFromNow.toISOString().split('T')[0];

  // Helper function to format date as YYYY/MM/DD
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  const serviceCategories = {
    mowing: [
      { 
        id: 'standard-mow', 
        name: 'Standard Mowing', 
        description: 'Professional cut at optimal height with complete grass cleanup. Includes blowing of clippings from all hard surfaces.',
        price: 35, 
        selected: false,
        icon: '🌿'
      },
    ],
    extras: [
      { 
        id: 'edging', 
        name: 'Edge Trimming', 
        description: 'Sharp, clean edges along walkways, driveways, and beds.',
        price: 10, 
        selected: false,
        icon: '✂️'
      },
      { 
        id: 'weed-removal', 
        name: 'Weed Removal', 
        description: 'Manual removal of visible weeds from your lawn and garden beds to maintain a clean, healthy appearance.',
        price: 10, 
        selected: false,
        icon: '🌱'
      },
      { 
        id: 'small-bush-trim', 
        name: 'Small Bush Trimming', 
        description: 'Basic trimming of small bushes and shrubs to maintain shape and size.',
        price: 10, 
        selected: false,
        icon: '🪴'
      },
      { 
        id: 'flower-bed-cleanup', 
        name: 'Flower Bed Cleanup', 
        description: 'Remove debris, dead plants, and unwanted growth from flower beds to keep them tidy.',
        price: 10, 
        selected: false,
        icon: '🌺'
      },
      { 
        id: 'grass-seeding', 
        name: 'Grass Seeding', 
        description: 'Spread grass seed on bare or thin patches to promote fuller lawn growth.',
        price: 15, 
        selected: false,
        icon: '🌾'
      }
    ]
  };

  const isToday = (date: string) => {
    const today = new Date();
    const selectedDate = new Date(date);
    return (
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    );
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    return `${hours > 12 ? hours - 12 : hours}:00 ${hours >= 12 ? 'PM' : 'AM'}`;
  };

  const getAvailableTimes = async (selectedDate: string) => {
    const timeSlots = [
      "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
      "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
    ];

    try {
      // Get already booked times for the selected date
      const bookedTimes = await getBookedTimes(selectedDate);
      // Filter out booked times
      return timeSlots.filter(time => !bookedTimes.includes(time));
    } catch (error) {
      console.error("Error getting available times:", error);
      return timeSlots; // Return all slots if there's an error
    }
  };

  useEffect(() => {
    setProgress(currentStep * 25);
  }, [currentStep]);

  const handleServiceSelection = (service: ServiceOption) => {
    // If selecting from mowing category, deselect other mowing options
    if (serviceCategories.mowing.some(s => s.id === service.id)) {
      setSelectedServices(prev => {
        const withoutMowing = prev.filter(s => !serviceCategories.mowing.some(m => m.id === s.id));
        return service.selected ? withoutMowing : [...withoutMowing, service];
      });
    } else {
      setSelectedServices(prev => 
        prev.some(s => s.id === service.id)
          ? prev.filter(s => s.id !== service.id)
          : [...prev, service]
      );
    }
  };

  useEffect(() => {
    setTotalPrice(selectedServices.reduce((sum, service) => sum + service.price, 0));
  }, [selectedServices]);

  const isServiceSelected = (service: ServiceOption) => 
    selectedServices.some(s => s.id === service.id);

  const validateCustomerInfo = () => {
    const newErrors: Partial<CustomerInfo> = {};
    
    if (!customerInfo.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!customerInfo.address) {
      newErrors.address = 'Address is required';
    }

    if (!customerInfo.date) {
      newErrors.date = 'Date is required';
    } else {
      // Convert dates to YYYY-MM-DD format for comparison
      const selectedDateStr = new Date(customerInfo.date).toISOString().split('T')[0];
      const todayStr = new Date().toISOString().split('T')[0];
      const twoWeeksFromNow = new Date();
      twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
      const twoWeeksStr = twoWeeksFromNow.toISOString().split('T')[0];

      if (selectedDateStr <= todayStr) {
        newErrors.date = 'Please book at least 1 day in advance';
      } else if (selectedDateStr > twoWeeksStr) {
        newErrors.date = 'Bookings can only be made up to 2 weeks in advance';
      }
    }

    if (!customerInfo.time) {
      newErrors.time = 'Time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBookingSubmit = async () => {
    if (!validateCustomerInfo()) {
      return;
    }

    try {
      const bookingDetails = {
        services: selectedServices.map(service => service.name).join(', '),
        totalPrice: totalPrice,
        customerInfo: customerInfo,
        timestamp: new Date().toISOString(),
      };

      // Create the booking in Firestore
      await createBooking(bookingDetails);

      // Send the email
      const response = await fetch('/api/send-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingDetails),
      });

      if (!response.ok) {
        throw new Error('Failed to submit booking');
      }

      router.push('/indymower/booking/thank-you');
    } catch (error: any) {
      console.error('Error submitting booking:', error);
      if (error.message === "This time slot is no longer available") {
        alert('Sorry, this time slot has just been booked. Please select another time.');
        // Refresh available times
        if (customerInfo.date) {
          const availableTimes = await getAvailableTimes(customerInfo.date);
          setAvailableTimeSlots(availableTimes);
          setCustomerInfo(prev => ({ ...prev, time: '' }));
        }
      } else {
        alert('There was an error submitting your booking. Please try again.');
      }
    }
  };

  const updateProgress = (step: number) => {
    switch (step) {
      case 1: setProgress(25); break;
      case 2: setProgress(50); break;
      case 3: setProgress(75); break;
      case 4: setProgress(100); break;
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && selectedServices.length === 0) {
      alert('Please select at least one service');
      return;
    }
    
    // Only validate customer info when on step 3
    if (currentStep === 3 && !validateCustomerInfo()) {
      return;
    }

    setCurrentStep(prev => prev + 1);
    updateProgress(currentStep + 1);
  };

  return (
    <main className={styles.main}>
      <IndyMowerNavbar />
      <button 
        onClick={async () => {
          try {
            const result = await testFirebaseConnection();
            alert('Test successful! Check console for details.');
          } catch (error) {
            console.error('Test error:', error);
            alert('Test failed! Check console for details.');
          }
        }}
        style={{
          padding: '10px 20px',
          margin: '20px',
          backgroundColor: '#ff4444',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Test Firebase Connection
      </button>
      <div className={styles.container}>
        <h1>Design Your Perfect Lawn Service</h1>
        
        <div className={styles.customizer}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className={styles.steps}>
            <div className={`${styles.step} ${currentStep === 1 ? styles.active : ''}`}>
              <div className={styles.stepIndicator}>1</div>
              Choose Your Cut
            </div>
            <div className={`${styles.step} ${currentStep === 2 ? styles.active : ''}`}>
              <div className={styles.stepIndicator}>2</div>
              Add Extras
            </div>
            <div className={`${styles.step} ${currentStep === 3 ? styles.active : ''}`}>
              <div className={styles.stepIndicator}>3</div>
              Your Details
            </div>
            <div className={`${styles.step} ${currentStep === 4 ? styles.active : ''}`}>
              <div className={styles.stepIndicator}>4</div>
              Review & Book
            </div>
          </div>

          <div className={styles.serviceOptions}>
            {currentStep === 1 && (
              <div className={styles.optionsGrid}>
                {serviceCategories.mowing.map(service => (
                  <div 
                    key={service.id}
                    className={`${styles.serviceCard} ${isServiceSelected(service) ? styles.selected : ''}`}
                    onClick={() => handleServiceSelection(service)}
                  >
                    <span className={styles.serviceIcon}>{service.icon}</span>
                    <h3>{service.name}</h3>
                    <p>{service.description}</p>
                    <span className={styles.price}>${service.price}</span>
                  </div>
                ))}
              </div>
            )}

            {currentStep === 2 && (
              <div className={styles.optionsGrid}>
                {serviceCategories.extras.map(service => (
                  <div 
                    key={service.id}
                    className={`${styles.serviceCard} ${isServiceSelected(service) ? styles.selected : ''}`}
                    onClick={() => handleServiceSelection(service)}
                  >
                    <span className={styles.serviceIcon}>{service.icon}</span>
                    <h3>{service.name}</h3>
                    <p>{service.description}</p>
                    <span className={styles.price}>${service.price}</span>
                  </div>
                ))}
              </div>
            )}

            {currentStep === 3 && (
              <div className={styles.customerInfoForm}>
                <h2>Your Information</h2>
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                    className={errors.email ? styles.errorInput : ''}
                  />
                  {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="address">Address *</label>
                  <input
                    type="text"
                    id="address"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                    className={errors.address ? styles.errorInput : ''}
                  />
                  {errors.address && <span className={styles.errorMessage}>{errors.address}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="date">Preferred Date *</label>
                  <input
                    type="date"
                    id="date"
                    value={customerInfo.date}
                    onChange={async (e) => {
                      const newDate = e.target.value;
                      setCustomerInfo(prev => ({
                        ...prev,
                        date: newDate,
                        time: '' // Reset time when date changes
                      }));
                      if (newDate) {
                        const availableTimes = await getAvailableTimes(newDate);
                        setAvailableTimeSlots(availableTimes);
                      }
                    }}
                    className={errors.date ? styles.errorInput : ''}
                    min={new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]}
                    max={maxDate}
                  />
                  <span className={styles.helperText}>
                    Bookings available from {formatDate(new Date(new Date().setDate(new Date().getDate() + 1)))} to {formatDate(twoWeeksFromNow)} (2 weeks in advance)
                  </span>
                  {errors.date && <span className={styles.errorMessage}>{errors.date}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="time">Preferred Time *</label>
                  <select
                    id="time"
                    value={customerInfo.time}
                    onChange={(e) => setCustomerInfo({...customerInfo, time: e.target.value})}
                    className={errors.time ? styles.errorInput : ''}
                    disabled={!customerInfo.date} // Disable if no date selected
                  >
                    <option value="">Select a time</option>
                    {customerInfo.date && availableTimeSlots.map(time => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  {errors.time && <span className={styles.errorMessage}>{errors.time}</span>}
                  {!customerInfo.date && 
                    <span className={styles.helperText}>Please select a date first</span>
                  }
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone">Phone (Optional)</label>
                  <input
                    type="tel"
                    id="phone"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  />
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className={styles.summary}>
                <h2>Your Custom Lawn Package</h2>
                {selectedServices.map(service => (
                  <div key={service.id} className={styles.summaryItem}>
                    <div>
                      <span className={styles.serviceIcon}>{service.icon}</span>
                      <span>{service.name}</span>
                    </div>
                    <span>${service.price}</span>
                  </div>
                ))}
                <div className={styles.customerSummary}>
                  <h3>Contact Information</h3>
                  <p>Email: {customerInfo.email}</p>
                  <p>Address: {customerInfo.address}</p>
                  <p>Preferred Date: {new Date(customerInfo.date).toLocaleDateString()}</p>
                  <p>Preferred Time: {customerInfo.time}</p>
                  {customerInfo.phone && <p>Phone: {customerInfo.phone}</p>}
                </div>
                <div className={styles.totalPrice}>
                  Total: ${totalPrice}
                </div>
                <button 
                  className={styles.bookButton}
                  onClick={handleBookingSubmit}
                >
                  Schedule Service
                </button>
                <p className={styles.bookingNote}>Please wait a moment while your booking is being confirmed</p>
              </div>
            )}
          </div>

          <div className={styles.navigation}>
            {currentStep > 1 && (
              <button onClick={() => {
                setCurrentStep(prev => prev - 1);
                updateProgress(currentStep - 1);
              }}>
                Previous
              </button>
            )}
            {currentStep < 4 && (
              <button onClick={handleNext}>
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}









