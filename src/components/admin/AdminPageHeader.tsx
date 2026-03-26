interface AdminPageHeaderProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function AdminPageHeader({ title, description, action }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#0B1F3A] mb-1">{title}</h1>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>
      {action && <div className="flex-shrink-0 flex items-center">{action}</div>}
    </div>
  );
}
