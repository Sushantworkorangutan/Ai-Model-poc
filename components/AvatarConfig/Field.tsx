interface FieldProps {
  label: string;
  children: React.ReactNode;
  tooltip?: string;
}

export const Field = (props: FieldProps) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[#1e3c29] text-sm font-bold">{props.label}</label>
      {props.children}
    </div>
  );
};
