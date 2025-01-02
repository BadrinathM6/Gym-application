import React, { useState, useEffect, useRef } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isBefore,
  isAfter,
  addMonths,
  subMonths,
  parseISO,
} from "date-fns";
import { BicepsFlexed, Snowflake, ChevronLeft, ChevronRight } from "lucide-react";
import axiosInstance from "./utils/axiosInstance";

const WorkoutCalendar = () => {
  const [calendarData, setCalendarData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [userCreationDate, setUserCreationDate] = useState(null);
  const calendarRef = useRef(null);
  const today = new Date();

  useEffect(() => {
    fetchCalendarData();
  }, [currentDate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setSelectedDate(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchCalendarData = async () => {
    try {
      const response = await axiosInstance.get(
        `/calender/?date=${format(currentDate, "yyyy-MM")}`
      );
      setCalendarData(response.data.calendar_data);
      setUserCreationDate(parseISO(response.data.user_creation_date));
    } catch (error) {
      console.error("Error fetching calendar data:", error);
    }
  };

  const getDaysInMonth = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  };

  const handlePrevMonth = () => {
    setCurrentDate((prev) => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    const nextMonth = addMonths(currentDate, 1);
    if (isBefore(nextMonth, addMonths(today, 1))) {
      setCurrentDate(nextMonth);
    }
  };

  const handleDateClick = (date, status) => {
    if (status) {
      setSelectedDate(isSameDay(selectedDate, date) ? null : date);
    }
  };

  const getDateStatus = (date) => {
    if (!userCreationDate || isBefore(date, userCreationDate)) {
      return null;
    }
    const dayData = calendarData.find((d) => isSameDay(new Date(d.date), date));
    return dayData || { calories_burned: 0 };
  };

  const shouldShowStatus = (date) => {
    return (
      userCreationDate &&
      !isBefore(date, userCreationDate) &&
      (isBefore(date, today) || isSameDay(date, today))
    );
  };

  return (
    <div ref={calendarRef} className="max-w-3xl mx-auto p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-indigo-100 text-indigo-600 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <h2 className="text-xl font-semibold text-center text-indigo-900">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        
        <button 
          onClick={handleNextMonth}
          className={`p-2 rounded-full hover:bg-indigo-100 transition-colors
            ${isAfter(addMonths(currentDate, 1), addMonths(today, 1)) 
              ? 'text-gray-300 cursor-not-allowed' 
              : 'text-indigo-600'}`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-semibold p-2 text-indigo-800">{day}</div>
        ))}
        
        {getDaysInMonth().map((date) => {
          const status = getDateStatus(date);
          const isToday = isSameDay(date, today);
          const isPastOrToday = shouldShowStatus(date);
          const isFutureDate = isAfter(date, today);
          const isBeforeCreation = userCreationDate && isBefore(date, userCreationDate);
          const isSelected = selectedDate && isSameDay(selectedDate, date);
          
          return (
            <div
              key={date.toString()}
              onClick={() => !isBeforeCreation && handleDateClick(date, status)}
              className={`
                group relative flex flex-col items-center justify-between
                min-h-[4rem] p-2 rounded-lg transition-all duration-200
                ${isPastOrToday ? 'cursor-pointer' : 'cursor-default'}
                ${isToday ? 'bg-indigo-200 font-bold text-indigo-900' : 'bg-white'}
                ${isFutureDate ? 'text-gray-400' : 'text-indigo-900'}
                ${isBeforeCreation ? 'text-gray-300' : ''}
                ${isPastOrToday ? 'hover:bg-indigo-100' : ''}
                ${isSelected ? 'ring-2 ring-indigo-500 bg-indigo-50' : ''}
                shadow-sm
              `}
            >
              <span className="text-sm">{format(date, 'd')}</span>
              {isPastOrToday && status && (
                <div className="mt-1">
                  {status.calories_burned > 0 ? (
                    <BicepsFlexed className="w-4 h-4 text-amber-500 fill-orange-400" />
                  ) : (
                    <Snowflake className="w-4 h-4 text-blue-500 fill-blue-400" />
                  )}
                </div>
              )}
              
              {isPastOrToday && status && (
                <div 
                  className={`
                    absolute z-10 p-2 bg-indigo-900 text-white text-xs rounded-md 
                    -translate-x-1/2 left-1/2 top-full shadow-lg
                    hidden
                    ${isSelected ? '!block md:!hidden' : ''}
                    lg:group-hover:block
                  `}
                >
                  Calories: {status.calories_burned}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkoutCalendar;

