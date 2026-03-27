"use client";

const DEFAULT_TARGET_ID = "kontaktformular";
const DEFAULT_OFFSET_PX = 92;

export function scrollToContactForm(options?: {
  targetId?: string;
  offsetPx?: number;
}) {
  const targetId = options?.targetId ?? DEFAULT_TARGET_ID;
  const offsetPx = options?.offsetPx ?? DEFAULT_OFFSET_PX;
  const target = document.getElementById(targetId);
  if (!target) return;

  const top = Math.max(
    0,
    window.scrollY + target.getBoundingClientRect().top - offsetPx,
  );
  window.scrollTo({ top, behavior: "smooth" });
}

type ScrollToContactButtonProps = {
  className: string;
  children: React.ReactNode;
  targetId?: string;
  offsetPx?: number;
};

/**
 * Scrollt nur bei aktivem Klick zum Formular, ohne Hash in der URL.
 */
export default function ScrollToContactButton({
  className,
  children,
  targetId = DEFAULT_TARGET_ID,
  offsetPx = DEFAULT_OFFSET_PX,
}: ScrollToContactButtonProps) {
  const handleClick = () => {
    scrollToContactForm({ targetId, offsetPx });
  };

  return (
    <button type="button" className={className} onClick={handleClick}>
      {children}
    </button>
  );
}
