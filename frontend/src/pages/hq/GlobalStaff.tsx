import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Star, Award, MoreHorizontal, Search, Filter } from 'lucide-react';
import { STAFF, BRANCHES } from '../../data/mockData';

export default function GlobalStaff() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');

  const getBranchName = (branchId: string) => {
    return BRANCHES.find(b => b.id === branchId)?.name || 'Unknown Branch';
  };

  const filteredStaff = STAFF.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchTerm.toLowerCase());
    // Add more filters if needed
    return matchesSearch;
  });

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-normal text-on-surface">Global Staff Directory</h2>
          <p className="text-sm text-on-surface-variant">Manage {STAFF.length} employees across {BRANCHES.length} locations</p>
        </div>

        <div className="flex w-full md:w-auto space-x-2">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              type="text"
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-surface-variant/30 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <button className="p-2 bg-surface-variant text-on-surface-variant rounded-full hover:bg-surface-variant/80 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
          <button className="px-4 py-2 bg-primary text-on-primary rounded-full text-sm font-medium hover:bg-primary/90 transition-colors whitespace-nowrap">
            Add Staff
          </button>
        </div>
      </div>

      <div className="m3-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-variant/30 border-b border-outline-variant/20">
                <th className="py-4 px-6 text-xs font-medium text-on-surface-variant uppercase tracking-wider">Employee</th>
                <th className="py-4 px-6 text-xs font-medium text-on-surface-variant uppercase tracking-wider">Role & Branch</th>
                <th className="py-4 px-6 text-xs font-medium text-on-surface-variant uppercase tracking-wider">Performance</th>
                <th className="py-4 px-6 text-xs font-medium text-on-surface-variant uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-medium text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="group hover:bg-surface-variant/10 transition-colors border-b border-outline-variant/10 last:border-0">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold">
                        {staff.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-on-surface">{staff.name}</p>
                        <p className="text-xs text-on-surface-variant">ID: #{staff.id.toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-on-surface">{staff.role}</p>
                    <p className="text-xs text-on-surface-variant">{getBranchName(staff.branchId)}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-secondary fill-secondary" />
                        <span className="text-sm font-medium text-on-surface">{(staff.credits / 250).toFixed(1)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Award className="w-4 h-4 text-tertiary" />
                        <span className="text-sm text-on-surface-variant">{staff.positiveMentions} Mentions</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${staff.rank === 1 ? 'bg-green-100 text-green-800' :
                        staff.rank === 5 ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                      }`}>
                      {staff.rank === 1 ? 'Top Performer' : 'Active'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="p-2 hover:bg-surface-variant rounded-full transition-colors">
                      <MoreHorizontal className="w-5 h-5 text-on-surface-variant" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
