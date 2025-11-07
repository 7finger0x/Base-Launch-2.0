import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { faker } from '@faker-js/faker';
const Navigation = window.Navigation;
const Discovery = window.Discovery;
const MyStack = window.MyStack;
const Launches = window.Launches;
const Cohorts = window.Cohorts;
const Admin = window.Admin;
function App() {
  const [apps, setApps] = useState([]);
  const [myStack, setMyStack] = useState([]);
  const [launches, setLaunches] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    generateMockData();
  }, []);

  const generateMockData = () => {
    // Generate 20 mock apps
    const mockApps = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      name: faker.company.name(),
      description: faker.lorem.sentence(10),
      category: faker.helpers.arrayElement(['DeFi', 'Gaming', 'Social', 'Productivity', 'AI', 'NFT']),
      rating: faker.number.float({ min: 3.5, max: 5.0, precision: 0.1 }),
      downloads: faker.number.int({ min: 1000, max: 100000 }),
      image: `https://picsum.photos/300/200?random=${i}`,
      trending: faker.datatype.boolean(),
      new: faker.datatype.boolean(),
      status: faker.helpers.arrayElement(['approved', 'pending', 'rejected']),
      createdAt: faker.date.recent({ days: 30 })
    }));

    // Generate launches
    const mockLaunches = Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      name: faker.company.name(),
      description: faker.lorem.sentence(8),
      launchDate: faker.date.future(),
      waitlistCount: faker.number.int({ min: 50, max: 5000 }),
      referralCode: faker.string.alphanumeric(8).toUpperCase(),
      image: `https://picsum.photos/400/250?random=${i + 100}`,
      category: faker.helpers.arrayElement(['DeFi', 'Gaming', 'Social', 'AI'])
    }));

    // Generate cohorts
    const mockCohorts = Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      name: faker.company.catchPhrase(),
      description: faker.lorem.sentence(12),
      members: faker.number.int({ min: 3, max: 15 }),
      maxMembers: faker.number.int({ min: 15, max: 30 }),
      category: faker.helpers.arrayElement(['DeFi', 'Gaming', 'Social', 'AI']),
      launchTarget: faker.date.future(),
      leader: faker.person.fullName()
    }));

    setApps(mockApps);
    setLaunches(mockLaunches);
    setCohorts(mockCohorts);
  };

  const addToStack = (app) => {
    if (!myStack.find(item => item.id === app.id)) {
      setMyStack([...myStack, app]);
    }
  };

  const removeFromStack = (appId) => {
    setMyStack(myStack.filter(app => app.id !== appId));
  };

  const approveApp = (appId) => {
    setApps(apps.map(app => 
      app.id === appId ? { ...app, status: 'approved' } : app
    ));
  };

  const rejectApp = (appId) => {
    setApps(apps.map(app => 
      app.id === appId ? { ...app, status: 'rejected' } : app
    ));
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <Navigation isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
        <main className="pt-20">
          <Routes>
            <Route 
              path="/" 
              element={
                <Discovery 
                  apps={apps.filter(app => app.status === 'approved')} 
                  onAddToStack={addToStack}
                  myStack={myStack}
                />
              } 
            />
            <Route 
              path="/my-stack" 
              element={
                <MyStack 
                  myStack={myStack} 
                  onRemoveFromStack={removeFromStack}
                />
              } 
            />
            <Route 
              path="/launches" 
              element={<Launches launches={launches} />} 
            />
            <Route 
              path="/cohorts" 
              element={<Cohorts cohorts={cohorts} />} 
            />
            <Route 
              path="/admin" 
              element={
                <Admin 
                  apps={apps} 
                  onApprove={approveApp}
                  onReject={rejectApp}
                  isAdmin={isAdmin}
                />
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
window.App = App;