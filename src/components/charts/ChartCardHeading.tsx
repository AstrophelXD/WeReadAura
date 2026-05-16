type ChartCardHeadingProps = {
  title: string;
  description: string;
};

export function ChartCardHeading({ title, description }: ChartCardHeadingProps) {
  return (
    <header>
      <h3 className="type-card-title-lg">{title}</h3>
      <p className="type-caption mt-2">{description}</p>
    </header>
  );
}
