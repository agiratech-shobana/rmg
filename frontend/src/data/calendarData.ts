// src/data/calendarData.ts
const mockData = {
    holidays: [
        { id: 1, title: 'National Holiday', date: new Date(2025, 2, 24), type: 'holiday', color: '#4caf50' },
        { id: 2, title: 'Company Day', date: new Date(2025, 2, 10), type: 'holiday', color: '#4caf50' },
    ],
    deadlines: [
        { id: 3, title: 'Client Deadline', date: new Date(2025, 2, 26), type: 'deadline', color: '#ff9800' },
        { id: 4, title: 'Bug Fixes', date: new Date(2025, 2, 5), type: 'deadline', color: '#ff9800' },
    ],
};

export default mockData;