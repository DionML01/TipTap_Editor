export function buttonClass(active: boolean) {
  const base =
    "px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 cursor-pointer";
  const activeStyle = "bg-gray-900 text-white";
  const inactiveStyle =
    "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200";

  return `${base} ${active ? activeStyle : inactiveStyle}`;
}
