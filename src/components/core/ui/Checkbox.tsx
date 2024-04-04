const CheckedIcon = () => {
  return (
    <svg
      width='22'
      height='22'
      viewBox='0 0 22 22'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'>
      <rect x='0.5' y='0.5' width='21' height='21' rx='4.5' fill='#1C64F2' />
      <path
        d='M5.75 11.75L8.75 14.75L16.25 7.25'
        stroke='white'
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <rect x='0.5' y='0.5' width='21' height='21' rx='4.5' stroke='#1F2A37' />
    </svg>
  );
};

const UncheckedIcon = ({ color }) => {
  return (
    <svg
      width='22'
      height='22'
      viewBox='0 0 22 22'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'>
      <rect x='0.5' y='0.5' width='21' height='21' rx='4.5' fill='#374151' />
      <rect
        x='0.5'
        y='0.5'
        width='21'
        height='21'
        rx='4.5'
        stroke={color ? color : "#D1D5DB"}
      />
    </svg>
  );
};

export default function Checkbox({
  checked,
  onClick = () => {},
  color,
  pulse = false,
}) {
  return (
    <div
      //@ts-ignore
      onClick={() => onClick(!checked)}
      className={pulse ? "animate-pulse mt-[1px]" : "mt-[1px]"}>
      {checked ? <CheckedIcon /> : <UncheckedIcon color={color} />}
    </div>
  );
}
