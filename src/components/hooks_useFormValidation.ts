import { useState, useCallback } from "react";

interface ValidationRules {
  [key: string]: (value: any) => string | null;
}

export const useFormValidation = (
  initialState: any,
  validationRules: ValidationRules
) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = useCallback(
    (fieldName: string, value: any) => {
      if (validationRules.hasOwnProperty(fieldName)) {
        const error = validationRules[fieldName](value);
        setErrors((prevErrors) => ({
          ...prevErrors,
          [fieldName]: error || "",
        }));
        return !error;
      }
      return true;
    },
    [validationRules]
  );

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setValues((prevValues: any) => ({ ...prevValues, [name]: value }));
      validate(name, value);
    },
    [validate]
  );

  const handleSubmit = useCallback(
    (onSubmit: () => void) => (e: React.FormEvent) => {
      e.preventDefault();
      const isValid = Object.keys(validationRules).every((fieldName) =>
        validate(fieldName, values[fieldName])
      );
      if (isValid) {
        onSubmit();
      }
    },
    [validate, values, validationRules]
  );

  return { values, errors, handleChange, handleSubmit };
};
