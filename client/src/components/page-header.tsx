interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h1 className="text-2xl md:text-4xl font-bold text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-sm md:text-base text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
      {action && <div className="mt-4 md:mt-0">{action}</div>}
    </div>
  );
}
