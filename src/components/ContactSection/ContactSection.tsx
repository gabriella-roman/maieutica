// ContactSection.tsx
// Envia formulário de contato para Formspree

import React, { useState } from "react";
import styles from "./ContactSection.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faPaperPlane,
  faPhone,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

// Endpoint Formspree configurado
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xovrbajr";

export type ContactSectionProps = {
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  className?: string;
  onSubmit?: (data: {
    name: string;
    email: string;
    phone: string;
    message: string;
  }) => void;
};

export function ContactSection({
  title = "Ficou com alguma dúvida? Precisa de ajuda?",
  subtitle = "Fique à vontade para entrar em contato conosco, responderemos o mais breve possível.",
  submitLabel = "Enviar mensagem",
  className,
  onSubmit,
}: ContactSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data = {
      name: (fd.get("name") as string) ?? "",
      email: (fd.get("email") as string) ?? "",
      phone: (fd.get("phone") as string) ?? "",
      message: (fd.get("message") as string) ?? "",
    };

    // Callback opcional para página pai
    onSubmit?.(data);

    // Enviar para Formspree
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitStatus("success");
        // Limpar formulário
        form.reset();
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={`${styles.content} ${className ?? ""}`}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span className={styles.label}>Seu nome</span>
          <div className={styles.inputWrap}>
            <input
              name="name"
              type="text"
              placeholder="Seu nome"
              className={styles.input}
              required
              autoComplete="name"
            />
            <FontAwesomeIcon icon={faUser} className={styles.icon} aria-hidden />
          </div>
        </label>

        <div className={styles.rowTwo}>
          <label className={styles.field}>
            <span className={styles.label}>E-mail</span>
            <div className={styles.inputWrap}>
              <input
                name="email"
                type="email"
                placeholder="Seu e-mail"
                className={styles.input}
                required
                autoComplete="email"
              />
              <FontAwesomeIcon icon={faPaperPlane} className={styles.icon} aria-hidden />
            </div>
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Telefone</span>
            <div className={styles.inputWrap}>
              <input
                name="phone"
                type="tel"
                placeholder="Seu Telefone"
                className={styles.input}
                autoComplete="tel"
              />
              <FontAwesomeIcon icon={faPhone} className={styles.icon} aria-hidden />
            </div>
          </label>
        </div>

        <label className={styles.field}>
          <span className={styles.label}>Mensagem</span>
          <div className={styles.textareaWrap}>
            <textarea
              name="message"
              placeholder="Escreva sua mensagem"
              rows={5}
              className={styles.textarea}
            />
            <FontAwesomeIcon icon={faEnvelope} className={styles.icon} aria-hidden />
          </div>
        </label>

        <button type="submit" className={styles.submit} disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : submitLabel}
        </button>

        {submitStatus === "success" && (
          <div className={styles.successMessage}>
            ✓ Mensagem enviada com sucesso! Responderemos em breve.
          </div>
        )}

        {submitStatus === "error" && (
          <div className={styles.errorMessage}>
            ✗ Erro ao enviar mensagem. Tente novamente ou envie e-mail diretamente.
          </div>
        )}
      </form>
    </section>
  );
}
