import { useAuth } from "@/hooks/use-auth";
import { useOrders } from "@/hooks/use-orders";
import { Navbar } from "@/components/layout/Navbar";
import { formatJOD, formatDate } from "@/lib/utils";
import { PackageOpen, Clock, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";
import { useEffect } from "react";

export function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation('/login');
    }
  }, [user, authLoading, setLocation]);

  if (authLoading || !user) return null;

  // Filter orders for this user
  const userOrders = orders?.filter(o => o.userId === user.id).sort((a,b) => 
    new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
  ) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'shipped': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-1">
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Sidebar Info */}
          <div className="md:w-80">
            <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm text-center">
              <div className="h-24 w-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 text-4xl font-display font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold mb-1">{user.username}</h2>
              <p className="text-muted-foreground text-sm mb-6 capitalize">{user.role} Account</p>
              
              <div className="grid grid-cols-2 gap-4 border-t border-border pt-6">
                <div>
                  <p className="text-2xl font-display font-bold text-foreground">{userOrders.length}</p>
                  <p className="text-xs text-muted-foreground">Total Orders</p>
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-foreground">
                    {formatJOD(userOrders.reduce((acc, o) => acc + Number(o.totalAmount), 0))}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Spent</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Orders List */}
          <div className="flex-1">
            <h2 className="text-2xl font-display font-bold mb-6">Order History</h2>
            
            {ordersLoading ? (
              <div className="space-y-4">
                {[1,2,3].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
              </div>
            ) : userOrders.length === 0 ? (
              <div className="bg-card border border-border/50 border-dashed rounded-3xl p-12 text-center">
                <PackageOpen className="h-16 w-16 text-muted-foreground opacity-20 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-6">When you place orders, they will appear here.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {userOrders.map(order => (
                  <div key={order.id} className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm hover-elevate transition-all">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-6 border-b border-border/50">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold">Order #{order.id}</h3>
                          <Badge variant="outline" className={getStatusColor(order.status)}>
                            {order.status.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground gap-2">
                          <Clock className="h-3 w-3" /> {formatDate(order.createdAt!)}
                        </div>
                      </div>
                      <div className="text-right mt-4 sm:mt-0">
                        <div className="font-display font-bold text-xl text-primary">{formatJOD(order.totalAmount)}</div>
                        <div className="text-xs text-muted-foreground">Includes {formatJOD(order.shippingCost)} shipping</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-primary/80 font-medium">
                       <CheckCircle2 className="mr-2 h-4 w-4" /> 
                       {order.status === 'pending' ? 'Order received, preparing for shipment' : 'Order processed'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
