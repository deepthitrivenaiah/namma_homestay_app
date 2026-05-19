import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card = ({ children, className, onClick, ...props }: CardProps) => (
  <div 
    onClick={onClick}
    className={`bg-white rounded-[32px] overflow-hidden shadow-sm border border-brand-earth/5 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${className}`}
    {...props}
  >
    {children}
  </div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  ...props 
}: ButtonProps) => {
  const variants = {
    primary: 'bg-brand-olive text-white hover:bg-brand-olive/90',
    secondary: 'bg-brand-earth text-white hover:bg-brand-earth/90',
    outline: 'border-2 border-brand-olive text-brand-olive hover:bg-brand-olive/5',
    ghost: 'text-brand-olive hover:bg-brand-olive/5'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5',
    lg: 'px-8 py-3.5 text-lg'
  };

  return (
    <button 
      className={`rounded-full font-medium transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Input = ({ label, error, className, ...props }: any) => (
  <div className={`space-y-1 ${className}`}>
    {label && <label className="text-xs font-semibold uppercase tracking-wider text-brand-earth/60 ml-4">{label}</label>}
    <input 
      className="w-full bg-white border border-brand-earth/10 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-brand-olive/20 transition-all font-sans"
      {...props}
    />
    {error && <p className="text-red-500 text-xs ml-4">{error}</p>}
  </div>
);

export const Textarea = ({ label, error, className, ...props }: any) => (
  <div className={`space-y-1 ${className}`}>
    {label && <label className="text-xs font-semibold uppercase tracking-wider text-brand-earth/60 ml-4">{label}</label>}
    <textarea 
      className="w-full bg-white border border-brand-earth/10 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-brand-olive/20 transition-all font-sans min-h-[120px]"
      {...props}
    />
    {error && <p className="text-red-500 text-xs ml-4">{error}</p>}
  </div>
);
