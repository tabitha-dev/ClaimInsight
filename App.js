// App.js (Single File)
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Define page constants for easier navigation
const PAGES = {
  DASHBOARD: 'dashboard',
  DENIALS_ANALYSIS: 'denials_analysis',
  NEW_CLAIM_PREDICTION: 'new_claim_prediction',
  CLAIM_PREDICTION_RESULTS: 'claim_prediction_results',
  DATASETS: 'datasets',
  SETTINGS_SYSTEM_PARAMETERS: 'settings_system_parameters',
  SETTINGS_PAYER_RULES: 'settings_payer_rules',
  USER_MANAGEMENT: 'user_management',
  REPORTS: 'reports',
};

// Mock data for charts
const monthlyDenialData = [
  { name: 'Jan', 'Denial Rate': 8.5 },
  { name: 'Feb', 'Denial Rate': 8.0 },
  { name: 'Mar', 'Denial Rate': 7.8 },
  { name: 'Apr', 'Denial Rate': 7.5 },
  { name: 'May', 'Denial Rate': 7.2 },
  { name: 'Jun', 'Denial Rate': 7.0 },
  { name: 'Jul', 'Denial Rate': 6.8 },
  { name: 'Aug', 'Denial Rate': 6.5 },
  { name: 'Sep', 'Denial Rate': 6.3 },
  { name: 'Oct', 'Denial Rate': 6.0 },
  { name: 'Nov', 'Denial Rate': 5.8 },
  { name: 'Dec', 'Denial Rate': 5.5 },
];

const denialReasonData = [
  { name: 'Missing Info', denials: 250 },
  { name: 'Non-Covered', denials: 200 },
  { name: 'Auth Req', denials: 150 },
  { name: 'Incorrect Coding', denials: 100 },
  { name: 'Duplicate', denials: 50 },
  { name: 'Other', denials: 90 },
];

const agedAccountsReceivableData = [
  { name: '0-30 Days', amount: 350000 },
  { name: '31-60 Days', amount: 150000 },
  { name: '61-90 Days', amount: 80000 },
  { name: '90+ Days', amount: 45000 },
];

// Mock Payer Rules for dynamic display
const mockPayerRules = {
  'Medicare': {
    'J20.9 (Acute Bronchitis)': 'Medicare often requires detailed documentation for acute conditions to ensure medical necessity. Claims over $1000 for this code may be flagged.',
    'I10 (Essential Hypertension)': 'For chronic conditions like hypertension, ensure regular follow-up notes are included. High claim amounts without clear justification may lead to denial.',
    'default': 'Always verify patient eligibility and benefits prior to service for Medicare claims.',
  },
  'Blue Cross': {
    'J20.9 (Acute Bronchitis)': 'Blue Cross may have specific preferred providers or require referrals for certain acute care services.',
    'I10 (Essential Hypertension)': 'Prior authorization might be required for certain procedures related to hypertension management, especially for new treatments.',
    'default': 'Check for any specific Blue Cross plan exclusions or limitations for the service type.',
  },
  'United Healthcare': {
    'J20.9 (Acute Bronchitis)': 'United Healthcare often has strict timely filing limits. Ensure claims are submitted promptly.',
    'I10 (Essential Hypertension)': 'For chronic disease management, United Healthcare emphasizes coordinated care. Missing referral information can lead to denials.',
    'default': 'Review United Healthcare\'s specific coding guidelines for the procedure performed.',
  },
  'default': 'Always check the payer\'s specific guidelines and documentation requirements for the selected diagnosis and service.',
};

// Main App component
function App() {
  const [currentPage, setCurrentPage] = useState(PAGES.DASHBOARD); // Default page
  const [predictionResult, setPredictionResult] = useState(null); // State to hold prediction results

  // Function to navigate to a different page
  const navigateTo = (page, data = null) => {
    if (page === PAGES.CLAIM_PREDICTION_RESULTS) {
      setPredictionResult(data);
    }
    setCurrentPage(page);
  };

  // Header Component
  const Header = ({ navigateTo }) => {
    return (
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f2f5] px-4 sm:px-10 py-3">
        <div className="flex items-center gap-4 text-[#111418]">
          <div className="size-4">
            {/* Logo SVG - A stylized cube/box icon */}
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="currentColor"></path>
              <path fillRule="evenodd" clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="currentColor"></path>
            </svg>
          </div>
          <h2 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em]">Claim Insights</h2>
        </div>
        <div className="flex flex-1 justify-end gap-4 sm:gap-8">
          <div className="hidden sm:flex items-center gap-4 sm:gap-9">
            {/* Navigation links with onClick handlers to change the current page */}
            <a className="text-[#111418] text-sm font-medium leading-normal cursor-pointer" onClick={() => navigateTo(PAGES.DASHBOARD)}>Dashboard</a>
            <a className="text-[#111418] text-sm font-medium leading-normal cursor-pointer" onClick={() => navigateTo(PAGES.DENIALS_ANALYSIS)}>Denials Analysis</a>
            <a className="text-[#111418] text-sm font-medium leading-normal cursor-pointer" onClick={() => navigateTo(PAGES.NEW_CLAIM_PREDICTION)}>Predictions</a>
            <a className="text-[#111418] text-sm font-medium leading-normal cursor-pointer" onClick={() => navigateTo(PAGES.REPORTS)}>Reports</a>
            <a className="text-[#111418] text-sm font-medium leading-normal cursor-pointer" onClick={() => navigateTo(PAGES.SETTINGS_SYSTEM_PARAMETERS)}>Settings</a>
          </div>
          <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-[#f0f2f5] text-[#111418] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
            {/* Bell Icon for notifications */}
            <div className="text-[#111418]" data-icon="Bell" data-size="20px" data-weight="regular">
              <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"></path>
              </svg>
            </div>
          </button>
          {/* User Avatar */}
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC-ezCxkMohxJG4WBE2EOOuIkOnywvUIq3-RVtiIaplhP_fTczxXHqIHWKmCH3RSN7I0FcsY0fjQ_d3BcqKVsmrKC_MyMOfu7DhQRykVMXrJXluyBu1-bD5JLcRFK6rjj2Cn2mW73-5OFRulCw4oBK7Kd4-icyALGGS2_rm8guyH5uweGvXKwUARuBuT8hxY881MBNGOwpi-J8IV4QfpiZW5kCHrvMuftKCEsLgZsYo_o6MCsKDYXgtHhGREdvawaDQ1Y8WUNBjulQ")' }}></div>
        </div>
      </header>
    );
  };

  // Dashboard Page Component
  const DashboardPage = () => {
    return (
      <div className="px-4 sm:px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          <div className="flex flex-wrap justify-between gap-3 p-4">
            <div className="flex min-w-72 flex-col gap-3">
              <p className="text-[#111418] tracking-light text-[32px] font-bold leading-tight">Dashboard</p>
              <p className="text-[#60758a] text-sm font-normal leading-normal">Overview of claim denial trends and system performance</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 p-4">
            {/* Metric Cards */}
            <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 bg-[#f0f2f5]">
              <p className="text-[#111418] text-base font-medium leading-normal">Denial Rate</p>
              <p className="text-[#111418] tracking-light text-2xl font-bold leading-tight">8.2%</p>
              <p className="text-[#e73908] text-base font-medium leading-normal">-1.5%</p>
            </div>
            <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 bg-[#f0f2f5]">
              <p className="text-[#111418] text-base font-medium leading-normal">Revenue Lost</p>
              <p className="text-[#111418] tracking-light text-2xl font-bold leading-tight">$1.2M</p>
              <p className="text-[#078838] text-base font-medium leading-normal">+5%</p>
            </div>
            <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 bg-[#f0f2f5]">
              <p className="text-[#111418] text-base font-medium leading-normal">Claims Processed</p>
              <p className="text-[#111418] tracking-light text-2xl font-bold leading-tight">15,000</p>
              <p className="text-[#078838] text-base font-medium leading-normal">+10%</p>
            </div>
            {/* New: Revenue Recovered Metric Card */}
            <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 bg-[#f0f2f5]">
              <p className="text-[#111418] text-base font-medium leading-normal">Revenue Recovered</p>
              <p className="text-[#111418] tracking-light text-2xl font-bold leading-tight">$850K</p>
              <p className="text-[#078838] text-base font-medium leading-normal">+12%</p>
            </div>
          </div>
          <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Denial Trends</h2>
          <div className="flex flex-wrap gap-4 px-4 py-6">
            <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-lg border border-[#dbe0e6] p-6">
              <p className="text-[#111418] text-base font-medium leading-normal">Denial Rate Over Time</p>
              <p className="text-[#111418] tracking-light text-[32px] font-bold leading-tight truncate">8.2%</p>
              <div className="flex gap-1">
                <p className="text-[#60758a] text-base font-normal leading-normal">Last 12 Months</p>
                <p className="text-[#e73908] text-base font-medium leading-normal">-1.5%</p>
              </div>
              {/* Recharts Line Chart */}
              <div className="w-full h-[180px] py-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyDenialData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Denial Rate" stroke="#60758a" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-lg border border-[#dbe0e6] p-6">
              <p className="text-[#111418] text-base font-medium leading-normal">Denials by Reason</p>
              <p className="text-[#111418] tracking-light text-[32px] font-bold leading-tight truncate">15,000</p>
              <div className="flex gap-1">
                <p className="text-[#60758a] text-base font-normal leading-normal">Last Quarter</p>
                <p className="text-[#078838] text-base font-medium leading-normal">+10%</p>
              </div>
              {/* Recharts Bar Chart */}
              <div className="w-full h-[180px] py-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={denialReasonData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="denials" fill="#60758a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          {/* New: Aged Accounts Receivable Chart */}
          <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Aged Accounts Receivable</h2>
          <div className="flex flex-wrap gap-4 px-4 py-6">
            <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-lg border border-[#dbe0e6] p-6">
              <p className="text-[#111418] text-base font-medium leading-normal">Outstanding Claims by Age</p>
              <p className="text-[#111418] tracking-light text-[32px] font-bold leading-tight truncate">$625,000</p>
              <div className="flex gap-1">
                <p className="text-[#60758a] text-base font-normal leading-normal">Total Outstanding</p>
              </div>
              <div className="w-full h-[180px] py-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={agedAccountsReceivableData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    <Legend />
                    <Bar dataKey="amount" fill="#3d98f4" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Denials Analysis Page Component
  const DenialsAnalysisPage = () => {
    return (
      <div className="px-4 sm:px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          <div className="flex flex-wrap justify-between gap-3 p-4">
            <div className="flex min-w-72 flex-col gap-3">
              <p className="text-[#111418] tracking-light text-[32px] font-bold leading-tight">Denials Analysis</p>
              <p className="text-[#60758a] text-sm font-normal leading-normal">Analyze historical denial data to identify trends and patterns.</p>
            </div>
          </div>
          <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Overall Denial Trends</h2>
          <div className="flex flex-wrap gap-4 px-4 py-6">
            <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-lg border border-[#dbe0e6] p-6">
              <p className="text-[#111418] text-base font-medium leading-normal">Denial Rate Over Time</p>
              <p className="text-[#111418] tracking-light text-[32px] font-bold leading-tight truncate">12%</p>
              <div className="flex gap-1">
                <p className="text-[#60758a] text-base font-normal leading-normal">Last 12 Months</p>
                <p className="text-[#e73908] text-base font-medium leading-normal">-2%</p>
              </div>
              {/* Recharts Line Chart */}
              <div className="w-full h-[180px] py-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyDenialData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Denial Rate" stroke="#60758a" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Common Denial Reasons</h2>
          <div className="px-4 py-3 @container">
            <div className="flex overflow-hidden rounded-lg border border-[#dbe0e6] bg-white">
              <table className="flex-1">
                <thead>
                  <tr className="bg-white">
                    <th className="table-f72d3480-0abd-4ca2-a317-e2fe991c36b4-column-120 px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-medium leading-normal">
                      Denial Reason
                    </th>
                    <th className="table-f72d3480-0abd-4ca2-a317-e2fe991c36b4-column-240 px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-medium leading-normal">
                      Number of Denials
                    </th>
                    <th className="table-f72d3480-0abd-4ca2-a317-e2fe991c36b4-column-360 px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-medium leading-normal">
                      Percentage
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-t-[#dbe0e6]">
                    <td className="table-f72d3480-0abd-4ca2-a317-e2fe991c36b4-column-120 h-[72px] px-4 py-2 w-[400px] text-[#111418] text-sm font-normal leading-normal">
                      Missing Information
                    </td>
                    <td className="table-f72d3480-0abd-4ca2-a317-e2fe991c36b4-column-240 h-[72px] px-4 py-2 w-[400px] text-[#60758a] text-sm font-normal leading-normal">250</td>
                    <td className="table-f72d3480-0abd-4ca2-a317-e2fe991c36b4-column-360 h-[72px] px-4 py-2 w-[400px] text-[#60758a] text-sm font-normal leading-normal">30%</td>
                  </tr>
                  <tr className="border-t border-t-[#dbe0e6]">
                    <td className="table-f72d3480-0abd-4ca2-a317-e2fe991c36b4-column-120 h-[72px] px-4 py-2 w-[400px] text-[#111418] text-sm font-normal leading-normal">
                      Non-Covered Service
                    </td>
                    <td className="table-f72d3480-0abd-4ca2-a317-e2fe991c36b4-column-240 h-[72px] px-4 py-2 w-[400px] text-[#60758a] text-sm font-normal leading-normal">200</td>
                    <td className="table-f72d3480-0abd-4ca2-a317-e2fe991c36b4-column-360 h-[72px] px-4 py-2 w-[400px] text-[#60758a] text-sm font-normal leading-normal">24%</td>
                  </tr>
                  <tr className="border-t border-t-[#dbe0e6]">
                    <td className="table-f72d3480-0abd-4ca2-a317-e2fe991c36b4-column-120 h-[72px] px-4 py-2 w-[400px] text-[#111418] text-sm font-normal leading-normal">
                      Prior Authorization Required
                    </td>
                    <td className="table-f72d3480-0abd-4ca2-a317-e2fe991c36b4-column-240 h-[72px] px-4 py-2 w-[400px] text-[#60758a] text-sm font-normal leading-normal">150</td>
                    <td className="table-f72d3480-0abd-4ca2-a317-e2fe991c36b4-column-360 h-[72px] px-4 py-2 w-[400px] text-[#60758a] text-sm font-normal leading-normal">18%</td>
                  </tr>
                  <tr className="border-t border-t-[#dbe0e6]">
                    <td className="table-f72d3480-0abd-4ca2-a317-e2fe991c36b4-column-120 h-[72px] px-4 py-2 w-[400px] text-[#111418] text-sm font-normal leading-normal">
                      Incorrect Coding
                    </td>
                    <td className="table-f72d3480-0abd-4ca2-a317-e2fe991c36b4-column-240 h-[72px] px-4 py-2 w-[400px] text-[#60758a] text-sm font-normal leading-normal">100</td>
                    <td className="table-f72d3480-0abd-4ca2-a317-e2fe991c36b4-column-360 h-[72px] px-4 py-2 w-[400px] text-[#60758a] text-sm font-normal leading-normal">12%</td>
                  </tr>
                  <tr className="border-t border-t-[#dbe0e6]">
                    <td className="table-f72d3480-0abd-4ca2-a317-e2fe991c36b4-column-120 h-[72px] px-4 py-2 w-[400px] text-[#111418] text-sm font-normal leading-normal">
                      Duplicate Claim
                    </td>
                    <td className="table-f72d3480-0abd-4ca2-a317-e2fe991c36b4-column-240 h-[72px] px-4 py-2 w-[400px] text-[#60758a] text-sm font-normal leading-normal">50</td>
                    <td className="table-f72d3480-0abd-4ca2-a317-e2fe991c36b4-column-360 h-[72px] px-4 py-2 w-[400px] text-[#60758a] text-sm font-normal leading-normal">6%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* Responsive styles for table columns */}
            <style>{`
              @container(max-width:120px){.table-f72d3480-0abd-4ca2-a317-e2fe991c36b4-column-120{display: none;}}
              @container(max-width:240px){.table-f72d3480-0abd-4ca2-a317-e2fe991c36b4-column-240{display: none;}}
              @container(max-width:360px){.table-f72d3480-0abd-4ca2-a317-e2fe991c36b4-column-360{display: none;}}
            `}</style>
          </div>
          <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Payer-Specific Denial Patterns</h2>
          <div className="px-4 py-3 @container">
            <div className="flex overflow-hidden rounded-lg border border-[#dbe0e6] bg-white">
              <table className="flex-1">
                <thead>
                  <tr className="bg-white">
                    <th className="table-d467028d-2e05-494f-aad4-27b74f969ed3-column-120 px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-medium leading-normal">Payer</th>
                    <th className="table-d467028d-2e05-494f-aad4-27b74f969ed3-column-240 px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-medium leading-normal">
                      Denial Rate
                    </th>
                    <th className="table-d467028d-2e05-494f-aad4-27b74f969ed3-column-360 px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-medium leading-normal">
                      Common Reasons
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-t-[#dbe0e6]">
                    <td className="table-d467028d-2e05-494f-aad4-27b74f969ed3-column-120 h-[72px] px-4 py-2 w-[400px] text-[#111418] text-sm font-normal leading-normal">Medicare</td>
                    <td className="table-d467028d-2e05-494f-aad4-27b74f969ed3-column-240 h-[72px] px-4 py-2 w-[400px] text-[#60758a] text-sm font-normal leading-normal">15%</td>
                    <td className="table-d467028d-2e05-494f-aad4-27b74f969ed3-column-360 h-[72px] px-4 py-2 w-[400px] text-[#60758a] text-sm font-normal leading-normal">
                      Missing Information, Non-Covered Service
                    </td>
                  </tr>
                  <tr className="border-t border-t-[#dbe0e6]">
                    <td className="table-d467028d-2e05-494f-aad4-27b74f969ed3-column-120 h-[72px] px-4 py-2 w-[400px] text-[#111418] text-sm font-normal leading-normal">
                      Blue Cross
                    </td>
                    <td className="table-d467028d-2e05-494f-aad4-27b74f969ed3-column-240 h-[72px] px-4 py-2 w-[400px] text-[#60758a] text-sm font-normal leading-normal">10%</td>
                    <td className="table-d467028d-2e05-494f-aad4-27b74f969ed3-column-360 h-[72px] px-4 py-2 w-[400px] text-[#60758a] text-sm font-normal leading-normal">
                      Prior Authorization Required, Incorrect Coding
                    </td>
                  </tr>
                  <tr className="border-t border-t-[#dbe0e6]">
                    <td className="table-d467028d-2e05-494f-aad4-27b74f969ed3-column-120 h-[72px] px-4 py-2 w-[400px] text-[#111418] text-sm font-normal leading-normal">
                      United Healthcare
                    </td>
                    <td className="table-d467028d-2e05-494f-aad4-27b74f969ed3-column-240 h-[72px] px-4 py-2 w-[400px] text-[#60758a] text-sm font-normal leading-normal">8%</td>
                    <td className="table-d467028d-2e05-494f-aad4-27b74f969ed3-column-360 h-[72px] px-4 py-2 w-[400px] text-[#60758a] text-sm font-normal leading-normal">
                      Duplicate Claim, Missing Information
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* Responsive styles for table columns */}
            <style>{`
              @container(max-width:120px){.table-d467028d-2e05-494f-aad4-27b74f969ed3-column-120{display: none;}}
              @container(max-width:240px){.table-d467028d-2e05-494f-aad4-27b74f969ed3-column-240{display: none;}}
              @container(max-width:360px){.table-d467028d-2e05-494f-aad4-27b74f969ed3-column-360{display: none;}}
            `}</style>
          </div>
        </div>
      </div>
    );
  };

  // New Claim Prediction Page Component
  const NewClaimPredictionPage = ({ navigateTo }) => {
    // State variables for form inputs
    const [claimId, setClaimId] = useState('');
    const [patientId, setPatientId] = useState('');
    const [providerId, setProviderId] = useState('');
    const [serviceType, setServiceType] = useState('one');
    const [diagnosisCode, setDiagnosisCode] = useState('one');
    const [claimAmount, setClaimAmount] = useState('');
    const [insurancePlan, setInsurancePlan] = useState('one');
    const [scrubbingWarnings, setScrubbingWarnings] = useState([]);
    const [patientResponsibility, setPatientResponsibility] = useState(null);
    const [payerRuleMessage, setPayerRuleMessage] = useState('');

    // Effect to update payer rule message when insurancePlan or diagnosisCode changes
    useEffect(() => {
      const selectedPayerRules = mockPayerRules[insurancePlan] || mockPayerRules['default'];
      const message = selectedPayerRules[diagnosisCode] || selectedPayerRules['default'];
      setPayerRuleMessage(message);
    }, [insurancePlan, diagnosisCode]);


    // Simulated prediction logic
    const predictDenialRisk = (amount, diagCode) => {
      let risk = 'Low';
      let explanation = 'This claim has a low risk of denial based on historical data.';
      let recommendations = [
        'Ensure all documentation is accurate and complete.',
        'Submit the claim promptly.',
      ];

      if (amount > 1000 && diagCode === 'J20.9 (Acute Bronchitis)') {
        risk = 'Medium';
        explanation = 'The claim amount is somewhat high for this diagnosis, which could raise flags.';
        recommendations = [
          'Verify the diagnosis code and procedure code for accuracy.',
          'Review the claim amount and ensure it aligns with standard pricing.',
          'Consider adding additional supporting documentation if available.',
        ];
      }
      if (amount > 2000 && diagCode === 'I10 (Essential Hypertension)') {
        risk = 'High';
        explanation = 'This claim has a high risk of denial due to a combination of high claim amount and a diagnosis code that frequently leads to denials for this service type.';
        recommendations = [
          'Verify the diagnosis code and procedure code for accuracy.',
          'Review the claim amount and ensure it aligns with standard pricing.',
          'Consider contacting the provider to clarify any discrepancies.',
          'Prepare for potential appeals or requests for additional information.',
        ];
      }
      if (amount > 5000) {
        risk = 'High';
        explanation = 'The claim amount is significantly higher than average, which is a common flag for denials.';
        recommendations = [
          'Thoroughly review all aspects of the claim for accuracy.',
          'Gather all supporting medical records and documentation.',
          'Consider pre-authorization if not already obtained.',
        ];
      }

      return { risk, explanation, recommendations };
    };

    // Handler for the Predict Denial Risk button
    const handlePredict = () => {
      const amount = parseFloat(claimAmount);
      const diagCode = diagnosisCode;

      const { risk, explanation, recommendations } = predictDenialRisk(amount, diagCode);

      // Pass all form data and prediction results to the results page
      navigateTo(PAGES.CLAIM_PREDICTION_RESULTS, {
        claimDetails: {
          claimId,
          patientId,
          providerId,
          serviceType,
          diagnosisCode,
          claimAmount,
          insurancePlan,
          patientName: 'Sophia Clark', // Mock data
          serviceDate: '2023-10-26', // Mock data
          procedureCode: '99203', // Mock data
          status: 'Pending', // Mock data
        },
        prediction: {
          risk,
          explanation,
          recommendations,
        },
      });
    };

    // Simulate claim scrubbing
    const handleScrubClaim = () => {
      const warnings = [];
      if (!claimId) warnings.push('Claim ID is missing.');
      if (!patientId) warnings.push('Patient ID is missing.');
      if (isNaN(parseFloat(claimAmount)) || parseFloat(claimAmount) <= 0) warnings.push('Claim Amount is invalid.');
      if (serviceType === 'one') warnings.push('Service Type not selected.');
      if (diagnosisCode === 'one') warnings.push('Diagnosis Code not selected.');
      if (insurancePlan === 'one') warnings.push('Insurance Plan not selected.');

      // Add more complex simulated rules
      if (parseFloat(claimAmount) > 2000 && diagnosisCode === 'J20.9 (Acute Bronchitis)') {
        warnings.push('High claim amount for Acute Bronchitis. May require additional justification.');
      }
      if (providerId === 'PROV123' && parseFloat(claimAmount) > 1500) { // Example: specific provider high claim flag
        warnings.push('Provider PROV123 has a history of high claim denials for amounts over $1500.');
      }

      setScrubbingWarnings(warnings);
    };

    // Simulate patient financial responsibility
    const handleEstimateResponsibility = () => {
      const amount = parseFloat(claimAmount);
      if (isNaN(amount) || amount <= 0) {
        setPatientResponsibility('N/A (Invalid amount)');
        return;
      }

      let estimatedResponsibility = 0;
      // Simple mock logic:
      if (insurancePlan === 'Medicare') {
        estimatedResponsibility = amount * 0.20; // 20% co-insurance
      } else if (insurancePlan === 'Blue Cross') {
        estimatedResponsibility = Math.min(amount * 0.10, 500); // 10% co-insurance, max $500
      } else if (insurancePlan === 'United Healthcare') {
        estimatedResponsibility = 250; // Flat co-pay
      } else {
        estimatedResponsibility = amount; // No insurance or unknown
      }
      setPatientResponsibility(`$${estimatedResponsibility.toFixed(2)}`);
    };


    return (
      <div className="px-4 sm:px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col w-full sm:w-[512px] max-w-[960px] flex-1 py-5">
          <div className="flex flex-wrap justify-between gap-3 p-4">
            <p className="text-[#111418] tracking-light text-[32px] font-bold leading-tight min-w-72">New Claim Prediction</p>
          </div>
          {/* Input fields for claim details */}
          <div className="flex flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#111418] text-base font-medium leading-normal pb-2">Claim ID</p>
              <input
                placeholder="Enter Claim ID"
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus:outline-0 focus:ring-0 border-none bg-[#f0f2f5] focus:border-none h-14 placeholder:text-[#60758a] p-4 text-base font-normal leading-normal"
                value={claimId}
                onChange={(e) => setClaimId(e.target.value)}
              />
            </label>
          </div>
          <div className="flex flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#111418] text-base font-medium leading-normal pb-2">Patient ID</p>
              <input
                placeholder="Enter Patient ID"
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus:outline-0 focus:ring-0 border-none bg-[#f0f2f5] focus:border-none h-14 placeholder:text-[#60758a] p-4 text-base font-normal leading-normal"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
              />
            </label>
          </div>
          <div className="flex flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#111418] text-base font-medium leading-normal pb-2">Provider ID</p>
              <input
                placeholder="Enter Provider ID"
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus:outline-0 focus:ring-0 border-none bg-[#f0f2f5] focus:border-none h-14 placeholder:text-[#60758a] p-4 text-base font-normal leading-normal"
                value={providerId}
                onChange={(e) => setProviderId(e.target.value)}
              />
            </label>
          </div>
          <div className="flex flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#111418] text-base font-medium leading-normal pb-2">Service Type</p>
              <select
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus:outline-0 focus:ring-0 border-none bg-[#f0f2f5] focus:border-none h-14 bg-[image:var(--select-button-svg)] bg-right bg-no-repeat appearance-none pr-10 placeholder:text-[#60758a] p-4 text-base font-normal leading-normal"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
              >
                <option value="one">Select Service Type</option>
                <option value="Consultation">Consultation</option>
                <option value="Procedure">Procedure</option>
                <option value="Diagnostic Test">Diagnostic Test</option>
              </select>
            </label>
          </div>
          <div className="flex flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#111418] text-base font-medium leading-normal pb-2">Diagnosis Code</p>
              <select
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus:outline-0 focus:ring-0 border-none bg-[#f0f2f5] focus:border-none h-14 bg-[image:var(--select-button-svg)] bg-right bg-no-repeat appearance-none pr-10 placeholder:text-[#60758a] p-4 text-base font-normal leading-normal"
                value={diagnosisCode}
                onChange={(e) => setDiagnosisCode(e.target.value)}
              >
                <option value="one">Select Diagnosis Code</option>
                <option value="J20.9 (Acute Bronchitis)">J20.9 (Acute Bronchitis)</option>
                <option value="I10 (Essential Hypertension)">I10 (Essential Hypertension)</option>
                <option value="E11.9 (Type 2 Diabetes)">E11.9 (Type 2 Diabetes)</option>
              </select>
            </label>
          </div>
          {payerRuleMessage && diagnosisCode !== 'one' && insurancePlan !== 'one' && (
            <div className="text-[#60758a] text-sm font-normal leading-normal px-4 py-2 bg-[#e0e6ed] rounded-lg mx-4">
              **Payer Rule Hint:** {payerRuleMessage}
            </div>
          )}
          <div className="flex flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#111418] text-base font-medium leading-normal pb-2">Claim Amount</p>
              <input
                placeholder="Enter Claim Amount"
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus:outline-0 focus:ring-0 border-none bg-[#f0f2f5] focus:border-none h-14 placeholder:text-[#60758a] p-4 text-base font-normal leading-normal"
                value={claimAmount}
                onChange={(e) => setClaimAmount(e.target.value)}
              />
            </label>
          </div>
          <div className="flex flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#111418] text-base font-medium leading-normal pb-2">Insurance Plan</p>
              <select
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus:outline-0 focus:ring-0 border-none bg-[#f0f2f5] focus:border-none h-14 bg-[image:var(--select-button-svg)] bg-right bg-no-repeat appearance-none pr-10 placeholder:text-[#60758a] p-4 text-base font-normal leading-normal"
                value={insurancePlan}
                onChange={(e) => setInsurancePlan(e.target.value)}
              >
                <option value="one">Select Insurance Plan</option>
                <option value="Medicare">Medicare</option>
                <option value="Blue Cross">Blue Cross</option>
                <option value="United Healthcare">United Healthcare</option>
              </select>
            </label>
          </div>
          {/* New: Patient Financial Responsibility Estimation */}
          <div className="flex px-4 py-3 justify-start gap-4">
            <button
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#e0e6ed] text-[#111418] text-sm font-bold leading-normal tracking-[0.015em]"
              onClick={handleEstimateResponsibility}
            >
              <span className="truncate">Estimate Patient Responsibility</span>
            </button>
            {patientResponsibility && (
              <p className="text-[#111418] text-base font-medium leading-normal py-2">
                Estimated: <span className="font-bold">{patientResponsibility}</span>
              </p>
            )}
          </div>
          {/* New: Simulate Claim Scrubbing Button */}
          <div className="flex px-4 py-3 justify-start">
            <button
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#e0e6ed] text-[#111418] text-sm font-bold leading-normal tracking-[0.015em]"
              onClick={handleScrubClaim}
            >
              <span className="truncate">Simulate Claim Scrubbing</span>
            </button>
          </div>
          {/* Display Scrubbing Warnings */}
          {scrubbingWarnings.length > 0 && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mx-4 my-2" role="alert">
              <strong className="font-bold">Scrubbing Warnings:</strong>
              <ul className="mt-2 list-disc list-inside">
                {scrubbingWarnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex px-4 py-3 justify-end">
            <button
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#3d98f4] text-white text-sm font-bold leading-normal tracking-[0.015em]"
              onClick={handlePredict}
            >
              <span className="truncate">Predict Denial Risk</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Claim Prediction Results Page Component
  const ClaimPredictionResultsPage = ({ predictionResult }) => {
    if (!predictionResult) {
      return (
        <div className="px-4 sm:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <p className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em] p-4">No prediction data available. Please submit a new claim prediction.</p>
          </div>
        </div>
      );
    }

    const { claimDetails, prediction } = predictionResult;

    const getRiskColor = (risk) => {
      switch (risk) {
        case 'High':
          return 'text-[#e73908]'; // Red
        case 'Medium':
          return 'text-[#f4b400]'; // Amber/Yellow
        case 'Low':
          return 'text-[#078838]'; // Green
        default:
          return 'text-[#111418]';
      }
    };

    return (
      <div className="px-4 sm:px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          <div className="flex flex-wrap justify-between gap-3 p-4">
            <div className="flex min-w-72 flex-col gap-3">
              <p className="text-[#111418] tracking-light text-[32px] font-bold leading-tight">Claim Prediction Results</p>
              <p className="text-[#60758a] text-sm font-normal leading-normal">Review the prediction for this claim and take necessary actions.</p>
            </div>
          </div>
          <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Claim Details</h2>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2">
            {/* Claim Details */}
            <div className="flex flex-col gap-1 border-t border-solid border-t-[#dbe0e6] py-4 pr-2">
              <p className="text-[#60758a] text-sm font-normal leading-normal">Claim ID</p>
              <p className="text-[#111418] text-sm font-normal leading-normal">{claimDetails.claimId}</p>
            </div>
            <div className="flex flex-col gap-1 border-t border-solid border-t-[#dbe0e6] py-4 pl-2">
              <p className="text-[#60758a] text-sm font-normal leading-normal">Patient ID</p>
              <p className="text-[#111418] text-sm font-normal leading-normal">{claimDetails.patientId}</p>
            </div>
            <div className="flex flex-col gap-1 border-t border-solid border-t-[#dbe0e6] py-4 pr-2">
              <p className="text-[#60758a] text-sm font-normal leading-normal">Provider ID</p>
              <p className="text-[#111418] text-sm font-normal leading-normal">{claimDetails.providerId}</p>
            </div>
            <div className="flex flex-col gap-1 border-t border-solid border-t-[#dbe0e6] py-4 pl-2">
              <p className="text-[#60758a] text-sm font-normal leading-normal">Service Type</p>
              <p className="text-[#111418] text-sm font-normal leading-normal">{claimDetails.serviceType}</p>
            </div>
            <div className="flex flex-col gap-1 border-t border-solid border-t-[#dbe0e6] py-4 pr-2">
              <p className="text-[#60758a] text-sm font-normal leading-normal">Claim Amount</p>
              <p className="text-[#111418] text-sm font-normal leading-normal">${claimDetails.claimAmount}</p>
            </div>
            <div className="flex flex-col gap-1 border-t border-solid border-t-[#dbe0e6] py-4 pl-2">
              <p className="text-[#60758a] text-sm font-normal leading-normal">Diagnosis Code</p>
              <p className="text-[#111418] text-sm font-normal leading-normal">{claimDetails.diagnosisCode}</p>
            </div>
            <div className="flex flex-col gap-1 border-t border-solid border-t-[#dbe0e6] py-4 pr-2">
              <p className="text-[#60758a] text-sm font-normal leading-normal">Insurance Plan</p>
              <p className="text-[#111418] text-sm font-normal leading-normal">{claimDetails.insurancePlan}</p>
            </div>
            <div className="flex flex-col gap-1 border-t border-solid border-t-[#dbe0e6] py-4 pl-2">
              <p className="text-[#60758a] text-sm font-normal leading-normal">Status</p>
              <p className="text-[#111418] text-sm font-normal leading-normal">{claimDetails.status}</p>
            </div>
          </div>
          <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Prediction Result</h2>
          <div className="flex flex-wrap gap-4 p-4">
            <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 bg-[#f0f2f5]">
              <p className="text-[#111418] text-base font-medium leading-normal">Denial Risk</p>
              <p className={`${getRiskColor(prediction.risk)} tracking-light text-2xl font-bold leading-tight`}>
                {prediction.risk}
              </p>
            </div>
          </div>
          <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Explanation</h2>
          <p className="text-[#111418] text-base font-normal leading-normal pb-3 pt-1 px-4">{prediction.explanation}</p>
          {prediction.recommendations.map((rec, index) => (
            <div key={index} className="flex items-center gap-4 bg-white px-4 min-h-14">
              <div className="text-[#111418] flex items-center justify-center rounded-lg bg-[#f0f2f5] shrink-0 size-10" data-icon="Check" data-size="24px" data-weight="regular">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
                </svg>
              </div>
              <p className="text-[#111418] text-base font-normal leading-normal flex-1 truncate">{rec}</p>
            </div>
          ))}
          <div className="flex px-4 py-3 justify-end">
            <button
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#3d98f4] text-white text-sm font-bold leading-normal tracking-[0.015em]"
              onClick={() => console.log('Submit Claim clicked')}
            >
              <span className="truncate">Submit Claim</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Datasets Page Component
  const DatasetsPage = () => {
    return (
      <div className="px-4 sm:px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          <div className="flex flex-wrap justify-between gap-3 p-4">
            <div className="flex min-w-72 flex-col gap-3">
              <p className="text-[#111418] tracking-light text-[32px] font-bold leading-tight">Datasets</p>
              <p className="text-[#60758a] text-sm font-normal leading-normal">Manage your datasets and track their processing status.</p>
            </div>
          </div>
          <h3 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Upload New Dataset</h3>
          <div className="flex flex-col p-4">
            <div className="flex flex-col items-center gap-6 rounded-lg border-2 border-dashed border-[#dbe0e6] px-6 py-14">
              <div className="flex max-w-[480px] flex-col items-center gap-2">
                <p className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em] max-w-[480px] text-center">Drag and drop or browse to upload</p>
                <p className="text-[#111418] text-sm font-normal leading-normal max-w-[480px] text-center">Supported file types: CSV, XLSX</p>
              </div>
              <button
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f2f5] text-[#111418] text-sm font-bold leading-normal tracking-[0.015em]"
                onClick={() => console.log('Browse Files clicked')}
              >
                <span className="truncate">Browse Files</span>
              </button>
            </div>
          </div>
          <h3 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Existing Datasets</h3>
          <div className="px-4 py-3 @container">
            <div className="flex overflow-hidden rounded-lg border border-[#dbe0e6] bg-white">
              <table className="flex-1">
                <thead>
                  <tr className="bg-white">
                    <th className="table-84604239-c8c2-4c5b-9a9e-9ec5d4e388c9-column-120 px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-medium leading-normal">
                      Dataset Name
                    </th>
                    <th className="table-84604239-c8c2-4c5b-9a9e-9ec5d4e388c9-column-240 px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-medium leading-normal">
                      Upload Date
                    </th>
                    <th className="table-84604239-c8c2-4c5b-9a9e-9ec5d4e388c9-column-360 px-4 py-3 text-left text-[#111418] w-60 text-sm font-medium leading-normal">Status</th>
                    <th className="table-84604239-c8c2-4c5b-9a9e-9ec5d4e388c9-column-480 px-4 py-3 text-left text-[#111418] w-60 text-[#60758a] text-sm font-medium leading-normal">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-t-[#dbe0e6]">
                    <td className="table-84604239-c8c2-4c5b-9a9e-9ec5d4e388c9-column-120 h-[72px] px-4 py-2 w-[400px] text-[#111418] text-sm font-normal leading-normal">
                      Claims Data 2023
                    </td>
                    <td className="table-84604239-c8c2-4c5b-9a9e-9ec5d4e388c9-column-240 h-[72px] px-4 py-2 w-[400px] text-[#60758a] text-sm font-normal leading-normal">
                      2023-11-15
                    </td>
                    <td className="table-84604239-c8c2-4c5b-9a9e-9ec5d4e388c9-column-360 h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                      <button
                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-[#f0f2f5] text-[#111418] text-sm font-medium leading-normal w-full"
                        onClick={() => console.log('Processed button clicked for Claims Data 2023')}
                      >
                        <span className="truncate">Processed</span>
                      </button>
                    </td>
                    <td className="table-84604239-c8c2-4c5b-9a9e-9ec5d4e388c9-column-480 h-[72px] px-4 py-2 w-60 text-[#60758a] text-sm font-bold leading-normal tracking-[0.015em]">
                      View Details
                    </td>
                  </tr>
                  <tr className="border-t border-t-[#dbe0e6]">
                    <td className="table-84604239-c8c2-4c5b-9a9e-9ec5d4e388c9-column-120 h-[72px] px-4 py-2 w-[400px] text-[#111418] text-sm font-normal leading-normal">
                      Claims Data 2022
                    </td>
                    <td className="table-84604239-c8c2-4c5b-9a9e-9ec5d4e388c9-column-240 h-[72px] px-4 py-2 w-[400px] text-[#60758a] text-sm font-normal leading-normal">
                      2023-11-10
                    </td>
                    <td className="table-84604239-c8c2-4c5b-9a9e-9ec5d4e388c9-column-360 h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                      <button
                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-[#f0f2f5] text-[#111418] text-sm font-medium leading-normal w-full"
                        onClick={() => console.log('Processing button clicked for Claims Data 2022')}
                      >
                        <span className="truncate">Processing</span>
                      </button>
                    </td>
                    <td className="table-84604239-c8c2-4c5b-9a9e-9ec5d4e388c9-column-480 h-[72px] px-4 py-2 w-60 text-[#60758a] text-sm font-bold leading-normal tracking-[0.015em]">
                      View Details
                    </td>
                  </tr>
                  <tr className="border-t border-t-[#dbe0e6]">
                    <td className="table-84604239-c8c2-4c5b-9a9e-9ec5d4e388c9-column-120 h-[72px] px-4 py-2 w-[400px] text-[#111418] text-sm font-normal leading-normal">
                      Claims Data 2021
                    </td>
                    <td className="table-84604239-c8c2-4c5b-9a9e-9ec5d4e388c9-column-240 h-[72px] px-4 py-2 w-[400px] text-[#60758a] text-sm font-normal leading-normal">
                      2023-11-05
                    </td>
                    <td className="table-84604239-c8c2-4c5b-9a9e-9ec5d4e388c9-column-360 h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                      <button
                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-[#f0f2f5] text-[#111418] text-sm font-medium leading-normal w-full"
                        onClick={() => console.log('Failed button clicked for Claims Data 2021')}
                      >
                        <span className="truncate">Failed</span>
                      </button>
                    </td>
                    <td className="table-84604239-c8c2-4c5b-9a9e-9ec5d4e388c9-column-480 h-[72px] px-4 py-2 w-60 text-[#60758a] text-sm font-bold leading-normal tracking-[0.015em]">
                      View Details
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* Responsive styles for table columns */}
            <style>{`
              @container(max-width:120px){.table-84604239-c8c2-4c5b-9a9e-9ec5d4e388c9-column-120{display: none;}}
              @container(max-width:240px){.table-84604239-c8c2-4c5b-9a9e-9ec5d4e388c9-column-240{display: none;}}
              @container(max-width:360px){.table-84604239-c8c2-4c5b-9a9e-9ec5d4e388c9-column-360{display: none;}}
              @container(max-width:480px){.table-84604239-c8c2-4c5b-9a9e-9ec5d4e388c9-column-480{display: none;}}
            `}</style>
          </div>
        </div>
      </div>
    );
  };

  // Settings System Parameters Page Component
  const SettingsSystemParametersPage = ({ navigateTo }) => {
    // State variables for form inputs
    const [denialThreshold, setDenialThreshold] = useState('');
    const [predictionModelVersion, setPredictionModelVersion] = useState('');
    const [dataSource, setDataSource] = useState('');

    // Handler for Update Parameters button
    const handleUpdateParameters = () => {
      console.log({ denialThreshold, predictionModelVersion, dataSource });
    };

    return (
      <div className="px-4 sm:px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          <div className="flex flex-wrap justify-between gap-3 p-4">
            <div className="flex min-w-72 flex-col gap-3">
              <p className="text-[#111418] tracking-light text-[32px] font-bold leading-tight">Settings</p>
            </div>
          </div>
          <div className="pb-3">
            <div className="flex border-b border-[#dbe0e6] px-4 gap-8">
              <a className="flex flex-col items-center justify-center border-b-[3px] border-b-[#111418] text-[#111418] pb-[13px] pt-4 cursor-pointer" onClick={() => navigateTo(PAGES.SETTINGS_SYSTEM_PARAMETERS)}>
                <p className="text-[#111418] text-sm font-bold leading-normal tracking-[0.015em]">System Parameters</p>
              </a>
              <a className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#60758a] pb-[13px] pt-4 cursor-pointer" onClick={() => navigateTo(PAGES.SETTINGS_PAYER_RULES)}>
                <p className="text-[#60758a] text-sm font-bold leading-normal tracking-[0.015em]">Payer Rules</p>
              </a>
              <a className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#60758a] pb-[13px] pt-4 cursor-pointer" onClick={() => navigateTo(PAGES.USER_MANAGEMENT)}>
                <p className="text-[#60758a] text-sm font-bold leading-normal tracking-[0.015em]">Account</p>
              </a>
            </div>
          </div>
          <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">System Parameters</h2>
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#111418] text-base font-medium leading-normal pb-2">Denial Threshold</p>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus:outline-0 focus:ring-0 border border-[#dbe0e6] bg-white focus:border-[#dbe0e6] h-14 placeholder:text-[#60758a] p-[15px] text-base font-normal leading-normal"
                value={denialThreshold}
                onChange={(e) => setDenialThreshold(e.target.value)}
              />
            </label>
          </div>
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#111418] text-base font-medium leading-normal pb-2">Prediction Model Version</p>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus:outline-0 focus:ring-0 border border-[#dbe0e6] bg-white focus:border-[#dbe0e6] h-14 placeholder:text-[#60758a] p-[15px] text-base font-normal leading-normal"
                value={predictionModelVersion}
                onChange={(e) => setPredictionModelVersion(e.target.value)}
              />
            </label>
          </div>
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#111418] text-base font-medium leading-normal pb-2">Data Source</p>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus:outline-0 focus:ring-0 border border-[#dbe0e6] bg-white focus:border-[#dbe0e6] h-14 placeholder:text-[#60758a] p-[15px] text-base font-normal leading-normal"
                value={dataSource}
                onChange={(e) => setDataSource(e.target.value)}
              />
            </label>
          </div>
          <div className="flex px-4 py-3 justify-start">
            <button
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#3d98f4] text-white text-sm font-bold leading-normal tracking-[0.015em]"
              onClick={handleUpdateParameters}
            >
              <span className="truncate">Update Parameters</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Settings Payer Rules Page Component
  const SettingsPayerRulesPage = ({ navigateTo }) => {
    // State variables for filter inputs
    const [payerFilter, setPayerFilter] = useState('one');
    const [serviceFilter, setServiceFilter] = useState('one');
    const [denialReasonFilter, setDenialReasonFilter] = useState('one');
    const [statusFilter, setStatusFilter] = useState('one');

    // Handler for Apply Filters button
    const handleApplyFilters = () => {
      console.log({ payerFilter, serviceFilter, denialReasonFilter, statusFilter });
    };

    return (
      <div className="px-4 sm:px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          <div className="flex flex-wrap justify-between gap-3 p-4">
            <div className="flex min-w-72 flex-col gap-3">
              <p className="text-[#121417] tracking-light text-[32px] font-bold leading-tight">Payer Rules &amp; Guidelines</p>
              <button
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#f1f2f4] text-[#121417] text-sm font-medium leading-normal"
                onClick={() => console.log('Add New Rule clicked')}
              >
                <span className="truncate">Add New Rule</span>
              </button>
            </div>
          </div>
          <div className="pb-3">
            <div className="flex border-b border-[#dbe0e6] px-4 gap-8">
              <a className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#60758a] pb-[13px] pt-4 cursor-pointer" onClick={() => navigateTo(PAGES.SETTINGS_SYSTEM_PARAMETERS)}>
                <p className="text-[#60758a] text-sm font-bold leading-normal tracking-[0.015em]">System Parameters</p>
              </a>
              <a className="flex flex-col items-center justify-center border-b-[3px] border-b-[#111418] text-[#111418] pb-[13px] pt-4 cursor-pointer" onClick={() => navigateTo(PAGES.SETTINGS_PAYER_RULES)}>
                <p className="text-[#111418] text-sm font-bold leading-normal tracking-[0.015em]">Payer Rules</p>
              </a>
              <a className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#60758a] pb-[13px] pt-4 cursor-pointer" onClick={() => navigateTo(PAGES.USER_MANAGEMENT)}>
                <p className="text-[#60758a] text-sm font-bold leading-normal tracking-[0.015em]">Account</p>
              </a>
            </div>
          </div>
          <h3 className="text-[#121417] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Filter by</h3>
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <select
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121417] focus:outline-0 focus:ring-0 border border-[#dde0e4] bg-white focus:border-[#dde0e4] h-14 bg-[image:var(--select-button-svg)] bg-right bg-no-repeat appearance-none pr-10 placeholder:text-[#677583] p-[15px] text-base font-normal leading-normal"
                value={payerFilter}
                onChange={(e) => setPayerFilter(e.target.value)}
              >
                <option value="one">Payer</option>
                <option value="two">Payer A</option>
                <option value="three">Payer B</option>
                <option value="four">Payer C</option>
              </select>
            </label>
          </div>
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <select
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121417] focus:outline-0 focus:ring-0 border border-[#dde0e4] bg-white focus:border-[#dde0e4] h-14 bg-[image:var(--select-button-svg)] bg-right bg-no-repeat appearance-none pr-10 placeholder:text-[#677583] p-[15px] text-base font-normal leading-normal"
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
              >
                <option value="one">Service</option>
                <option value="two">Inpatient Care</option>
                <option value="three">Outpatient Surgery</option>
                <option value="four">Diagnostic Testing</option>
              </select>
            </label>
          </div>
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#121417] text-base font-medium leading-normal pb-2">Denial Reason</p>
              <select
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121417] focus:outline-0 focus:ring-0 border border-[#dde0e4] bg-white focus:border-[#dde0e4] h-14 bg-[image:var(--select-button-svg)] bg-right bg-no-repeat appearance-none pr-10 placeholder:text-[#677583] p-[15px] text-base font-normal leading-normal"
                value={denialReasonFilter}
                onChange={(e) => setDenialReasonFilter(e.target.value)}
              >
                <option value="one">Denial Reason</option>
                <option value="two">Lack of Medical Necessity</option>
                <option value="three">Incorrect Coding</option>
                <option value="four">Insufficient Documentation</option>
              </select>
            </label>
          </div>
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#121417] text-base font-medium leading-normal pb-2">Status</p>
              <select
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121417] focus:outline-0 focus:ring-0 border border-[#dde0e4] bg-white focus:border-[#dde0e4] h-14 bg-[image:var(--select-button-svg)] bg-right bg-no-repeat appearance-none pr-10 placeholder:text-[#677583] p-[15px] text-base font-normal leading-normal"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="one">Status</option>
                <option value="two">Active</option>
                <option value="three">Inactive</option>
              </select>
            </label>
          </div>
          <div className="flex px-4 py-3 justify-end">
            <button
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#d2e2f3] text-[#121417] text-sm font-bold leading-normal tracking-[0.015em]"
              onClick={handleApplyFilters}
            >
              <span className="truncate">Apply Filters</span>
            </button>
          </div>
          <div className="px-4 py-3 @container">
            <div className="flex overflow-hidden rounded-xl border border-[#dde0e4] bg-white">
              <table className="flex-1">
                <thead>
                  <tr className="bg-white">
                    <th className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-120 px-4 py-3 text-left text-[#121417] w-[400px] text-sm font-medium leading-normal">Payer</th>
                    <th className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-240 h-[72px] px-4 py-2 w-[400px] text-[#121417] text-sm font-normal leading-normal">Service</th>
                    <th className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-360 px-4 py-3 text-left text-[#121417] w-[400px] text-sm font-medium leading-normal">
                      Denial Reason
                    </th>
                    <th className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-480 px-4 py-3 text-left text-[#121417] w-[400px] text-sm font-medium leading-normal">
                      Rule Description
                    </th>
                    <th className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-600 h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">Status</th>
                    <th className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-720 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">
                      Last Updated
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-t-[#dde0e4]">
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-120 h-[72px] px-4 py-2 w-[400px] text-[#121417] text-sm font-normal leading-normal">Payer A</td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-240 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">
                      Inpatient Care
                    </td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-360 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">
                      Lack of Medical Necessity
                    </td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-480 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">
                      Rule 1: Inpatient care requires prior authorization and must be deemed medically necessary by the payer's review team.
                    </td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-600 h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                      <button
                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#f1f2f4] text-[#121417] text-sm font-medium leading-normal w-full"
                        onClick={() => console.log('Active button clicked for Payer A')}
                      >
                        <span className="truncate">Active</span>
                      </button>
                    </td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-720 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">
                      2023-08-15
                    </td>
                  </tr>
                  <tr className="border-t border-t-[#dde0e4]">
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-120 h-[72px] px-4 py-2 w-[400px] text-[#121417] text-sm font-normal leading-normal">Payer B</td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-240 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">
                      Outpatient Surgery
                    </td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-360 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">
                      Incorrect Coding
                    </td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-480 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">
                      Rule 2: Outpatient surgical procedures must be coded accurately using the latest ICD and CPT codes.
                    </td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-600 h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                      <button
                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#f1f2f4] text-[#121417] text-sm font-medium leading-normal w-full"
                        onClick={() => console.log('Active button clicked for Payer B')}
                      >
                        <span className="truncate">Active</span>
                      </button>
                    </td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-720 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">
                      2023-07-22
                    </td>
                  </tr>
                  <tr className="border-t border-t-[#dde0e4]">
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-120 h-[72px] px-4 py-2 w-[400px] text-[#121417] text-sm font-normal leading-normal">Payer C</td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-240 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">
                      Diagnostic Testing
                    </td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-360 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">
                      Insufficient Documentation
                    </td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-480 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">
                      Rule 3: Diagnostic tests require complete and accurate documentation, including physician orders and test results.
                    </td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-600 h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                      <button
                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#f1f2f4] text-[#121417] text-sm font-medium leading-normal w-full"
                        onClick={() => console.log('Active button clicked for Payer C')}
                      >
                        <span className="truncate">Active</span>
                      </button>
                    </td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-720 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">
                      2023-09-01
                    </td>
                  </tr>
                  <tr className="border-t border-t-[#dde0e4]">
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-120 h-[72px] px-4 py-2 w-[400px] text-[#121417] text-sm font-normal leading-normal">Payer A</td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-240 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">
                      Physical Therapy
                    </td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-360 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">
                      Exceeded Benefit Limits
                    </td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-480 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">
                      Rule 4: Physical therapy services are subject to annual benefit limits, which may vary based on the member's plan.
                    </td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-600 h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                      <button
                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#f1f2f4] text-[#121417] text-sm font-medium leading-normal w-full"
                        onClick={() => console.log('Inactive button clicked for Payer A')}
                      >
                        <span className="truncate">Inactive</span>
                      </button>
                    </td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-720 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">
                      2023-06-10
                    </td>
                  </tr>
                  <tr className="border-t border-t-[#dde0e4]">
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-120 h-[72px] px-4 py-2 w-[400px] text-[#121417] text-sm font-normal leading-normal">Payer B</td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-240 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">
                      Mental Health Services
                    </td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-360 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">
                      Non-Covered Service
                    </td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-480 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">
                      Rule 5: Prescription medications must be on the payer's formulary to be covered at the lowest cost-sharing level.
                    </td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-600 h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                      <button
                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#f1f2f4] text-[#121417] text-sm font-medium leading-normal w-full"
                        onClick={() => console.log('Active button clicked for Payer B')}
                      >
                        <span className="truncate">Active</span>
                      </button>
                    </td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-720 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">
                      2023-08-29
                    </td>
                  </tr>
                  <tr className="border-t border-t-[#dde0e4]">
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-120 h-[72px] px-4 py-2 w-[400px] text-[#121417] text-sm font-normal leading-normal">Payer C</td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-240 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">
                      Emergency Room Visits
                    </td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-360 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">
                      Inappropriate Use of ER
                    </td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-480 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">
                      Rule 6: Emergency room visits for non-emergency conditions may be subject to higher cost-sharing or denial.
                    </td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-600 h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                      <button
                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#f1f2f4] text-[#121417] text-sm font-medium leading-normal w-full"
                        onClick={() => console.log('Active button clicked for Payer C')}
                      >
                        <span className="truncate">Active</span>
                      </button>
                    </td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-720 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">
                      2023-07-05
                    </td>
                  </tr>
                  <tr className="border-t border-t-[#dde0e4]">
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-120 h-[72px] px-4 py-2 w-[400px] text-[#121417] text-sm font-normal leading-normal">Payer A</td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-240 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">
                      Specialist Consultations
                    </td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-360 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">
                      Lack of Referral
                    </td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-480 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">
                      Rule 7: Specialist consultations often require a referral from a primary care physician.
                    </td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-600 h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                      <button
                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#f1f2f4] text-[#121417] text-sm font-medium leading-normal w-full"
                        onClick={() => console.log('Active button clicked for Payer A')}
                      >
                        <span className="truncate">Active</span>
                      </button>
                    </td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-720 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">
                      2023-09-12
                    </td>
                  </tr>
                  <tr className="border-t border-t-[#dde0e4]">
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-120 h-[72px] px-4 py-2 w-[400px] text-[#121417] text-sm font-normal leading-normal">Payer B</td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-240 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">
                      Prescription Medications
                    </td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-360 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">
                      Non-Formulary Drug
                    </td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-480 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">
                      Rule 8: Prescription medications must be on the payer's formulary to be covered at the lowest cost-sharing level.
                    </td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-600 h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                      <button
                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#f1f2f4] text-[#121417] text-sm font-medium leading-normal w-full"
                        onClick={() => console.log('Active button clicked for Payer B')}
                      >
                        <span className="truncate">Active</span>
                      </button>
                    </td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-720 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">
                      2023-06-28
                    </td>
                  </tr>
                  <tr className="border-t border-t-[#dde0e4]">
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-120 h-[72px] px-4 py-2 w-[400px] text-[#121417] text-sm font-normal leading-normal">Payer C</td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-240 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">
                      Durable Medical Equipment
                    </td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-360 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">
                      Prior Authorization Required
                    </td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-480 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">
                      Rule 9: Durable medical equipment requires prior authorization and may be subject to medical necessity review.
                    </td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-600 h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                      <button
                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#f1f2f4] text-[#121417] text-sm font-medium leading-normal w-full"
                        onClick={() => console.log('Active button clicked for Payer C')}
                      >
                        <span className="truncate">Active</span>
                      </button>
                    </td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-720 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">
                      2023-08-03
                    </td>
                  </tr>
                  <tr className="border-t border-t-[#dde0e4]">
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-120 h-[72px] px-4 py-2 w-[400px] text-[#121417] text-sm font-normal leading-normal">Payer A</td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-240 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">
                      Preventive Care
                    </td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-360 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">
                      Frequency Limits
                    </td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-480 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">
                      Rule 10: Preventive care services, such as annual check-ups, have frequency limits based on age and gender.
                    </td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-600 h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                      <button
                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#f1f2f4] text-[#121417] text-sm font-medium leading-normal w-full"
                        onClick={() => console.log('Active button clicked for Payer A')}
                      >
                        <span className="truncate">Active</span>
                      </button>
                    </td>
                    <td className="table-783b51e4-d627-4da2-9a34-bef2556d717a-column-720 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">
                      2023-07-19
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* Responsive styles for table columns */}
            <style>{`
              @container(max-width:120px){.table-783b51e4-d627-4da2-9a34-bef2556d717a-column-120{display: none;}}
              @container(max-width:240px){.table-783b51e4-d627-4da2-9a34-bef2556d717a-column-240{display: none;}}
              @container(max-width:360px){.table-783b51e4-d627-4da2-9a34-bef2556d717a-column-360{display: none;}}
              @container(max-width:480px){.table-783b51e4-d627-4da2-9a34-bef2556d717a-column-480{display: none;}}
              @container(max-width:600px){.table-783b51e4-d627-4da2-9a34-bef2556d717a-column-600{display: none;}}
              @container(max-width:720px){.table-783b51e4-d627-4da2-9a34-bef2556d717a-column-720{display: none;}}
            `}</style>
          </div>
        </div>
      </div>
    );
  };

  // User Management Page Component
  const UserManagementPage = ({ navigateTo }) => {
    return (
      <div className="px-4 sm:px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          <div className="flex flex-wrap justify-between gap-3 p-4">
            <div className="flex min-w-72 flex-col gap-3">
              <p className="text-[#121417] tracking-light text-[32px] font-bold leading-tight">User Management</p>
              <p className="text-[#677583] text-sm font-normal leading-normal">Manage user roles and permissions within the system.</p>
            </div>
          </div>
          <div className="pb-3">
            <div className="flex border-b border-[#dbe0e6] px-4 gap-8">
              <a className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#60758a] pb-[13px] pt-4 cursor-pointer" onClick={() => navigateTo(PAGES.SETTINGS_SYSTEM_PARAMETERS)}>
                <p className="text-[#60758a] text-sm font-bold leading-normal tracking-[0.015em]">System Parameters</p>
              </a>
              <a className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#60758a] pb-[13px] pt-4 cursor-pointer" onClick={() => navigateTo(PAGES.SETTINGS_PAYER_RULES)}>
                <p className="text-[#60758a] text-sm font-bold leading-normal tracking-[0.015em]">Payer Rules</p>
              </a>
              <a className="flex flex-col items-center justify-center border-b-[3px] border-b-[#111418] text-[#111418] pb-[13px] pt-4 cursor-pointer" onClick={() => navigateTo(PAGES.USER_MANAGEMENT)}>
                <p className="text-[#111418] text-sm font-bold leading-normal tracking-[0.015em]">Account</p>
              </a>
            </div>
          </div>
          <h2 className="text-[#121417] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">User Roles</h2>
          <div className="px-4 py-3 @container">
            <div className="flex overflow-hidden rounded-xl border border-[#dde0e4] bg-white">
              <table className="flex-1">
                <thead>
                  <tr className="bg-white">
                    <th className="table-6d1b6f06-d4b1-409b-86e8-3e70bea90f20-column-120 px-4 py-3 text-left text-[#121417] w-[400px] text-sm font-medium leading-normal">User</th>
                    <th className="table-6d1b6f06-d4b1-409b-86e8-3e70bea90f20-column-240 h-[72px] px-4 py-2 w-[400px] text-[#121417] text-sm font-normal leading-normal">Role</th>
                    <th className="table-6d1b6f06-d4b1-409b-86e8-3e70bea90f20-column-360 px-4 py-3 text-left text-[#121417] w-60 text-sm font-medium leading-normal">Status</th>
                    <th className="table-6d1b6f06-d4b1-409b-86e8-3e70bea90f20-column-480 px-4 py-3 text-left text-[#121417] w-60 text-[#677583] text-sm font-medium leading-normal">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-t-[#dde0e4]">
                    <td className="table-6d1b6f06-d4b1-409b-86e8-3e70bea90f20-column-120 h-[72px] px-4 py-2 w-[400px] text-[#121417] text-sm font-normal leading-normal">
                      Dr. Emily Carter
                    </td>
                    <td className="table-6d1b6f06-d4b1-409b-86e8-3e70bea90f20-column-240 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">
                      Administrator
                    </td>
                    <td className="table-6d1b6f06-d4b1-409b-86e8-3e70bea90f20-column-360 h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                      <button
                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#f1f2f4] text-[#121417] text-sm font-medium leading-normal w-full"
                        onClick={() => console.log('Active button clicked for Dr. Emily Carter')}
                      >
                        <span className="truncate">Active</span>
                      </button>
                    </td>
                    <td className="table-6d1b6f06-d4b1-409b-86e8-3e70bea90f20-column-480 h-[72px] px-4 py-2 w-60 text-[#677583] text-sm font-bold leading-normal tracking-[0.015em]">
                      Edit
                    </td>
                  </tr>
                  <tr className="border-t border-t-[#dde0e4]">
                    <td className="table-6d1b6f06-d4b1-409b-86e8-3e70bea90f20-column-120 h-[72px] px-4 py-2 w-[400px] text-[#121417] text-sm font-normal leading-normal">
                      Dr. Robert Harris
                    </td>
                    <td className="table-6d1b6f06-d4b1-409b-86e8-3e70bea90f20-column-240 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">Analyst</td>
                    <td className="table-6d1b6f06-d4b1-409b-86e8-3e70bea90f20-column-360 h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                      <button
                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#f1f2f4] text-[#121417] text-sm font-medium leading-normal w-full"
                        onClick={() => console.log('Active button clicked for Dr. Robert Harris')}
                      >
                        <span className="truncate">Active</span>
                      </button>
                    </td>
                    <td className="table-6d1b6f06-d4b1-409b-86e8-3e70bea90f20-column-480 h-[72px] px-4 py-2 w-60 text-[#677583] text-sm font-bold leading-normal tracking-[0.015em]">
                      Edit
                    </td>
                  </tr>
                  <tr className="border-t border-t-[#dde0e4]">
                    <td className="table-6d1b6f06-d4b1-409b-86e8-3e70bea90f20-column-120 h-[72px] px-4 py-2 w-[400px] text-[#121417] text-sm font-normal leading-normal">
                      Dr. Olivia Bennett
                    </td>
                    <td className="table-6d1b6f06-d4b1-409b-86e8-3e70bea90f20-column-240 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">Reviewer</td>
                    <td className="table-6d1b6f06-d4b1-409b-86e8-3e70bea90f20-column-360 h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                      <button
                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#f1f2f4] text-[#121417] text-sm font-medium leading-normal w-full"
                        onClick={() => console.log('Inactive button clicked for Dr. Olivia Bennett')}
                      >
                        <span className="truncate">Inactive</span>
                      </button>
                    </td>
                    <td className="table-6d1b6f06-d4b1-409b-86e8-3e70bea90f20-column-480 h-[72px] px-4 py-2 w-60 text-[#677583] text-sm font-bold leading-normal tracking-[0.015em]">
                      Edit
                    </td>
                  </tr>
                  <tr className="border-t border-t-[#dde0e4]">
                    <td className="table-6d1b6f06-d4b1-409b-86e8-3e70bea90f20-column-120 h-[72px] px-4 py-2 w-[400px] text-[#121417] text-sm font-normal leading-normal">
                      Dr. Ethan Clark
                    </td>
                    <td className="table-6d1b6f06-d4b1-409b-86e8-3e70bea90f20-column-240 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">Analyst</td>
                    <td className="table-6d1b6f06-d4b1-409b-86e8-3e70bea90f20-column-360 h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                      <button
                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#f1f2f4] text-[#121417] text-sm font-medium leading-normal w-full"
                        onClick={() => console.log('Active button clicked for Dr. Ethan Clark')}
                      >
                        <span className="truncate">Active</span>
                      </button>
                    </td>
                    <td className="table-6d1b6f06-d4b1-409b-86e8-3e70bea90f20-column-480 h-[72px] px-4 py-2 w-60 text-[#677583] text-sm font-bold leading-normal tracking-[0.015em]">
                      Edit
                    </td>
                  </tr>
                  <tr className="border-t border-t-[#dde0e4]">
                    <td className="table-6d1b6f06-d4b1-409b-86e8-3e70bea90f20-column-120 h-[72px] px-4 py-2 w-[400px] text-[#121417] text-sm font-normal leading-normal">
                      Dr. Sophia Turner
                    </td>
                    <td className="table-6d1b6f06-d4b1-409b-86e8-3e70bea90f20-column-240 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">Reviewer</td>
                    <td className="table-6d1b6f06-d4b1-409b-86e8-3e70bea90f20-column-360 h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                      <button
                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#f1f2f4] text-[#121417] text-sm font-medium leading-normal w-full"
                        onClick={() => console.log('Active button clicked for Dr. Sophia Turner')}
                      >
                        <span className="truncate">Active</span>
                      </button>
                    </td>
                    <td className="table-6d1b6f06-d4b1-409b-86e8-3e70bea90f20-column-480 h-[72px] px-4 py-2 w-60 text-[#677583] text-sm font-bold leading-normal tracking-[0.015em]">
                      Edit
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* Responsive styles for table columns */}
            <style>{`
              @container(max-width:120px){.table-6d1b6f06-d4b1-409b-86e8-3e70bea90f20-column-120{display: none;}}
              @container(max-width:240px){.table-6d1b6f06-d4b1-409b-86e8-3e70bea90f20-column-240{display: none;}}
              @container(max-width:360px){.table-6d1b6f06-d4b1-409b-86e8-3e70bea90f20-column-360{display: none;}}
              @container(max-width:480px){.table-6d1b6f06-d4b1-409b-86e8-3e70bea90f20-column-480{display: none;}}
            `}</style>
          </div>
          <div className="flex px-4 py-3 justify-start">
            <button
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#d2e2f3] text-[#121417] text-sm font-bold leading-normal tracking-[0.015em]"
              onClick={() => console.log('Add New User clicked')}
            >
              <span className="truncate">Add New User</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Reports Page Component
  const ReportsPage = () => {
    // State variables for filter inputs
    const [reportType, setReportType] = useState('one');
    const [dateRange, setDateRange] = useState('one');
    const [denialReason, setDenialReason] = useState('one');
    const [insuranceProvider, setInsuranceProvider] = useState('one');
    const [reportFormat, setReportFormat] = useState('one');

    // Handler for Generate Report button
    const handleGenerateReport = () => {
      console.log({ reportType, dateRange, denialReason, insuranceProvider, reportFormat });
    };

    return (
      <div className="px-4 sm:px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          <div className="flex flex-wrap justify-between gap-3 p-4">
            <div className="flex min-w-72 flex-col gap-3">
              <p className="text-[#121417] tracking-light text-[32px] font-bold leading-tight">Reports</p>
              <p className="text-[#677583] text-sm font-normal leading-normal">
                Generate customized reports on denial trends, system performance, and other key metrics. Filter data and export reports in various formats.
              </p>
            </div>
          </div>
          <h2 className="text-[#121417] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Report Configuration</h2>
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#121417] text-base font-medium leading-normal pb-2">Report Type</p>
              <select
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121417] focus:outline-0 focus:ring-0 border border-[#dde0e4] bg-white focus:border-[#dde0e4] h-14 bg-[image:var(--select-button-svg)] bg-right bg-no-repeat appearance-none pr-10 placeholder:text-[#677583] p-[15px] text-base font-normal leading-normal"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="one">Denial Trends Report</option>
                <option value="two">Payer Performance Report</option>
                <option value="three">Claim Volume Report</option>
              </select>
            </label>
          </div>
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#121417] text-base font-medium leading-normal pb-2">Date Range</p>
              <select
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121417] focus:outline-0 focus:ring-0 border border-[#dde0e4] bg-white focus:border-[#dde0e4] h-14 bg-[image:var(--select-button-svg)] bg-right bg-no-repeat appearance-none pr-10 placeholder:text-[#677583] p-[15px] text-base font-normal leading-normal"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="one">Last 30 Days</option>
                <option value="two">Last Quarter</option>
                <option value="three">Last 12 Months</option>
              </select>
            </label>
          </div>
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#121417] text-base font-medium leading-normal pb-2">Denial Reason</p>
              <select
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121417] focus:outline-0 focus:ring-0 border border-[#dde0e4] bg-white focus:border-[#dde0e4] h-14 bg-[image:var(--select-button-svg)] bg-right bg-no-repeat appearance-none pr-10 placeholder:text-[#677583] p-[15px] text-base font-normal leading-normal"
                value={denialReason}
                onChange={(e) => setDenialReason(e.target.value)}
              >
                <option value="one">All Reasons</option>
                <option value="two">Missing Information</option>
                <option value="three">Incorrect Coding</option>
                <option value="four">Prior Authorization Required</option>
              </select>
            </label>
          </div>
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#121417] text-base font-medium leading-normal pb-2">Insurance Provider</p>
              <select
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121417] focus:outline-0 focus:ring-0 border border-[#dde0e4] bg-white focus:border-[#dde0e4] h-14 bg-[image:var(--select-button-svg)] bg-right bg-no-repeat appearance-none pr-10 placeholder:text-[#677583] p-[15px] text-base font-normal leading-normal"
                value={insuranceProvider}
                onChange={(e) => setInsuranceProvider(e.target.value)}
              >
                <option value="one">All Providers</option>
                <option value="two">Medicare</option>
                <option value="three">Blue Cross</option>
                <option value="four">United Healthcare</option>
              </select>
            </label>
          </div>
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#121417] text-base font-medium leading-normal pb-2">Report Format</p>
              <select
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121417] focus:outline-0 focus:ring-0 border border-[#dde0e4] bg-white focus:border-[#dde0e4] h-14 bg-[image:var(--select-button-svg)] bg-right bg-no-repeat appearance-none pr-10 placeholder:text-[#677583] p-[15px] text-base font-normal leading-normal"
                value={reportFormat}
                onChange={(e) => setReportFormat(e.target.value)}
              >
                <option value="one">PDF</option>
                <option value="two">CSV</option>
                <option value="three">Excel</option>
              </select>
            </label>
          </div>
          <div className="flex px-4 py-3 justify-start">
            <button
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#d2e2f3] text-[#121417] text-sm font-bold leading-normal tracking-[0.015em]"
              onClick={handleGenerateReport}
            >
              <span className="truncate">Generate Report</span>
            </button>
          </div>
          <h2 className="text-[#121417] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Report Preview</h2>
          <div className="px-4 py-3 @container">
            <div className="flex overflow-hidden rounded-xl border border-[#dde0e4] bg-white">
              <table className="flex-1">
                <thead>
                  <tr className="bg-white">
                    <th className="table-763ecaad-fc0c-4d45-80cd-0e6f6293391d-column-120 px-4 py-3 text-left text-[#121417] w-[400px] text-sm font-medium leading-normal">
                      Denial Reason
                    </th>
                    <th className="table-763ecaad-fc0c-4d45-80cd-0e6f6293391d-column-240 h-[72px] px-4 py-2 w-[400px] text-[#121417] text-sm font-normal leading-normal">
                      Number of Denials
                    </th>
                    <th className="table-763ecaad-fc0c-4d45-80cd-0e6f6293391d-column-360 h-[72px] px-4 py-2 w-[400px] text-[#121417] text-sm font-medium leading-normal">
                      Percentage
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-t-[#dde0e4]">
                    <td className="table-763ecaad-fc0c-4d45-80cd-0e6f6293391d-column-120 h-[72px] px-4 py-2 w-[400px] text-[#121417] text-sm font-normal leading-normal">
                      Missing Information
                    </td>
                    <td className="table-763ecaad-fc0c-4d45-80cd-0e6f6293391d-column-240 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">120</td>
                    <td className="table-763ecaad-fc0c-4d45-80cd-0e6f6293391d-column-360 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">30%</td>
                  </tr>
                  <tr className="border-t border-t-[#dde0e4]">
                    <td className="table-763ecaad-fc0c-4d45-80cd-0e6f6293391d-column-120 h-[72px] px-4 py-2 w-[400px] text-[#121417] text-sm font-normal leading-normal">
                      Incorrect Coding
                    </td>
                    <td className="table-763ecaad-fc0c-4d45-80cd-0e6f6293391d-column-240 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">80</td>
                    <td className="table-763ecaad-fc0c-4d45-80cd-0e6f6293391d-column-360 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">20%</td>
                  </tr>
                  <tr className="border-t border-t-[#dde0e4]">
                    <td className="table-763ecaad-fc0c-4d45-80cd-0e6f6293391d-column-120 h-[72px] px-4 py-2 w-[400px] text-[#121417] text-sm font-normal leading-normal">
                      Prior Authorization Required
                    </td>
                    <td className="table-763ecaad-fc0c-4d45-80cd-0e6f6293391d-column-240 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">60</td>
                    <td className="table-763ecaad-fc0c-4d45-80cd-0e6f6293391d-column-360 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">15%</td>
                  </tr>
                  <tr className="border-t border-t-[#dde0e4]">
                    <td className="table-763ecaad-fc0c-4d45-80cd-0e6f6293391d-column-120 h-[72px] px-4 py-2 w-[400px] text-[#121417] text-sm font-normal leading-normal">
                      Non-Covered Service
                    </td>
                    <td className="table-763ecaad-fc0c-4d45-80cd-0e6f6293391d-column-240 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">50</td>
                    <td className="table-763ecaad-fc0c-4d45-80cd-0e6f6293391d-column-360 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">12.5%</td>
                  </tr>
                  <tr className="border-t border-t-[#dde0e4]">
                    <td className="table-763ecaad-fc0c-4d45-80cd-0e6f6293391d-column-120 h-[72px] px-4 py-2 w-[400px] text-[#121417] text-sm font-normal leading-normal">Other</td>
                    <td className="table-763ecaad-fc0c-4d45-80cd-0e6f6293391d-column-240 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">90</td>
                    <td className="table-763ecaad-fc0c-4d45-80cd-0e6f6293391d-column-360 h-[72px] px-4 py-2 w-[400px] text-[#677583] text-sm font-normal leading-normal">22.5%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* Responsive styles for table columns */}
            <style>{`
              @container(max-width:120px){.table-763ecaad-fc0c-4d45-80cd-0e6f6293391d-column-120{display: none;}}
              @container(max-width:240px){.table-763ecaad-fc0c-4d45-80cd-0e6f6293391d-column-240{display: none;}}
              @container(max-width:360px){.table-763ecaad-fc0c-4d45-80cd-0e6f6293391d-column-360{display: none;}}
            `}</style>
          </div>
          <div className="flex px-4 py-3 justify-start">
            <button
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#f1f2f4] text-[#121417] text-sm font-bold leading-normal tracking-[0.015em]"
              onClick={() => console.log('Export Report clicked')}
            >
              <span className="truncate">Export Report</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      {/* Header component is always rendered */}
      <Header navigateTo={navigateTo} />
      <div className="layout-container flex h-full grow flex-col">
        {/* Render the current page based on state */}
        {(() => {
          switch (currentPage) {
            case PAGES.DASHBOARD:
              return <DashboardPage />;
            case PAGES.DENIALS_ANALYSIS:
              return <DenialsAnalysisPage />;
            case PAGES.NEW_CLAIM_PREDICTION:
              // Pass navigateTo to allow NewClaimPredictionPage to redirect to results
              return <NewClaimPredictionPage navigateTo={navigateTo} />;
            case PAGES.CLAIM_PREDICTION_RESULTS:
              return <ClaimPredictionResultsPage predictionResult={predictionResult} />;
            case PAGES.DATASETS:
              return <DatasetsPage />;
            case PAGES.SETTINGS_SYSTEM_PARAMETERS:
              return <SettingsSystemParametersPage navigateTo={navigateTo} />;
            case PAGES.SETTINGS_PAYER_RULES:
              return <SettingsPayerRulesPage navigateTo={navigateTo} />;
            case PAGES.USER_MANAGEMENT:
              return <UserManagementPage navigateTo={navigateTo} />;
            case PAGES.REPORTS:
              return <ReportsPage />;
            default:
              return <DashboardPage />;
          }
        })()}
      </div>
    </div>
  );
}

export default App;
