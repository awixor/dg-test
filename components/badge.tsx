type Props = {
  label: string;
};

export const Badge = ({ label }: Props) => {
  return (
    <span className="text-[10px] font-bold text-warning-text bg-warning-gold rounded px-1.5 py-0.5">
      {label}
    </span>
  );
};
