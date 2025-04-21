export const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex rounded-md bg-green-50 px-2 pb-0.5 align-text-bottom text-xs font-semibold text-[#2A9977] ring-1 ring-inset ring-[#57CDA4]/20">
    {children}
  </span>
);
