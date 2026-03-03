import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export function SettingsPage() {
  const { toast } = useToast();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Settings Saved", description: "Store settings updated successfully." });
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold">Store Settings</h1>
        <p className="text-muted-foreground mt-1">Manage global preferences and shipping rules.</p>
      </div>

      <div className="max-w-2xl bg-card border border-border rounded-2xl p-8 shadow-sm">
        <h2 className="text-xl font-bold mb-6 border-b border-border pb-4">Shipping Configuration</h2>
        
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="shipping">Flat Rate Shipping Cost (JOD)</Label>
            <Input id="shipping" type="number" defaultValue="5.00" step="0.5" className="bg-background" />
            <p className="text-xs text-muted-foreground">This amount will be added to all checkouts.</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="freeShipping">Free Shipping Threshold (JOD)</Label>
            <Input id="freeShipping" type="number" defaultValue="100.00" className="bg-background" />
            <p className="text-xs text-muted-foreground">Orders above this amount get free shipping. Set to 0 to disable.</p>
          </div>
          
          <div className="pt-4">
            <Button type="submit">Save Configuration</Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
