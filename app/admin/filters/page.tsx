"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Trash2, Edit, Plus, Save, X } from "lucide-react";
import type { PreferenceFilter } from "@/lib/db/schema";

interface FilterFormData {
  label: string;
  icon: string;
  value: string;
  orderIndex: number;
  isActive: boolean;
}

export default function FiltersPage() {
  const [filters, setFilters] = useState<PreferenceFilter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingFilter, setEditingFilter] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<FilterFormData>({
    label: "",
    icon: "🏷️",
    value: "",
    orderIndex: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchFilters();
  }, []);

  const fetchFilters = async () => {
    try {
      const response = await fetch("/admin/filters/api");
      const data = await response.json();
      setFilters(data.filters || []);
    } catch (error) {
      console.error("Error fetching filters:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setIsAdding(true);
    setFormData({
      label: "",
      icon: "🏷️",
      value: "",
      orderIndex: filters.length + 1,
      isActive: true,
    });
  };

  const handleEdit = (filter: PreferenceFilter) => {
    setEditingFilter(filter.id);
    setFormData({
      label: filter.label,
      icon: filter.icon || "🏷️",
      value: filter.value,
      orderIndex: filter.orderIndex,
      isActive: filter.isActive,
    });
  };

  const handleSave = async () => {
    try {
      const url = editingFilter
        ? `/admin/filters/api?id=${editingFilter}`
        : "/admin/filters/api";

      const method = editingFilter ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchFilters();
        setEditingFilter(null);
        setIsAdding(false);
        setFormData({
          label: "",
          icon: "🏷️",
          value: "",
          orderIndex: 0,
          isActive: true,
        });
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error saving filter:", error);
      alert("Error saving filter");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this filter?")) return;

    try {
      const response = await fetch(`/admin/filters/api?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchFilters();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error deleting filter:", error);
      alert("Error deleting filter");
    }
  };

  const handleCancel = () => {
    setEditingFilter(null);
    setIsAdding(false);
    setFormData({
      label: "",
      icon: "🏷️",
      value: "",
      orderIndex: 0,
      isActive: true,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading filters...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Preference Filters</h1>
        <p className="mt-2 text-base text-foreground/70">
          Manage user preference filters
        </p>
      </div>

      <div className="mb-6">
        <Button onClick={handleAdd} className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg shadow-primary/30 transition-all duration-200 hover:scale-105">
          <Plus className="h-5 w-5" />
          Add Filter
        </Button>
      </div>

      <div className="space-y-4">
        {filters.map((filter, index) => (
          <Card key={filter.id} className="p-5 rounded-xl border-2 border-primary/20 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-slate-800 dark:via-blue-900/10 dark:to-purple-900/10 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-200">
            {editingFilter === filter.id ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
                <div>
                  <Label htmlFor="label">Label</Label>
                  <Input
                    id="label"
                    value={formData.label}
                    onChange={(e) =>
                      setFormData({ ...formData, label: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="icon">Icon</Label>
                  <Input
                    id="icon"
                    value={formData.icon}
                    onChange={(e) =>
                      setFormData({ ...formData, icon: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="value">Value</Label>
                  <Input
                    id="value"
                    value={formData.value}
                    onChange={(e) =>
                      setFormData({ ...formData, value: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="orderIndex">Order</Label>
                  <Input
                    id="orderIndex"
                    type="number"
                    value={formData.orderIndex}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        orderIndex: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked: boolean) =>
                      setFormData({ ...formData, isActive: checked })
                    }
                  />
                  <Label>Active</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={handleSave} className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancel} className="border-2 border-accent/30 hover:bg-accent/10">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl bg-gradient-to-br from-primary/20 to-secondary/20 p-2 rounded-xl">{filter.icon}</div>
                  <div>
                    <p className="font-bold text-lg">{filter.label}</p>
                    <p className="text-sm text-foreground/60 mt-1">
                      Value: <code className="bg-primary/10 px-2 py-0.5 rounded text-primary font-semibold">{filter.value}</code> | Order: <span className="font-semibold">{filter.orderIndex}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {filter.isActive ? (
                      <span className="rounded-full bg-gradient-to-r from-green-500 to-green-600 px-3 py-1.5 text-xs font-bold text-white shadow-md">
                        ✓ Active
                      </span>
                    ) : (
                      <span className="rounded-full bg-gradient-to-r from-gray-400 to-gray-500 px-3 py-1.5 text-xs font-bold text-white shadow-md">
                        ✕ Inactive
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(filter)}
                    className="border-2 border-secondary/30 hover:bg-secondary/10 hover:scale-105 transition-all duration-200"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(filter.id)}
                    className="border-2 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:scale-105 transition-all duration-200"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}

        {isAdding && (
          <Card className="p-5 rounded-xl border-2 border-accent/30 bg-gradient-to-br from-white via-teal-50/30 to-blue-50/30 dark:from-slate-800 dark:via-teal-900/10 dark:to-blue-900/10 shadow-lg">
            <div className="mb-3">
              <h3 className="text-lg font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Add New Filter</h3>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
              <div>
                <Label htmlFor="new-label">Label</Label>
                <Input
                  id="new-label"
                  value={formData.label}
                  onChange={(e) =>
                    setFormData({ ...formData, label: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="new-icon">Icon</Label>
                <Input
                  id="new-icon"
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="new-value">Value</Label>
                <Input
                  id="new-value"
                  value={formData.value}
                  onChange={(e) =>
                    setFormData({ ...formData, value: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="new-orderIndex">Order</Label>
                <Input
                  id="new-orderIndex"
                  type="number"
                  value={formData.orderIndex}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      orderIndex: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked: boolean) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
                <Label>Active</Label>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={handleSave} className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90">
                  <Save className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel} className="border-2 border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
