import { cn } from "@/lib/utils";
import { createContext, useContext, type FormEventHandler, type ReactNode } from "react";

const FormContext = createContext<"form" | undefined>(undefined);

interface FormProps {
  onSubmit: FormEventHandler<HTMLFormElement>;
  title?: string;
  className?: string;
  children: ReactNode;
}

const Form = ({ onSubmit, title, className, children }: FormProps) => {
  return (
    <FormContext.Provider value="form">
      <form onSubmit={onSubmit} className={cn("grid gap-3", className)}>
        {title && <h1 className="mb-4 text-2xl font-semibold">{title}</h1>}
        {children}
      </form>
    </FormContext.Provider>
  );
};

interface FormRowProps {
  error?: string;
  className?: string;
  children: ReactNode;
}

const FormRow = ({ error, className, children }: FormRowProps) => {
  const context = useContext(FormContext);
  if (!context) throw new Error("FormRow not used in Form component");

  return (
    <div className={cn("grid gap-2", className)}>
      {children}
      {error && <span className="text-red-500">{error}</span>}
    </div>
  );
};

Form.FormRow = FormRow;

export default Form;
