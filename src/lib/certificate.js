import { jsPDF } from "jspdf";

// Gera um certificado PDF personalizado ao concluir o plano de 365 dias.
export function generateCertificate({ fullName, completionDate }) {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const W = 842;
  const H = 595;

  // Cores (paleta "Luminous Parchment")
  const CREAM = [250, 248, 244];
  const NAVY = [28, 31, 45];
  const GOLD = [176, 148, 89];
  const MUTED = [120, 110, 90];

  // Fundo
  doc.setFillColor(...CREAM);
  doc.rect(0, 0, W, H, "F");

  // Molduras
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(3);
  doc.rect(30, 30, W - 60, H - 60);
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.8);
  doc.rect(42, 42, W - 84, H - 84);

  // Cabeçalho
  doc.setTextColor(...NAVY);
  doc.setFont("times", "normal");
  doc.setFontSize(13);
  doc.text("•  CERTIFICADO DE CONCLUSÃO  •", W / 2, 110, { align: "center" });

  // Subtítulo
  doc.setFontSize(11);
  doc.setTextColor(...MUTED);
  doc.text("A Bíblia Cronológica — Guia de Leitura em 365 Dias", W / 2, 138, {
    align: "center",
  });

  // Divisor decorativo
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(1);
  doc.line(W / 2 - 60, 158, W / 2 + 60, 158);

  // "Conferido a"
  doc.setTextColor(...MUTED);
  doc.setFont("times", "italic");
  doc.setFontSize(13);
  doc.text("Este certificado é orgulhosamente conferido a", W / 2, 205, {
    align: "center",
  });

  // Nome
  doc.setFont("times", "bold");
  doc.setFontSize(38);
  doc.setTextColor(...NAVY);
  doc.text(fullName || "Leitor", W / 2, 255, { align: "center" });

  // Linha sob o nome
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.6);
  const nameWidth = doc.getTextWidth(fullName || "Leitor");
  doc.line(W / 2 - Math.max(nameWidth / 2 + 20, 80), 270, W / 2 + Math.max(nameWidth / 2 + 20, 80), 270);

  // Corpo
  doc.setFont("times", "normal");
  doc.setFontSize(13);
  doc.setTextColor(70, 66, 60);
  const body =
    "Por ter concluído a leitura cronológica de todos os 1.189 capítulos das Escrituras Sagradas, " +
    "distribuídos em 365 dias, percorrendo a Bíblia na ordem histórica dos acontecimentos — " +
    "da Criação à Revelação.";
  const bodyLines = doc.splitTextToSize(body, W - 240);
  doc.text(bodyLines, W / 2, 315, { align: "center" });

  // Data
  const dateStr = completionDate
    ? new Date(completionDate).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
  doc.setFontSize(12);
  doc.setTextColor(...MUTED);
  doc.text(`Concluído em ${dateStr}`, W / 2, 400, { align: "center" });

  // Assinatura
  doc.setDrawColor(...MUTED);
  doc.setLineWidth(0.5);
  doc.line(W / 2 - 120, 490, W / 2 + 120, 490);
  doc.setFontSize(10);
  doc.text("A Bíblia Cronológica 365", W / 2, 506, { align: "center" });

  doc.save("certificado-biblia-cronologica.pdf");
}