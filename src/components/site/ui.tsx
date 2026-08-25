import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-display font-bold tracking-tight transition-all duration-300 disabled:opacity-60 disabled:pointer-events-none";

const sizes = {
  md: "px-6 py-3 text-sm",
  lg: "px-7 py-3.5 text-[0.95rem]",
  sm: "px-4 py-2 text-xs",
};

const variants = {
  primary:
    "bg-[image:var(--gradient-accent)] text-primary-foreground shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-lift)] hover:-translate-y-0.5",
  outline:
    "border border-border bg-background text-primary hover:border-accent hover:text-accent hover:-translate-y-0.5",
  ghostLight:
    "border border-white/25 bg-white/5 text-white hover:bg-white/12 hover:-translate-y-0.5 backdrop-blur-sm",
  solidLight: "bg-white text-navy-deep hover:bg-white/90 hover:-translate-y-0.5 shadow-[var(--shadow-soft)]",
  whatsapp: "bg-[oklch(0.62_0.16_150)] text-white hover:brightness-110 hover:-translate-y-0.5",
};

export type CtaVariant = keyof typeof variants;

export function CtaLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: CtaVariant; size?: keyof typeof sizes }) {
  return (
    <a className={cn(base, sizes[size], variants[variant], className)} {...props}>
      {children}
    </a>
  );
}

export function CtaButton({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: CtaVariant; size?: keyof typeof sizes }) {
  return (
    <button className={cn(base, sizes[size], variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  light = false,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "center" | "left";
  light?: boolean;
  as?: "h2" | "h3";
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
      <Tag className={cn("text-3xl leading-tight sm:text-4xl", light ? "text-white" : "text-navy-deep")}>{title}</Tag>
      {subtitle ? (
        <p className={cn("mt-4 text-base leading-relaxed", light ? "text-white/75" : "text-muted-foreground")}>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
