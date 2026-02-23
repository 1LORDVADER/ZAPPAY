import { Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function NotificationBell() {
  const [previousStatuses, setPreviousStatuses] = useState<Record<string, string>>({});
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Poll for application status changes every 30 seconds
  const { data: applications } = trpc.applications.getMyApplications.useQuery(undefined, {
    refetchInterval: 30000, // 30 seconds
  });

  useEffect(() => {
    if (!applications) return;

    // Check for status changes
    const statusChanges: Array<{ type: string; status: string }> = [];
    
    if (applications.farmer && previousStatuses.farmer && applications.farmer.verified !== previousStatuses.farmer) {
      statusChanges.push({ type: 'Farmer', status: applications.farmer.verified });
    }
    
    if (applications.driver && previousStatuses.driver && applications.driver.status !== previousStatuses.driver) {
      statusChanges.push({ type: 'Driver', status: applications.driver.status });
    }
    
    if (applications.company && previousStatuses.company && applications.company.status !== previousStatuses.company) {
      statusChanges.push({ type: 'Company', status: applications.company.status });
    }
    
    if (applications.salesRep && previousStatuses.salesRep && applications.salesRep.status !== previousStatuses.salesRep) {
      statusChanges.push({ type: 'Sales Rep', status: applications.salesRep.status });
    }

    // Show toast notifications for status changes
    statusChanges.forEach(change => {
      const statusEmoji = change.status === 'approved' || change.status === 'active' ? '✅' : 
                         change.status === 'rejected' || change.status === 'inactive' ? '❌' : '⏳';
      
      toast.success(`${statusEmoji} ${change.type} Application ${change.status}!`, {
        description: `Your ${change.type.toLowerCase()} application status has been updated.`,
        duration: 5000,
      });
      
      setUnreadCount(prev => prev + 1);
    });

    // Update previous statuses
    setPreviousStatuses({
      farmer: applications.farmer?.verified || '',
      driver: applications.driver?.status || '',
      company: applications.company?.status || '',
      salesRep: applications.salesRep?.status || '',
    });
  }, [applications]);

  const notifications = [];
  
  if (applications?.farmer) {
    notifications.push({
      type: 'Farmer',
      status: applications.farmer.verified,
      date: applications.farmer.createdAt,
    });
  }
  
  if (applications?.driver) {
    notifications.push({
      type: 'Driver',
      status: applications.driver.status,
      date: applications.driver.createdAt,
    });
  }
  
  if (applications?.company) {
    notifications.push({
      type: 'Company',
      status: applications.company.status,
      date: applications.company.createdAt,
    });
  }
  
  if (applications?.salesRep) {
    notifications.push({
      type: 'Sales Rep',
      status: applications.salesRep.status,
      date: applications.salesRep.createdAt,
    });
  }

  const handleMarkAllRead = () => {
    setUnreadCount(0);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMarkAllRead}
              className="text-xs"
            >
              Mark all read
            </Button>
          )}
        </div>
        
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No notifications yet
            </p>
          ) : (
            notifications.map((notif, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="flex-1">
                  <p className="text-sm font-medium">{notif.type} Application</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Status: <span className="font-medium capitalize">{notif.status}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(notif.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
