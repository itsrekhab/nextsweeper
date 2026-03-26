const StatCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <p className="flex flex-col gap-0.5 px-4 [padding-block-start:calc(var(--spacing)*2)] [padding-block-end:calc(var(--spacing)*3)] -mx-4 -my-2 rounded-md hover:bg-blue-100 dark:hover:bg-blue-950 select-none">
      {children}
    </p>
  );
};

const StatCardTitle = ({ children }: { children: React.ReactNode }) => {
  return <span className="block font-semibold">{children}</span>;
};

const StatCardValue = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="flex gap-1 font-light items-baseline *:leading-none">
      {children}
    </span>
  );
};

StatCard.Title = StatCardTitle;
StatCard.Value = StatCardValue;

export default StatCard;
