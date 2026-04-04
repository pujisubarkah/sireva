import React from "react";

export default function AdminPageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-blue-900 mb-1">{title}</h1>
      {description && <p className="text-gray-600 text-sm">{description}</p>}
    </div>
  );
}
