"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTemplatesByCategory, type Template } from "@/lib/templates";

interface TemplatesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (template: Template) => void;
}

export function TemplatesModal({
  open,
  onOpenChange,
  onSelectTemplate,
}: TemplatesModalProps) {
  const templatesByCategory = getTemplatesByCategory();
  const allTemplates = Object.values(templatesByCategory).flat();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Choose a Strategy Template
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {allTemplates.map((template) => (
            <Card
              key={template.id}
              className="cursor-pointer hover:shadow-md transition-shadow duration-200 border-gray-200"
              onClick={() => {
                onSelectTemplate(template);
                onOpenChange(false);
              }}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-100 rounded-md text-indigo-600">
                      {template.icon}
                    </div>
                    <div>
                      <CardTitle className="text-sm font-medium">
                        {template.name}
                      </CardTitle>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-xs px-2 py-1 bg-gray-100 text-gray-700"
                  >
                    {template.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0 pb-3">
                <CardDescription className="text-xs text-gray-600 line-clamp-3">
                  {template.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
