

import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventInput } from "@fullcalendar/core";
import axios from "axios";

interface Project {
  id: number;
  name: string;
  endDate: string;
}

const ProjectCalendar: React.FC = () => {
  // const [events, setEvents] = useState<any[]>([]);
    const [events, setEvents] = useState<EventInput[]>([]);


//   useEffect(() => {
//     const loadProjects = async () => {
//       try {
//         const res = await axios.get<Project[]>("http://localhost:5000/api/projects");
//         const projects = res.data;

//         const calendarEvents = projects.map((p) => ({
//           id: p.id.toString(),
//           title: `${p.name} (Deadline)`,
//           start: p.endDate,
//           allDay: true,
//           color: "red", // show deadline in red
//         }));

//         setEvents(calendarEvents);
//       } catch (err) {
//         console.error("Error loading projects:", err);
//       }
//     };

//     loadProjects();
//   }, []);


 useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await axios.get<Project[]>("http://localhost:5000/api/projects");
        const projects = res.data;

        const today = new Date();
        today.setHours(0, 0, 0, 0); // normalize to midnight

        // ✅ Only upcoming deadlines
        const upcoming = projects.filter((p) => {
          const end = new Date(p.endDate);
          return end >= today;
        });

        const calendarEvents = upcoming.map((p) => ({
          id: p.id.toString(),
          title: `${p.name} (Deadline)`,
          start: p.endDate,
          allDay: true,
          color: "red",
        }));

        setEvents(calendarEvents);
      } catch (err) {
        console.error("Error loading projects:", err);
      }
    };

    loadProjects();
  }, []);

  
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Project Deadlines</h2>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="auto"
      />
    </div>
  );
};

export default ProjectCalendar;
