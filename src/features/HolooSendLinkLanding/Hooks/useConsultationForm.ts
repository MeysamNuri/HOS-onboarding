import type { FormEvent } from "react";
import { useState } from "react";

import { useProposedPackageMutation } from "@/core/api/baseApi";

interface ConsultationFormState {
  name: string;
  mobile: string;
  description: string;
}

const initialForm: ConsultationFormState = {
  name: "",
  mobile: "",
  description: "",
};

export default function useConsultationForm() {
  const [form, setForm] = useState(initialForm);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitRequest, { isLoading }] = useProposedPackageMutation();

  const updateField = (field: keyof ConsultationFormState, value: string) => {
    setIsSubmitted(false);
    setForm((currentValue) => ({ ...currentValue, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await submitRequest({
        SendCount: 0,
        MonthCount: 0,
        FieldOfActivity: form.name,
        Mobile: form.mobile,
        Serial: "",
        Description: form.description,
        ServiceCode: "SendInvoice",
      }).unwrap();
      setForm(initialForm);
      setIsSubmitted(true);
    } catch {
      setIsSubmitted(false);
    }
  };

  return {
    form,
    isLoading,
    isSubmitted,
    handleSubmit,
    updateField,
  };
}
