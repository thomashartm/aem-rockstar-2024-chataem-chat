export default function FloatingButton() {
  return (
    <button
      aria-expanded="false"
      aria-haspopup="dialog"
      className="fixed bottom-4 right-4 inline-flex items-center justify-center text-sm font-medium disabled:pointer-events-none disabled:opacity-50 border rounded-full w-16 h-16 bg-black hover:bg-gray-700 m-0 cursor-pointer border-gray-200 bg-none p-0 normal-case leading-5 hover:text-gray-900"
      data-state="closed"
      type="button"
    >
      <svg xmlns=" http://www.w3.org/2000/svg"
        className="text-white block border-gray-200 align-middle"
        fill="none"
        height="40"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        viewBox="0 0 24 24"
        width="30"
      >
        <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" className="border-gray-200" />
      </svg>
    </button>
  );
}
