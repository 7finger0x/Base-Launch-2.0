import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { faker } from '@faker-js/faker';
const Navigation = window.Navigation;
const Discovery = window.Discovery;
const MyStack = window.MyStack;
const Launches = window.Launches;
const Cohorts = window.Cohorts;
const Admin = window.Admin;
const Profile = window.Profile;
const TrendingDigest = window.TrendingDigest;
function App() {
  const [apps, setApps] = useState([]);
  const [myStack, setMyStack] = useState([]);
  const [launches, setLaunches] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userStats, setUserStats] = useState({
    appsDiscovered: 0,
    referralCount: 0,
    earlyAdopterCount: 0,
    launchesJoined: 0,
    cohortsJoined: 0
  });

  useEffect(() => {
    generateMockData();
    initializeUser();
  }, []);

  const initializeUser = () => {
    // Simulate user authentication and load profile
    const mockUser = {
      id: '1',
      name: 'Alex Builder',
      username: 'alexbuilder',
      fid: '12345',
      avatar: 'https://picsum.photos/100/100?random=1',
      badges: ['EARLY_ADOPTER', 'APP_HUNTER'],
      preferences: {
        categories: ['DeFi', 'AI', 'Gaming'],
        notificationsEnabled: true
      }
    };
    setUser(mockUser);
    setUserStats({
      appsDiscovered: 24,
      referralCount: 8,
      earlyAdopterCount: 5,
      launchesJoined: 12,
      cohortsJoined: 3
    });
  };

  const generateMockData = () => {
    // Generate 50 mock apps with trending scores
    const mockApps = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: faker.company.name(),
      description: faker.lorem.sentence(12),
      category: faker.helpers.arrayElement(['DeFi', 'Gaming', 'Social', 'Productivity', 'AI', 'NFT']),
      rating: faker.number.float({ min: 3.5, max: 5.0, precision: 0.1 }),
      downloads: faker.number.int({ min: 1000, max: 100000 }),
      image: `https://picsum.photos/400/300?random=${i}`,
      trending: faker.datatype.boolean(),
      new: faker.datatype.boolean(),
      featured: faker.datatype.boolean(),
      status: 'approved',
      createdAt: faker.date.recent({ days: 30 }),
      trendingScore: faker.number.float({ min: 0, max: 100, precision: 0.1 }),
      weeklyGrowth: faker.number.float({ min: -20, max: 150, precision: 0.1 }),
      userCount: faker.number.int({ min: 500, max: 50000 }),
      launchPlaybook: {
        hasTemplate: faker.datatype.boolean(),
        socialPosts: faker.number.int({ min: 0, max: 10 }),
        referralReward: faker.helpers.arrayElement(['Token Drop', 'NFT', 'Early Access', 'Premium Features'])
      },
      viralFactors: {
        referrals: faker.number.int({ min: 0, max: 500 }),
        shares: faker.number.int({ min: 0, max: 2000 }),
        saves: faker.number.int({ min: 0, max: 1500 })
      }
    }));

    // Generate launches with enhanced viral mechanics
    const mockLaunches = Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: faker.company.name(),
      description: faker.lorem.sentence(8),
      launchDate: faker.date.future(),
      waitlistCount: faker.number.int({ min: 50, max: 15000 }),
      referralCode: faker.string.alphanumeric(8).toUpperCase(),
      image: `https://picsum.photos/500/400?random=${i + 100}`,
      category: faker.helpers.arrayElement(['DeFi', 'Gaming', 'Social', 'AI']),
      developer: faker.person.fullName(),
      playbookTemplate: {
        preWrittenPosts: generatePlaybookPosts(),
        milestones: [1000, 5000, 10000, 25000],
        rewards: ['Early Access', 'Exclusive NFT', 'Token Airdrop', 'Lifetime Premium']
      },
      cohortId: faker.helpers.maybe(() => faker.number.int({ min: 1, max: 6 }), { probability: 0.6 }),
      socialProof: {
        shares: faker.number.int({ min: 50, max: 2000 }),
        referrals: faker.number.int({ min: 20, max: 800 }),
        mentions: faker.number.int({ min: 5, max: 200 })
      }
    }));

    // Generate cohorts with coordination tools
    const mockCohorts = Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      name: faker.company.catchPhrase(),
      description: faker.lorem.sentence(15),
      members: faker.number.int({ min: 3, max: 15 }),
      maxMembers: faker.number.int({ min: 15, max: 30 }),
      category: faker.helpers.arrayElement(['DeFi', 'Gaming', 'Social', 'AI']),
      launchTarget: faker.date.future(),
      leader: faker.person.fullName(),
      coordinationTools: {
        sharedCalendar: true,
        crossPromotion: true,
        groupChat: true,
        analyticsSharing: true
      },
      launchSchedule: {
        countdown: faker.number.int({ min: 5, max: 45 }),
        timeSlots: ['9AM EST', '12PM EST', '6PM EST', '9PM EST']
      },
      successMetrics: {
        targetReach: faker.number.int({ min: 10000, max: 100000 }),
        targetSignups: faker.number.int({ min: 1000, max: 25000 }),
        crossPromotionScore: faker.number.float({ min: 60, max: 95, precision: 0.1 })
      }
    }));

    setApps(mockApps);
    setLaunches(mockLaunches);
    setCohorts(mockCohorts);
  };

  const generatePlaybookPosts = () => [
    "🚀 Excited to announce we're launching on @base! Join our waitlist for exclusive early access: [link] #BaseEcosystem",
    "Behind the scenes: Here's how we built [app name] to solve the biggest problem in [category] 🧵 [1/7]",
    "We just hit [milestone] signups! 🎉 Next stop: [next milestone]. Use code [referral] for 2x rewards!",
    "48 hours until launch! 🔥 First 100 users get [exclusive benefit]. Ready? Set? GO! [link]",
    "LIVE NOW 🟢 [App name] is officially available! Thank you to everyone who joined the journey. [link]"
  ];

  const addToStack = (app) => {
    if (!myStack.find(item => item.id === app.id)) {
      setMyStack([...myStack, { ...app, dateAdded: new Date().toISOString() }]);
      updateUserStats('appsDiscovered', userStats.appsDiscovered + 1);
      
      // Trigger achievement check
      checkBadgeEligibility();
    }
  };

  const removeFromStack = (appId) => {
    setMyStack(myStack.filter(app => app.id !== appId));
  };

  const shareApp = async (app, platform = 'farcaster') => {
    const referralCode = generateReferralCode(user?.id || '1', app.id);
    const shareText = `Just discovered ${app.name} on @base! ${app.description} Try it: [link]?ref=${referralCode} #BaseApps`;
    
    // Simulate social sharing
    if (user) {
      updateUserStats('referralCount', userStats.referralCount + 1);
    }
    
    // Track viral action
    setApps(apps.map(a => 
      a.id === app.id 
        ? { ...a, viralFactors: { ...a.viralFactors, shares: a.viralFactors.shares + 1 }}
        : a
    ));
  };

  const generateReferralCode = (userId, appId) => {
    return `${userId.slice(0, 3).toUpperCase()}${appId}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
  };

  const updateUserStats = (metric, value) => {
    setUserStats(prev => ({ ...prev, [metric]: value }));
  };

  const checkBadgeEligibility = () => {
    if (!user) return;
    
    const newBadges = [...user.badges];
    
    // Check various badge criteria
    if (userStats.appsDiscovered >= 10 && !newBadges.includes('APP_HUNTER')) {
      newBadges.push('APP_HUNTER');
    }
    
    if (userStats.referralCount >= 5 && !newBadges.includes('VIRAL_CONTRIBUTOR')) {
      newBadges.push('VIRAL_CONTRIBUTOR');
    }
    
    if (userStats.earlyAdopterCount >= 3 && !newBadges.includes('EARLY_BIRD')) {
      newBadges.push('EARLY_BIRD');
    }
    
    setUser({ ...user, badges: newBadges });
  };

  const joinLaunch = (launchId, referralCode = null) => {
    setLaunches(launches.map(launch => 
      launch.id === launchId 
        ? { 
            ...launch, 
            waitlistCount: launch.waitlistCount + 1,
            socialProof: { 
              ...launch.socialProof, 
              referrals: referralCode ? launch.socialProof.referrals + 1 : launch.socialProof.referrals 
            }
          }
        : launch
    ));
    updateUserStats('launchesJoined', userStats.launchesJoined + 1);
  };

  const getPersonalizedApps = () => {
    if (!user?.preferences?.categories) return apps;
    
    return apps.sort((a, b) => {
      const aScore = user.preferences.categories.includes(a.category) ? 100 : 0;
      const bScore = user.preferences.categories.includes(b.category) ? 100 : 0;
      return (bScore + b.trendingScore) - (aScore + a.trendingScore);
    });
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
        <Navigation 
          isAdmin={isAdmin} 
          setIsAdmin={setIsAdmin} 
          user={user}
          userStats={userStats}
        />
        <main className="pt-20">
          <Routes>
            <Route 
              path="/" 
              element={
                <Discovery 
                  apps={getPersonalizedApps().filter(app => app.status === 'approved')} 
                  onAddToStack={addToStack}
                  onShare={shareApp}
                  myStack={myStack}
                  user={user}
                />
              } 
            />
            <Route 
              path="/my-stack" 
              element={
                <MyStack 
                  myStack={myStack} 
                  onRemoveFromStack={removeFromStack}
                  onShare={shareApp}
                  user={user}
                />
              } 
            />
            <Route 
              path="/launches" 
              element={
                <Launches 
                  launches={launches} 
                  onJoinLaunch={joinLaunch}
                  user={user}
                />
              } 
            />
            <Route 
              path="/cohorts" 
              element={
                <Cohorts 
                  cohorts={cohorts} 
                  setCohorts={setCohorts}
                  user={user}
                  updateUserStats={updateUserStats}
                />
              } 
            />
            <Route 
              path="/profile" 
              element={
                <Profile 
                  user={user}
                  setUser={setUser}
                  userStats={userStats}
                  myStack={myStack}
                  onShare={shareApp}
                />
              } 
            />
            <Route 
              path="/trending" 
              element={
                <TrendingDigest 
                  apps={apps}
                  launches={launches}
                  onAddToStack={addToStack}
                  user={user}
                />
              } 
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