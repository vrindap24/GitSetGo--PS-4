import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, UserCheck, AlertCircle } from 'lucide-react';

const SHIFTS = [
  { id: 1, name: 'Morning Shift', time: '09:00 - 15:00', staff: 12, status: 'Full' },
  { id: 2, name: 'Evening Shift', time: '15:00 - 23:00', staff: 15, status: 'Short Staffed' },
  { id: 3, name: 'Night Shift', time: '23:00 - 05:00', staff: 8, status: 'Full' },
];

const INITIAL_REQUESTS = [
  { id: 1, name: 'Rajesh Kumar', type: 'Leave Request', date: '15 Oct', status: 'Pending' },
  { id: 2, name: 'Priya Singh', type: 'Shift Swap', date: '16 Oct', status: 'Pending' },
  { id: 3, name: 'Amit Patel', type: 'Sick Leave', date: '16 Oct', status: 'Pending' },
  { id: 4, name: 'Sneha Gupta', type: 'Shift Swap', date: '17 Oct', status: 'Pending' },
  { id: 5, name: 'Vikram Malhotra', type: 'Emergency Leave', date: '17 Oct', status: 'Pending' },
  { id: 6, name: 'Anjali Desai', type: 'Vacation', date: '18 Oct', status: 'Pending' },
  { id: 7, name: 'Rohan Mehta', type: 'Half Day', date: '18 Oct', status: 'Pending' },
];

const WEEKLY_SCHEDULE = [
  { day: 'Mon', date: 14, events: [{ label: 'Morning: Full', type: 'success' }, { label: 'Eve: Full', type: 'success' }] },
  { day: 'Tue', date: 15, events: [{ label: 'Morning: Full', type: 'success' }] },
  { day: 'Wed', date: 16, events: [{ label: 'Eve: -2 Staff', type: 'error' }] },
  { day: 'Thu', date: 17, events: [{ label: 'Morning: Full', type: 'success' }, { label: 'Eve: Full', type: 'success' }] },
  { day: 'Fri', date: 18, events: [{ label: 'Training', type: 'warning' }] },
  { day: 'Sat', date: 19, events: [{ label: 'Morning: Busy', type: 'warning' }, { label: 'Eve: Full', type: 'success' }] },
  { day: 'Sun', date: 20, events: [{ label: 'Morning: Low', type: 'neutral' }, { label: 'Eve: Full', type: 'success' }] },
];

export default function StaffManagement() {
  const [requests, setRequests] = useState(INITIAL_REQUESTS);

  const handleApprove = (id: number) => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: 'Approved' } : req
    ));
    // Optional: Show a toast or feedback
  };

  const handleDeny = (id: number) => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: 'Denied' } : req
    ));
  };

  const handleNotifyStaff = () => {
    alert("Alert sent to all staff members about the requirement of staff");
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-normal text-on-surface">Staff Management</h2>
          <p className="text-sm text-on-surface-variant">Schedule and manage your branch team</p>
        </div>
        <button className="px-4 py-2 bg-primary text-on-primary rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">
          Create Schedule
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Shift Overview */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SHIFTS.map((shift) => (
              <div key={shift.id} className="m3-card p-6 border-l-4 border-primary">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-on-surface">{shift.name}</h3>
                    <div className="flex items-center text-sm text-on-surface-variant mt-1">
                      <Clock className="w-4 h-4 mr-1" /> {shift.time}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    shift.status === 'Full' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {shift.status}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex -space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-surface-variant border-2 border-surface flex items-center justify-center text-xs font-bold text-on-surface-variant">
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-full bg-surface-variant border-2 border-surface flex items-center justify-center text-xs font-bold text-on-surface-variant">
                      +{shift.staff - 4}
                    </div>
                  </div>
                  <button className="text-sm font-medium text-primary hover:underline">Manage</button>
                </div>
              </div>
            ))}
          </div>

          <div className="m3-card p-6">
            <h3 className="text-lg font-medium text-on-surface mb-4">Weekly Schedule</h3>
            <div className="h-64 bg-surface rounded-xl border border-outline-variant/20 overflow-hidden flex flex-col">
              <div className="grid grid-cols-7 border-b border-outline-variant/20 bg-surface-variant/30">
                {WEEKLY_SCHEDULE.map(day => (
                  <div key={day.day} className="py-2 text-center text-xs font-medium text-on-surface-variant">{day.day}</div>
                ))}
              </div>
              <div className="flex-1 grid grid-cols-7">
                {WEEKLY_SCHEDULE.map((day, i) => (
                  <div key={i} className="border-r border-outline-variant/10 last:border-r-0 p-1 relative group hover:bg-surface-variant/10 transition-colors flex flex-col gap-1">
                    <span className="text-xs text-on-surface-variant p-1">{day.date}</span>
                    {day.events.map((event, j) => (
                      <div key={j} className={`p-1 rounded text-[10px] font-medium truncate ${
                        event.type === 'success' ? 'bg-primary-container text-on-primary-container' :
                        event.type === 'error' ? 'bg-error-container text-on-error-container' :
                        event.type === 'warning' ? 'bg-secondary-container text-on-secondary-container' :
                        'bg-surface-variant text-on-surface-variant'
                      }`}>
                        {event.label}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Requests & Alerts */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="m3-card p-6">
            <h3 className="text-lg font-medium text-on-surface mb-4">Pending Requests</h3>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {requests.map((req) => (
                <div key={req.id} className="p-4 bg-surface-variant/30 rounded-xl border border-outline-variant/20">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold text-on-surface">{req.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      req.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                      req.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                  <p className="text-sm text-on-surface-variant mb-3">{req.type} • {req.date}</p>
                  {req.status === 'Pending' && (
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleApprove(req.id)}
                        className="flex-1 py-1.5 bg-primary text-on-primary text-xs rounded-lg hover:bg-primary/90"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleDeny(req.id)}
                        className="flex-1 py-1.5 bg-surface-variant text-on-surface-variant text-xs rounded-lg hover:bg-surface-variant/80"
                      >
                        Deny
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="m3-card p-6 bg-error-container/20 border border-error-container">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-error" />
              <div>
                <h3 className="text-sm font-bold text-on-surface">Staff Shortage Alert</h3>
                <p className="text-xs text-on-surface-variant mt-1">
                  Tomorrow's evening shift is short by 2 servers. Consider asking for overtime volunteers.
                </p>
                <button 
                  onClick={handleNotifyStaff}
                  className="mt-3 text-xs font-bold text-error hover:underline"
                >
                  Notify Staff
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
