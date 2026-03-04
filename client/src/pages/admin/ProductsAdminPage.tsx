import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, useImportProducts } from "@/hooks/use-products";
import { formatJOD } from "@/lib/utils";
import { Plus, Edit2, Trash2, Search, FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ProductsAdminPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const { data: products, isLoading } = useProducts(search);
  const { mutateAsync: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutateAsync: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const { mutateAsync: deleteProduct } = useDeleteProduct();
  const { mutateAsync: importCsv, isPending: isImporting } = useImportProducts();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
    category: "",
  });

  const handleOpenDialog = (product?: any) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        name: product.name,
        description: product.description || "",
        price: product.price.toString(),
        stock: product.stock.toString(),
        imageUrl: product.imageUrl || "",
        category: product.category || "",
      });
    } else {
      setEditingId(null);
      setFormData({ name: "", description: "", price: "", stock: "0", imageUrl: "", category: "" });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...formData,
        price: formData.price,
        stock: parseInt(formData.stock, 10) || 0,
      };

      if (editingId) {
        await updateProduct({ id: editingId, ...formattedData });
      } else {
        await createProduct(formattedData as any);
      }
      setDialogOpen(false);
    } catch (err) {
      // Handled by query global
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">{t('admin.products.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('admin.products.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => importCsv()} disabled={isImporting}>
            <FileUp className="h-4 w-4 mr-2" /> {isImporting ? t('admin.products.importing') : t('admin.products.import_csv')}
          </Button>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4 mr-2" /> {t('admin.products.add_product')}
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder={t('admin.products.search')} 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('admin.products.table.product')}</TableHead>
              <TableHead>{t('admin.products.table.category')}</TableHead>
              <TableHead>{t('admin.products.table.price')}</TableHead>
              <TableHead>{t('admin.products.table.stock')}</TableHead>
              <TableHead className="text-right">{t('admin.products.table.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center h-24">{t('admin.products.loading')}</TableCell></TableRow>
            ) : products?.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center h-24 text-muted-foreground">{t('admin.products.no_products')}</TableCell></TableRow>
            ) : (
              products?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                        {product.imageUrl && <img src={product.imageUrl} alt="" className="h-full w-full object-cover" />}
                      </div>
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{product.category || "-"}</TableCell>
                  <TableCell className="font-medium text-primary">{formatJOD(product.price)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.stock > 10 ? 'bg-green-500/10 text-green-500' : product.stock > 0 ? 'bg-yellow-500/10 text-yellow-500' : 'bg-destructive/10 text-destructive'}`}>
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(product)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => { if(confirm(t('admin.products.confirm_delete'))) deleteProduct(product.id) }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editingId ? t('admin.products.dialog.edit_title') : t('admin.products.dialog.add_title')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('admin.products.dialog.name')}</Label>
                <Input id="name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">{t('admin.products.dialog.price_label')}</Label>
                  <Input id="price" type="number" step="0.01" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">{t('admin.products.dialog.stock_label')}</Label>
                  <Input id="stock" type="number" required value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">{t('admin.products.dialog.category')}</Label>
                <Input id="category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">{t('admin.products.dialog.image_url')}</Label>
                <Input id="imageUrl" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">{t('admin.products.dialog.description')}</Label>
                <Textarea id="desc" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>{t('admin.products.dialog.cancel')}</Button>
              <Button type="submit" disabled={isCreating || isUpdating}>{editingId ? t('admin.products.dialog.save') : t('admin.products.dialog.create')}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
