import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const userGrowthData = [
  { name: 'Jan', users: 400 },
  { name: 'Feb', users: 600 },
  { name: 'Mar', users: 800 },
  { name: 'Apr', users: 1200 },
  { name: 'May', users: 1800 },
  { name: 'Jun', users: 2400 },
  { name: 'Jul', users: 3100 },
];

const activityData = [
  { name: 'Mon', TOEIC: 120, Vocabulary: 200, Materials: 150 },
  { name: 'Tue', TOEIC: 150, Vocabulary: 220, Materials: 170 },
  { name: 'Wed', TOEIC: 180, Vocabulary: 250, Materials: 190 },
  { name: 'Thu', TOEIC: 140, Vocabulary: 280, Materials: 160 },
  { name: 'Fri', TOEIC: 190, Vocabulary: 300, Materials: 210 },
  { name: 'Sat', TOEIC: 250, Vocabulary: 350, Materials: 280 },
  { name: 'Sun', TOEIC: 300, Vocabulary: 400, Materials: 320 },
];

const materialDistribution = [
  { name: 'Reading', value: 45, color: '#3b82f6' },
  { name: 'Listening', value: 35, color: '#f59e0b' },
  { name: 'Vocabulary', value: 20, color: '#10b981' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Platform usage statistics and activity metrics
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Icons
              name="users"
              className="h-4 w-4 text-indigo-600 dark:text-indigo-400"
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,100</div>
            <p className="text-xs text-emerald-600 font-medium flex items-center mt-1">
              +22.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tests Completed
            </CardTitle>
            <Icons
              name="file-text"
              className="h-4 w-4 text-blue-600 dark:text-blue-400"
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,453</div>
            <p className="text-xs text-emerald-600 font-medium flex items-center mt-1">
              +15.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Material Views
            </CardTitle>
            <Icons
              name="book-open"
              className="h-4 w-4 text-amber-600 dark:text-amber-400"
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45,231</div>
            <p className="text-xs text-emerald-600 font-medium flex items-center mt-1">
              +34.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <Icons
              name="activity"
              className="h-4 w-4 text-rose-600 dark:text-rose-400"
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-muted-foreground mt-1">
              Users currently online
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Area */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* User Growth Chart */}
        <Card className="col-span-4 border-0 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>
              New registrations over the past 7 months
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={userGrowthData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorUsers)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Content Distribution */}
        <Card className="col-span-3 border-0 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm">
          <CardHeader>
            <CardTitle>Content Distribution</CardTitle>
            <CardDescription>
              Breakdown by learning material type
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={materialDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {materialDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Activity */}
        <Card className="col-span-7 border-0 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm mt-2">
          <CardHeader>
            <CardTitle>Weekly Engagement</CardTitle>
            <CardDescription>
              Activity across different modules over the past week
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={activityData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                    cursor={{ fill: 'transparent' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar
                    dataKey="TOEIC"
                    stackId="a"
                    fill="#6366f1"
                    radius={[0, 0, 4, 4]}
                  />
                  <Bar dataKey="Vocabulary" stackId="a" fill="#10b981" />
                  <Bar
                    dataKey="Materials"
                    stackId="a"
                    fill="#f59e0b"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
