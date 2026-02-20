"use client";

type ConfirmDangerButtonProps = {
  label: string;
  message: string;
  className?: string;
};

export function ConfirmDangerButton({ label, message, className }: ConfirmDangerButtonProps) {
  return (
    <button
      type="submit"
      className={className || "btn-danger"}
      onClick={(event) => {
        if (!window.confirm(message)) {
          event.preventDefault();
        }
      }}
    >
      {label}
    </button>
  );
}
