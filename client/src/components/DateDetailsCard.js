import React, { useState, useEffect } from 'react';

import './DateDetailsCard.css';
const DateDetailsCard = ({ anniversaryDate }) => {
    const [dates, setDates] = useState({
        startDate: 'Loading...',
        endDate: 'Loading...',
        years: 0,
        months: 0,
        days: 0,
        totalDays: 0,
        totalMonths: 0,
    });

    useEffect(() => {
        const calculateDates = () => {
            const startDate = new Date(anniversaryDate);
            const endDate = new Date();
            const options = { year: 'numeric', month: 'long', day: 'numeric' };

            const diffTime = Math.abs(endDate - startDate);
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
            const diffMonths = Math.floor(diffDays / 30.436875);

            let years = endDate.getFullYear() - startDate.getFullYear();
            let months = endDate.getMonth() - startDate.getMonth();
            let days = endDate.getDate() - startDate.getDate();

            if (days < 0) {
                months--;
                const daysInPrevMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0).getDate();
                days += daysInPrevMonth;
            }

            if (months < 0) {
                years--;
                months += 12;
            }

            setDates({
                startDate: startDate.toLocaleDateString('en-US', options),
                endDate: endDate.toLocaleDateString('en-US', options),
                years,
                months,
                days,
                totalDays: diffDays,
                totalMonths: diffMonths,
            });
        };

        calculateDates();
        const intervalId = setInterval(calculateDates, 60000);

        return () => clearInterval(intervalId);
    }, [anniversaryDate]);

    return (
        <div className="card date-details-card">
            <div className="date-display-container">
                <div className="date-item"><div className="date-label">Start Date</div><div className="date-value-display">{dates.startDate}</div></div>
                <div className="date-divider" aria-hidden="true">→</div>
                <div className="date-item"><div className="date-label">Today's Date</div><div className="date-value-display">{dates.endDate}</div></div>
            </div>
            <div className="time-span">
                <div className="time-breakdown">
                    <div className="time-unit"><div className="time-value">{dates.years}</div><div className="time-label">Years</div></div>
                    <div className="time-unit"><div className="time-value">{dates.months}</div><div className="time-label">Months</div></div>
                    <div className="time-unit"><div className="time-value">{dates.days}</div><div className="time-label">Days</div></div>
                </div>
                <div className="total-container">
                    <div className="total-days">Total: {dates.totalDays.toLocaleString()} days</div>
                    <div className="total-months">Total: {dates.totalMonths} months</div>
                </div>
            </div>
        </div>
    );
};

export default DateDetailsCard;