import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Radio, 
  Bell, 
  ArrowLeftRight, 
  ExternalLink, 
  User, 
  Languages, 
  MapPin, 
  IndianRupee, 
  AlertCircle,
  FileText,
  Clock,
  X
} from 'lucide-react';
import Terminal from '../components/Terminal';

export default function Dashboard({ dbState, isLoading, error, events, onClearEvents }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  const { users = [], signals = [], notifications = [], remittances = [] } = dbState || {};

  // Find status details for selected user
  const userNotifications = selectedUser 
    ? notifications.filter(n => n.userId === selectedUser.id)
    : [];
  const userRemittance = selectedUser
    ? remittances.find(r => r.userId === selectedUser.id)
    : null;

  const getSegmentBadge = (segment) => {
    switch (segment?.toLowerCase()) {
      case 'worker':
        return (
          <span className="inline-flex items-center rounded bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            Migrant Worker
          </span>
        );
      case 'student':
        return (
          <span className="inline-flex items-center rounded bg-purple-50 px-2 py-0.5 text-xs font-semibold text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
            Student
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-900/30 dark:text-slate-400">
            {segment}
          </span>
        );
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return (
          <span className="inline-flex items-center rounded bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
            Active
          </span>
        );
      case 'dormant':
        return (
          <span className="inline-flex items-center rounded bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
            Dormant
          </span>
        );
      case 'none':
        return (
          <span className="inline-flex items-center rounded bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            No Account
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-750 dark:bg-slate-900/30 dark:text-slate-400">
            {status}
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-sbi-blue" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-450">Loading database state...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12">
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-center dark:border-rose-900/30 dark:bg-rose-950/10">
          <AlertCircle className="mx-auto h-10 w-10 text-rose-500 dark:text-rose-450" />
          <h3 className="mt-2 text-sm font-semibold text-rose-800 dark:text-rose-400">Failed to fetch state</h3>
          <p className="mt-1 text-xs text-rose-600 dark:text-rose-405">{error.message || 'Check connection to backend'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          System Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Monitor incoming location signals, live LLM notifications, CBS accounts, and recurring remittance streams.
        </p>
      </div>

      {/* KPI Section */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1 */}
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 theme-transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Users</p>
              <h3 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{users.length}</h3>
            </div>
            <div className="rounded-md bg-slate-50 p-3 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <Users className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 theme-transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Signals Received</p>
              <h3 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{signals.length}</h3>
            </div>
            <div className="rounded-md bg-slate-50 p-3 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <Radio className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 theme-transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Outbound Alerts</p>
              <h3 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{notifications.length}</h3>
            </div>
            <div className="rounded-md bg-slate-50 p-3 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <Bell className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 theme-transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Remittances Active</p>
              <h3 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{remittances.length}</h3>
            </div>
            <div className="rounded-md bg-slate-50 p-3 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <ArrowLeftRight className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Users Table: 7 cols */}
        <div className="lg:col-span-7 flex flex-col rounded-lg border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900 theme-transition overflow-hidden">
          <div className="border-b border-slate-150 px-6 py-4 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Core Banking Accounts</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Database records of registered users and core banking profile states.</p>
          </div>
          
          <div className="flex-1 overflow-x-auto">
            {users.length === 0 ? (
              <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">No users found.</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-2xs font-semibold text-slate-500 uppercase tracking-wider dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-4 py-3">Segment</th>
                    <th className="px-4 py-3">Cities (Home ➡️ Current)</th>
                    <th className="px-4 py-3">Account Status</th>
                    <th className="px-4 py-3 text-right">Balance</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      {/* Customer Name and phone */}
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900 dark:text-white">{user.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-450">{user.phone}</div>
                      </td>
                      {/* Segment */}
                      <td className="px-4 py-4">{getSegmentBadge(user.segment)}</td>
                      {/* Home -> Current City */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                          <span className="font-medium">{user.homeCity}</span>
                          <span className="text-slate-400">➡️</span>
                          <span className={user.homeCity !== user.currentCity ? 'font-bold text-sbi-blue dark:text-blue-400' : ''}>
                            {user.currentCity}
                          </span>
                        </div>
                      </td>
                      {/* Account status */}
                      <td className="px-4 py-4">{getStatusBadge(user.accountStatus)}</td>
                      {/* Balance */}
                      <td className="px-4 py-4 text-right font-mono font-medium text-slate-900 dark:text-white">
                        ₹{user.balance?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      {/* Action */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="inline-flex items-center gap-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 px-2 py-1 text-xs font-semibold dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-350 dark:border-slate-700 transition-colors cursor-pointer"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Live SSE Terminal: 5 cols */}
        <div className="lg:col-span-5 h-[500px]">
          <Terminal events={events} onClear={onClearEvents} />
        </div>
      </div>

      {/* Profile Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-lg border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden theme-transition">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-150 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/50">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                <User className="h-5 w-5 text-sbi-blue dark:text-blue-400" />
                <h3 className="font-bold text-lg">Customer Profile Details</h3>
              </div>
              <button 
                onClick={() => setSelectedUser(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-650 dark:hover:bg-slate-850 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              
              {/* Core Details Grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-100 p-4 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/20">
                  <span className="text-3xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</span>
                  <div className="mt-1 font-bold text-slate-900 dark:text-white">{selectedUser.name}</div>
                </div>

                <div className="rounded-lg border border-slate-100 p-4 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/20">
                  <span className="text-3xs font-semibold text-slate-400 uppercase tracking-wider">Mobile Number</span>
                  <div className="mt-1 font-mono font-semibold text-slate-900 dark:text-white">{selectedUser.phone}</div>
                </div>

                <div className="rounded-lg border border-slate-100 p-4 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/20">
                  <span className="text-3xs font-semibold text-slate-400 uppercase tracking-wider">Aadhaar Number</span>
                  <div className="mt-1 font-mono font-medium text-slate-900 dark:text-white">
                    {selectedUser.aadhaar ? `xxxx-xxxx-${selectedUser.aadhaar.slice(-4)}` : 'N/A'}
                  </div>
                </div>

                <div className="rounded-lg border border-slate-100 p-4 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/20">
                  <span className="text-3xs font-semibold text-slate-400 uppercase tracking-wider">Preferred Language</span>
                  <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-800 dark:text-slate-200">
                    <Languages className="h-4 w-4 text-slate-400" />
                    {selectedUser.preferredLanguage || 'N/A'}
                  </div>
                </div>

                <div className="rounded-lg border border-slate-100 p-4 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/20 sm:col-span-2">
                  <span className="text-3xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Geolocation Cities
                  </span>
                  <div className="mt-1.5 flex items-center gap-3 text-sm">
                    <div>
                      <span className="text-xs text-slate-450 dark:text-slate-400 mr-1">Home:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedUser.homeCity}</span>
                    </div>
                    <span className="text-slate-300 dark:text-slate-700">|</span>
                    <div>
                      <span className="text-xs text-slate-450 dark:text-slate-400 mr-1">Current Location:</span>
                      <span className="font-semibold text-sbi-blue dark:text-blue-400">{selectedUser.currentCity}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Balance Card */}
              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                <div>
                  <span className="text-3xs font-semibold text-slate-400 uppercase tracking-wider">Account Status & Balance</span>
                  <div className="mt-1.5 flex items-center gap-2">
                    {getStatusBadge(selectedUser.accountStatus)}
                    {selectedUser.segment && getSegmentBadge(selectedUser.segment)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xs font-semibold text-slate-400 uppercase tracking-wider">Available Balance</div>
                  <div className="mt-0.5 flex items-center justify-end font-mono text-xl font-bold text-slate-905 dark:text-white">
                    <IndianRupee className="h-4.5 w-4.5 text-slate-500" />
                    {selectedUser.balance?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              {/* Remittance Info */}
              <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Active Remittance Schedule</h4>
                {userRemittance ? (
                  <div className="grid gap-3 sm:grid-cols-3 text-sm">
                    <div className="rounded border border-slate-100 p-2.5 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-900/10">
                      <span className="text-3xs font-semibold text-slate-450 uppercase block mb-0.5">Beneficiary Name</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{userRemittance.beneficiaryName}</span>
                    </div>
                    <div className="rounded border border-slate-100 p-2.5 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-900/10">
                      <span className="text-3xs font-semibold text-slate-450 uppercase block mb-0.5">Account Number</span>
                      <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{userRemittance.beneficiaryAccount}</span>
                    </div>
                    <div className="rounded border border-slate-100 p-2.5 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-900/10">
                      <span className="text-3xs font-semibold text-slate-455 uppercase block mb-0.5">Amount / Recurrence</span>
                      <span className="font-bold text-slate-900 dark:text-white flex items-center">
                        ₹{userRemittance.amount?.toLocaleString('en-IN')} <span className="text-xs font-normal text-slate-450 ml-1">({userRemittance.frequency})</span>
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-450 italic py-2">No active automated remittance schedules found for this user.</div>
                )}
              </div>

              {/* Outbox Notifications */}
              <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Alert Dispatch History (SMS / YONO Notifications)</h4>
                {userNotifications.length === 0 ? (
                  <div className="text-xs text-slate-450 italic py-2">No alerts have been dispatched to this customer.</div>
                ) : (
                  <div className="space-y-3.5 max-h-[160px] overflow-y-auto">
                    {userNotifications.map((notif, idx) => (
                      <div key={notif.id || idx} className="rounded-md border border-slate-100 bg-slate-50/40 p-3 text-xs dark:border-slate-800/60 dark:bg-slate-900/30">
                        <div className="flex items-center justify-between text-slate-500 mb-1.5 font-medium">
                          <span className="flex items-center gap-1 font-semibold text-sbi-blue dark:text-blue-400">
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                            {new Date(notif.timestamp).toLocaleString()}
                          </span>
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-2xs dark:bg-slate-800">{notif.channel || 'SMS'} • {notif.language || 'English'}</span>
                        </div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm mb-0.5">{notif.title}</div>
                        <p className="text-slate-600 dark:text-slate-350">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-slate-150 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/50">
              <button
                onClick={() => {
                  setSelectedUser(null);
                  navigate('/demo');
                }}
                className="inline-flex items-center gap-1 rounded bg-sbi-blue hover:bg-sbi-blue-hover text-white px-4 py-2 text-sm font-semibold transition-colors cursor-pointer"
              >
                <FileText className="h-4 w-4" />
                Go to Guided Demo Flow
              </button>
              <button
                onClick={() => setSelectedUser(null)}
                className="rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 text-sm font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-750 transition-colors cursor-pointer"
              >
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
