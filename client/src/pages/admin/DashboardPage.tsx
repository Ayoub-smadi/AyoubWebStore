import { AdminLayout } from "@/components/layout/AdminLayout";
import { useStats } from "@/hooks/use-stats";
import { formatJOD } from "@/lib/utils";
import { Package, Users, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Dummy data for chart since backend stats is aggregated
const chartData = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 2000 },
  { name: 'Apr', revenue: 2780 },
  { name: 'May', revenue: 1890 },
  { name: 'Jun', revenue: 2390 },
  { name: 'Jul', revenue: 3490 },
];

export function DashboardPage() {
  const { data: stats, isLoading } = useStats();

  const cards = [
    { title: "Total Revenue", value: stats ? formatJOD(stats.revenue) : "JOD 0.00", icon: DollarSign, trend: "+12%" },
    { title: "Total Orders", value: stats?.totalOrders || 0, icon: ShoppingCart, trend: "+5%" },
    { title: "Products", value: stats?.totalProducts || 0, icon: Package, trend: "+2%" },
    { title: "Active Users", value: stats?.totalUsers || 0, icon: Users, trend: "+18%" },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">Welcome back. Here's what's happening today.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cards.map((card, i) => (
            <div key={i} className="bg-card p-6 rounded-2xl border border-border shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <card.icon className="h-5 w-5" />
                </div>
                <span className="flex items-center text-xs font-semibold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                  <TrendingUp className="h-3 w-3 mr-1" /> {card.trend}
                </span>
              </div>
              <h3 className="text-muted-foreground text-sm font-medium mb-1">{card.title}</h3>
              <p className="text-2xl font-display font-bold text-foreground">{card.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm h-[400px]">
        <div className="mb-6">
          <h3 className="text-lg font-bold">Revenue Overview</h3>
          <p className="text-sm text-muted-foreground">Monthly revenue performance</p>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 25, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} tickFormatter={(value) => `JOD ${value}`} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
              itemStyle={{ color: 'hsl(var(--primary))' }}
            />
            <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={3} dot={{r: 4, fill: 'hsl(var(--background))', strokeWidth: 2}} activeDot={{r: 6}} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </AdminLayout>
  );
}
