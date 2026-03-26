interface UserPageHeaderProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function UserPageHeader({ title, description, action }: UserPageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-8 gap-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-1">{title}</h1>
        <p className="text-gray-600 text-base md:text-lg">{description}</p>
      </div>
      {action && (
        <div className="flex-shrink-0 flex items-center">{action}</div>
      )}
    </div>
  );
}
