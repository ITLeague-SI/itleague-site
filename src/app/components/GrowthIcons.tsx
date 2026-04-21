// Иконки для блока "П'ять кроків до росту" (node 23:521).
// SVG-пути взяты 1:1 из Figma-ассетов, цвет управляется через `currentColor`
// (родительский .growth-step-circle задаёт `color`).

type IconProps = { className?: string };

// Step 1 — Icon-enter (24×24)
export function IconEnter({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M20 6C21.1046 6 22 5.10455 22 4C22 2.89543 21.1046 2 20 2C18.8954 2 18 2.89543 18 4C18 5.10455 18.8954 6 20 6Z"
        stroke="currentColor"
        strokeLinejoin="round"
      />
      <path
        d="M20 22C21.1046 22 22 21.1046 22 20C22 18.8954 21.1046 18 20 18C18.8954 18 18 18.8954 18 20C18 21.1046 18.8954 22 20 22Z"
        stroke="currentColor"
        strokeLinejoin="round"
      />
      <path
        d="M4 6C5.10455 6 6 5.10455 6 4C6 2.89543 5.10455 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10455 2.89543 6 4 6Z"
        stroke="currentColor"
        strokeLinejoin="round"
      />
      <path
        d="M4 22C5.10455 22 6 21.1046 6 20C6 18.8954 5.10455 18 4 18C2.89543 18 2 18.8954 2 20C2 21.1046 2.89543 22 4 22Z"
        stroke="currentColor"
        strokeLinejoin="round"
      />
      <path d="M10 4H14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 8L8 16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 10V14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Step 2 — Icon-tree (28×28)
export function IconTree({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path d="M14 19.25V8.75" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M22.1663 5.25H5.83301V8.75H22.1663V5.25Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.66699 18.6654L8.16699 14.582H19.8187L23.3337 18.6654"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.99967 19.25H2.33301V23.9167H6.99967V19.25Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.3337 19.25H11.667V23.9167H16.3337V19.25Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M25.6667 19.25H21V23.9167H25.6667V19.25Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Step 3 — Icon-game (28×28), круговая диаграмма с выделенным сегментом
export function IconGame({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M22.4651 5.56148C20.3269 3.55848 17.4523 2.33203 14.2913 2.33203C7.68696 2.33203 2.33301 7.68598 2.33301 14.2904C2.33301 20.8947 7.68696 26.2487 14.2913 26.2487C17.5666 26.2487 20.5344 24.9319 22.6941 22.7989L13.9997 13.9987L22.4651 5.56148Z"
        stroke="currentColor"
        strokeLinejoin="round"
      />
      <path
        d="M23.3333 16.3346C24.622 16.3346 25.6667 15.2899 25.6667 14.0013C25.6667 12.7127 24.622 11.668 23.3333 11.668C22.0447 11.668 21 12.7127 21 14.0013C21 15.2899 22.0447 16.3346 23.3333 16.3346Z"
        stroke="currentColor"
        strokeLinejoin="round"
      />
      <path
        d="M9.91699 7.58203V12.2487"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.58301 9.91797H12.2497"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Step 4 — Icon-trophy (28×28)
export function IconTrophy({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M14 18.4987C17.866 18.4987 21 15.2725 21 11.2928V3.33203H7V11.2928C7 15.2725 10.134 18.4987 14 18.4987Z"
        stroke="currentColor"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.99967 13.2513V7.41797H2.33301C2.33301 11.3069 4.66634 13.2513 6.99967 13.2513Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21 13.2513V7.41797H25.6667C25.6667 11.3069 23.3333 13.2513 21 13.2513Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 19.668V22.0013"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.75 25.5L10.9025 22H16.9415L19.25 25.5H8.75Z"
        stroke="currentColor"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Step 5 — Icon-positive-dynamics (24×24)
export function IconPositive({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path d="M8.5 16.9766V21.0566" stroke="currentColor" strokeLinecap="round" />
      <path d="M4.5 20V21.0278" stroke="currentColor" strokeLinecap="round" />
      <path d="M12.5 13.5V21.0357" stroke="currentColor" strokeLinecap="round" />
      <path d="M16.5 9.4807V21.0439" stroke="currentColor" strokeLinecap="round" />
      <path d="M20.5 5.48438V21.0407" stroke="currentColor" strokeLinecap="round" />
      <path d="M3.5 16.5L17 3" stroke="currentColor" strokeLinecap="round" />
      <path d="M11.75 3H17" stroke="currentColor" strokeLinecap="round" />
    </svg>
  );
}
