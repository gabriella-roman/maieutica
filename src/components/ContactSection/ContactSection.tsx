import React, { useState } from "react";
import styles from "./ContactSection.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faPhone,
  faEnvelope,
  faIdCard,
} from "@fortawesome/free-solid-svg-icons";

const CONTACT_ENDPOINT = "/api/contact";
const LEGACY_CONTACT_ENDPOINT =
  process.env.REACT_APP_LEGACY_EMAIL_API_URL || "https://maieuticarh.com.br:9200/postmsg";
const ENABLE_LEGACY_FALLBACK = process.env.REACT_APP_ENABLE_LEGACY_EMAIL_FALLBACK === "true";
const CONTACT_ENCODING = process.env.REACT_APP_CONTACT_ENCODING || "urlencoded";

type SubmitStatus = "idle" | "success" | "error";

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
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const sendToEndpoint = async (
    endpoint: string,
    data: { name: string; email: string; phone: string; message: string }
  ) => {
    const isUrlEncoded = CONTACT_ENCODING === "urlencoded";
    const body = isUrlEncoded
      ? new URLSearchParams({
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: data.message,
        }).toString()
      : JSON.stringify(data);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": isUrlEncoded
          ? "application/x-www-form-urlencoded"
          : "application/json",
      },
      body,
    });

    if (response.ok) {
      return;
    }

    const text = await response.text();
    throw new Error(text || `Falha no envio (${response.status})`);
  };

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
    onSubmit?.(data);
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      try {
        await sendToEndpoint(CONTACT_ENDPOINT, data);
      } catch (primaryError) {
        if (!ENABLE_LEGACY_FALLBACK) {
          throw primaryError;
        }

        await sendToEndpoint(LEGACY_CONTACT_ENDPOINT, data);
      }

      setSubmitStatus("success");
      form.reset();
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      const message = error instanceof Error && error.message ? error.message : "Erro inesperado no envio.";
      setErrorMessage(message);
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
            <FontAwesomeIcon icon={faIdCard} className={styles.icon} aria-hidden />
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
            ✗ Nao foi possivel enviar sua mensagem. {errorMessage}
          </div>
        )}
      </form>
    </section>
  );
}

